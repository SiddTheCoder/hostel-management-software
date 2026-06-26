import { Schema, model, models } from "mongoose";

const receiptSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    residentId: { ref: "Resident", required: true, type: Schema.Types.ObjectId },
    paymentId: { ref: "Payment", required: true, type: Schema.Types.ObjectId },
    receiptNumber: { required: true, trim: true, type: String },
    issuedAt: { default: Date.now, type: Date },
    issuedBy: { ref: "User", required: true, type: Schema.Types.ObjectId },
    amount: { min: 0, required: true, type: Number },
    month: { required: true, trim: true, type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

receiptSchema.index({ hostelId: 1, residentId: 1, paymentId: 1 });
receiptSchema.index({ receiptNumber: 1 }, { unique: true });

export const ReceiptModel = models.Receipt || model("Receipt", receiptSchema);
