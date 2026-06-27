import { Schema, model, models } from "mongoose";

const duplicateCheckResultSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    checkedBy: { ref: "User", required: true, type: Schema.Types.ObjectId },
    matchedHostelIds: [{ ref: "Hostel", type: Schema.Types.ObjectId }],
    signals: [{ type: String, trim: true }],
    riskLevel: {
      default: "LOW",
      enum: ["LOW", "MEDIUM", "HIGH"],
      type: String,
    },
    flagId: { ref: "ListingFlag", type: Schema.Types.ObjectId },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

duplicateCheckResultSchema.index({ hostelId: 1, createdAt: -1 });
duplicateCheckResultSchema.index({ riskLevel: 1, createdAt: -1 });

export const DuplicateCheckResultModel =
  models.DuplicateCheckResult ||
  model("DuplicateCheckResult", duplicateCheckResultSchema);
