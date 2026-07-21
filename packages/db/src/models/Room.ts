import { Schema, model, models } from "mongoose";

const roomSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    floorId: { ref: "Floor", required: true, type: Schema.Types.ObjectId },
    roomNumber: { type: String, required: true, trim: true },
    roomType: { type: String, required: true, trim: true },
    capacity: { min: 1, required: true, type: Number },
    facilities: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    vacancyStatus: {
      type: String,
      enum: ["VACANT", "PARTIAL", "FULL"],
      default: "VACANT",
    },
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

roomSchema.index({ hostelId: 1, floorId: 1, roomNumber: 1 }, { unique: true });
roomSchema.index({ hostelId: 1, vacancyStatus: 1 });
roomSchema.index({ hostelId: 1, repairStatus: 1 });

export const RoomModel = models.Room || model("Room", roomSchema);
