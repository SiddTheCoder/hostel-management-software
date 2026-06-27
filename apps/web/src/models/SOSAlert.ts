import { Schema, model, models } from "mongoose";

const sosAlertSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    residentId: { ref: "Resident", required: true, type: Schema.Types.ObjectId },
    triggeredBy: { ref: "User", required: true, type: Schema.Types.ObjectId },
    message: { trim: true, type: String },
    status: {
      default: "ACTIVE",
      enum: ["ACTIVE", "ACKNOWLEDGED", "RESOLVED", "FALSE_ALARM"],
      type: String,
    },
    acknowledgedAt: Date,
    acknowledgedBy: { ref: "User", type: Schema.Types.ObjectId },
    resolvedAt: Date,
    resolvedBy: { ref: "User", type: Schema.Types.ObjectId },
    guardianAlertEnabled: { default: false, type: Boolean },
  },
  { timestamps: true },
);

sosAlertSchema.index({ hostelId: 1, status: 1, createdAt: -1 });
sosAlertSchema.index({ residentId: 1, createdAt: -1 });

export const SOSAlertModel = models.SOSAlert || model("SOSAlert", sosAlertSchema);
