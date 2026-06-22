import { randomInt } from "node:crypto";
import { createRemoteJWKSet, jwtVerify } from "jose";

import {
  hashToken,
  refreshTokenExpiresAt,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { Role } from "@/lib/roles";
import { OAuthAccountModel } from "@/models/OAuthAccount";
import { OtpChallengeModel } from "@/models/OtpChallenge";
import { SessionModel } from "@/models/Session";
import { UserModel } from "@/models/User";
import type {
  GoogleAuthInput,
  LoginInput,
  OtpRequestInput,
  OtpVerifyInput,
  RegisterInput,
} from "@/modules/auth/auth.validation";

export class AuthServiceError extends Error {
  constructor(
    message: string,
    public errorCode = "AUTH_ERROR",
    public status = 401,
  ) {
    super(message);
  }
}

type RequestContext = {
  ipAddress?: string;
  userAgent?: string;
};

const GOOGLE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs"),
);

function publicUser(user: {
  _id: unknown;
  email?: string | null;
  hostelIds?: unknown[];
  name: string;
  phone?: string | null;
  role: Role;
  status: string;
}) {
  return {
    id: String(user._id),
    email: user.email ?? null,
    hostelIds: (user.hostelIds ?? []).map((hostelId) => String(hostelId)),
    name: user.name,
    phone: user.phone ?? null,
    role: user.role,
    status: user.status,
  };
}

function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() || undefined;
}

function normalizePhone(phone?: string | null) {
  return phone?.trim() || undefined;
}

function normalizeOtpIdentifier(channel: OtpRequestInput["channel"], identifier: string) {
  return channel === "email" ? identifier.trim().toLowerCase() : identifier.trim();
}

function otpTtlMs() {
  return Number(process.env.OTP_TTL_MINUTES ?? 10) * 60 * 1000;
}

function otpRateLimitWindowMs() {
  return Number(process.env.OTP_RATE_LIMIT_WINDOW_MINUTES ?? 15) * 60 * 1000;
}

function otpRateLimitMax() {
  return Number(process.env.OTP_RATE_LIMIT_MAX ?? 5);
}

function otpResendCooldownMs() {
  return Number(process.env.OTP_RESEND_COOLDOWN_SECONDS ?? 60) * 1000;
}

function hashOtpCode(identifier: string, code: string) {
  const secret =
    process.env.OTP_HASH_SECRET ??
    process.env.JWT_ACCESS_SECRET ??
    "development-otp-secret";

  return hashToken(`${identifier}:${code}:${secret}`);
}

function generateOtpCode() {
  return String(randomInt(100000, 1000000));
}

function otpDeliveryProvider(channel: OtpRequestInput["channel"]) {
  if (channel === "email") {
    return process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL ? "resend" : null;
  }

  return process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    (process.env.TWILIO_MESSAGING_SERVICE_SID || process.env.TWILIO_FROM_PHONE)
    ? "twilio"
    : null;
}

async function sendResendOtp(input: { code: string; identifier: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    throw new AuthServiceError(
      "Resend OTP email is not configured.",
      "OTP_DELIVERY_NOT_CONFIGURED",
      503,
    );
  }

  const response = await fetch("https://api.resend.com/emails", {
    body: JSON.stringify({
      from,
      subject: "Your HostelHub verification code",
      text: `Your HostelHub verification code is ${input.code}. It expires soon.`,
      to: [input.identifier],
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new AuthServiceError("Could not send OTP email.", "OTP_DELIVERY_FAILED", 502);
  }
}

async function sendTwilioSmsOtp(input: { code: string; identifier: string }) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
  const fromPhone = process.env.TWILIO_FROM_PHONE;

  if (!accountSid || !authToken || (!messagingServiceSid && !fromPhone)) {
    throw new AuthServiceError(
      "Twilio SMS OTP is not configured.",
      "OTP_DELIVERY_NOT_CONFIGURED",
      503,
    );
  }

  const body = new URLSearchParams({
    Body: `Your HostelHub verification code is ${input.code}. It expires soon.`,
    To: input.identifier,
  });

  if (messagingServiceSid) {
    body.set("MessagingServiceSid", messagingServiceSid);
  } else if (fromPhone) {
    body.set("From", fromPhone);
  }

  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      body,
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    },
  );

  if (!response.ok) {
    throw new AuthServiceError("Could not send OTP SMS.", "OTP_DELIVERY_FAILED", 502);
  }
}

async function dispatchOtpChallenge(input: {
  channel: OtpRequestInput["channel"];
  code: string;
  identifier: string;
}) {
  const provider = otpDeliveryProvider(input.channel);

  if (!provider) {
    if (process.env.NODE_ENV !== "production") {
      return {
        channel: input.channel,
        provider: "development",
        status: "development",
      };
    }

    throw new AuthServiceError(
      "OTP delivery provider is not configured.",
      "OTP_DELIVERY_NOT_CONFIGURED",
      503,
    );
  }

  if (provider === "resend") {
    await sendResendOtp(input);
  }

  if (provider === "twilio") {
    await sendTwilioSmsOtp(input);
  }

  return {
    channel: input.channel,
    provider,
    status: "queued",
  };
}

async function issueSessionForUser(
  user: {
    _id: unknown;
    email?: string | null;
    hostelIds?: unknown[];
    name: string;
    phone?: string | null;
    role: Role;
    status: string;
  },
  context?: RequestContext,
) {
  const safeUser = publicUser(user);
  const session = await SessionModel.create({
    expiresAt: refreshTokenExpiresAt(),
    ipAddress: context?.ipAddress,
    refreshTokenHash: "pending",
    userAgent: context?.userAgent,
    userId: safeUser.id,
  });

  const sessionId = String(session._id);
  const tokenInput = {
    hostelIds: safeUser.hostelIds,
    role: safeUser.role,
    sessionId,
    userId: safeUser.id,
  };
  const [accessToken, refreshToken] = await Promise.all([
    signAccessToken(tokenInput),
    signRefreshToken(tokenInput),
  ]);

  session.refreshTokenHash = hashToken(refreshToken);
  await session.save();

  return {
    accessToken,
    refreshToken,
    user: safeUser,
  };
}

export async function requestOtpChallenge(
  input: OtpRequestInput,
  context?: RequestContext,
) {
  await connectToDatabase();

  const identifier = normalizeOtpIdentifier(input.channel, input.identifier);
  const rateLimitStartedAt = new Date(Date.now() - otpRateLimitWindowMs());
  const recentRequestCount = await OtpChallengeModel.countDocuments({
    channel: input.channel,
    createdAt: { $gte: rateLimitStartedAt },
    identifier,
    purpose: input.purpose,
  });

  if (recentRequestCount >= otpRateLimitMax()) {
    throw new AuthServiceError(
      "Too many OTP requests. Please wait before trying again.",
      "OTP_RATE_LIMITED",
      429,
    );
  }

  const latestChallenge = await OtpChallengeModel.findOne({
    channel: input.channel,
    consumedAt: null,
    expiresAt: { $gt: new Date() },
    identifier,
    purpose: input.purpose,
  }).sort({ createdAt: -1 });

  if (
    latestChallenge?.codeLastSentAt &&
    Date.now() - new Date(latestChallenge.codeLastSentAt).getTime() <
      otpResendCooldownMs()
  ) {
    throw new AuthServiceError(
      "Please wait before requesting another OTP.",
      "OTP_RESEND_COOLDOWN",
      429,
    );
  }

  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + otpTtlMs());
  const delivery = await dispatchOtpChallenge({
    channel: input.channel,
    code,
    identifier,
  });
  const challenge = await OtpChallengeModel.create({
    channel: input.channel,
    codeHash: hashOtpCode(identifier, code),
    codeLastSentAt: new Date(),
    expiresAt,
    identifier,
    ipAddress: context?.ipAddress,
    purpose: input.purpose,
    userAgent: context?.userAgent,
  });

  return {
    challengeId: String(challenge._id),
    delivery,
    expiresAt,
    ...(process.env.NODE_ENV === "production" ? {} : { devCode: code }),
  };
}

export async function verifyOtpChallenge(input: OtpVerifyInput) {
  await connectToDatabase();

  const challenge = await OtpChallengeModel.findOne({
    _id: input.challengeId,
    consumedAt: null,
    expiresAt: { $gt: new Date() },
  }).select("+codeHash");

  if (!challenge) {
    throw new AuthServiceError(
      "OTP challenge is invalid or expired.",
      "OTP_INVALID",
      400,
    );
  }

  if (challenge.attempts >= 5) {
    throw new AuthServiceError(
      "Too many OTP verification attempts.",
      "OTP_ATTEMPT_LIMIT",
      429,
    );
  }

  if (challenge.codeHash !== hashOtpCode(challenge.identifier, input.code)) {
    challenge.attempts += 1;
    await challenge.save();

    throw new AuthServiceError("OTP code is incorrect.", "OTP_INCORRECT", 400);
  }

  challenge.verifiedAt = new Date();
  await challenge.save();

  return {
    challengeId: String(challenge._id),
    channel: challenge.channel,
    identifier: challenge.identifier,
    verifiedAt: challenge.verifiedAt,
  };
}

async function findVerifiedRegistrationChallenge(input: RegisterInput) {
  const email = normalizeEmail(input.email);
  const phone = normalizePhone(input.phone);
  const challenge = await OtpChallengeModel.findOne({
    _id: input.otpChallengeId,
    consumedAt: null,
    expiresAt: { $gt: new Date() },
    purpose: "registration",
    verifiedAt: { $ne: null },
  });

  if (!challenge) {
    throw new AuthServiceError(
      "A verified registration OTP is required.",
      "REGISTRATION_OTP_REQUIRED",
      400,
    );
  }

  const challengeMatchesEmail =
    challenge.channel === "email" && email === challenge.identifier;
  const challengeMatchesPhone =
    challenge.channel === "phone" && phone === challenge.identifier;

  if (!challengeMatchesEmail && !challengeMatchesPhone) {
    throw new AuthServiceError(
      "Verified OTP does not match this registration.",
      "REGISTRATION_OTP_MISMATCH",
      400,
    );
  }

  return challenge;
}

export async function registerPublicAccount(
  input: RegisterInput,
  context?: RequestContext,
) {
  await connectToDatabase();

  const email = normalizeEmail(input.email);
  const phone = normalizePhone(input.phone);
  const duplicateFilters = [...(email ? [{ email }] : []), ...(phone ? [{ phone }] : [])];
  const existingUser = await UserModel.findOne({
    $or: duplicateFilters,
    isDeleted: { $ne: true },
  });

  if (existingUser) {
    throw new AuthServiceError(
      "An account already exists for this email or phone.",
      "ACCOUNT_ALREADY_EXISTS",
      409,
    );
  }

  const challenge = await findVerifiedRegistrationChallenge({
    ...input,
    email,
    phone,
  });
  const now = new Date();
  const user = await UserModel.create({
    email,
    emailVerifiedAt: challenge.channel === "email" ? now : undefined,
    name: input.name,
    passwordHash: await hashPassword(input.password),
    phone,
    phoneVerifiedAt: challenge.channel === "phone" ? now : undefined,
    role: Role.PUBLIC_USER,
    status: "ACTIVE",
  });

  challenge.consumedAt = now;
  await challenge.save();

  return issueSessionForUser(user, context);
}

async function verifyGoogleIdToken(input: GoogleAuthInput) {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    throw new AuthServiceError(
      "Google auth is not configured.",
      "GOOGLE_AUTH_NOT_CONFIGURED",
      503,
    );
  }

  try {
    const { payload } = await jwtVerify(input.idToken, GOOGLE_JWKS, {
      audience: googleClientId,
      issuer: ["https://accounts.google.com", "accounts.google.com"],
    });
    const subject = typeof payload.sub === "string" ? payload.sub : null;
    const email =
      typeof payload.email === "string" ? normalizeEmail(payload.email) : null;
    const emailVerified = payload.email_verified === true;

    if (!subject || !email || !emailVerified) {
      throw new AuthServiceError(
        "Google account email must be verified.",
        "GOOGLE_EMAIL_UNVERIFIED",
        401,
      );
    }

    return {
      email,
      name:
        typeof payload.name === "string" && payload.name.trim().length > 0
          ? payload.name.trim()
          : email,
      providerAccountId: subject,
    };
  } catch (error) {
    if (error instanceof AuthServiceError) {
      throw error;
    }

    throw new AuthServiceError(
      "Google sign-in token is invalid.",
      "GOOGLE_TOKEN_INVALID",
      401,
    );
  }
}

export async function authenticateWithGoogle(
  input: GoogleAuthInput,
  context?: RequestContext,
) {
  const googleAccount = await verifyGoogleIdToken(input);

  await connectToDatabase();

  const linkedAccount = await OAuthAccountModel.findOne({
    isDeleted: { $ne: true },
    provider: "google",
    providerAccountId: googleAccount.providerAccountId,
  });
  let user = linkedAccount
    ? await UserModel.findOne({
        _id: linkedAccount.userId,
        isDeleted: { $ne: true },
        status: "ACTIVE",
      })
    : null;

  if (linkedAccount && !user) {
    throw new AuthServiceError(
      "Linked Google account no longer has access.",
      "USER_INACTIVE",
      401,
    );
  }

  if (!user) {
    user = await UserModel.findOne({
      email: googleAccount.email,
      isDeleted: { $ne: true },
      status: "ACTIVE",
    });
  }

  if (!user) {
    user = await UserModel.create({
      email: googleAccount.email,
      emailVerifiedAt: new Date(),
      name: googleAccount.name,
      role: Role.PUBLIC_USER,
      status: "ACTIVE",
    });
  }

  if (!linkedAccount) {
    await OAuthAccountModel.create({
      email: googleAccount.email,
      provider: "google",
      providerAccountId: googleAccount.providerAccountId,
      userId: user._id,
    });
  }

  return issueSessionForUser(user, context);
}

export async function login(input: LoginInput, context?: RequestContext) {
  await connectToDatabase();

  const identifier = input.identifier.toLowerCase();
  const user = await UserModel.findOne({
    $or: [{ email: identifier }, { phone: input.identifier }],
    isDeleted: { $ne: true },
    status: "ACTIVE",
  }).select("+passwordHash");

  if (!user?.passwordHash) {
    throw new AuthServiceError("Invalid credentials.", "INVALID_CREDENTIALS");
  }

  const passwordMatches = await verifyPassword(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw new AuthServiceError("Invalid credentials.", "INVALID_CREDENTIALS");
  }

  user.lastLoginAt = new Date();
  await user.save();

  return issueSessionForUser(user, context);
}

export async function refreshAccessToken(refreshToken: string) {
  await connectToDatabase();

  const payload = await verifyRefreshToken(refreshToken);
  const refreshTokenHash = hashToken(refreshToken);
  const session = await SessionModel.findOne({
    _id: payload.sessionId,
    expiresAt: { $gt: new Date() },
    refreshTokenHash,
    revokedAt: null,
  });

  if (!session) {
    throw new AuthServiceError("Refresh session is invalid.", "INVALID_SESSION");
  }

  const user = await UserModel.findOne({
    _id: payload.sub,
    isDeleted: { $ne: true },
    status: "ACTIVE",
  });

  if (!user) {
    throw new AuthServiceError("User no longer has access.", "USER_INACTIVE");
  }

  session.lastSeenAt = new Date();
  const safeUser = publicUser(user);
  const tokenInput = {
    hostelIds: safeUser.hostelIds,
    role: safeUser.role,
    sessionId: String(session._id),
    userId: safeUser.id,
  };
  const [accessToken, nextRefreshToken] = await Promise.all([
    signAccessToken(tokenInput),
    signRefreshToken(tokenInput),
  ]);

  session.refreshTokenHash = hashToken(nextRefreshToken);
  await session.save();

  return {
    accessToken,
    refreshToken: nextRefreshToken,
    user: safeUser,
  };
}

export async function getCurrentUser(accessToken: string) {
  await connectToDatabase();

  const payload = await verifyAccessToken(accessToken);
  const user = await UserModel.findOne({
    _id: payload.sub,
    isDeleted: { $ne: true },
    status: "ACTIVE",
  });

  if (!user) {
    throw new AuthServiceError("User no longer has access.", "USER_INACTIVE");
  }

  return publicUser(user);
}

export async function logout(refreshToken: string) {
  await connectToDatabase();

  await SessionModel.updateOne(
    { refreshTokenHash: hashToken(refreshToken), revokedAt: null },
    { $set: { revokedAt: new Date() } },
  );
}
