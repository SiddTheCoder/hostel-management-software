import type { NextRequest } from "next/server";

import { ACCESS_TOKEN_COOKIE, getBearerToken, verifyAccessToken } from "@/lib/auth";
import { HOSTEL_STAFF_ROLES, assertAllowedRole } from "@/lib/permissions";
import { assertHostelAccess } from "@/lib/tenant";
import { Role } from "@/lib/roles";

export type ApiPrincipal = {
  hostelIds: string[];
  role: Role;
  sessionId?: string;
  userId: string;
};

export class ApiAuthError extends Error {
  constructor(
    message: string,
    public errorCode = "UNAUTHENTICATED",
    public status = 401,
  ) {
    super(message);
  }
}

function isRole(value: unknown): value is Role {
  return typeof value === "string" && Object.values(Role).includes(value as Role);
}

function cookieAccessToken(request: NextRequest) {
  return request.cookies.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}

export async function loadApiPrincipal(request: NextRequest) {
  const accessToken =
    getBearerToken(request.headers.get("authorization")) ?? cookieAccessToken(request);

  if (!accessToken) {
    return null;
  }

  try {
    const payload = await verifyAccessToken(accessToken);

    if (!payload.sub || !isRole(payload.role)) {
      return null;
    }

    return {
      hostelIds: Array.isArray(payload.hostelIds)
        ? payload.hostelIds.map((hostelId) => String(hostelId))
        : [],
      role: payload.role,
      sessionId: typeof payload.sessionId === "string" ? payload.sessionId : undefined,
      userId: payload.sub,
    } satisfies ApiPrincipal;
  } catch {
    return null;
  }
}

export async function requireApiPrincipal(request: NextRequest) {
  const principal = await loadApiPrincipal(request);

  if (!principal) {
    throw new ApiAuthError("Authentication is required.");
  }

  return principal;
}

export function assertApiRoles(principal: ApiPrincipal, roles: Role[]) {
  try {
    assertAllowedRole(principal, roles);
  } catch {
    throw new ApiAuthError(
      "This role is not allowed to perform this action.",
      "FORBIDDEN",
      403,
    );
  }
}

export async function requirePlatformPrincipal(request: NextRequest) {
  const principal = await requireApiPrincipal(request);

  assertApiRoles(principal, [Role.PLATFORM_OWNER]);

  return principal;
}

export async function requireHostelStaffPrincipal(request: NextRequest) {
  const principal = await requireApiPrincipal(request);

  assertApiRoles(principal, HOSTEL_STAFF_ROLES);

  return principal;
}

export function assertHostelScopedApiAccess(principal: ApiPrincipal, hostelId: string) {
  try {
    assertHostelAccess(principal, hostelId);
  } catch {
    throw new ApiAuthError(
      "You do not have access to this hostel.",
      "TENANT_ACCESS_DENIED",
      403,
    );
  }
}

export async function requireHostelScopedPrincipal(
  request: NextRequest,
  hostelId: string,
) {
  const principal = await requireApiPrincipal(request);

  assertApiRoles(principal, [Role.PLATFORM_OWNER, ...HOSTEL_STAFF_ROLES]);
  assertHostelScopedApiAccess(principal, hostelId);

  return principal;
}

export async function requireResidentPrincipal(request: NextRequest) {
  const principal = await requireApiPrincipal(request);

  assertApiRoles(principal, [Role.RESIDENT]);

  return principal;
}

export async function requireGuardianPrincipal(request: NextRequest) {
  const principal = await requireApiPrincipal(request);

  assertApiRoles(principal, [Role.GUARDIAN]);

  return principal;
}
