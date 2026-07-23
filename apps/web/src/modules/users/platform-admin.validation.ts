import { z } from "zod";

import { Role } from "@/lib/roles";

const platformAdminRoleSchema = z.enum([Role.SUPERADMIN, Role.PLATFORM_MODERATOR]);

export const platformAdminCreateSchema = z.object({
  email: z.string().trim().email(),
  name: z.string().trim().max(120).optional(),
  phone: z.string().trim().max(40).optional(),
  role: platformAdminRoleSchema,
  sendEmailNotification: z.boolean().optional(),
});

export const platformAdminRoleUpdateSchema = z.object({
  role: platformAdminRoleSchema,
});
