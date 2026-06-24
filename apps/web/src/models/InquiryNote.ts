import { Schema, model, models } from "mongoose";

const inquiryNoteSchema = new Schema(
  {
    inquiryId: { ref: "Inquiry", required: true, type: Schema.Types.ObjectId },
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    authorId: { ref: "User", required: true, type: Schema.Types.ObjectId },
    note: { type: String, required: true, trim: true },
    nextFollowUpAt: Date,
    statusSnapshot: {
      type: String,
      enum: ["NEW", "CONTACTED", "VISIT_SCHEDULED", "CONVERTED", "CLOSED"],
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    deletedBy: { ref: "User", type: Schema.Types.ObjectId },
  },
  { timestamps: true },
);

inquiryNoteSchema.index({ inquiryId: 1, createdAt: -1 });
inquiryNoteSchema.index({ hostelId: 1, createdAt: -1 });

export const InquiryNoteModel =
  models.InquiryNote || model("InquiryNote", inquiryNoteSchema);
