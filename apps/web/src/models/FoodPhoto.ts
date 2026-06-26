import { Schema, model, models } from "mongoose";

const foodPhotoSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    residentId: { ref: "Resident", type: Schema.Types.ObjectId },
    mealType: {
      enum: ["BREAKFAST", "LUNCH", "SNACKS", "DINNER"],
      required: true,
      type: String,
    },
    date: { required: true, type: Date },
    photoAssetId: { required: true, trim: true, type: String },
    caption: { type: String, trim: true },
    uploadedBy: { ref: "User", required: true, type: Schema.Types.ObjectId },
    uploadedAt: { default: Date.now, type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

foodPhotoSchema.index({ hostelId: 1, date: 1, mealType: 1 });
foodPhotoSchema.index({ hostelId: 1, residentId: 1, date: 1 });

export const FoodPhotoModel = models.FoodPhoto || model("FoodPhoto", foodPhotoSchema);
