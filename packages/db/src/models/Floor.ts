import { Schema, model, models } from "mongoose";

const floorSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    name: { type: String, required: true, trim: true },
    level: { required: true, type: Number },
    sortOrder: { default: 0, type: Number },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    createdBy: { ref: "User", type: Schema.Types.ObjectId },
    updatedBy: { ref: "User", type: Schema.Types.ObjectId },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    deletedBy: { ref: "User", type: Schema.Types.ObjectId },
  },
  { timestamps: true },
);

floorSchema.index({ hostelId: 1, level: 1 }, { unique: true });
floorSchema.index({ hostelId: 1, sortOrder: 1 });

export const FloorModel = models.Floor || model("Floor", floorSchema);
