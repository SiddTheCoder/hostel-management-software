import type { NextRequest } from "next/server";

import { handleRouteError, successResponse } from "@/lib/api-response";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/auth";
import { readBodyRefreshToken } from "@/lib/mobile-auth";
import { logout } from "@/modules/auth/auth.service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const cookieRefreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
    const bodyRefreshToken = cookieRefreshToken
      ? null
      : await readBodyRefreshToken(request);
    const refreshToken = cookieRefreshToken ?? bodyRefreshToken;

    if (refreshToken) {
      await logout(refreshToken);
    }

    const response = successResponse(null, "Logged out");

    response.cookies.set(ACCESS_TOKEN_COOKIE, "", {
      httpOnly: true,
      maxAge: 0,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    response.cookies.set(REFRESH_TOKEN_COOKIE, "", {
      httpOnly: true,
      maxAge: 0,
      path: "/api/v1/auth",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    return handleRouteError(error);
  }
}
