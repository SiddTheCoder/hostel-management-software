import { Schema, model, models } from "mongoose";

const depositRecordSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    residentId: { ref: "Resident", required: true, type: Schema.Types.ObjectId },
    amount: { min: 0, required: true, type: Number },
    paidDate: { required: true, type: Date },
    status: {
      default: "HELD",
      enum: ["HELD", "REFUNDED", "FORFEITED"],
      type: String,
    },
    refundedDate: Date,
    refundedAmount: { min: 0, type: Number },
    remarks: { type: String, trim: true },
  },
  { timestamps: true },
);

depositRecordSchema.index({ hostelId: 1, residentId: 1, status: 1 });

export const DepositRecordModel =
  models.DepositRecord || model("DepositRecord", depositRecordSchema);
