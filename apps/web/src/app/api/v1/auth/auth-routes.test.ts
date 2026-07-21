import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Role } from "@/lib/roles";

const routeMocks = vi.hoisted(() => {
  class MockAuthServiceError extends Error {
    constructor(
      message: string,
      public errorCode = "AUTH_ERROR",
      public status = 401,
    ) {
      super(message);
    }
  }

  return {
    AuthServiceError: MockAuthServiceError,
    authenticateWithGoogle: vi.fn(),
    registerPublicAccount: vi.fn(),
    requestOtpChallenge: vi.fn(),
    verifyOtpChallenge: vi.fn(),
  };
});

vi.mock("@/modules/auth/auth.service", () => routeMocks);

import * as googleRoute from "@/app/api/v1/auth/google/route";
import * as otpRequestRoute from "@/app/api/v1/auth/otp/request/route";
import * as otpVerifyRoute from "@/app/api/v1/auth/otp/verify/route";
import * as registerRoute from "@/app/api/v1/auth/register/route";

function jsonRequest(path: string, body: unknown, headers?: Record<string, string>) {
  return new NextRequest(`https://hostelhub.local${path}`, {
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
      ...headers,
    },
    method: "POST",
  });
}

function authSession() {
  return {
    accessToken: "access-token",
    refreshToken: "refresh-token",
    user: {
      email: "public@example.com",
      hostelIds: [],
      id: "user-1",
      name: "Public User",
      phone: null,
      role: Role.PUBLIC,
      status: "ACTIVE",
    },
  };
}

describe("phase 1 auth routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates OTP challenges through the route handler", async () => {
    routeMocks.requestOtpChallenge.mockResolvedValue({
      challengeId: "64f0f0f0f0f0f0f0f0f0f0f0",
      delivery: { channel: "email", provider: "development", status: "development" },
      devCode: "123456",
      expiresAt: new Date("2030-01-01T00:00:00.000Z"),
    });

    const response = await otpRequestRoute.POST(
      jsonRequest("/api/v1/auth/otp/request", {
        channel: "email",
        identifier: "public@example.com",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(payload.data.challengeId).toBe("64f0f0f0f0f0f0f0f0f0f0f0");
  });

  it("verifies OTP challenges through the route handler", async () => {
    routeMocks.verifyOtpChallenge.mockResolvedValue({
      challengeId: "64f0f0f0f0f0f0f0f0f0f0f0",
      channel: "email",
      identifier: "public@example.com",
      verifiedAt: new Date("2030-01-01T00:00:00.000Z"),
    });

    const response = await otpVerifyRoute.POST(
      jsonRequest("/api/v1/auth/otp/verify", {
        challengeId: "64f0f0f0f0f0f0f0f0f0f0f0",
        code: "123456",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(payload.message).toBe("OTP verified");
  });

  it("registers mobile public users and exposes the mobile refresh token", async () => {
    routeMocks.registerPublicAccount.mockResolvedValue(authSession());

    const response = await registerRoute.POST(
      jsonRequest(
        "/api/v1/auth/register",
        {
          email: "public@example.com",
          name: "Public User",
          otpChallengeId: "64f0f0f0f0f0f0f0f0f0f0f0",
          password: "ChangeMe123!",
        },
        { "x-hostelhub-client": "mobile" },
      ),
    );
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.success).toBe(true);
    expect(payload.data.refreshToken).toBe("refresh-token");
    expect(payload.data.user.role).toBe(Role.PUBLIC);
  });

  it("returns configured service errors from Google auth", async () => {
    routeMocks.authenticateWithGoogle.mockRejectedValue(
      new routeMocks.AuthServiceError(
        "Google auth is not configured.",
        "GOOGLE_AUTH_NOT_CONFIGURED",
        503,
      ),
    );

    const response = await googleRoute.POST(
      jsonRequest("/api/v1/auth/google", {
        idToken: "this-is-a-long-google-id-token-placeholder",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload).toMatchObject({
      errorCode: "GOOGLE_AUTH_NOT_CONFIGURED",
      success: false,
    });
  });
});
