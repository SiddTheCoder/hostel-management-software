import { Schema, model, models } from "mongoose";

const noticeReadStatusSchema = new Schema(
  {
    noticeId: { ref: "Notice", required: true, type: Schema.Types.ObjectId },
    userId: { ref: "User", required: true, type: Schema.Types.ObjectId },
    readAt: { default: Date.now, type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

noticeReadStatusSchema.index({ noticeId: 1, userId: 1 }, { unique: true });
noticeReadStatusSchema.index({ userId: 1, readAt: -1 });

export const NoticeReadStatusModel =
  models.NoticeReadStatus || model("NoticeReadStatus", noticeReadStatusSchema);
