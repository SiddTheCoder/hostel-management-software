import { Schema, model, models } from "mongoose";

const bedSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    floorId: { ref: "Floor", required: true, type: Schema.Types.ObjectId },
    roomId: { ref: "Room", required: true, type: Schema.Types.ObjectId },
    bedNumber: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["AVAILABLE", "OCCUPIED", "RESERVED", "MAINTENANCE"],
      default: "AVAILABLE",
    },
    assignedResidentId: { ref: "User", type: Schema.Types.ObjectId },
    repairStatus: {
      type: String,
      enum: ["OK", "NEEDS_REPAIR", "UNDER_REPAIR"],
      default: "OK",
    },
    notes: { type: String, trim: true },
    createdBy: { ref: "User", type: Schema.Types.ObjectId },
    updatedBy: { ref: "User", type: Schema.Types.ObjectId },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    deletedBy: { ref: "User", type: Schema.Types.ObjectId },
  },
  { timestamps: true },
);

bedSchema.index({ hostelId: 1, roomId: 1, bedNumber: 1 }, { unique: true });
bedSchema.index({ hostelId: 1, status: 1 });
bedSchema.index({ roomId: 1, status: 1 });
bedSchema.index({ assignedResidentId: 1, status: 1 });

export const BedModel = models.Bed || model("Bed", bedSchema);
