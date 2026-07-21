import { Schema, model, models } from "mongoose";

const moveOutChecklistSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    residentId: { ref: "Resident", required: true, type: Schema.Types.ObjectId },
    pendingFeeAmount: { default: 0, min: 0, type: Number },
    damageNotes: { trim: true, type: String },
    itemReturnNotes: { trim: true, type: String },
    depositRefundAmount: { default: 0, min: 0, type: Number },
    depositRefundDecision: {
      default: "PENDING",
      enum: ["PENDING", "APPROVED", "PARTIAL", "FORFEITED"],
      type: String,
    },
    finalReceiptAssetId: { trim: true, type: String },
    completedAt: Date,
    completedBy: { ref: "User", type: Schema.Types.ObjectId },
    createdBy: { ref: "User", required: true, type: Schema.Types.ObjectId },
    updatedBy: { ref: "User", required: true, type: Schema.Types.ObjectId },
  },
  { timestamps: true },
);

moveOutChecklistSchema.index({ hostelId: 1, residentId: 1 }, { unique: true });

export const MoveOutChecklistModel =
  models.MoveOutChecklist || model("MoveOutChecklist", moveOutChecklistSchema);
