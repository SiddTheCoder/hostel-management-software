import { Schema, model, models } from "mongoose";

const referralRewardSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    referralId: { ref: "Referral", required: true, type: Schema.Types.ObjectId },
    referrerResidentId: {
      ref: "Resident",
      required: true,
      type: Schema.Types.ObjectId,
    },
    rewardType: {
      default: "DISCOUNT",
      enum: ["DISCOUNT", "CASH", "SERVICE_CREDIT", "OTHER"],
      type: String,
    },
    amount: { default: 0, min: 0, type: Number },
    status: {
      default: "PENDING",
      enum: ["PENDING", "APPROVED", "PAID", "CANCELLED"],
      type: String,
    },
    notes: { trim: true, type: String },
    approvedAt: Date,
    approvedBy: { ref: "User", type: Schema.Types.ObjectId },
  },
  { timestamps: true },
);

referralRewardSchema.index({ hostelId: 1, status: 1 });
referralRewardSchema.index({ referralId: 1 }, { unique: true });

export const ReferralRewardModel =
  models.ReferralReward || model("ReferralReward", referralRewardSchema);
