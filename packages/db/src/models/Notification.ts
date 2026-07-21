import { Schema, model, models } from "mongoose";

const notificationSchema = new Schema(
  {
    userId: { ref: "User", required: true, type: Schema.Types.ObjectId },
    hostelId: { ref: "Hostel", type: Schema.Types.ObjectId },
    title: { type: String, required: true },
    body: { type: String, required: true },
    category: { type: String, required: true },
    channel: {
      type: String,
      enum: ["IN_APP", "PUSH", "EMAIL", "SMS"],
      default: "IN_APP",
    },
    data: { default: {}, type: Schema.Types.Mixed },
    readAt: Date,
    status: { type: String, enum: ["QUEUED", "SENT", "FAILED"], default: "QUEUED" },
    createdBy: { ref: "User", type: Schema.Types.ObjectId },
    updatedBy: { ref: "User", type: Schema.Types.ObjectId },
  },
  { timestamps: true },
);

notificationSchema.index({ userId: 1, readAt: 1, createdAt: -1 });
notificationSchema.index({ hostelId: 1, status: 1 });

export const NotificationModel =
  models.Notification || model("Notification", notificationSchema);
