export type AuthUser = {
  email: string | null;
  id: string;
  name: string;
  phone: string | null;
  role: string;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

type ApiSuccess<T> = {
  data: T;
  message: string;
  success: true;
};

type ApiFailure = {
  errorCode: string;
  message: string;
  success: false;
};

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

async function apiRequest<T>(
  path: string,
  options: {
    accessToken?: string;
    body?: unknown;
    method?: "GET" | "POST";
  } = {},
) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: {
      "Content-Type": "application/json",
      "x-hostelhub-client": "mobile",
      ...(options.accessToken
        ? { Authorization: `Bearer ${options.accessToken}` }
        : {}),
    },
    method: options.method ?? "GET",
  });
  const payload = (await response.json().catch(() => null)) as
    | ApiSuccess<T>
    | ApiFailure
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message ?? "Request failed.");
  }

  return payload.data;
}

export function login(identifier: string, password: string) {
  return apiRequest<AuthSession>("/api/v1/auth/login", {
    body: { identifier, password },
    method: "POST",
  });
}

export function requestOtp(channel: "email" | "phone", identifier: string) {
  return apiRequest<{
    challengeId: string;
    devCode?: string;
    expiresAt: string;
  }>("/api/v1/auth/otp/request", {
    body: { channel, identifier, purpose: "registration" },
    method: "POST",
  });
}

export function verifyOtp(challengeId: string, code: string) {
  return apiRequest<{
    challengeId: string;
    verifiedAt: string;
  }>("/api/v1/auth/otp/verify", {
    body: { challengeId, code },
    method: "POST",
  });
}

export function register(input: {
  email?: string;
  name: string;
  otpChallengeId: string;
  password: string;
  phone?: string;
}) {
  return apiRequest<AuthSession>("/api/v1/auth/register", {
    body: input,
    method: "POST",
  });
}

export function signInWithGoogle(idToken: string) {
  return apiRequest<AuthSession>("/api/v1/auth/google", {
    body: { idToken },
    method: "POST",
  });
}

export function refreshSession(refreshToken: string) {
  return apiRequest<AuthSession>("/api/v1/auth/refresh", {
    body: { refreshToken },
    method: "POST",
  });
}

export function logout(refreshToken: string) {
  return apiRequest<null>("/api/v1/auth/logout", {
    body: { refreshToken },
    method: "POST",
  });
}
