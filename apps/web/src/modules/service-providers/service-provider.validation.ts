import { z } from "zod";

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid object id.");

export const serviceProviderCategorySchema = z.enum([
  "PLUMBER",
  "ELECTRICIAN",
  "DOCTOR_CLINIC",
  "INTERNET_TECHNICIAN",
  "CLEANER",
  "CARPENTER",
  "PAINTER",
  "WATER_SUPPLIER",
  "APPLIANCE_REPAIR",
  "ROOM_REPAIR",
  "OTHER",
]);

export const serviceProviderRegisterSchema = z.object({
  area: z.string().trim().min(2).max(120),
  availability: z.string().trim().max(240).optional(),
  category: serviceProviderCategorySchema,
  city: z.string().trim().min(2).max(120).default("Kathmandu"),
  description: z.string().trim().max(1200).optional(),
  documents: z
    .array(
      z.object({
        documentType: z.string().trim().min(2).max(80),
        fileAssetId: objectIdSchema.optional(),
        fileUrl: z.string().trim().url().optional(),
      }),
    )
    .max(8)
    .default([]),
  experience: z.string().trim().max(240).optional(),
  fullName: z.string().trim().min(2).max(160),
  phone: z.string().trim().min(7).max(24),
  photoAssetId: objectIdSchema.optional(),
});

export const platformServiceProviderListQuerySchema = z.object({
  area: z.string().trim().min(1).max(120).optional(),
  category: serviceProviderCategorySchema.optional(),
  status: z
    .enum(["PENDING_APPROVAL", "APPROVED", "REJECTED", "HIDDEN", "INACTIVE"])
    .optional(),
});

export const serviceProviderRejectSchema = z.object({
  reason: z.string().trim().min(2).max(800),
});

export const hostelAdminServiceProviderListQuerySchema = z.object({
  area: z.string().trim().min(1).max(120).optional(),
  category: serviceProviderCategorySchema.optional(),
  q: z.string().trim().min(1).max(160).optional(),
});
