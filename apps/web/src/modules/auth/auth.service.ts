import {
  hashToken,
  refreshTokenExpiresAt,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { Role } from "@/lib/roles";
import { SessionModel } from "@/models/Session";
import { UserModel } from "@/models/User";
import type { LoginInput } from "@/modules/auth/auth.validation";

export class AuthServiceError extends Error {
  constructor(
    message: string,
    public errorCode = "AUTH_ERROR",
    public status = 401,
  ) {
    super(message);
  }
}

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

export async function login(
  input: LoginInput,
  context?: { ipAddress?: string; userAgent?: string },
) {
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
  await session.save();

  const safeUser = publicUser(user);

  return {
    accessToken: await signAccessToken({
      hostelIds: safeUser.hostelIds,
      role: safeUser.role,
      sessionId: String(session._id),
      userId: safeUser.id,
    }),
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
