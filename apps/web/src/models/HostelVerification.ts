import { Schema, model, models } from "mongoose";

const hostelVerificationSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    status: {
      type: String,
      enum: ["PENDING", "VERIFIED", "REJECTED"],
      default: "PENDING",
    },
    checklist: [
      {
        key: { type: String, required: true, trim: true },
        label: { type: String, required: true, trim: true },
        passed: { default: false, type: Boolean },
      },
    ],
    notes: { type: String, trim: true },
    verifiedBy: { ref: "User", type: Schema.Types.ObjectId },
    verifiedAt: Date,
    createdBy: { ref: "User", type: Schema.Types.ObjectId },
    updatedBy: { ref: "User", type: Schema.Types.ObjectId },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    deletedBy: { ref: "User", type: Schema.Types.ObjectId },
  },
  { timestamps: true },
);

hostelVerificationSchema.index({ hostelId: 1 }, { unique: true });
hostelVerificationSchema.index({ status: 1, updatedAt: -1 });

export const HostelVerificationModel =
  models.HostelVerification || model("HostelVerification", hostelVerificationSchema);
