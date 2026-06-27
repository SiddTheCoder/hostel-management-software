import { Schema, model, models } from "mongoose";

const serviceProviderApplicationSchema = new Schema(
  {
    providerId: {
      ref: "ServiceProvider",
      required: true,
      type: Schema.Types.ObjectId,
    },
    status: {
      default: "PENDING",
      enum: ["PENDING", "APPROVED", "REJECTED"],
      type: String,
    },
    snapshot: { default: {}, type: Schema.Types.Mixed },
    submittedAt: { default: Date.now, type: Date },
    reviewedAt: Date,
    reviewedBy: { ref: "User", type: Schema.Types.ObjectId },
    rejectionReason: { trim: true, type: String },
    createdBy: { ref: "User", type: Schema.Types.ObjectId },
    updatedBy: { ref: "User", type: Schema.Types.ObjectId },
    isDeleted: { default: false, type: Boolean },
  },
  { timestamps: true },
);

serviceProviderApplicationSchema.index({ providerId: 1, status: 1 });
serviceProviderApplicationSchema.index({ status: 1, submittedAt: -1 });

export const ServiceProviderApplicationModel =
  models.ServiceProviderApplication ||
  model("ServiceProviderApplication", serviceProviderApplicationSchema);
