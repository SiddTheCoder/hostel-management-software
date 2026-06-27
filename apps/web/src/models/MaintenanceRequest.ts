import { Schema, model, models } from "mongoose";

const maintenanceRequestSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    providerId: { ref: "ServiceProvider", type: Schema.Types.ObjectId },
    roomId: { ref: "Room", type: Schema.Types.ObjectId },
    bedId: { ref: "Bed", type: Schema.Types.ObjectId },
    category: {
      enum: [
        "PLUMBING",
        "ELECTRICAL",
        "INTERNET",
        "CLEANING",
        "CARPENTRY",
        "PAINTING",
        "WATER",
        "APPLIANCE",
        "ROOM_REPAIR",
        "HEALTH",
        "OTHER",
      ],
      required: true,
      type: String,
    },
    title: { required: true, trim: true, type: String },
    description: { trim: true, type: String },
    priority: {
      default: "MEDIUM",
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      type: String,
    },
    status: {
      default: "PENDING",
      enum: ["PENDING", "CONTACTED", "SCHEDULED", "COMPLETED", "CANCELLED"],
      type: String,
    },
    scheduledFor: Date,
    completedAt: Date,
    costNote: { trim: true, type: String },
    remarks: { trim: true, type: String },
    requestedBy: { ref: "User", required: true, type: Schema.Types.ObjectId },
    createdBy: { ref: "User", type: Schema.Types.ObjectId },
    updatedBy: { ref: "User", type: Schema.Types.ObjectId },
    isDeleted: { default: false, type: Boolean },
    deletedAt: Date,
    deletedBy: { ref: "User", type: Schema.Types.ObjectId },
  },
  { timestamps: true },
);

maintenanceRequestSchema.index({ hostelId: 1, status: 1, category: 1 });
maintenanceRequestSchema.index({ hostelId: 1, providerId: 1, createdAt: -1 });
maintenanceRequestSchema.index({ hostelId: 1, roomId: 1, bedId: 1 });

export const MaintenanceRequestModel =
  models.MaintenanceRequest || model("MaintenanceRequest", maintenanceRequestSchema);
