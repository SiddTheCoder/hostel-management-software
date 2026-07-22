import { z } from "zod";

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid object id.");

const optionalHostelScopeSchema = {
  hostelId: objectIdSchema.optional(),
};

/**
 * Per-warden capability flags. Mirrors DATABASE.md `IHostelStaffPermissions`,
 * but stored as an enabled-key array on the `HostelMember.permissions` field
 * (the model this codebase actually uses in place of docs' `HostelStaff`).
 */
export const WARDEN_PERMISSION_KEYS = [
  "registerResidents",
  "editHostelProfile",
  "manageRooms",
  "verifyPayments",
  "manageFood",
  "manageNotices",
  "viewComplaints",
  "updateComplaints",
  "viewNightStatus",
  "updateNightStatus",
  "manageMaintenance",
] as const;

export type WardenPermissionKey = (typeof WARDEN_PERMISSION_KEYS)[number];

/** Defaults match the `default: true` flags in DATABASE.md HostelStaffSchema. */
export const DEFAULT_WARDEN_PERMISSIONS: WardenPermissionKey[] = [
  "registerResidents",
  "verifyPayments",
  "manageFood",
  "manageNotices",
  "viewComplaints",
  "updateComplaints",
  "viewNightStatus",
  "updateNightStatus",
  "manageMaintenance",
];

const permissionsSchema = z
  .array(z.enum(WARDEN_PERMISSION_KEYS))
  .max(WARDEN_PERMISSION_KEYS.length);

export const wardenListQuerySchema = z.object({
  ...optionalHostelScopeSchema,
  status: z.enum(["ACTIVE", "INVITED", "SUSPENDED", "REMOVED"]).optional(),
});

export const wardenCreateSchema = z.object({
  ...optionalHostelScopeSchema,
  email: z.string().trim().email(),
  name: z.string().trim().min(1).max(120),
  permissions: permissionsSchema.optional(),
  phone: z.string().trim().min(7).max(24).optional(),
});

export const wardenUpdateSchema = z
  .object({
    ...optionalHostelScopeSchema,
    permissions: permissionsSchema.optional(),
    status: z.enum(["ACTIVE", "SUSPENDED"]).optional(),
  })
  .refine((value) => value.permissions !== undefined || value.status !== undefined, {
    message: "Provide permissions or status to update.",
  });
