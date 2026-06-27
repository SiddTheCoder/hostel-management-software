import { z } from "zod";

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid object id.");

export const moveInChecklistSchema = z.object({
  bedCondition: z.string().trim().max(1000).optional(),
  depositAmount: z.number().min(0).default(0),
  documentsCollected: z.array(z.string().trim().min(1)).max(20).default([]),
  hostelId: objectIdSchema.optional(),
  itemsProvided: z.array(z.string().trim().min(1)).max(50).default([]),
  roomCondition: z.string().trim().max(1000).optional(),
  roomPhotoAssetIds: z.array(z.string().trim().min(1)).max(20).default([]),
  rulesAccepted: z.boolean().default(false),
});

export const moveOutChecklistSchema = z.object({
  damageNotes: z.string().trim().max(2000).optional(),
  depositRefundAmount: z.number().min(0).default(0),
  depositRefundDecision: z
    .enum(["PENDING", "APPROVED", "PARTIAL", "FORFEITED"])
    .default("PENDING"),
  finalReceiptAssetId: z.string().trim().optional(),
  hostelId: objectIdSchema.optional(),
  itemReturnNotes: z.string().trim().max(2000).optional(),
});
