import { Schema, model, models } from "mongoose";

const emergencyContactSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    residentId: { ref: "Resident", required: true, type: Schema.Types.ObjectId },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    relation: { type: String, required: true, trim: true },
    isPrimary: { type: Boolean, default: false },
  },
  { timestamps: true },
);

emergencyContactSchema.index({ residentId: 1 });
emergencyContactSchema.index({ hostelId: 1, residentId: 1 });

export const EmergencyContactModel =
  models.EmergencyContact || model("EmergencyContact", emergencyContactSchema);
