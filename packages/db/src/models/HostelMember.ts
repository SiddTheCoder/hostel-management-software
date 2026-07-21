import { Schema, model, models } from "mongoose";

import { ROLE_VALUES } from "@/lib/roles";

const hostelMemberSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    userId: { ref: "User", required: true, type: Schema.Types.ObjectId },
    role: { type: String, enum: ROLE_VALUES, required: true },
    permissions: [{ type: String }],
    status: {
      type: String,
      enum: ["ACTIVE", "INVITED", "SUSPENDED", "REMOVED"],
      default: "ACTIVE",
    },
    createdBy: { ref: "User", type: Schema.Types.ObjectId },
    updatedBy: { ref: "User", type: Schema.Types.ObjectId },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    deletedBy: { ref: "User", type: Schema.Types.ObjectId },
  },
  { timestamps: true },
);

hostelMemberSchema.index({ hostelId: 1, userId: 1 }, { unique: true });
hostelMemberSchema.index({ hostelId: 1, role: 1, status: 1 });
hostelMemberSchema.index({ userId: 1, status: 1 });

export const HostelMemberModel =
  models.HostelMember || model("HostelMember", hostelMemberSchema);
