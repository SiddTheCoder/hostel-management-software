import { Schema, model, models } from "mongoose";

const auditLogSchema = new Schema(
  {
    actorId: { ref: "User", required: true, type: Schema.Types.ObjectId },
    hostelId: { ref: "Hostel", type: Schema.Types.ObjectId },
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: String, required: true },
    metadata: { default: {}, type: Schema.Types.Mixed },
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

auditLogSchema.index({ actorId: 1, createdAt: -1 });
auditLogSchema.index({ hostelId: 1, action: 1, createdAt: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

export const AuditLogModel = models.AuditLog || model("AuditLog", auditLogSchema);
