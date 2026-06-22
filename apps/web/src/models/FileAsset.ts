import { Schema, model, models } from "mongoose";

const fileAssetSchema = new Schema(
  {
    hostelId: { ref: "Hostel", type: Schema.Types.ObjectId },
    ownerId: { ref: "User", type: Schema.Types.ObjectId },
    storageProvider: { type: String, required: true },
    bucket: { type: String, required: true },
    key: { type: String, required: true },
    fileName: { type: String, required: true },
    mimeType: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    accessLevel: {
      type: String,
      enum: ["PUBLIC", "PRIVATE", "PROTECTED"],
      default: "PRIVATE",
    },
    publicUrl: String,
    status: { type: String, enum: ["ACTIVE", "DELETED"], default: "ACTIVE" },
    createdBy: { ref: "User", type: Schema.Types.ObjectId },
    updatedBy: { ref: "User", type: Schema.Types.ObjectId },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    deletedBy: { ref: "User", type: Schema.Types.ObjectId },
  },
  { timestamps: true },
);

fileAssetSchema.index({ hostelId: 1, status: 1 });
fileAssetSchema.index({ ownerId: 1, status: 1 });
fileAssetSchema.index({ key: 1 }, { unique: true });

export const FileAssetModel = models.FileAsset || model("FileAsset", fileAssetSchema);
