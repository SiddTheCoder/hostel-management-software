import { Schema, model, models } from "mongoose";

const hostelDocumentSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    ownerId: { ref: "User", required: true, type: Schema.Types.ObjectId },
    documentType: { type: String, required: true, trim: true },
    fileAssetId: { ref: "FileAsset", type: Schema.Types.ObjectId },
    fileUrl: { type: String, trim: true },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    reviewedBy: { ref: "User", type: Schema.Types.ObjectId },
    reviewedAt: Date,
    rejectionReason: { type: String, trim: true },
    createdBy: { ref: "User", type: Schema.Types.ObjectId },
    updatedBy: { ref: "User", type: Schema.Types.ObjectId },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    deletedBy: { ref: "User", type: Schema.Types.ObjectId },
  },
  { timestamps: true },
);

hostelDocumentSchema.index({ hostelId: 1, documentType: 1, status: 1 });
hostelDocumentSchema.index({ ownerId: 1, status: 1 });

export const HostelDocumentModel =
  models.HostelDocument || model("HostelDocument", hostelDocumentSchema);
