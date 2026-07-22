import { Schema, model, models } from "mongoose";

const hostelApplicationSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    applicantId: { ref: "User", required: true, type: Schema.Types.ObjectId },
    submittedBy: { ref: "User", required: true, type: Schema.Types.ObjectId },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "NEEDS_MORE_INFO"],
      default: "PENDING",
    },
    reviewedBy: { ref: "User", type: Schema.Types.ObjectId },
    reviewedAt: Date,
    rejectionReason: { type: String, trim: true },
    // Superadmin "documents needed" requests. When populated with an unresolved
    // entry the application status is NEEDS_MORE_INFO and the owner is asked to
    // provide the listed documents.
    requestedDocuments: {
      default: [],
      type: [
        {
          _id: false,
          documentType: { required: true, trim: true, type: String },
          note: { trim: true, type: String },
        },
      ],
    },
    infoRequestNote: { type: String, trim: true },
    infoRequestedAt: Date,
    infoRequestedBy: { ref: "User", type: Schema.Types.ObjectId },
    notes: { type: String, trim: true },
    snapshot: { default: {}, type: Schema.Types.Mixed },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    deletedBy: { ref: "User", type: Schema.Types.ObjectId },
  },
  { timestamps: true },
);

hostelApplicationSchema.index({ hostelId: 1, status: 1 });
hostelApplicationSchema.index({ applicantId: 1, status: 1 });
hostelApplicationSchema.index({ status: 1, createdAt: -1 });

export const HostelApplicationModel =
  models.HostelApplication || model("HostelApplication", hostelApplicationSchema);
