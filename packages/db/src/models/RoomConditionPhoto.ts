import { Schema, model, models } from "mongoose";

const roomConditionPhotoSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    residentId: { ref: "Resident", required: true, type: Schema.Types.ObjectId },
    checklistType: {
      enum: ["MOVE_IN", "MOVE_OUT"],
      required: true,
      type: String,
    },
    checklistId: { required: true, type: Schema.Types.ObjectId },
    photoAssetId: { required: true, trim: true, type: String },
    caption: { trim: true, type: String },
    uploadedBy: { ref: "User", required: true, type: Schema.Types.ObjectId },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

roomConditionPhotoSchema.index({ hostelId: 1, residentId: 1, checklistType: 1 });

export const RoomConditionPhotoModel =
  models.RoomConditionPhoto || model("RoomConditionPhoto", roomConditionPhotoSchema);
