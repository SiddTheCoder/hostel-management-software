import { z } from "zod";

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid object id.");

export const guardianAccessCreateSchema = z.object({
  allowComplaintStatus: z.boolean().default(false),
  expiresInDays: z.number().int().min(1).max(90).default(30),
  guardianId: objectIdSchema,
  hostelId: objectIdSchema.optional(),
});

export const guardianLoginSchema = z.object({
  accessCode: z.string().trim().min(4).max(24),
  phone: z.string().trim().min(6).max(32),
});
