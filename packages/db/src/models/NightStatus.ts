import { Schema, model, models } from "mongoose";

const nightStatusSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    residentId: { ref: "Resident", required: true, type: Schema.Types.ObjectId },
    status: {
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
    checkedAt: { default: Date.now, type: Date },
    note: { trim: true, type: String },
    source: {
      default: "RESIDENT",
      enum: ["RESIDENT", "WARDEN_OVERRIDE", "SOS"],
      type: String,
    },
    updatedBy: { ref: "User", required: true, type: Schema.Types.ObjectId },
  },
  { timestamps: true },
);

nightStatusSchema.index({ residentId: 1 }, { unique: true });
nightStatusSchema.index({ hostelId: 1, status: 1, checkedAt: -1 });

export const NightStatusModel =
  models.NightStatus || model("NightStatus", nightStatusSchema);
