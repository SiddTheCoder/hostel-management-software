import { z } from "zod";

export const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Expected a MongoDB ObjectId.");

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const phoneSchema = z
  .string()
  .trim()
  .min(7)
  .max(20)
  .regex(/^[+\d\s-]+$/, "Expected a valid phone number.");

export function validateWith<T>(schema: z.ZodType<T>, value: unknown) {
  return schema.parse(value);
}
