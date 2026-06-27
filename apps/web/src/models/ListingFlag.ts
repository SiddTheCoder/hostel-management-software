import { Schema, model, models } from "mongoose";

const listingFlagSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    matchedHostelIds: [{ ref: "Hostel", type: Schema.Types.ObjectId }],
    riskLevel: {
      default: "LOW",
      enum: ["LOW", "MEDIUM", "HIGH"],
      type: String,
    },
    reason: { required: true, trim: true, type: String },
    signals: [{ type: String, trim: true }],
    status: {
      default: "OPEN",
      enum: ["OPEN", "RESOLVED", "DISMISSED"],
      type: String,
    },
    resolvedAt: Date,
    resolvedBy: { ref: "User", type: Schema.Types.ObjectId },
    resolutionNote: { trim: true, type: String },
    createdBy: { ref: "User", type: Schema.Types.ObjectId },
    updatedBy: { ref: "User", type: Schema.Types.ObjectId },
    isDeleted: { default: false, type: Boolean },
  },
  { timestamps: true },
);

listingFlagSchema.index({ status: 1, riskLevel: 1, createdAt: -1 });
listingFlagSchema.index({ hostelId: 1, status: 1 });

export const ListingFlagModel =
  models.ListingFlag || model("ListingFlag", listingFlagSchema);
