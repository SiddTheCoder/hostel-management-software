import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";

import { ACCESS_TOKEN_COOKIE } from "@/lib/auth-cookies";
import { landingPathForRole, protectedRouteRuleForPath } from "@/lib/route-access";
import { Role } from "@/lib/roles";

function accessSecret() {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is required for protected routes.");
  }

  return new TextEncoder().encode(secret);
}

function redirectToLogin(request: NextRequest, error?: string) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set(
    "next",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );

  if (error) {
    loginUrl.searchParams.set("error", error);
  }

  return NextResponse.redirect(loginUrl);
}

export async function proxy(request: NextRequest) {
  const rule = protectedRouteRuleForPath(request.nextUrl.pathname);

  if (!rule) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!token) {
    return redirectToLogin(request);
  }

  try {
    const { payload } = await jwtVerify(token, accessSecret());

    if (
      payload.tokenType !== "access" ||
      !payload.sub ||
      typeof payload.role !== "string"
    ) {
      return redirectToLogin(request, "invalid_session");
    }

    const role = payload.role as Role;

    if (rule.roles.includes(role)) {
      return NextResponse.next();
    }

    const landingPath = landingPathForRole(role);

    if (landingPath) {
      const landingUrl = request.nextUrl.clone();
      landingUrl.pathname = landingPath;
      landingUrl.search = "";

      return NextResponse.redirect(landingUrl);
    }

    return redirectToLogin(request, "forbidden");
  } catch {
    return redirectToLogin(request, "session_expired");
  }
}

export const config = {
  matcher: [
    "/platform/:path*",
    "/hostel-admin/:path*",
    "/resident/:path*",
    "/guardian/:path*",
  ],
};
