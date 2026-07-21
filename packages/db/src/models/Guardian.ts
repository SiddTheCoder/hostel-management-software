import { Schema, model, models } from "mongoose";

const guardianSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    residentId: { ref: "Resident", required: true, type: Schema.Types.ObjectId },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    relation: { type: String, required: true, trim: true },
    isPrimary: { type: Boolean, default: false },
  },
  { timestamps: true },
);

guardianSchema.index({ residentId: 1, phone: 1 });
guardianSchema.index({ hostelId: 1, residentId: 1 });

export const GuardianModel = models.Guardian || model("Guardian", guardianSchema);
