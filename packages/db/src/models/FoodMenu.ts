import { Schema, model, models } from "mongoose";

const foodMenuSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    date: { required: true, type: Date },
    weekStartDate: { required: true, type: Date },
    dayOfWeek: {
      enum: [
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
      ],
      required: true,
      type: String,
    },
    mealType: {
      enum: ["BREAKFAST", "LUNCH", "SNACKS", "DINNER"],
      required: true,
      type: String,
    },
    items: [{ required: true, trim: true, type: String }],
    timing: { required: true, trim: true, type: String },
    specialNotes: { type: String, trim: true },
    createdBy: { ref: "User", type: Schema.Types.ObjectId },
    updatedBy: { ref: "User", type: Schema.Types.ObjectId },
  },
  { timestamps: true },
);

foodMenuSchema.index({ hostelId: 1, date: 1, mealType: 1 }, { unique: true });
foodMenuSchema.index({ hostelId: 1, weekStartDate: 1, mealType: 1 });

export const FoodMenuModel = models.FoodMenu || model("FoodMenu", foodMenuSchema);
