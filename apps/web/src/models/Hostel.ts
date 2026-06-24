import { Schema, model, models } from "mongoose";

const hostelSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    description: String,
    ownerId: { ref: "User", required: true, type: Schema.Types.ObjectId },
    location: {
      area: { type: String, required: true, trim: true },
      city: { type: String, default: "Kathmandu", trim: true },
      province: { type: String, trim: true },
      address: { type: String, trim: true },
      lat: Number,
      lng: Number,
    },
    contact: {
      phone: String,
      email: String,
    },
    hostelType: {
      type: String,
      enum: ["BOYS", "GIRLS", "CO_LIVING"],
      default: "CO_LIVING",
    },
    pricing: {
      currency: { type: String, default: "NPR", trim: true },
      monthlyRentMin: { min: 0, type: Number },
      monthlyRentMax: { min: 0, type: Number },
      admissionFee: { min: 0, type: Number },
    },
    facilities: [{ type: String, trim: true }],
    roomTypes: [{ type: String, trim: true }],
    food: {
      mealsPerDay: { min: 0, type: Number },
      hasVeg: { default: true, type: Boolean },
      hasNonVeg: { default: true, type: Boolean },
      notes: { type: String, trim: true },
    },
    rules: [{ type: String, trim: true }],
    photos: [
      {
        alt: { type: String, trim: true },
        fileAssetId: { ref: "FileAsset", type: Schema.Types.ObjectId },
        url: { type: String, trim: true },
      },
    ],
    capacitySummary: {
      totalRooms: { min: 0, type: Number },
      totalBeds: { min: 0, type: Number },
      vacantBeds: { min: 0, type: Number },
    },
    status: {
      type: String,
      enum: [
        "DRAFT",
        "PENDING_APPROVAL",
        "APPROVED",
        "PUBLISHED",
        "REJECTED",
        "SUSPENDED",
      ],
      default: "DRAFT",
    },
    verificationStatus: {
      type: String,
      enum: ["UNVERIFIED", "PENDING", "VERIFIED", "REJECTED"],
      default: "UNVERIFIED",
    },
    createdBy: { ref: "User", type: Schema.Types.ObjectId },
    updatedBy: { ref: "User", type: Schema.Types.ObjectId },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    deletedBy: { ref: "User", type: Schema.Types.ObjectId },
  },
  { timestamps: true },
);

hostelSchema.index({ slug: 1 }, { unique: true });
hostelSchema.index({ status: 1, "location.area": 1, hostelType: 1 });
hostelSchema.index({ verificationStatus: 1, status: 1 });
hostelSchema.index({ ownerId: 1, status: 1 });
hostelSchema.index({ "pricing.monthlyRentMin": 1, "pricing.monthlyRentMax": 1 });

export const HostelModel = models.Hostel || model("Hostel", hostelSchema);
