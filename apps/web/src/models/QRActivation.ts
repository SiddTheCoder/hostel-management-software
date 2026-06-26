import { Schema, model, models } from "mongoose";

const qrActivationSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    residentId: { ref: "Resident", required: true, type: Schema.Types.ObjectId },
    codeHash: { required: true, select: false, type: String },
    expiresAt: { required: true, type: Date },
    usedAt: Date,
    usedBy: { ref: "User", type: Schema.Types.ObjectId },
    deviceInfo: { default: {}, type: Schema.Types.Mixed },
    sessionInfo: { default: {}, type: Schema.Types.Mixed },
    createdBy: { ref: "User", required: true, type: Schema.Types.ObjectId },
    status: {
      default: "PENDING",
      enum: ["PENDING", "USED", "EXPIRED", "CANCELLED"],
      type: String,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

qrActivationSchema.index({ hostelId: 1, residentId: 1, status: 1 });
qrActivationSchema.index({ codeHash: 1 });
qrActivationSchema.index({ expiresAt: 1, status: 1 });
qrActivationSchema.index({ usedAt: 1, status: 1 });

export const QRActivationModel =
  models.QRActivation || model("QRActivation", qrActivationSchema);
