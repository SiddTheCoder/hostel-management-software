import type { NextResponse } from "next/server";

import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  accessTokenTtlSeconds,
  refreshTokenTtlSeconds,
} from "@/lib/auth";

// "/api" so the refresh token reaches both the docs-standard /api/auth/*
// routes and the legacy /api/v1/auth/* routes during the migration window.
const REFRESH_COOKIE_PATH = "/api";

export function applySessionCookies(
  response: NextResponse,
  tokens: { accessToken: string; refreshToken: string },
) {
  response.cookies.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
    httpOnly: true,
    maxAge: accessTokenTtlSeconds(),
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  response.cookies.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
    httpOnly: true,
    maxAge: refreshTokenTtlSeconds(),
    path: REFRESH_COOKIE_PATH,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}

export function clearSessionCookies(response: NextResponse) {
  for (const path of ["/", REFRESH_COOKIE_PATH, "/api/v1/auth"]) {
    const name = path === "/" ? ACCESS_TOKEN_COOKIE : REFRESH_TOKEN_COOKIE;

    response.cookies.set(name, "", {
      httpOnly: true,
      maxAge: 0,
      path,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
}
