import { Schema, model, models } from "mongoose";

const complaintUpdateSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    complaintId: {
      ref: "Complaint",
      required: true,
      type: Schema.Types.ObjectId,
    },
    actorId: { ref: "User", required: true, type: Schema.Types.ObjectId },
    actorRole: { required: true, trim: true, type: String },
    type: {
      enum: ["CREATED", "STATUS_CHANGE", "ADMIN_REPLY", "RESIDENT_CONFIRMATION"],
      required: true,
      type: String,
    },
    message: { trim: true, type: String },
    previousStatus: {
      enum: ["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"],
      type: String,
    },
    nextStatus: {
      enum: ["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"],
      type: String,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

complaintUpdateSchema.index({ complaintId: 1, createdAt: 1 });
complaintUpdateSchema.index({ hostelId: 1, createdAt: -1 });

export const ComplaintUpdateModel =
  models.ComplaintUpdate || model("ComplaintUpdate", complaintUpdateSchema);
