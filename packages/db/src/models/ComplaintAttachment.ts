import { Schema, model, models } from "mongoose";

const complaintAttachmentSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    complaintId: {
      ref: "Complaint",
      required: true,
      type: Schema.Types.ObjectId,
    },
    fileAssetId: { required: true, trim: true, type: String },
    uploadedBy: { ref: "User", required: true, type: Schema.Types.ObjectId },
    uploadedAt: { default: Date.now, type: Date },
  },
  { timestamps: false },
);

complaintAttachmentSchema.index({ complaintId: 1, uploadedAt: -1 });
complaintAttachmentSchema.index({ hostelId: 1, complaintId: 1 });

export const ComplaintAttachmentModel =
  models.ComplaintAttachment || model("ComplaintAttachment", complaintAttachmentSchema);
