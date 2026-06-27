import { z } from "zod";

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid object id.");

export const reviewCreateSchema = z.object({
  cleanlinessRating: z.number().int().min(1).max(5).optional(),
  comment: z.string().trim().max(3000).optional(),
  foodRating: z.number().int().min(1).max(5).optional(),
  overallRating: z.number().int().min(1).max(5),
  safetyRating: z.number().int().min(1).max(5).optional(),
});

export const reviewModerationSchema = z.object({
  reason: z.string().trim().max(1000).optional(),
});

export const platformReviewListQuerySchema = z.object({
  hostelId: objectIdSchema.optional(),
  status: z.enum(["VISIBLE", "HIDDEN"]).optional(),
});
