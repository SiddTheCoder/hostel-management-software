import { Schema, model, models } from "mongoose";

const deviceTokenSchema = new Schema(
  {
    userId: { ref: "User", required: true, type: Schema.Types.ObjectId },
    token: { required: true, trim: true, type: String },
    platform: {
      enum: ["IOS", "ANDROID", "WEB"],
      required: true,
      type: String,
    },
    deviceId: { trim: true, type: String },
    lastSeenAt: { default: Date.now, type: Date },
    status: {
      default: "ACTIVE",
      enum: ["ACTIVE", "REVOKED"],
      type: String,
    },
  },
  { timestamps: true },
);

deviceTokenSchema.index({ token: 1 }, { unique: true });
deviceTokenSchema.index({ userId: 1, status: 1 });

export const DeviceTokenModel =
  models.DeviceToken || model("DeviceToken", deviceTokenSchema);
