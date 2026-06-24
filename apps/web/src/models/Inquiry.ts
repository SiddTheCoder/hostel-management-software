import { Schema, model, models } from "mongoose";

const inquirySchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    message: { type: String, trim: true },
    preferredVisitDate: Date,
    source: {
      type: String,
      enum: ["PUBLIC_WEBSITE", "ADMIN_CREATED"],
      default: "PUBLIC_WEBSITE",
    },
    status: {
      type: String,
      enum: ["NEW", "CONTACTED", "VISIT_SCHEDULED", "CONVERTED", "CLOSED"],
      default: "NEW",
    },
    createdBy: { ref: "User", type: Schema.Types.ObjectId },
    updatedBy: { ref: "User", type: Schema.Types.ObjectId },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    deletedBy: { ref: "User", type: Schema.Types.ObjectId },
  },
  { timestamps: true },
);

inquirySchema.index({ hostelId: 1, status: 1, createdAt: -1 });
inquirySchema.index({ phone: 1, hostelId: 1 });
inquirySchema.index({ email: 1, hostelId: 1 });

export const InquiryModel = models.Inquiry || model("Inquiry", inquirySchema);
