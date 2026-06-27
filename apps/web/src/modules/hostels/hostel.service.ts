import { Types } from "mongoose";

import type { ApiPrincipal } from "@/lib/api-auth";
import { connectToDatabase } from "@/lib/db";
import { assertHostelAccess } from "@/lib/tenant";
import { AuditLogModel } from "@/models/AuditLog";
import { BedModel } from "@/models/Bed";
import { FloorModel } from "@/models/Floor";
import { HostelApplicationModel } from "@/models/HostelApplication";
import { HostelDocumentModel } from "@/models/HostelDocument";
import { HostelModel } from "@/models/Hostel";
import { HostelVerificationModel } from "@/models/HostelVerification";
import { InquiryModel } from "@/models/Inquiry";
import { RatingReviewModel } from "@/models/RatingReview";
import { InquiryNoteModel } from "@/models/InquiryNote";
import { RoomModel } from "@/models/Room";
import type {
  bedCreateSchema,
  bedUpdateSchema,
  floorCreateSchema,
  hostelAdminInquiryListQuerySchema,
  hostelAdminInquiryStatusSchema,
  hostelAdminProfileQuerySchema,
  hostelAdminProfileUpdateSchema,
  hostelPhotoCreateSchema,
  hostelPhotoDeleteQuerySchema,
  hostelScopedListQuerySchema,
  hostelRejectSchema,
  inquiryNoteCreateSchema,
  platformHostelCreateSchema,
  platformHostelListQuerySchema,
  publicHostelCompareQuerySchema,
  publicInquiryCreateSchema,
  publicHostelListQuerySchema,
  roomCreateSchema,
  roomUpdateSchema,
} from "@/modules/hostels/hostel.validation";
import type { z } from "zod";

type PlatformHostelCreateInput = z.infer<typeof platformHostelCreateSchema>;
type PlatformHostelListQuery = z.infer<typeof platformHostelListQuerySchema>;
type HostelRejectInput = z.infer<typeof hostelRejectSchema>;
type PublicHostelListQuery = z.infer<typeof publicHostelListQuerySchema>;
type PublicHostelCompareQuery = z.infer<typeof publicHostelCompareQuerySchema>;
type PublicInquiryCreateInput = z.infer<typeof publicInquiryCreateSchema>;
type HostelAdminInquiryListQuery = z.infer<typeof hostelAdminInquiryListQuerySchema>;
type HostelAdminInquiryStatusInput = z.infer<typeof hostelAdminInquiryStatusSchema>;
type InquiryNoteCreateInput = z.infer<typeof inquiryNoteCreateSchema>;
type HostelAdminProfileQuery = z.infer<typeof hostelAdminProfileQuerySchema>;
type HostelAdminProfileUpdateInput = z.infer<typeof hostelAdminProfileUpdateSchema>;
type HostelPhotoCreateInput = z.infer<typeof hostelPhotoCreateSchema>;
type HostelPhotoDeleteQuery = z.infer<typeof hostelPhotoDeleteQuerySchema>;
type HostelScopedListQuery = z.infer<typeof hostelScopedListQuerySchema>;
type FloorCreateInput = z.infer<typeof floorCreateSchema>;
type RoomCreateInput = z.infer<typeof roomCreateSchema>;
type RoomUpdateInput = z.infer<typeof roomUpdateSchema>;
type BedCreateInput = z.infer<typeof bedCreateSchema>;
type BedUpdateInput = z.infer<typeof bedUpdateSchema>;

type HostelRecord = {
  _id: Types.ObjectId;
  capacitySummary?: {
    totalBeds?: number;
    totalRooms?: number;
    vacantBeds?: number;
  };
  contact?: {
    email?: string;
    phone?: string;
  };
  createdAt?: Date;
  description?: string;
  facilities?: string[];
  food?: {
    hasNonVeg?: boolean;
    hasVeg?: boolean;
    mealsPerDay?: number;
    notes?: string;
  };
  hostelType?: "BOYS" | "GIRLS" | "CO_LIVING";
  location: {
    address?: string;
    area: string;
    city?: string;
    lat?: number;
    lng?: number;
    province?: string;
  };
  name: string;
  ownerId: Types.ObjectId;
  photos?: Array<{
    _id?: Types.ObjectId;
    alt?: string;
    fileAssetId?: Types.ObjectId;
    url?: string;
  }>;
  pricing?: {
    admissionFee?: number;
    currency?: string;
    monthlyRentMax?: number;
    monthlyRentMin?: number;
  };
  roomTypes?: string[];
  rules?: string[];
  slug: string;
  status:
    | "DRAFT"
    | "PENDING_APPROVAL"
    | "APPROVED"
    | "PUBLISHED"
    | "REJECTED"
    | "SUSPENDED";
  updatedAt?: Date;
  verificationStatus: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
};

type HostelApplicationRecord = {
  _id: Types.ObjectId;
  applicantId: Types.ObjectId;
  hostelId: Types.ObjectId;
  rejectionReason?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedBy: Types.ObjectId;
};

type HostelStatus = HostelRecord["status"];

type InquiryStatus = "NEW" | "CONTACTED" | "VISIT_SCHEDULED" | "CONVERTED" | "CLOSED";

type InquiryRecord = {
  _id: Types.ObjectId;
  createdAt?: Date;
  email?: string;
  hostelId: Types.ObjectId;
  message?: string;
  name: string;
  phone: string;
  preferredVisitDate?: Date;
  source: "PUBLIC_WEBSITE" | "ADMIN_CREATED";
  status: InquiryStatus;
  updatedAt?: Date;
};

type InquiryNoteRecord = {
  _id: Types.ObjectId;
  authorId: Types.ObjectId;
  createdAt?: Date;
  hostelId: Types.ObjectId;
  inquiryId: Types.ObjectId;
  nextFollowUpAt?: Date;
  note: string;
  statusSnapshot?: InquiryStatus;
};

type FloorRecord = {
  _id: Types.ObjectId;
  createdAt?: Date;
  description?: string;
  hostelId: Types.ObjectId;
  level: number;
  name: string;
  sortOrder?: number;
  status: "ACTIVE" | "INACTIVE";
  updatedAt?: Date;
};

type RoomRecord = {
  _id: Types.ObjectId;
  capacity: number;
  createdAt?: Date;
  facilities?: string[];
  floorId: Types.ObjectId;
  hostelId: Types.ObjectId;
  notes?: string;
  repairStatus: "OK" | "NEEDS_REPAIR" | "UNDER_REPAIR";
  roomNumber: string;
  roomType: string;
  status: "ACTIVE" | "INACTIVE";
  updatedAt?: Date;
  vacancyStatus: "VACANT" | "PARTIAL" | "FULL";
};

type BedRecord = {
  _id: Types.ObjectId;
  assignedResidentId?: Types.ObjectId;
  bedNumber: string;
  createdAt?: Date;
  floorId: Types.ObjectId;
  hostelId: Types.ObjectId;
  notes?: string;
  repairStatus: "OK" | "NEEDS_REPAIR" | "UNDER_REPAIR";
  roomId: Types.ObjectId;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "MAINTENANCE";
  updatedAt?: Date;
};

type RatingSummaryRecord = {
  _id: Types.ObjectId;
  averageRating: number;
  cleanlinessRating: number;
  foodRating: number;
  safetyRating: number;
  total: number;
};

export class HostelServiceError extends Error {
  constructor(
    message: string,
    public errorCode = "HOSTEL_ERROR",
    public status = 400,
  ) {
    super(message);
  }
}

function normalizeObjectId(value: string) {
  if (!Types.ObjectId.isValid(value)) {
    throw new HostelServiceError("Invalid hostel id.", "INVALID_HOSTEL_ID", 422);
  }

  return new Types.ObjectId(value);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function uniqueSlug(name: string, area: string) {
  const baseSlug = slugify(`${name}-${area}`) || `hostel-${Date.now()}`;
  let candidate = baseSlug;
  let suffix = 2;

  while (await HostelModel.exists({ slug: candidate })) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

function serializeHostel(hostel: HostelRecord) {
  return {
    capacitySummary: hostel.capacitySummary ?? {},
    contact: hostel.contact ?? {},
    createdAt: hostel.createdAt?.toISOString(),
    description: hostel.description ?? "",
    facilities: hostel.facilities ?? [],
    food: hostel.food ?? {},
    hostelType: hostel.hostelType ?? "CO_LIVING",
    id: hostel._id.toString(),
    location: hostel.location,
    name: hostel.name,
    ownerId: hostel.ownerId.toString(),
    photos: (hostel.photos ?? []).map((photo) => ({
      alt: photo.alt ?? "",
      fileAssetId: photo.fileAssetId?.toString(),
      id: photo._id?.toString(),
      url: photo.url ?? "",
    })),
    pricing: hostel.pricing ?? {},
    roomTypes: hostel.roomTypes ?? [],
    rules: hostel.rules ?? [],
    slug: hostel.slug,
    status: hostel.status,
    updatedAt: hostel.updatedAt?.toISOString(),
    verificationStatus: hostel.verificationStatus,
  };
}

function serializePublicHostel(hostel: HostelRecord) {
  return {
    capacitySummary: hostel.capacitySummary ?? {},
    description: hostel.description ?? "",
    facilities: hostel.facilities ?? [],
    food: hostel.food ?? {},
    hostelType: hostel.hostelType ?? "CO_LIVING",
    id: hostel._id.toString(),
    location: hostel.location,
    name: hostel.name,
    photos: (hostel.photos ?? []).map((photo) => ({
      alt: photo.alt ?? "",
      id: photo._id?.toString(),
      url: photo.url ?? "",
    })),
    pricing: hostel.pricing ?? {},
    roomTypes: hostel.roomTypes ?? [],
    rules: hostel.rules ?? [],
    slug: hostel.slug,
    verificationStatus: hostel.verificationStatus,
  };
}

function serializeInquiry(inquiry: InquiryRecord) {
  return {
    createdAt: inquiry.createdAt?.toISOString(),
    email: inquiry.email ?? "",
    hostelId: inquiry.hostelId.toString(),
    id: inquiry._id.toString(),
    message: inquiry.message ?? "",
    name: inquiry.name,
    phone: inquiry.phone,
    preferredVisitDate: inquiry.preferredVisitDate?.toISOString(),
    source: inquiry.source,
    status: inquiry.status,
    updatedAt: inquiry.updatedAt?.toISOString(),
  };
}

function serializeInquiryNote(note: InquiryNoteRecord) {
  return {
    authorId: note.authorId.toString(),
    createdAt: note.createdAt?.toISOString(),
    hostelId: note.hostelId.toString(),
    id: note._id.toString(),
    inquiryId: note.inquiryId.toString(),
    nextFollowUpAt: note.nextFollowUpAt?.toISOString(),
    note: note.note,
    statusSnapshot: note.statusSnapshot,
  };
}

function serializeFloor(floor: FloorRecord) {
  return {
    createdAt: floor.createdAt?.toISOString(),
    description: floor.description ?? "",
    hostelId: floor.hostelId.toString(),
    id: floor._id.toString(),
    level: floor.level,
    name: floor.name,
    sortOrder: floor.sortOrder ?? 0,
    status: floor.status,
    updatedAt: floor.updatedAt?.toISOString(),
  };
}

function serializeRoom(room: RoomRecord) {
  return {
    capacity: room.capacity,
    createdAt: room.createdAt?.toISOString(),
    facilities: room.facilities ?? [],
    floorId: room.floorId.toString(),
    hostelId: room.hostelId.toString(),
    id: room._id.toString(),
    notes: room.notes ?? "",
    repairStatus: room.repairStatus,
    roomNumber: room.roomNumber,
    roomType: room.roomType,
    status: room.status,
    updatedAt: room.updatedAt?.toISOString(),
    vacancyStatus: room.vacancyStatus,
  };
}

function serializeBed(bed: BedRecord) {
  return {
    assignedResidentId: bed.assignedResidentId?.toString(),
    bedNumber: bed.bedNumber,
    createdAt: bed.createdAt?.toISOString(),
    floorId: bed.floorId.toString(),
    hostelId: bed.hostelId.toString(),
    id: bed._id.toString(),
    notes: bed.notes ?? "",
    repairStatus: bed.repairStatus,
    roomId: bed.roomId.toString(),
    status: bed.status,
    updatedAt: bed.updatedAt?.toISOString(),
  };
}

function serializeApplication(application: HostelApplicationRecord | null) {
  if (!application) {
    return null;
  }

  return {
    applicantId: application.applicantId.toString(),
    hostelId: application.hostelId.toString(),
    id: application._id.toString(),
    rejectionReason: application.rejectionReason ?? "",
    status: application.status,
    submittedBy: application.submittedBy.toString(),
  };
}

async function auditHostelAction(
  principal: ApiPrincipal,
  hostelId: Types.ObjectId,
  action: string,
  metadata: Record<string, unknown> = {},
) {
  await AuditLogModel.create({
    action,
    actorId: principal.userId,
    entityId: hostelId.toString(),
    entityType: "Hostel",
    hostelId,
    metadata,
  });
}

async function findHostelByIdOrThrow(hostelId: string) {
  const hostel = await HostelModel.findOne({
    _id: normalizeObjectId(hostelId),
    isDeleted: false,
  }).lean<HostelRecord | null>();

  if (!hostel) {
    throw new HostelServiceError("Hostel was not found.", "HOSTEL_NOT_FOUND", 404);
  }

  return hostel;
}

function definedUpdate(input: Record<string, unknown>, omittedKeys: string[] = []) {
  return Object.fromEntries(
    Object.entries(input).filter(
      ([key, value]) => value !== undefined && !omittedKeys.includes(key),
    ),
  );
}

function normalizeObjectIds(values: string[]) {
  return values.map((value) => normalizeObjectId(value));
}

function resolveAdminHostelId(principal: ApiPrincipal, requestedHostelId?: string) {
  if (requestedHostelId) {
    assertHostelAccess(principal, requestedHostelId);
    return normalizeObjectId(requestedHostelId);
  }

  if (principal.hostelIds.length === 1) {
    return normalizeObjectId(principal.hostelIds[0]);
  }

  throw new HostelServiceError(
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

async function findScopedHostel(principal: ApiPrincipal, requestedHostelId?: string) {
  const hostelId = resolveAdminHostelId(principal, requestedHostelId);
  const hostel = await HostelModel.findOne({
    _id: hostelId,
    isDeleted: false,
  }).lean<HostelRecord | null>();

  if (!hostel) {
    throw new HostelServiceError("Hostel was not found.", "HOSTEL_NOT_FOUND", 404);
  }

  return hostel;
}

async function findFloorInHostel(floorId: string, hostelId: Types.ObjectId) {
  const floor = await FloorModel.findOne({
    _id: normalizeObjectId(floorId),
    hostelId,
    isDeleted: false,
  }).lean<FloorRecord | null>();

  if (!floor) {
    throw new HostelServiceError("Floor was not found.", "FLOOR_NOT_FOUND", 404);
  }

  return floor;
}

async function findRoomInHostel(roomId: string, hostelId: Types.ObjectId) {
  const room = await RoomModel.findOne({
    _id: normalizeObjectId(roomId),
    hostelId,
    isDeleted: false,
  }).lean<RoomRecord | null>();

  if (!room) {
    throw new HostelServiceError("Room was not found.", "ROOM_NOT_FOUND", 404);
  }

  return room;
}

async function refreshCapacitySummary(hostelId: Types.ObjectId) {
  const [totalRooms, totalBeds, vacantBeds] = await Promise.all([
    RoomModel.countDocuments({ hostelId, isDeleted: false, status: "ACTIVE" }),
    BedModel.countDocuments({ hostelId, isDeleted: false }),
    BedModel.countDocuments({ hostelId, isDeleted: false, status: "AVAILABLE" }),
  ]);

  await HostelModel.updateOne(
    { _id: hostelId, isDeleted: false },
    {
      $set: {
        capacitySummary: {
          totalBeds,
          totalRooms,
          vacantBeds,
        },
      },
    },
  );
}

async function refreshRoomVacancyStatus(room: RoomRecord) {
  const occupiedBeds = await BedModel.countDocuments({
    isDeleted: false,
    roomId: room._id,
    status: { $in: ["OCCUPIED", "RESERVED"] },
  });
  const nextStatus =
    occupiedBeds === 0 ? "VACANT" : occupiedBeds >= room.capacity ? "FULL" : "PARTIAL";

  await RoomModel.updateOne(
    { _id: room._id, isDeleted: false },
    { $set: { vacancyStatus: nextStatus } },
  );
}

async function findScopedInquiry(
  inquiryId: string,
  principal: ApiPrincipal,
  requestedHostelId?: string,
) {
  const inquiry = await InquiryModel.findOne({
    _id: normalizeObjectId(inquiryId),
    isDeleted: false,
    ...scopedHostelFilter(principal, requestedHostelId),
  }).lean<InquiryRecord | null>();

  if (!inquiry) {
    throw new HostelServiceError("Inquiry was not found.", "INQUIRY_NOT_FOUND", 404);
  }

  return inquiry;
}

export async function createPlatformHostelApplication(
  input: PlatformHostelCreateInput,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const ownerId = normalizeObjectId(input.ownerId);
  const slug = await uniqueSlug(input.name, input.location.area);

  const hostel = await HostelModel.create({
    capacitySummary: input.capacitySummary,
    contact: input.contact,
    createdBy: principal.userId,
    description: input.description,
    facilities: input.facilities,
    food: input.food,
    hostelType: input.hostelType,
    location: input.location,
    name: input.name,
    ownerId,
    photos: input.photos,
    pricing: input.pricing,
    roomTypes: input.roomTypes,
    rules: input.rules,
    slug,
    status: "PENDING_APPROVAL",
    updatedBy: principal.userId,
    verificationStatus: "PENDING",
  });

  const application = await HostelApplicationModel.create({
    applicantId: ownerId,
    hostelId: hostel._id,
    notes: input.notes,
    snapshot: {
      contact: input.contact,
      location: input.location,
      name: input.name,
    },
    status: "PENDING",
    submittedBy: principal.userId,
  });

  await HostelVerificationModel.create({
    createdBy: principal.userId,
    hostelId: hostel._id,
    status: "PENDING",
    updatedBy: principal.userId,
  });

  if (input.documents.length > 0) {
    await HostelDocumentModel.insertMany(
      input.documents.map((document) => ({
        createdBy: principal.userId,
        documentType: document.documentType,
        fileAssetId: document.fileAssetId,
        fileUrl: document.fileUrl,
        hostelId: hostel._id,
        ownerId,
        status: "PENDING",
        updatedBy: principal.userId,
      })),
    );
  }

  await auditHostelAction(principal, hostel._id, "HOSTEL_APPLICATION_CREATED", {
    ownerId: ownerId.toString(),
  });

  const createdHostel = await findHostelByIdOrThrow(hostel._id.toString());
  const createdApplication = await HostelApplicationModel.findById(
    application._id,
  ).lean<HostelApplicationRecord | null>();

  return {
    application: serializeApplication(createdApplication),
    hostel: serializeHostel(createdHostel),
  };
}

export async function listPlatformHostels(query: PlatformHostelListQuery) {
  await connectToDatabase();

  const filter: Partial<Pick<HostelRecord, "status" | "verificationStatus">> & {
    isDeleted: false;
  } = {
    isDeleted: false,
  };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.verificationStatus) {
    filter.verificationStatus = query.verificationStatus;
  }

  const hostels = await HostelModel.find(filter)
    .sort({ createdAt: -1 })
    .limit(100)
    .lean<HostelRecord[]>();

  return {
    hostels: hostels.map(serializeHostel),
  };
}

export async function getPlatformHostel(hostelId: string) {
  await connectToDatabase();

  const hostel = await findHostelByIdOrThrow(hostelId);
  const application = await HostelApplicationModel.findOne({
    hostelId: hostel._id,
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .lean<HostelApplicationRecord | null>();

  return {
    application: serializeApplication(application),
    hostel: serializeHostel(hostel),
  };
}

async function updateHostelStatus(
  hostelId: string,
  principal: ApiPrincipal,
  status: HostelStatus,
  action: string,
  verificationStatus?: HostelRecord["verificationStatus"],
  metadata: Record<string, unknown> = {},
) {
  await connectToDatabase();

  const objectId = normalizeObjectId(hostelId);
  const update: {
    reviewedAt?: Date;
    reviewedBy?: string;
    status?: HostelStatus;
    updatedBy?: string;
    verificationStatus?: HostelRecord["verificationStatus"];
  } = {
    status,
    updatedBy: principal.userId,
  };

  if (verificationStatus) {
    update.verificationStatus = verificationStatus;
  }

  const hostel = await HostelModel.findOneAndUpdate(
    { _id: objectId, isDeleted: false },
    { $set: update },
    { new: true },
  ).lean<HostelRecord | null>();

  if (!hostel) {
    throw new HostelServiceError("Hostel was not found.", "HOSTEL_NOT_FOUND", 404);
  }

  await auditHostelAction(principal, objectId, action, metadata);

  return {
    hostel: serializeHostel(hostel),
  };
}

export async function approvePlatformHostel(hostelId: string, principal: ApiPrincipal) {
  await connectToDatabase();

  const result = await updateHostelStatus(
    hostelId,
    principal,
    "APPROVED",
    "HOSTEL_APPROVED",
    "VERIFIED",
  );

  const objectId = normalizeObjectId(hostelId);

  await HostelApplicationModel.updateMany(
    { hostelId: objectId, status: "PENDING" },
    {
      $set: {
        reviewedAt: new Date(),
        reviewedBy: principal.userId,
        status: "APPROVED",
      },
    },
  );
  await HostelVerificationModel.findOneAndUpdate(
    { hostelId: objectId },
    {
      $set: {
        status: "VERIFIED",
        updatedBy: principal.userId,
        verifiedAt: new Date(),
        verifiedBy: principal.userId,
      },
    },
    { upsert: true },
  );
  await HostelDocumentModel.updateMany(
    { hostelId: objectId, status: "PENDING" },
    {
      $set: {
        reviewedAt: new Date(),
        reviewedBy: principal.userId,
        status: "APPROVED",
        updatedBy: principal.userId,
      },
    },
  );

  return result;
}

export async function rejectPlatformHostel(
  hostelId: string,
  input: HostelRejectInput,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const result = await updateHostelStatus(
    hostelId,
    principal,
    "REJECTED",
    "HOSTEL_REJECTED",
    "REJECTED",
    { reason: input.reason },
  );
  const objectId = normalizeObjectId(hostelId);

  await HostelApplicationModel.updateMany(
    { hostelId: objectId, status: "PENDING" },
    {
      $set: {
        rejectionReason: input.reason,
        reviewedAt: new Date(),
        reviewedBy: principal.userId,
        status: "REJECTED",
      },
    },
  );
  await HostelVerificationModel.findOneAndUpdate(
    { hostelId: objectId },
    {
      $set: {
        notes: input.reason,
        status: "REJECTED",
        updatedBy: principal.userId,
        verifiedBy: principal.userId,
      },
    },
    { upsert: true },
  );

  return result;
}

export async function publishPlatformHostel(hostelId: string, principal: ApiPrincipal) {
  await connectToDatabase();

  const current = await findHostelByIdOrThrow(hostelId);

  if (current.verificationStatus !== "VERIFIED") {
    throw new HostelServiceError(
      "Only verified hostels can be published.",
      "HOSTEL_NOT_VERIFIED",
      409,
    );
  }

  return updateHostelStatus(hostelId, principal, "PUBLISHED", "HOSTEL_PUBLISHED");
}

export async function unpublishPlatformHostel(hostelId: string, principal: ApiPrincipal) {
  return updateHostelStatus(hostelId, principal, "APPROVED", "HOSTEL_UNPUBLISHED");
}

export async function listPublicHostels(query: PublicHostelListQuery) {
  await connectToDatabase();

  const filter: {
    $or?: Array<Record<string, RegExp>>;
    facilities?: string;
    "food.hasNonVeg"?: true;
    "food.hasVeg"?: true;
    "location.area"?: RegExp;
    "pricing.monthlyRentMax"?: { $gte: number };
    "pricing.monthlyRentMin"?: { $lte: number };
    roomTypes?: string;
    hostelType?: PublicHostelListQuery["type"];
    isDeleted: false;
    status: "PUBLISHED";
    verificationStatus: "VERIFIED";
  } = {
    isDeleted: false,
    status: "PUBLISHED",
    verificationStatus: "VERIFIED",
  };

  if (query.q) {
    const pattern = new RegExp(query.q, "i");
    filter.$or = [{ name: pattern }, { "location.area": pattern }];
  }

  if (query.area) {
    filter["location.area"] = new RegExp(query.area, "i");
  }

  if (query.type) {
    filter.hostelType = query.type;
  }

  if (query.facility) {
    filter.facilities = query.facility;
  }

  if (query.food === "veg") {
    filter["food.hasVeg"] = true;
  }

  if (query.food === "non-veg") {
    filter["food.hasNonVeg"] = true;
  }

  if (query.roomType) {
    filter.roomTypes = query.roomType;
  }

  if (query.minPrice !== undefined) {
    filter["pricing.monthlyRentMax"] = { $gte: query.minPrice };
  }

  if (query.maxPrice !== undefined) {
    filter["pricing.monthlyRentMin"] = { $lte: query.maxPrice };
  }

  const hostels = await HostelModel.find(filter)
    .sort({ "pricing.monthlyRentMin": 1, createdAt: -1 })
    .limit(60)
    .lean<HostelRecord[]>();

  return {
    hostels: hostels.map(serializePublicHostel),
  };
}

export async function getPublicHostelBySlug(slug: string) {
  await connectToDatabase();

  const hostel = await HostelModel.findOne({
    isDeleted: false,
    slug,
    status: "PUBLISHED",
    verificationStatus: "VERIFIED",
  }).lean<HostelRecord | null>();

  if (!hostel) {
    throw new HostelServiceError("Hostel was not found.", "HOSTEL_NOT_FOUND", 404);
  }

  return {
    hostel: serializePublicHostel(hostel),
  };
}

export async function comparePublicHostels(query: PublicHostelCompareQuery) {
  await connectToDatabase();

  const hostelIds = normalizeObjectIds(query.ids);
  const hostels = await HostelModel.find({
    _id: { $in: hostelIds },
    isDeleted: false,
    status: "PUBLISHED",
    verificationStatus: "VERIFIED",
  }).lean<HostelRecord[]>();

  if (hostels.length !== hostelIds.length) {
    throw new HostelServiceError(
      "One or more hostels are not available for public comparison.",
      "PUBLIC_HOSTEL_COMPARE_NOT_FOUND",
      404,
    );
  }

  const ratings = await RatingReviewModel.aggregate<RatingSummaryRecord>([
    {
      $match: {
        hostelId: { $in: hostelIds },
        status: "VISIBLE",
      },
    },
    {
      $group: {
        _id: "$hostelId",
        averageRating: { $avg: "$overallRating" },
        cleanlinessRating: { $avg: "$cleanlinessRating" },
        foodRating: { $avg: "$foodRating" },
        safetyRating: { $avg: "$safetyRating" },
        total: { $sum: 1 },
      },
    },
  ]);
  const ratingByHostelId = new Map(
    ratings.map((rating) => [rating._id.toString(), rating]),
  );
  const byRequestedOrder = new Map(
    hostels.map((hostel) => [hostel._id.toString(), hostel]),
  );

  return {
    hostels: query.ids
      .map((id) => byRequestedOrder.get(id))
      .filter((hostel): hostel is HostelRecord => Boolean(hostel))
      .map((hostel) => {
        const rating = ratingByHostelId.get(hostel._id.toString());

        return {
          ...serializePublicHostel(hostel),
          comparison: {
            facilities: hostel.facilities ?? [],
            foodScore: rating?.foodRating ?? 0,
            locationText: [
              hostel.location.address,
              hostel.location.area,
              hostel.location.city,
            ]
              .filter(Boolean)
              .join(", "),
            monthlyFee: {
              currency: hostel.pricing?.currency ?? "NPR",
              max: hostel.pricing?.monthlyRentMax ?? 0,
              min: hostel.pricing?.monthlyRentMin ?? 0,
            },
            ratingSummary: {
              averageRating: rating?.averageRating ?? 0,
              cleanlinessRating: rating?.cleanlinessRating ?? 0,
              safetyRating: rating?.safetyRating ?? 0,
              total: rating?.total ?? 0,
            },
            roomTypes: hostel.roomTypes ?? [],
            vacancy: hostel.capacitySummary?.vacantBeds ?? 0,
            verificationStatus: hostel.verificationStatus,
          },
        };
      }),
  };
}

export async function createPublicHostelInquiry(
  hostelId: string,
  input: PublicInquiryCreateInput,
) {
  await connectToDatabase();

  const objectId = normalizeObjectId(hostelId);
  const hostel = await HostelModel.findOne({
    _id: objectId,
    isDeleted: false,
    status: "PUBLISHED",
    verificationStatus: "VERIFIED",
  }).lean<HostelRecord | null>();

  if (!hostel) {
    throw new HostelServiceError("Hostel was not found.", "HOSTEL_NOT_FOUND", 404);
  }

  const inquiry = await InquiryModel.create({
    ...input,
    hostelId: objectId,
    source: "PUBLIC_WEBSITE",
    status: "NEW",
  });

  return {
    hostel: serializePublicHostel(hostel),
    inquiry: serializeInquiry(inquiry),
  };
}

export async function listHostelAdminInquiries(
  query: HostelAdminInquiryListQuery,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const filter: Record<string, unknown> = {
    isDeleted: false,
    ...scopedHostelFilter(principal, query.hostelId),
  };

  if (query.status) {
    filter.status = query.status;
  }

  const inquiries = await InquiryModel.find(filter)
    .sort({ createdAt: -1 })
    .limit(100)
    .lean<InquiryRecord[]>();

  return {
    inquiries: inquiries.map(serializeInquiry),
  };
}

export async function updateHostelAdminInquiryStatus(
  inquiryId: string,
  input: HostelAdminInquiryStatusInput,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const inquiry = await findScopedInquiry(inquiryId, principal, input.hostelId);
  const updatedInquiry = await InquiryModel.findOneAndUpdate(
    { _id: inquiry._id, isDeleted: false },
    {
      $set: {
        status: input.status,
        updatedBy: principal.userId,
      },
    },
    { new: true },
  ).lean<InquiryRecord | null>();

  if (!updatedInquiry) {
    throw new HostelServiceError("Inquiry was not found.", "INQUIRY_NOT_FOUND", 404);
  }

  await auditHostelAction(principal, inquiry.hostelId, "INQUIRY_STATUS_UPDATED", {
    inquiryId: inquiry._id.toString(),
    status: input.status,
  });

  return {
    inquiry: serializeInquiry(updatedInquiry),
  };
}

export async function addHostelAdminInquiryNote(
  inquiryId: string,
  input: InquiryNoteCreateInput,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const inquiry = await findScopedInquiry(inquiryId, principal, input.hostelId);
  const note = await InquiryNoteModel.create({
    authorId: principal.userId,
    hostelId: inquiry.hostelId,
    inquiryId: inquiry._id,
    nextFollowUpAt: input.nextFollowUpAt,
    note: input.note,
    statusSnapshot: inquiry.status,
  });

  await auditHostelAction(principal, inquiry.hostelId, "INQUIRY_NOTE_ADDED", {
    inquiryId: inquiry._id.toString(),
    noteId: note._id.toString(),
  });

  return {
    inquiry: serializeInquiry(inquiry),
    note: serializeInquiryNote(note),
  };
}

export async function getHostelAdminProfile(
  query: HostelAdminProfileQuery,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const hostel = await findScopedHostel(principal, query.hostelId);

  return {
    hostel: serializeHostel(hostel),
  };
}

export async function updateHostelAdminProfile(
  input: HostelAdminProfileUpdateInput,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const hostel = await findScopedHostel(principal, input.hostelId);
  const profileUpdate = definedUpdate(input, ["hostelId"]);
  const updatedHostel = await HostelModel.findOneAndUpdate(
    { _id: hostel._id, isDeleted: false },
    {
      $set: {
        ...profileUpdate,
        updatedBy: principal.userId,
      },
    },
    { new: true },
  ).lean<HostelRecord | null>();

  if (!updatedHostel) {
    throw new HostelServiceError("Hostel was not found.", "HOSTEL_NOT_FOUND", 404);
  }

  await auditHostelAction(principal, hostel._id, "HOSTEL_PROFILE_UPDATED");

  return {
    hostel: serializeHostel(updatedHostel),
  };
}

export async function addHostelAdminProfilePhoto(
  input: HostelPhotoCreateInput,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const hostel = await findScopedHostel(principal, input.hostelId);
  const updatedHostel = await HostelModel.findOneAndUpdate(
    { _id: hostel._id, isDeleted: false },
    {
      $push: {
        photos: {
          alt: input.alt,
          fileAssetId: input.fileAssetId,
          url: input.url,
        },
      },
      $set: {
        updatedBy: principal.userId,
      },
    },
    { new: true },
  ).lean<HostelRecord | null>();

  if (!updatedHostel) {
    throw new HostelServiceError("Hostel was not found.", "HOSTEL_NOT_FOUND", 404);
  }

  await auditHostelAction(principal, hostel._id, "HOSTEL_PROFILE_PHOTO_ADDED");

  return {
    hostel: serializeHostel(updatedHostel),
  };
}

export async function deleteHostelAdminProfilePhoto(
  photoId: string,
  query: HostelPhotoDeleteQuery,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const hostel = await findScopedHostel(principal, query.hostelId);
  const updatedHostel = await HostelModel.findOneAndUpdate(
    { _id: hostel._id, isDeleted: false },
    {
      $pull: {
        photos: {
          _id: normalizeObjectId(photoId),
        },
      },
      $set: {
        updatedBy: principal.userId,
      },
    },
    { new: true },
  ).lean<HostelRecord | null>();

  if (!updatedHostel) {
    throw new HostelServiceError("Hostel was not found.", "HOSTEL_NOT_FOUND", 404);
  }

  await auditHostelAction(principal, hostel._id, "HOSTEL_PROFILE_PHOTO_DELETED", {
    photoId,
  });

  return {
    hostel: serializeHostel(updatedHostel),
  };
}

export async function createHostelAdminFloor(
  input: FloorCreateInput,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const hostelId = resolveAdminHostelId(principal, input.hostelId);
  const floor = await FloorModel.create({
    ...input,
    createdBy: principal.userId,
    hostelId,
    updatedBy: principal.userId,
  });

  await auditHostelAction(principal, hostelId, "HOSTEL_FLOOR_CREATED", {
    floorId: floor._id.toString(),
  });

  return {
    floor: serializeFloor(floor),
  };
}

export async function listHostelAdminFloors(
  query: HostelScopedListQuery,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const floors = await FloorModel.find({
    isDeleted: false,
    ...scopedHostelFilter(principal, query.hostelId),
  })
    .sort({ sortOrder: 1, level: 1 })
    .lean<FloorRecord[]>();

  return {
    floors: floors.map(serializeFloor),
  };
}

export async function createHostelAdminRoom(
  input: RoomCreateInput,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const hostelId = resolveAdminHostelId(principal, input.hostelId);
  const floor = await findFloorInHostel(input.floorId, hostelId);
  const room = await RoomModel.create({
    ...input,
    createdBy: principal.userId,
    floorId: floor._id,
    hostelId,
    status: "ACTIVE",
    updatedBy: principal.userId,
  });

  await refreshCapacitySummary(hostelId);
  await auditHostelAction(principal, hostelId, "HOSTEL_ROOM_CREATED", {
    roomId: room._id.toString(),
  });

  return {
    room: serializeRoom(room),
  };
}

export async function listHostelAdminRooms(
  query: HostelScopedListQuery,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const rooms = await RoomModel.find({
    isDeleted: false,
    ...scopedHostelFilter(principal, query.hostelId),
  })
    .sort({ floorId: 1, roomNumber: 1 })
    .lean<RoomRecord[]>();

  return {
    rooms: rooms.map(serializeRoom),
  };
}

export async function updateHostelAdminRoom(
  roomId: string,
  input: RoomUpdateInput,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const existingRoom = await RoomModel.findOne({
    _id: normalizeObjectId(roomId),
    isDeleted: false,
    ...scopedHostelFilter(principal, input.hostelId),
  }).lean<RoomRecord | null>();

  if (!existingRoom) {
    throw new HostelServiceError("Room was not found.", "ROOM_NOT_FOUND", 404);
  }

  const roomUpdate = definedUpdate(input, ["hostelId"]);

  if (input.floorId) {
    const floor = await findFloorInHostel(input.floorId, existingRoom.hostelId);
    roomUpdate.floorId = floor._id;
  }

  const updatedRoom = await RoomModel.findOneAndUpdate(
    { _id: existingRoom._id, isDeleted: false },
    {
      $set: {
        ...roomUpdate,
        updatedBy: principal.userId,
      },
    },
    { new: true },
  ).lean<RoomRecord | null>();

  if (!updatedRoom) {
    throw new HostelServiceError("Room was not found.", "ROOM_NOT_FOUND", 404);
  }

  await refreshCapacitySummary(existingRoom.hostelId);
  await auditHostelAction(principal, existingRoom.hostelId, "HOSTEL_ROOM_UPDATED", {
    roomId: existingRoom._id.toString(),
  });

  return {
    room: serializeRoom(updatedRoom),
  };
}

export async function createHostelAdminBed(
  input: BedCreateInput,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const hostelId = resolveAdminHostelId(principal, input.hostelId);
  const room = await findRoomInHostel(input.roomId, hostelId);
  const bed = await BedModel.create({
    ...input,
    assignedResidentId: input.assignedResidentId
      ? normalizeObjectId(input.assignedResidentId)
      : undefined,
    createdBy: principal.userId,
    floorId: room.floorId,
    hostelId,
    roomId: room._id,
    updatedBy: principal.userId,
  });

  await refreshRoomVacancyStatus(room);
  await refreshCapacitySummary(hostelId);
  await auditHostelAction(principal, hostelId, "HOSTEL_BED_CREATED", {
    bedId: bed._id.toString(),
    roomId: room._id.toString(),
  });

  return {
    bed: serializeBed(bed),
  };
}

export async function updateHostelAdminBed(
  bedId: string,
  input: BedUpdateInput,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const existingBed = await BedModel.findOne({
    _id: normalizeObjectId(bedId),
    isDeleted: false,
    ...scopedHostelFilter(principal, input.hostelId),
  }).lean<BedRecord | null>();

  if (!existingBed) {
    throw new HostelServiceError("Bed was not found.", "BED_NOT_FOUND", 404);
  }

  const bedUpdate = definedUpdate(input, ["hostelId"]);
  const unsetUpdate: Record<string, ""> = {};
  let currentRoom = await findRoomInHostel(
    existingBed.roomId.toString(),
    existingBed.hostelId,
  );
  let previousRoom: RoomRecord | null = null;

  if (input.roomId) {
    const nextRoom = await findRoomInHostel(input.roomId, existingBed.hostelId);

    if (nextRoom._id.toString() !== existingBed.roomId.toString()) {
      previousRoom = currentRoom;
    }

    currentRoom = nextRoom;
    bedUpdate.floorId = nextRoom.floorId;
    bedUpdate.roomId = nextRoom._id;
  }

  if (input.assignedResidentId === null) {
    delete bedUpdate.assignedResidentId;
    unsetUpdate.assignedResidentId = "";
  } else if (input.assignedResidentId) {
    bedUpdate.assignedResidentId = normalizeObjectId(input.assignedResidentId);
  }

  const modifier: Record<string, unknown> = {
    $set: {
      ...bedUpdate,
      updatedBy: principal.userId,
    },
  };

  if (Object.keys(unsetUpdate).length > 0) {
    modifier.$unset = unsetUpdate;
  }

  const updatedBed = await BedModel.findOneAndUpdate(
    { _id: existingBed._id, isDeleted: false },
    modifier,
    { new: true },
  ).lean<BedRecord | null>();

  if (!updatedBed) {
    throw new HostelServiceError("Bed was not found.", "BED_NOT_FOUND", 404);
  }

  if (previousRoom) {
    await refreshRoomVacancyStatus(previousRoom);
  }

  await refreshRoomVacancyStatus(currentRoom);
  await refreshCapacitySummary(existingBed.hostelId);
  await auditHostelAction(principal, existingBed.hostelId, "HOSTEL_BED_UPDATED", {
    bedId: existingBed._id.toString(),
  });

  return {
    bed: serializeBed(updatedBed),
  };
}

export async function getHostelAdminRoomMap(
  query: HostelScopedListQuery,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const hostel = await findScopedHostel(principal, query.hostelId);
  const [floors, rooms, beds] = await Promise.all([
    FloorModel.find({ hostelId: hostel._id, isDeleted: false })
      .sort({ sortOrder: 1, level: 1 })
      .lean<FloorRecord[]>(),
    RoomModel.find({ hostelId: hostel._id, isDeleted: false })
      .sort({ floorId: 1, roomNumber: 1 })
      .lean<RoomRecord[]>(),
    BedModel.find({ hostelId: hostel._id, isDeleted: false })
      .sort({ roomId: 1, bedNumber: 1 })
      .lean<BedRecord[]>(),
  ]);

  return {
    floors: floors.map((floor) => ({
      ...serializeFloor(floor),
      rooms: rooms
        .filter((room) => room.floorId.toString() === floor._id.toString())
        .map((room) => ({
          ...serializeRoom(room),
          beds: beds
            .filter((bed) => bed.roomId.toString() === room._id.toString())
            .map(serializeBed),
        })),
    })),
    hostel: serializeHostel(hostel),
  };
}
