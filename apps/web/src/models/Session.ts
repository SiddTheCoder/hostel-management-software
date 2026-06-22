import { Schema, model, models } from "mongoose";

const sessionSchema = new Schema(
  {
    userId: { ref: "User", required: true, type: Schema.Types.ObjectId },
    refreshTokenHash: { type: String, required: true },
    userAgent: String,
    ipAddress: String,
    expiresAt: { type: Date, required: true },
    lastSeenAt: Date,
    revokedAt: { default: null, type: Date },
  },
  { timestamps: true },
);

sessionSchema.index({ userId: 1, expiresAt: 1 });
sessionSchema.index({ refreshTokenHash: 1 }, { unique: true });
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const SessionModel = models.Session || model("Session", sessionSchema);
