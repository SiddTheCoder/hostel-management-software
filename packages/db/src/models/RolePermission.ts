import { Schema, model, models } from "mongoose";

import { ROLE_VALUES } from "@hostel/shared/types/roles";

const rolePermissionSchema = new Schema(
  {
    role: { type: String, enum: ROLE_VALUES, required: true },
    module: { type: String, required: true },
    actions: [{ type: String, required: true }],
    hostelId: { ref: "Hostel", type: Schema.Types.ObjectId },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    createdBy: { ref: "User", type: Schema.Types.ObjectId },
    updatedBy: { ref: "User", type: Schema.Types.ObjectId },
  },
  { timestamps: true },
);

rolePermissionSchema.index({ role: 1, module: 1, hostelId: 1 }, { unique: true });
rolePermissionSchema.index({ hostelId: 1, status: 1 });

export const RolePermissionModel =
  models.RolePermission || model("RolePermission", rolePermissionSchema);
