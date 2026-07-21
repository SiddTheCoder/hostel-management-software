export enum Role {
  SUPERADMIN = "SUPERADMIN",
  PLATFORM_MODERATOR = "PLATFORM_MODERATOR",
  HOSTEL_ADMIN = "HOSTEL_ADMIN",
  WARDEN = "WARDEN",
  COOK = "COOK",
  RESIDENT = "RESIDENT",
  GUARDIAN = "GUARDIAN",
  PUBLIC = "PUBLIC",
}

export const ROLE_VALUES = Object.values(Role);

/**
 * Maps role values from the pre-docs codebase to the canonical
 * DATABASE.md roles. Used by the one-shot data migration script
 * (packages/db/src/migrate-roles.ts) — not by runtime auth logic.
 */
export const LEGACY_ROLE_MAP: Record<string, Role> = {
  PLATFORM_OWNER: Role.SUPERADMIN,
  HOSTEL_OWNER: Role.HOSTEL_ADMIN,
  PUBLIC_USER: Role.PUBLIC,
  SERVICE_PROVIDER: Role.PUBLIC,
};
