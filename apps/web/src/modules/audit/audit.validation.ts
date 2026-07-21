import { z } from "zod";

export const platformAuditLogQuerySchema = z.object({
  action: z.string().trim().min(1).optional(),
  entityType: z.string().trim().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(250).optional(),
});

export type PlatformAuditLogQueryInput = z.infer<typeof platformAuditLogQuerySchema>;
