import type { NextRequest } from "next/server";

import { requireApiPrincipal } from "@/lib/api-auth";
import { handleRouteError, successResponse } from "@/lib/api-response";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  accessTokenTtlSeconds,
  refreshTokenTtlSeconds,
} from "@/lib/auth";
import { shouldExposeRefreshToken } from "@/lib/mobile-auth";
import { activateResident } from "@/modules/residents/activation.service";
import { activationCodeSchema } from "@/modules/residents/activation.validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const principal = await requireApiPrincipal(request);
    const input = activationCodeSchema.parse(await request.json());
    const result = await activateResident(input, principal);
    const response = successResponse(
      {
        activation: result.activation,
        accessToken: result.session.accessToken,
        ...(shouldExposeRefreshToken(request.headers)
          ? { refreshToken: result.session.refreshToken }
          : {}),
        resident: result.resident,
        user: result.session.user,
      },
      "Resident activated",
    );

    response.cookies.set(ACCESS_TOKEN_COOKIE, result.session.accessToken, {
      httpOnly: true,
      maxAge: accessTokenTtlSeconds(),
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    response.cookies.set(REFRESH_TOKEN_COOKIE, result.session.refreshToken, {
      httpOnly: true,
      maxAge: refreshTokenTtlSeconds(),
      path: "/api/v1/auth",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    return handleRouteError(error);
  }
}
