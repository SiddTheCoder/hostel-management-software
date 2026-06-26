import { Types } from "mongoose";
import type { z } from "zod";

import type { ApiPrincipal } from "@/lib/api-auth";
import { connectToDatabase } from "@/lib/db";
import { assertHostelAccess } from "@/lib/tenant";
import { AuditLogModel } from "@/models/AuditLog";
import { FoodFeedbackModel } from "@/models/FoodFeedback";
import { FoodMenuModel } from "@/models/FoodMenu";
import { FoodPhotoModel } from "@/models/FoodPhoto";
import {
  findCurrentResident,
  normalizeObjectId,
  serializeResidentSummary,
} from "@/modules/residents/resident-access";
import type {
  foodFeedbackSchema,
  foodMenuCreateSchema,
  foodMenuListQuerySchema,
  foodMenuUpdateSchema,
  foodPhotoUploadSchema,
} from "@/modules/food/food.validation";

type FoodMenuCreateInput = z.infer<typeof foodMenuCreateSchema>;
type FoodMenuUpdateInput = z.infer<typeof foodMenuUpdateSchema>;
type FoodMenuListQuery = z.infer<typeof foodMenuListQuerySchema>;
type FoodPhotoUploadInput = z.infer<typeof foodPhotoUploadSchema>;
type FoodFeedbackInput = z.infer<typeof foodFeedbackSchema>;

type FoodMenuRecord = {
  _id: Types.ObjectId;
  createdAt?: Date;
  date: Date;
  dayOfWeek: string;
  hostelId: Types.ObjectId;
  items: string[];
  mealType: string;
  specialNotes?: string;
  timing: string;
  updatedAt?: Date;
  weekStartDate: Date;
};

type FoodPhotoRecord = {
  _id: Types.ObjectId;
  caption?: string;
  date: Date;
  hostelId: Types.ObjectId;
  mealType: string;
  photoAssetId: string;
  residentId?: Types.ObjectId;
  uploadedAt: Date;
  uploadedBy: Types.ObjectId;
};

type FoodFeedbackRecord = {
  _id: Types.ObjectId;
  comment?: string;
  createdAt?: Date;
  date: Date;
  hostelId: Types.ObjectId;
  isAnonymous: boolean;
  mealType: string;
  menuId?: Types.ObjectId;
  rating: number;
  residentId: Types.ObjectId;
};

export class FoodServiceError extends Error {
  constructor(
    message: string,
    public errorCode = "FOOD_ERROR",
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

  throw new FoodServiceError(
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

function serializeFoodMenu(menu: FoodMenuRecord) {
  return {
    createdAt: menu.createdAt?.toISOString(),
    date: menu.date.toISOString(),
    dayOfWeek: menu.dayOfWeek,
    hostelId: menu.hostelId.toString(),
    id: menu._id.toString(),
    items: menu.items,
    mealType: menu.mealType,
    specialNotes: menu.specialNotes ?? "",
    timing: menu.timing,
    updatedAt: menu.updatedAt?.toISOString(),
    weekStartDate: menu.weekStartDate.toISOString(),
  };
}

function serializeFoodPhoto(photo: FoodPhotoRecord) {
  return {
    caption: photo.caption ?? "",
    date: photo.date.toISOString(),
    hostelId: photo.hostelId.toString(),
    id: photo._id.toString(),
    mealType: photo.mealType,
    photoAssetId: photo.photoAssetId,
    residentId: photo.residentId?.toString(),
    uploadedAt: photo.uploadedAt.toISOString(),
    uploadedBy: photo.uploadedBy.toString(),
  };
}

function serializeFoodFeedback(feedback: FoodFeedbackRecord) {
  return {
    comment: feedback.comment ?? "",
    createdAt: feedback.createdAt?.toISOString(),
    date: feedback.date.toISOString(),
    hostelId: feedback.hostelId.toString(),
    id: feedback._id.toString(),
    isAnonymous: feedback.isAnonymous,
    mealType: feedback.mealType,
    menuId: feedback.menuId?.toString(),
    rating: feedback.rating,
    residentId: feedback.residentId.toString(),
  };
}

async function auditFoodAction(
  principal: ApiPrincipal,
  hostelId: Types.ObjectId,
  entityId: Types.ObjectId,
  entityType: string,
  action: string,
  metadata: Record<string, unknown> = {},
) {
  await AuditLogModel.create({
    action,
    actorId: principal.userId,
    entityId: entityId.toString(),
    entityType,
    hostelId,
    metadata,
  });
}

export async function createFoodMenu(
  input: FoodMenuCreateInput,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const hostelId = resolveAdminHostelId(principal, input.hostelId);
  const menu = await FoodMenuModel.create({
    ...input,
    createdBy: principal.userId,
    hostelId,
    updatedBy: principal.userId,
  });

  await auditFoodAction(principal, hostelId, menu._id, "FoodMenu", "FOOD_MENU_CREATED");

  return {
    menu: serializeFoodMenu(menu as FoodMenuRecord),
  };
}

export async function listFoodMenus(query: FoodMenuListQuery, principal: ApiPrincipal) {
  await connectToDatabase();

  const filter: Record<string, unknown> = {
    ...scopedHostelFilter(principal, query.hostelId),
  };

  if (query.date) {
    const start = new Date(query.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    filter.date = { $gte: start, $lt: end };
  }

  if (query.weekStartDate) {
    filter.weekStartDate = query.weekStartDate;
  }

  if (query.mealType) {
    filter.mealType = query.mealType;
  }

  const menus = await FoodMenuModel.find(filter)
    .sort({ date: 1, mealType: 1 })
    .limit(120)
    .lean<FoodMenuRecord[]>();

  return {
    menus: menus.map(serializeFoodMenu),
  };
}

export async function updateFoodMenu(
  menuId: string,
  input: FoodMenuUpdateInput,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const existingMenu = await FoodMenuModel.findOne({
    _id: normalizeObjectId(menuId, "food menu id"),
    ...scopedHostelFilter(principal, input.hostelId),
  }).lean<FoodMenuRecord | null>();

  if (!existingMenu) {
    throw new FoodServiceError("Food menu was not found.", "FOOD_MENU_NOT_FOUND", 404);
  }

  const menu = await FoodMenuModel.findOneAndUpdate(
    { _id: existingMenu._id },
    {
      $set: {
        ...definedUpdate(input, ["hostelId"]),
        updatedBy: principal.userId,
      },
    },
    { new: true },
  ).lean<FoodMenuRecord | null>();

  if (!menu) {
    throw new FoodServiceError("Food menu was not found.", "FOOD_MENU_NOT_FOUND", 404);
  }

  await auditFoodAction(
    principal,
    existingMenu.hostelId,
    existingMenu._id,
    "FoodMenu",
    "FOOD_MENU_UPDATED",
  );

  return {
    menu: serializeFoodMenu(menu),
  };
}

export async function uploadFoodPhoto(
  input: FoodPhotoUploadInput,
  principal: ApiPrincipal,
  residentScoped = false,
) {
  await connectToDatabase();

  const resident = residentScoped ? await findCurrentResident(principal) : null;
  const hostelId = resident
    ? resident.hostelId
    : resolveAdminHostelId(principal, input.hostelId);
  const photo = await FoodPhotoModel.create({
    ...input,
    hostelId,
    residentId: resident?._id,
    uploadedBy: principal.userId,
  });

  await auditFoodAction(
    principal,
    hostelId,
    photo._id,
    "FoodPhoto",
    "FOOD_PHOTO_UPLOADED",
  );

  return {
    photo: serializeFoodPhoto(photo as FoodPhotoRecord),
    resident: resident ? serializeResidentSummary(resident) : null,
  };
}

export async function listFoodForResident(principal: ApiPrincipal) {
  await connectToDatabase();

  const resident = await findCurrentResident(principal);
  const menus = await FoodMenuModel.find({
    hostelId: resident.hostelId,
  })
    .sort({ date: 1, mealType: 1 })
    .limit(80)
    .lean<FoodMenuRecord[]>();
  const photos = await FoodPhotoModel.find({
    hostelId: resident.hostelId,
    date: {
      $gte: menus[0]?.date ?? new Date(0),
    },
  })
    .sort({ date: -1, uploadedAt: -1 })
    .limit(40)
    .lean<FoodPhotoRecord[]>();

  return {
    menus: menus.map(serializeFoodMenu),
    photos: photos.map(serializeFoodPhoto),
    resident: serializeResidentSummary(resident),
  };
}

export async function submitFoodFeedback(
  input: FoodFeedbackInput,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const resident = await findCurrentResident(principal);

  if (input.menuId) {
    const menuExists = await FoodMenuModel.exists({
      _id: normalizeObjectId(input.menuId, "food menu id"),
      hostelId: resident.hostelId,
    });

    if (!menuExists) {
      throw new FoodServiceError("Food menu was not found.", "FOOD_MENU_NOT_FOUND", 404);
    }
  }

  const feedback = await FoodFeedbackModel.create({
    ...input,
    hostelId: resident.hostelId,
    residentId: resident._id,
  });

  await auditFoodAction(
    principal,
    resident.hostelId,
    feedback._id,
    "FoodFeedback",
    "FOOD_FEEDBACK_SUBMITTED",
  );

  return {
    feedback: serializeFoodFeedback(feedback as FoodFeedbackRecord),
    resident: serializeResidentSummary(resident),
  };
}
