import { Role } from "@/lib/roles";

export type Principal = {
  role: Role;
  userId: string;
};

export const HOSTEL_STAFF_ROLES = [Role.HOSTEL_ADMIN, Role.WARDEN];

export const PLATFORM_ROLES = [Role.SUPERADMIN, Role.PLATFORM_MODERATOR];

export const AUTHENTICATED_ROLES = [
  ...PLATFORM_ROLES,
  ...HOSTEL_STAFF_ROLES,
  Role.COOK,
  Role.RESIDENT,
  Role.GUARDIAN,
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
