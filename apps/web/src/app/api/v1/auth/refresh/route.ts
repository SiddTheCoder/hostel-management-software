import type { NextRequest } from "next/server";

import { errorResponse, handleRouteError, successResponse } from "@/lib/api-response";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  accessTokenTtlSeconds,
  refreshTokenTtlSeconds,
} from "@/lib/auth";
import { readBodyRefreshToken, shouldExposeRefreshToken } from "@/lib/mobile-auth";
import { AuthServiceError, refreshAccessToken } from "@/modules/auth/auth.service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const cookieRefreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
    const bodyRefreshToken = cookieRefreshToken
      ? null
      : await readBodyRefreshToken(request);
    const refreshToken = cookieRefreshToken ?? bodyRefreshToken;

    if (!refreshToken) {
      return errorResponse("Refresh token is missing.", "UNAUTHENTICATED", 401);
    }

    const result = await refreshAccessToken(refreshToken);
    const response = successResponse(
      {
        accessToken: result.accessToken,
        ...(shouldExposeRefreshToken(request.headers)
          ? { refreshToken: result.refreshToken }
          : {}),
        user: result.user,
      },
      "Token refreshed",
    );

    if (cookieRefreshToken) {
      response.cookies.set(ACCESS_TOKEN_COOKIE, result.accessToken, {
        httpOnly: true,
        maxAge: accessTokenTtlSeconds(),
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      response.cookies.set(REFRESH_TOKEN_COOKIE, result.refreshToken, {
        httpOnly: true,
        maxAge: refreshTokenTtlSeconds(),
        path: "/api/v1/auth",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }

    return response;
  } catch (error) {
    if (error instanceof AuthServiceError) {
      return errorResponse(error.message, error.errorCode, error.status);
    }

    return handleRouteError(error);
  }
}
