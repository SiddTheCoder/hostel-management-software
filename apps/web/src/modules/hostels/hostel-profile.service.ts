import { connectToDatabase } from "@/lib/db";
import { HostelModel } from "@hostel/db/models/Hostel";
import type {
  hostelAdminProfileQuerySchema,
  hostelAdminProfileUpdateSchema,
  hostelPhotoCreateSchema,
  hostelPhotoDeleteQuerySchema,
} from "@/modules/hostels/hostel.validation";
import {
  findScopedHostel,
  HostelServiceError,
  normalizeObjectId,
  serializeHostel,
  auditHostelAction,
  definedUpdate,
  type HostelRecord,
} from "@/modules/hostels/hostel.service";
import type { ApiPrincipal } from "@/lib/api-auth";
import type { z } from "zod";

type HostelAdminProfileQuery = z.infer<typeof hostelAdminProfileQuerySchema>;
type HostelAdminProfileUpdateInput = z.infer<typeof hostelAdminProfileUpdateSchema>;
type HostelPhotoCreateInput = z.infer<typeof hostelPhotoCreateSchema>;
type HostelPhotoDeleteQuery = z.infer<typeof hostelPhotoDeleteQuerySchema>;

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
