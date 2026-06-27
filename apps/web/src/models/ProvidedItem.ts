import { Schema, model, models } from "mongoose";

const providedItemSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    residentId: { ref: "Resident", required: true, type: Schema.Types.ObjectId },
    checklistId: { ref: "MoveInChecklist", required: true, type: Schema.Types.ObjectId },
    name: { required: true, trim: true, type: String },
    condition: { trim: true, type: String },
    returnedAt: Date,
    returnCondition: { trim: true, type: String },
  },
  { timestamps: true },
);

providedItemSchema.index({ hostelId: 1, residentId: 1 });
providedItemSchema.index({ checklistId: 1 });

export const ProvidedItemModel =
  models.ProvidedItem || model("ProvidedItem", providedItemSchema);
