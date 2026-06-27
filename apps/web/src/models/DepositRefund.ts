import { Schema, model, models } from "mongoose";

const depositRefundSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    residentId: { ref: "Resident", required: true, type: Schema.Types.ObjectId },
    moveOutChecklistId: {
      ref: "MoveOutChecklist",
      required: true,
      type: Schema.Types.ObjectId,
    },
    amount: { default: 0, min: 0, type: Number },
    decision: {
      default: "PENDING",
      enum: ["PENDING", "APPROVED", "PARTIAL", "FORFEITED"],
      type: String,
    },
    reason: { trim: true, type: String },
    decidedBy: { ref: "User", required: true, type: Schema.Types.ObjectId },
    decidedAt: { default: Date.now, type: Date },
  },
  { timestamps: true },
);

depositRefundSchema.index({ hostelId: 1, residentId: 1 });
depositRefundSchema.index({ moveOutChecklistId: 1 });

export const DepositRefundModel =
  models.DepositRefund || model("DepositRefund", depositRefundSchema);
