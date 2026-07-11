import { Types } from "mongoose";

import type { ApiPrincipal } from "@/lib/api-auth";
import { connectToDatabase } from "@/lib/db";
import { Role } from "@/lib/roles";
import { assertHostelAccess } from "@/lib/tenant";
import { AuditLogModel } from "@/models/AuditLog";
import { HostelApplicationModel } from "@/models/HostelApplication";
import { HostelDocumentModel } from "@/models/HostelDocument";
import { HostelModel } from "@/models/Hostel";
import { HostelVerificationModel } from "@/models/HostelVerification";
import { InquiryModel } from "@/models/Inquiry";
import { RatingReviewModel } from "@/models/RatingReview";
import { UserModel } from "@/models/User";
import type {
  hostelRejectSchema,
  platformHostelCreateSchema,
  platformHostelListQuerySchema,
  publicHostelCompareQuerySchema,
  publicHostelApplicationCreateSchema,
  publicInquiryCreateSchema,
  publicHostelListQuerySchema,
} from "@/modules/hostels/hostel.validation";
import type { z } from "zod";

type PlatformHostelCreateInput = z.infer<typeof platformHostelCreateSchema>;
type PublicHostelApplicationCreateInput = z.infer<
  typeof publicHostelApplicationCreateSchema
>;
type PlatformHostelListQuery = z.infer<typeof platformHostelListQuerySchema>;
type HostelRejectInput = z.infer<typeof hostelRejectSchema>;
type PublicHostelListQuery = z.infer<typeof publicHostelListQuerySchema>;
type PublicHostelCompareQuery = z.infer<typeof publicHostelCompareQuerySchema>;
type PublicInquiryCreateInput = z.infer<typeof publicInquiryCreateSchema>;

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
  demoDataLabel?: string;
  description?: string;
  facilities?: string[];
  food?: {
    hasNonVeg?: boolean;
    hasVeg?: boolean;
    mealsPerDay?: number;
    notes?: string;
  };
  hostelType?: "BOYS" | "GIRLS" | "CO_LIVING";
  isDemoData?: boolean;
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

type UserOwnerRecord = {
  _id: Types.ObjectId;
  role?: string;
};

type HostelStatus = HostelRecord["status"];

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

export function normalizeObjectId(value: string) {
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

export function serializeHostel(hostel: HostelRecord) {
  return {
    capacitySummary: hostel.capacitySummary ?? {},
    contact: hostel.contact ?? {},
    createdAt: hostel.createdAt?.toISOString(),
    demoDataLabel: hostel.demoDataLabel ?? "",
    description: hostel.description ?? "",
    facilities: hostel.facilities ?? [],
    food: hostel.food ?? {},
    hostelType: hostel.hostelType ?? "CO_LIVING",
    id: hostel._id.toString(),
    isDemoData: Boolean(hostel.isDemoData),
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

export function serializePublicHostel(hostel: HostelRecord) {
  return {
    capacitySummary: hostel.capacitySummary ?? {},
    demoDataLabel: hostel.demoDataLabel ?? "",
    description: hostel.description ?? "",
    facilities: hostel.facilities ?? [],
    food: hostel.food ?? {},
    hostelType: hostel.hostelType ?? "CO_LIVING",
    id: hostel._id.toString(),
    isDemoData: Boolean(hostel.isDemoData),
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

type InquiryStatus = "NEW" | "CONTACTED" | "VISIT_SCHEDULED" | "CONVERTED" | "CLOSED";

type InquiryRecord = {
  _id: Types.ObjectId;
  budgetRange?: string;
  createdAt?: Date;
  email?: string;
  gender?: string;
  hostelId: Types.ObjectId;
  message?: string;
  name: string;
  phone: string;
  preferredRoomType?: string;
  preferredVisitDate?: Date;
  source: "PUBLIC_WEBSITE" | "ADMIN_CREATED";
  status: InquiryStatus;
  updatedAt?: Date;
};

function serializeInquiry(inquiry: InquiryRecord) {
  return {
    budgetRange: inquiry.budgetRange ?? "",
    createdAt: inquiry.createdAt?.toISOString(),
    email: inquiry.email ?? "",
    gender: inquiry.gender ?? "",
    hostelId: inquiry.hostelId.toString(),
    id: inquiry._id.toString(),
    message: inquiry.message ?? "",
    name: inquiry.name,
    phone: inquiry.phone,
    preferredRoomType: inquiry.preferredRoomType ?? "",
    preferredVisitDate: inquiry.preferredVisitDate?.toISOString(),
    source: inquiry.source,
    status: inquiry.status,
    updatedAt: inquiry.updatedAt?.toISOString(),
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

export async function auditHostelAction(
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

export async function findHostelByIdOrThrow(hostelId: string) {
  const hostel = await HostelModel.findOne({
    _id: normalizeObjectId(hostelId),
    isDeleted: false,
  }).lean<HostelRecord | null>();

  if (!hostel) {
    throw new HostelServiceError("Hostel was not found.", "HOSTEL_NOT_FOUND", 404);
  }

  return hostel;
}

export function definedUpdate(input: Record<string, unknown>, omittedKeys: string[] = []) {
  return Object.fromEntries(
    Object.entries(input).filter(
      ([key, value]) => value !== undefined && !omittedKeys.includes(key),
    ),
  );
}

export function normalizeObjectIds(values: string[]) {
  return values.map((value) => normalizeObjectId(value));
}

export function resolveAdminHostelId(principal: ApiPrincipal, requestedHostelId?: string) {
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

export function scopedHostelFilter(principal: ApiPrincipal, requestedHostelId?: string) {
  if (requestedHostelId) {
    return { hostelId: resolveAdminHostelId(principal, requestedHostelId) };
  }

  return {
    hostelId: {
      $in: normalizeObjectIds(principal.hostelIds),
    },
  };
}

export async function findScopedHostel(principal: ApiPrincipal, requestedHostelId?: string) {
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

async function findOrCreatePublicHostelOwner(
  applicant: PublicHostelApplicationCreateInput["applicant"],
) {
  const contactFilter: Array<{ email?: string; phone?: string }> = [
    { phone: applicant.phone },
  ];

  if (applicant.email) {
    contactFilter.push({ email: applicant.email.toLowerCase() });
  }

  const existingUser = await UserModel.findOne({
    $or: contactFilter,
    isDeleted: { $ne: true },
  }).lean<UserOwnerRecord | null>();

  if (existingUser) {
    if (existingUser.role !== Role.HOSTEL_OWNER) {
      throw new HostelServiceError(
        "This contact already belongs to another account role.",
        "HOSTEL_OWNER_CONTACT_CONFLICT",
        409,
      );
    }

    return existingUser._id;
  }

  const user = await UserModel.create({
    email: applicant.email,
    name: applicant.name,
    phone: applicant.phone,
    role: Role.HOSTEL_OWNER,
    status: "INVITED",
  });

  return user._id as Types.ObjectId;
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

export async function registerPublicHostelApplication(
  input: PublicHostelApplicationCreateInput,
) {
  await connectToDatabase();

  const ownerId = await findOrCreatePublicHostelOwner(input.applicant);
  const slug = await uniqueSlug(input.name, input.location.area);

  const hostel = await HostelModel.create({
    capacitySummary: input.capacitySummary,
    contact: input.contact,
    createdBy: ownerId,
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
    updatedBy: ownerId,
    verificationStatus: "PENDING",
  });

  const application = await HostelApplicationModel.create({
    applicantId: ownerId,
    hostelId: hostel._id,
    notes: input.notes,
    snapshot: {
      applicant: input.applicant,
      capacitySummary: input.capacitySummary,
      contact: input.contact,
      documents: input.documents,
      location: input.location,
      name: input.name,
      pricing: input.pricing,
      roomConfigurations: input.roomConfigurations,
      selectedPlan: input.selectedPlan,
    },
    status: "PENDING",
    submittedBy: ownerId,
  });

  await HostelVerificationModel.create({
    createdBy: ownerId,
    hostelId: hostel._id,
    status: "PENDING",
    updatedBy: ownerId,
  });

  if (input.documents.length > 0) {
    await HostelDocumentModel.insertMany(
      input.documents.map((document) => ({
        createdBy: ownerId,
        documentType: document.documentType,
        fileAssetId: document.fileAssetId,
        fileUrl: document.fileUrl,
        hostelId: hostel._id,
        ownerId,
        status: "PENDING",
        updatedBy: ownerId,
      })),
    );
  }

  await AuditLogModel.create({
    action: "PUBLIC_HOSTEL_APPLICATION_SUBMITTED",
    actorId: ownerId,
    entityId: hostel._id.toString(),
    entityType: "Hostel",
    hostelId: hostel._id,
    metadata: {
      selectedPlan: input.selectedPlan,
      submittedFrom: "public-registration",
    },
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
  hostelRef: string,
  input: PublicInquiryCreateInput,
) {
  await connectToDatabase();

  const hostelLookup = Types.ObjectId.isValid(hostelRef)
    ? { _id: normalizeObjectId(hostelRef) }
    : { slug: hostelRef };
  const hostel = await HostelModel.findOne({
    ...hostelLookup,
    isDeleted: false,
    status: "PUBLISHED",
    verificationStatus: "VERIFIED",
  }).lean<HostelRecord | null>();

  if (!hostel) {
    throw new HostelServiceError("Hostel was not found.", "HOSTEL_NOT_FOUND", 404);
  }

  const inquiry = await InquiryModel.create({
    ...input,
    hostelId: hostel._id,
    source: "PUBLIC_WEBSITE",
    status: "NEW",
  });

  return {
    hostel: serializePublicHostel(hostel),
    inquiry: serializeInquiry(inquiry),
  };
}
