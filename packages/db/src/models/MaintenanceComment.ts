import { Schema, model, models } from "mongoose";

const maintenanceCommentSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    requestId: {
      ref: "MaintenanceRequest",
      required: true,
      type: Schema.Types.ObjectId,
    },
    authorId: { ref: "User", required: true, type: Schema.Types.ObjectId },
    message: { required: true, trim: true, type: String },
    visibility: {
      default: "INTERNAL",
      enum: ["INTERNAL", "PROVIDER_NOTE"],
      type: String,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

maintenanceCommentSchema.index({ hostelId: 1, requestId: 1, createdAt: -1 });

export const MaintenanceCommentModel =
  models.MaintenanceComment || model("MaintenanceComment", maintenanceCommentSchema);
