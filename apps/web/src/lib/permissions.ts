import { Role } from "@/lib/roles";

export type Principal = {
  role: Role;
  userId: string;
};

export const HOSTEL_STAFF_ROLES = [Role.HOSTEL_OWNER, Role.HOSTEL_ADMIN, Role.WARDEN];

export const AUTHENTICATED_ROLES = [
  Role.PLATFORM_OWNER,
  ...HOSTEL_STAFF_ROLES,
  Role.RESIDENT,
  Role.GUARDIAN,
  Role.SERVICE_PROVIDER,
];

export class PermissionError extends Error {
  status = 403;
  errorCode = "FORBIDDEN";
}

export function hasAllowedRole(principal: Principal, allowedRoles: Role[]) {
  return allowedRoles.includes(principal.role);
}

export function assertAllowedRole(principal: Principal, allowedRoles: Role[]) {
  if (!hasAllowedRole(principal, allowedRoles)) {
    throw new PermissionError("This role is not allowed to perform this action.");
  }
}
