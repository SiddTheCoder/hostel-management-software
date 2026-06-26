import { Schema, model, models } from "mongoose";

const foodFeedbackSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    residentId: { ref: "Resident", required: true, type: Schema.Types.ObjectId },
    menuId: { ref: "FoodMenu", type: Schema.Types.ObjectId },
    date: { required: true, type: Date },
    mealType: {
      enum: ["BREAKFAST", "LUNCH", "SNACKS", "DINNER"],
      required: true,
      type: String,
    },
    rating: { max: 5, min: 1, required: true, type: Number },
    comment: { type: String, trim: true },
    isAnonymous: { default: false, type: Boolean },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

foodFeedbackSchema.index({ hostelId: 1, residentId: 1, date: 1 });
foodFeedbackSchema.index({ hostelId: 1, menuId: 1 });

export const FoodFeedbackModel =
  models.FoodFeedback || model("FoodFeedback", foodFeedbackSchema);
