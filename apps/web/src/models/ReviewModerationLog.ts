import { Schema, model, models } from "mongoose";

const reviewModerationLogSchema = new Schema(
  {
    reviewId: { ref: "RatingReview", required: true, type: Schema.Types.ObjectId },
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    action: { enum: ["HIDE", "UNHIDE"], required: true, type: String },
    reason: { trim: true, type: String },
    actorId: { ref: "User", required: true, type: Schema.Types.ObjectId },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

reviewModerationLogSchema.index({ reviewId: 1, createdAt: -1 });
reviewModerationLogSchema.index({ hostelId: 1, createdAt: -1 });

export const ReviewModerationLogModel =
  models.ReviewModerationLog || model("ReviewModerationLog", reviewModerationLogSchema);
