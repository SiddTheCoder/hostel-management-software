import { Schema, model, models } from "mongoose";

const incidentLogSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    residentId: { ref: "Resident", type: Schema.Types.ObjectId },
    sosAlertId: { ref: "SOSAlert", type: Schema.Types.ObjectId },
    action: { required: true, trim: true, type: String },
    note: { trim: true, type: String },
    actorId: { ref: "User", required: true, type: Schema.Types.ObjectId },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

incidentLogSchema.index({ hostelId: 1, createdAt: -1 });
incidentLogSchema.index({ sosAlertId: 1, createdAt: 1 });

export const IncidentLogModel =
  models.IncidentLog || model("IncidentLog", incidentLogSchema);
