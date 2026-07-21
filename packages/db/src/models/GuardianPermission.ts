import { Schema, model, models } from "mongoose";

const guardianPermissionSchema = new Schema(
  {
    hostelId: { ref: "Hostel", required: true, type: Schema.Types.ObjectId },
    residentId: { ref: "Resident", required: true, type: Schema.Types.ObjectId },
    guardianAccessId: {
      ref: "GuardianAccess",
      required: true,
      type: Schema.Types.ObjectId,
    },
    canViewPayments: { default: true, type: Boolean },
    canViewNotices: { default: true, type: Boolean },
    canViewFood: { default: true, type: Boolean },
    canViewSafety: { default: true, type: Boolean },
    canViewComplaintStatus: { default: false, type: Boolean },
  },
  { timestamps: true },
);

guardianPermissionSchema.index({ guardianAccessId: 1 }, { unique: true });
guardianPermissionSchema.index({ hostelId: 1, residentId: 1 });

export const GuardianPermissionModel =
  models.GuardianPermission || model("GuardianPermission", guardianPermissionSchema);
