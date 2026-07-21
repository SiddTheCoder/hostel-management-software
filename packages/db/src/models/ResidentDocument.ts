import { Schema, model, models } from "mongoose";

const residentDocumentSchema = new Schema(
  {
    residentId: { ref: "Resident", required: true, type: Schema.Types.ObjectId },
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    documentType: { type: String, required: true, trim: true },
    fileAssetId: { ref: "FileAsset", required: true, type: Schema.Types.ObjectId },
    uploadedBy: { ref: "User", required: true, type: Schema.Types.ObjectId },
    uploadedAt: { default: Date.now, type: Date },
  },
  { timestamps: false },
);

residentDocumentSchema.index({ hostelId: 1, residentId: 1 });
residentDocumentSchema.index({ residentId: 1, documentType: 1 });

export const ResidentDocumentModel =
  models.ResidentDocument || model("ResidentDocument", residentDocumentSchema);
