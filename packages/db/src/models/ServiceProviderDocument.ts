import { Schema, model, models } from "mongoose";

const serviceProviderDocumentSchema = new Schema(
  {
    providerId: {
      ref: "ServiceProvider",
      required: true,
      type: Schema.Types.ObjectId,
    },
    documentType: { required: true, trim: true, type: String },
    fileAssetId: { ref: "FileAsset", type: Schema.Types.ObjectId },
    fileUrl: { trim: true, type: String },
    status: {
      default: "PENDING",
      enum: ["PENDING", "APPROVED", "REJECTED"],
      type: String,
    },
    reviewedAt: Date,
    reviewedBy: { ref: "User", type: Schema.Types.ObjectId },
    createdBy: { ref: "User", type: Schema.Types.ObjectId },
    updatedBy: { ref: "User", type: Schema.Types.ObjectId },
    isDeleted: { default: false, type: Boolean },
  },
  { timestamps: true },
);

serviceProviderDocumentSchema.index({ providerId: 1, status: 1 });

export const ServiceProviderDocumentModel =
  models.ServiceProviderDocument ||
  model("ServiceProviderDocument", serviceProviderDocumentSchema);
