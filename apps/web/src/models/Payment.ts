import { Schema, model, models } from "mongoose";

const paymentSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    residentId: { ref: "Resident", required: true, type: Schema.Types.ObjectId },
    month: { required: true, trim: true, type: String },
    dueAmount: { min: 0, required: true, type: Number },
    paidAmount: { default: 0, min: 0, type: Number },
    dueDate: { required: true, type: Date },
    paidDate: Date,
    status: {
      default: "UNPAID",
      enum: ["UNPAID", "PAID", "PARTIAL", "OVERDUE", "PENDING_PROOF"],
      type: String,
    },
    paymentMethod: {
      enum: ["CASH", "ESEWA", "KHALTI", "FONEPAY", "BANK_TRANSFER", "OTHER"],
      type: String,
    },
    remarks: { type: String, trim: true },
    createdBy: { ref: "User", type: Schema.Types.ObjectId },
    updatedBy: { ref: "User", type: Schema.Types.ObjectId },
  },
  { timestamps: true },
);

paymentSchema.index({ hostelId: 1, residentId: 1, month: 1 }, { unique: true });
paymentSchema.index({ hostelId: 1, status: 1 });
paymentSchema.index({ hostelId: 1, dueDate: 1 });
paymentSchema.index({ residentId: 1, status: 1 });

export const PaymentModel = models.Payment || model("Payment", paymentSchema);
