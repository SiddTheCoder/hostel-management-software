import { Schema, model, models } from "mongoose";

const maintenanceHistorySchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    requestId: {
      ref: "MaintenanceRequest",
      required: true,
      type: Schema.Types.ObjectId,
    },
    actorId: { ref: "User", required: true, type: Schema.Types.ObjectId },
    action: { required: true, trim: true, type: String },
    previousStatus: {
      enum: ["PENDING", "CONTACTED", "SCHEDULED", "COMPLETED", "CANCELLED"],
      type: String,
    },
    nextStatus: {
      enum: ["PENDING", "CONTACTED", "SCHEDULED", "COMPLETED", "CANCELLED"],
      type: String,
    },
    note: { trim: true, type: String },
    costNote: { trim: true, type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

maintenanceHistorySchema.index({ hostelId: 1, requestId: 1, createdAt: -1 });

export const MaintenanceHistoryModel =
  models.MaintenanceHistory || model("MaintenanceHistory", maintenanceHistorySchema);
