import { Types } from "mongoose";
import type { z } from "zod";

import type { ApiPrincipal } from "@/lib/api-auth";
import { connectToDatabase } from "@/lib/db";
import { assertHostelAccess } from "@/lib/tenant";
import { AuditLogModel } from "@hostel/db/models/AuditLog";
import { NoticeModel } from "@hostel/db/models/Notice";
import { NoticeReadStatusModel } from "@hostel/db/models/NoticeReadStatus";
import {
  findCurrentResident,
  normalizeObjectId,
  serializeResidentSummary,
} from "@/modules/residents/resident-access";
import type {
  noticeCreateSchema,
  noticeListQuerySchema,
  noticeUpdateSchema,
} from "@/modules/notices/notice.validation";

type NoticeCreateInput = z.infer<typeof noticeCreateSchema>;
type NoticeUpdateInput = z.infer<typeof noticeUpdateSchema>;
type NoticeListQuery = z.infer<typeof noticeListQuerySchema>;

type NoticeRecord = {
  _id: Types.ObjectId;
  category: string;
  content: string;
  createdAt?: Date;
  expiresAt?: Date;
  hostelId: Types.ObjectId;
  isUrgent: boolean;
  publishedAt?: Date;
  title: string;
  updatedAt?: Date;
};

type NoticeReadStatusRecord = {
  _id: Types.ObjectId;
  noticeId: Types.ObjectId;
  readAt: Date;
  userId: Types.ObjectId;
};

export class NoticeServiceError extends Error {
  constructor(
    message: string,
    public errorCode = "NOTICE_ERROR",
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

  throw new NoticeServiceError(
    "A hostelId is required for this hostel admin action.",
    "HOSTEL_SCOPE_REQUIRED",
    422,
  );
}

function scopedHostelFilter(principal: ApiPrincipal, requestedHostelId?: string) {
  if (requestedHostelId) {
    return { hostelId: resolveAdminHostelId(principal, requestedHostelId) };
  }

  return {
    hostelId: {
      $in: normalizeObjectIds(principal.hostelIds),
    },
  };
}

function definedUpdate(input: Record<string, unknown>, omittedKeys: string[] = []) {
  return Object.fromEntries(
    Object.entries(input).filter(
      ([key, value]) => value !== undefined && !omittedKeys.includes(key),
    ),
  );
}

function serializeNotice(
  notice: NoticeRecord,
  readStatus?: NoticeReadStatusRecord | null,
) {
  return {
    category: notice.category,
    content: notice.content,
    createdAt: notice.createdAt?.toISOString(),
    expiresAt: notice.expiresAt?.toISOString(),
    hostelId: notice.hostelId.toString(),
    id: notice._id.toString(),
    isRead: Boolean(readStatus),
    isUrgent: notice.isUrgent,
    publishedAt: notice.publishedAt?.toISOString(),
    readAt: readStatus?.readAt.toISOString(),
    title: notice.title,
    updatedAt: notice.updatedAt?.toISOString(),
  };
}

async function auditNoticeAction(
  principal: ApiPrincipal,
  hostelId: Types.ObjectId,
  noticeId: Types.ObjectId,
  action: string,
  metadata: Record<string, unknown> = {},
) {
  await AuditLogModel.create({
    action,
    actorId: principal.userId,
    entityId: noticeId.toString(),
    entityType: "Notice",
    hostelId,
    metadata,
  });
}

export async function createNotice(input: NoticeCreateInput, principal: ApiPrincipal) {
  await connectToDatabase();

  const hostelId = resolveAdminHostelId(principal, input.hostelId);
  const notice = await NoticeModel.create({
    ...input,
    createdBy: principal.userId,
    hostelId,
    publishedAt: input.publishedAt ?? new Date(),
    updatedBy: principal.userId,
  });

  await auditNoticeAction(principal, hostelId, notice._id, "NOTICE_CREATED");

  return {
    notice: serializeNotice(notice as NoticeRecord),
  };
}

export async function listNotices(query: NoticeListQuery, principal: ApiPrincipal) {
  await connectToDatabase();

  const filter: Record<string, unknown> = {
    ...scopedHostelFilter(principal, query.hostelId),
  };

  if (query.category) {
    filter.category = query.category;
  }

  const notices = await NoticeModel.find(filter)
    .sort({ isUrgent: -1, publishedAt: -1 })
    .limit(100)
    .lean<NoticeRecord[]>();

  return {
    notices: notices.map((notice) => serializeNotice(notice)),
  };
}

export async function updateNotice(
  noticeId: string,
  input: NoticeUpdateInput,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const existingNotice = await NoticeModel.findOne({
    _id: normalizeObjectId(noticeId, "notice id"),
    ...scopedHostelFilter(principal, input.hostelId),
  }).lean<NoticeRecord | null>();

  if (!existingNotice) {
    throw new NoticeServiceError("Notice was not found.", "NOTICE_NOT_FOUND", 404);
  }

  const notice = await NoticeModel.findOneAndUpdate(
    { _id: existingNotice._id },
    {
      $set: {
        ...definedUpdate(input, ["hostelId"]),
        updatedBy: principal.userId,
      },
    },
    { new: true },
  ).lean<NoticeRecord | null>();

  if (!notice) {
    throw new NoticeServiceError("Notice was not found.", "NOTICE_NOT_FOUND", 404);
  }

  await auditNoticeAction(
    principal,
    existingNotice.hostelId,
    existingNotice._id,
    "NOTICE_UPDATED",
  );

  return {
    notice: serializeNotice(notice),
  };
}

export async function listNoticesForResident(principal: ApiPrincipal) {
  await connectToDatabase();

  const resident = await findCurrentResident(principal);
  const notices = await NoticeModel.find({
    hostelId: resident.hostelId,
    publishedAt: { $lte: new Date() },
    $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }],
  })
    .sort({ isUrgent: -1, publishedAt: -1 })
    .limit(100)
    .lean<NoticeRecord[]>();
  const readStatuses = await NoticeReadStatusModel.find({
    noticeId: { $in: notices.map((notice) => notice._id) },
    userId: normalizeObjectId(principal.userId, "user id"),
  }).lean<NoticeReadStatusRecord[]>();
  const readStatusByNoticeId = new Map(
    readStatuses.map((status) => [status.noticeId.toString(), status]),
  );

  return {
    notices: notices.map((notice) =>
      serializeNotice(notice, readStatusByNoticeId.get(notice._id.toString())),
    ),
    resident: serializeResidentSummary(resident),
  };
}

export async function markNoticeAsRead(noticeId: string, principal: ApiPrincipal) {
  await connectToDatabase();

  const resident = await findCurrentResident(principal);
  const notice = await NoticeModel.findOne({
    _id: normalizeObjectId(noticeId, "notice id"),
    hostelId: resident.hostelId,
  }).lean<NoticeRecord | null>();

  if (!notice) {
    throw new NoticeServiceError("Notice was not found.", "NOTICE_NOT_FOUND", 404);
  }

  const readStatus = await NoticeReadStatusModel.findOneAndUpdate(
    {
      noticeId: notice._id,
      userId: normalizeObjectId(principal.userId, "user id"),
    },
    {
      $setOnInsert: {
        readAt: new Date(),
      },
    },
    { new: true, upsert: true },
  ).lean<NoticeReadStatusRecord>();

  return {
    notice: serializeNotice(notice, readStatus),
    resident: serializeResidentSummary(resident),
  };
}
