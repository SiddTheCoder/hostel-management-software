import { z } from "zod";

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid object id.");

export const activationCodeGenerateSchema = z.object({
  expiresInHours: z.coerce.number().int().min(1).max(168).default(48),
  hostelId: objectIdSchema.optional(),
});

export const activationCodeSchema = z.object({
  code: z.string().trim().min(6).max(32),
  deviceInfo: z.record(z.string(), z.unknown()).default({}),
  sessionInfo: z.record(z.string(), z.unknown()).default({}),
});

export const activationStatusQuerySchema = z.object({
  code: z.string().trim().min(6).max(32).optional(),
});
