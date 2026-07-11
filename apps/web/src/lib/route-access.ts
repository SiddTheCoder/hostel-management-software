import { Role } from "@/lib/roles";

export type ProtectedRouteRule = {
  prefix: string;
  roles: Role[];
};

export const protectedRouteRules: ProtectedRouteRule[] = [
  {
    prefix: "/platform",
    roles: [Role.PLATFORM_OWNER],
  },
  {
    prefix: "/hostel-admin",
    roles: [Role.HOSTEL_OWNER, Role.HOSTEL_ADMIN, Role.WARDEN],
  },
  {
    prefix: "/resident",
    roles: [Role.RESIDENT],
  },
  {
    prefix: "/guardian",
    roles: [Role.GUARDIAN],
  },
];

export const roleLandingPath: Record<Role, string> = {
  [Role.PLATFORM_OWNER]: "/platform/dashboard",
  [Role.HOSTEL_OWNER]: "/hostel-admin/dashboard",
  [Role.HOSTEL_ADMIN]: "/hostel-admin/dashboard",
  [Role.WARDEN]: "/hostel-admin/dashboard",
  [Role.RESIDENT]: "/resident/dashboard",
  [Role.GUARDIAN]: "/guardian/dashboard",
  [Role.SERVICE_PROVIDER]: "/",
  [Role.PUBLIC_USER]: "/",
};

export const roleAllowedNextPrefixes: Partial<Record<Role, string[]>> = {
  [Role.PLATFORM_OWNER]: ["/platform"],
  [Role.HOSTEL_OWNER]: ["/hostel-admin"],
  [Role.HOSTEL_ADMIN]: ["/hostel-admin"],
  [Role.WARDEN]: ["/hostel-admin"],
  [Role.RESIDENT]: ["/resident"],
  [Role.GUARDIAN]: ["/guardian"],
};

export function pathMatchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function protectedRouteRuleForPath(pathname: string) {
  return protectedRouteRules.find((rule) => pathMatchesPrefix(pathname, rule.prefix));
}

export function landingPathForRole(role: Role | string) {
  return roleLandingPath[role as Role];
}

export function dashboardHrefForRole(role: Role) {
  return landingPathForRole(role) ?? "/";
}

export function isSafeLocalPath(value: string) {
  return value.startsWith("/") && !value.startsWith("//");
}

export function isAllowedNextPath(role: Role, value: string) {
  const allowedPrefixes = roleAllowedNextPrefixes[role] ?? [];

  return allowedPrefixes.some((prefix) => pathMatchesPrefix(value, prefix));
}

export function destinationForRole(role: Role, requestedNext?: string | null) {
  if (
    requestedNext &&
    isSafeLocalPath(requestedNext) &&
    isAllowedNextPath(role, requestedNext)
  ) {
    return requestedNext;
  }

  return landingPathForRole(role) ?? "/";
}
