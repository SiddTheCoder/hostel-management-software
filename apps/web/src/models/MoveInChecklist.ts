import { Schema, model, models } from "mongoose";

const moveInChecklistSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    residentId: { ref: "Resident", required: true, type: Schema.Types.ObjectId },
    documentsCollected: { default: [], type: [String] },
    roomPhotoAssetIds: { default: [], type: [String] },
    roomCondition: { trim: true, type: String },
    bedCondition: { trim: true, type: String },
    itemsProvided: { default: [], type: [String] },
    depositAmount: { default: 0, min: 0, type: Number },
    rulesAccepted: { default: false, type: Boolean },
    completedAt: Date,
    completedBy: { ref: "User", type: Schema.Types.ObjectId },
    createdBy: { ref: "User", required: true, type: Schema.Types.ObjectId },
    updatedBy: { ref: "User", required: true, type: Schema.Types.ObjectId },
  },
  { timestamps: true },
);

moveInChecklistSchema.index({ hostelId: 1, residentId: 1 }, { unique: true });

export const MoveInChecklistModel =
  models.MoveInChecklist || model("MoveInChecklist", moveInChecklistSchema);
