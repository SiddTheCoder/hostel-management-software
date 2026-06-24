import { Schema, model, models } from "mongoose";

const hostelApplicationSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    applicantId: { ref: "User", required: true, type: Schema.Types.ObjectId },
    submittedBy: { ref: "User", required: true, type: Schema.Types.ObjectId },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    reviewedBy: { ref: "User", type: Schema.Types.ObjectId },
    reviewedAt: Date,
    rejectionReason: { type: String, trim: true },
    notes: { type: String, trim: true },
    snapshot: { default: {}, type: Schema.Types.Mixed },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    deletedBy: { ref: "User", type: Schema.Types.ObjectId },
  },
  { timestamps: true },
);

hostelApplicationSchema.index({ hostelId: 1, status: 1 });
hostelApplicationSchema.index({ applicantId: 1, status: 1 });
hostelApplicationSchema.index({ status: 1, createdAt: -1 });

export const HostelApplicationModel =
  models.HostelApplication || model("HostelApplication", hostelApplicationSchema);
