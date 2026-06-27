import { Schema, model, models } from "mongoose";

const manualStatusOverrideSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    residentId: { ref: "Resident", required: true, type: Schema.Types.ObjectId },
    previousStatus: {
      enum: [
        "INSIDE_HOSTEL",
        "OUTSIDE_HOSTEL",
        "NOT_VERIFIED",
        "MARKED_SAFE",
        "SOS_TRIGGERED",
      ],
      type: String,
    },
    nextStatus: {
      enum: [
        "INSIDE_HOSTEL",
        "OUTSIDE_HOSTEL",
        "NOT_VERIFIED",
        "MARKED_SAFE",
        "SOS_TRIGGERED",
      ],
      required: true,
      type: String,
    },
    reason: { required: true, trim: true, type: String },
    overriddenBy: { ref: "User", required: true, type: Schema.Types.ObjectId },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

manualStatusOverrideSchema.index({ hostelId: 1, createdAt: -1 });
manualStatusOverrideSchema.index({ residentId: 1, createdAt: -1 });

export const ManualStatusOverrideModel =
  models.ManualStatusOverride ||
  model("ManualStatusOverride", manualStatusOverrideSchema);
