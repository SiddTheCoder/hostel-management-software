import { Schema, model, models } from "mongoose";

import { ROLE_VALUES } from "@/lib/roles";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, sparse: true, trim: true },
    phone: { type: String, sparse: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ROLE_VALUES, required: true },
    hostelIds: [{ ref: "Hostel", type: Schema.Types.ObjectId }],
    status: {
      type: String,
      enum: ["ACTIVE", "INVITED", "SUSPENDED", "ARCHIVED"],
      default: "ACTIVE",
    },
    lastLoginAt: Date,
    createdBy: { ref: "User", type: Schema.Types.ObjectId },
    updatedBy: { ref: "User", type: Schema.Types.ObjectId },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    deletedBy: { ref: "User", type: Schema.Types.ObjectId },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 }, { sparse: true, unique: true });
userSchema.index({ phone: 1 }, { sparse: true, unique: true });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ hostelIds: 1, status: 1 });

export const UserModel = models.User || model("User", userSchema);
