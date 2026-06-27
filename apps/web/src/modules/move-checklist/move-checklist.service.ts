import { Types } from "mongoose";
import type { z } from "zod";

import type { ApiPrincipal } from "@/lib/api-auth";
import { connectToDatabase } from "@/lib/db";
import { assertHostelAccess } from "@/lib/tenant";
import { AuditLogModel } from "@/models/AuditLog";
import { BedModel } from "@/models/Bed";
import { DepositRefundModel } from "@/models/DepositRefund";
import { MoveInChecklistModel } from "@/models/MoveInChecklist";
import { MoveOutChecklistModel } from "@/models/MoveOutChecklist";
import { PaymentModel } from "@/models/Payment";
import { ProvidedItemModel } from "@/models/ProvidedItem";
import { ResidentModel } from "@/models/Resident";
import { RoomModel } from "@/models/Room";
import {
  normalizeObjectId,
  serializeResidentSummary,
} from "@/modules/residents/resident-access";
import type {
  moveInChecklistSchema,
  moveOutChecklistSchema,
} from "@/modules/move-checklist/move-checklist.validation";

type MoveInInput = z.infer<typeof moveInChecklistSchema>;
type MoveOutInput = z.infer<typeof moveOutChecklistSchema>;

type ResidentRecord = {
  _id: Types.ObjectId;
  bedId: Types.ObjectId;
  depositAmount: number;
  email?: string;
  firstName: string;
  hostelId: Types.ObjectId;
  lastName: string;
  moveInDate: Date;
  phone: string;
  roomId: Types.ObjectId;
  status: "PENDING" | "ACTIVE" | "SUSPENDED" | "MOVED_OUT";
  userId?: Types.ObjectId;
};

type MoveInRecord = {
  _id: Types.ObjectId;
  bedCondition?: string;
  completedAt?: Date;
  depositAmount: number;
  documentsCollected: string[];
  hostelId: Types.ObjectId;
  itemsProvided: string[];
  residentId: Types.ObjectId;
  roomCondition?: string;
  roomPhotoAssetIds: string[];
  rulesAccepted: boolean;
};

type MoveOutRecord = {
  _id: Types.ObjectId;
  completedAt?: Date;
  damageNotes?: string;
  depositRefundAmount: number;
  depositRefundDecision: "PENDING" | "APPROVED" | "PARTIAL" | "FORFEITED";
  finalReceiptAssetId?: string;
  hostelId: Types.ObjectId;
  itemReturnNotes?: string;
  pendingFeeAmount: number;
  residentId: Types.ObjectId;
};

export class MoveChecklistServiceError extends Error {
  constructor(
    message: string,
    public errorCode = "MOVE_CHECKLIST_ERROR",
    public status = 400,
  ) {
    super(message);
  }
}

function normalizeObjectIds(values: string[]) {
  return values.map((value) => normalizeObjectId(value, "hostel id"));
}

function resolveAdminHostelId(principal: ApiPrincipal, requestedHostelId?: string) {
  if (requestedHostelId) {
    assertHostelAccess(principal, requestedHostelId);
    return normalizeObjectId(requestedHostelId, "hostel id");
  }

  if (principal.hostelIds.length === 1) {
    return normalizeObjectId(principal.hostelIds[0], "hostel id");
  }

  throw new MoveChecklistServiceError(
    "A hostelId is required for this hostel admin action.",
    "HOSTEL_SCOPE_REQUIRED",
    422,
  );
}

function scopedHostelFilter(principal: ApiPrincipal, requestedHostelId?: string) {
  if (requestedHostelId) {
    return { hostelId: resolveAdminHostelId(principal, requestedHostelId) };
  }

  return { hostelId: { $in: normalizeObjectIds(principal.hostelIds) } };
}

async function findAdminResident(
  residentId: string,
  principal: ApiPrincipal,
  requestedHostelId?: string,
) {
  const resident = await ResidentModel.findOne({
    _id: normalizeObjectId(residentId, "resident id"),
    isDeleted: false,
    ...scopedHostelFilter(principal, requestedHostelId),
  }).lean<ResidentRecord | null>();

  if (!resident) {
    throw new MoveChecklistServiceError(
      "Resident was not found.",
      "RESIDENT_NOT_FOUND",
      404,
    );
  }

  return resident;
}

function serializeMoveIn(checklist: MoveInRecord | null) {
  if (!checklist) {
    return null;
  }

  return {
    bedCondition: checklist.bedCondition ?? "",
    completedAt: checklist.completedAt?.toISOString(),
    depositAmount: checklist.depositAmount,
    documentsCollected: checklist.documentsCollected,
    hostelId: checklist.hostelId.toString(),
    id: checklist._id.toString(),
    itemsProvided: checklist.itemsProvided,
    residentId: checklist.residentId.toString(),
    roomCondition: checklist.roomCondition ?? "",
    roomPhotoAssetIds: checklist.roomPhotoAssetIds,
    rulesAccepted: checklist.rulesAccepted,
  };
}

function serializeMoveOut(checklist: MoveOutRecord | null) {
  if (!checklist) {
    return null;
  }

  return {
    completedAt: checklist.completedAt?.toISOString(),
    damageNotes: checklist.damageNotes ?? "",
    depositRefundAmount: checklist.depositRefundAmount,
    depositRefundDecision: checklist.depositRefundDecision,
    finalReceiptAssetId: checklist.finalReceiptAssetId ?? "",
    hostelId: checklist.hostelId.toString(),
    id: checklist._id.toString(),
    itemReturnNotes: checklist.itemReturnNotes ?? "",
    pendingFeeAmount: checklist.pendingFeeAmount,
    residentId: checklist.residentId.toString(),
  };
}

async function auditMoveAction(
  principal: ApiPrincipal,
  hostelId: Types.ObjectId,
  residentId: Types.ObjectId,
  action: string,
  metadata: Record<string, unknown> = {},
) {
  await AuditLogModel.create({
    action,
    actorId: principal.userId,
    entityId: residentId.toString(),
    entityType: "ResidentMoveChecklist",
    hostelId,
    metadata,
  });
}

async function pendingFeeAmount(resident: ResidentRecord) {
  const payments = await PaymentModel.find({
    hostelId: resident.hostelId,
    residentId: resident._id,
    status: { $in: ["UNPAID", "PARTIAL", "OVERDUE", "PENDING_PROOF"] },
  }).lean<Array<{ dueAmount: number; paidAmount: number }>>();

  return payments.reduce(
    (sum, payment) => sum + Math.max(payment.dueAmount - payment.paidAmount, 0),
    0,
  );
}

async function refreshRoomVacancy(roomId: Types.ObjectId) {
  const room = await RoomModel.findById(roomId).lean<{
    _id: Types.ObjectId;
    capacity: number;
  } | null>();

  if (!room) {
    return;
  }

  const occupiedBeds = await BedModel.countDocuments({
    isDeleted: false,
    roomId: room._id,
    status: { $in: ["OCCUPIED", "RESERVED"] },
  });
  const vacancyStatus =
    occupiedBeds === 0 ? "VACANT" : occupiedBeds >= room.capacity ? "FULL" : "PARTIAL";

  await RoomModel.updateOne({ _id: room._id }, { $set: { vacancyStatus } });
}

export async function createMoveInChecklist(
  residentId: string,
  input: MoveInInput,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const resident = await findAdminResident(residentId, principal, input.hostelId);
  const checklist = await MoveInChecklistModel.findOneAndUpdate(
    { hostelId: resident.hostelId, residentId: resident._id },
    {
      $set: {
        ...input,
        completedAt: new Date(),
        completedBy: principal.userId,
        createdBy: principal.userId,
        hostelId: resident.hostelId,
        residentId: resident._id,
        updatedBy: principal.userId,
      },
    },
    { new: true, upsert: true },
  ).lean<MoveInRecord>();

  if (!checklist) {
    throw new MoveChecklistServiceError(
      "Move-in checklist could not be saved.",
      "MOVE_IN_SAVE_FAILED",
      500,
    );
  }

  await ProvidedItemModel.deleteMany({ checklistId: checklist._id });
  if (input.itemsProvided.length > 0) {
    await ProvidedItemModel.insertMany(
      input.itemsProvided.map((name) => ({
        checklistId: checklist._id,
        hostelId: resident.hostelId,
        name,
        residentId: resident._id,
      })),
    );
  }

  await auditMoveAction(principal, resident.hostelId, resident._id, "MOVE_IN_COMPLETED");

  return {
    checklist: serializeMoveIn(checklist),
    resident: serializeResidentSummary(resident),
  };
}

export async function getMoveInChecklist(
  residentId: string,
  principal: ApiPrincipal,
  hostelId?: string,
) {
  await connectToDatabase();

  const resident = await findAdminResident(residentId, principal, hostelId);
  const checklist = await MoveInChecklistModel.findOne({
    hostelId: resident.hostelId,
    residentId: resident._id,
  }).lean<MoveInRecord | null>();

  return {
    checklist: serializeMoveIn(checklist),
    resident: serializeResidentSummary(resident),
  };
}

export async function createMoveOutChecklist(
  residentId: string,
  input: MoveOutInput,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const resident = await findAdminResident(residentId, principal, input.hostelId);
  const pendingFees = await pendingFeeAmount(resident);
  const checklist = await MoveOutChecklistModel.findOneAndUpdate(
    { hostelId: resident.hostelId, residentId: resident._id },
    {
      $set: {
        ...input,
        completedAt: new Date(),
        completedBy: principal.userId,
        createdBy: principal.userId,
        hostelId: resident.hostelId,
        pendingFeeAmount: pendingFees,
        residentId: resident._id,
        updatedBy: principal.userId,
      },
    },
    { new: true, upsert: true },
  ).lean<MoveOutRecord>();

  if (!checklist) {
    throw new MoveChecklistServiceError(
      "Move-out checklist could not be saved.",
      "MOVE_OUT_SAVE_FAILED",
      500,
    );
  }

  await Promise.all([
    DepositRefundModel.create({
      amount: input.depositRefundAmount,
      decidedBy: principal.userId,
      decision: input.depositRefundDecision,
      hostelId: resident.hostelId,
      moveOutChecklistId: checklist._id,
      residentId: resident._id,
    }),
    ResidentModel.updateOne(
      { _id: resident._id },
      { $set: { status: "MOVED_OUT", updatedBy: principal.userId } },
    ),
    BedModel.updateOne(
      { _id: resident.bedId },
      {
        $set: { status: "AVAILABLE", updatedBy: principal.userId },
        $unset: { assignedResidentId: "" },
      },
    ),
  ]);
  await refreshRoomVacancy(resident.roomId);
  await auditMoveAction(
    principal,
    resident.hostelId,
    resident._id,
    "MOVE_OUT_COMPLETED",
    {
      pendingFeeAmount: pendingFees,
    },
  );

  return {
    checklist: serializeMoveOut(checklist),
    resident: serializeResidentSummary({ ...resident, status: "MOVED_OUT" }),
  };
}

export async function getMoveOutChecklist(
  residentId: string,
  principal: ApiPrincipal,
  hostelId?: string,
) {
  await connectToDatabase();

  const resident = await findAdminResident(residentId, principal, hostelId);
  const checklist = await MoveOutChecklistModel.findOne({
    hostelId: resident.hostelId,
    residentId: resident._id,
  }).lean<MoveOutRecord | null>();

  return {
    checklist: serializeMoveOut(checklist),
    resident: serializeResidentSummary(resident),
  };
}
