import type { NextRequest } from "next/server";

import { loadApiPrincipal } from "@/lib/api-auth";
import { handleRouteError, successResponse, errorResponse } from "@/lib/api-response";
import { validateFileAssetMetadata } from "@/lib/file-assets";
import { FileAssetModel } from "@hostel/db/models/FileAsset";
import { getPresignedUploadUrl, generateFileKey } from "@/lib/r2";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const principal = await loadApiPrincipal(request);

    if (!principal) {
      return errorResponse("Authentication required", "UNAUTHENTICATED", 401);
    }

    const body = (await request.json()) as {
      accessLevel?: "PUBLIC" | "PRIVATE" | "PROTECTED";
      fileName?: string;
      mimeType?: string;
      sizeBytes?: number;
    };

    const { fileName, mimeType, sizeBytes, accessLevel } = body;

    if (!fileName || !mimeType || !sizeBytes) {
      return errorResponse(
        "fileName, mimeType, and sizeBytes are required",
        "VALIDATION_ERROR",
        422,
      );
    }

    const validation = validateFileAssetMetadata({ mimeType, sizeBytes });

    if (validation) {
      return errorResponse(validation, "FILE_TYPE_NOT_ALLOWED", 422);
    }

    const bucket = process.env.R2_BUCKET_NAME ?? "hostelhub-uploads";
    const key = generateFileKey("uploads", fileName);
    const fileAsset = await FileAssetModel.create({
      storageProvider: "CLOUDFLARE_R2",
      bucket,
      key,
      fileName,
      mimeType,
      sizeBytes,
      accessLevel: accessLevel ?? "PRIVATE",
      status: "ACTIVE",
      createdBy: principal.userId,
      ownerId: principal.userId,
    });

    const presignedUrl = await getPresignedUploadUrl(key, mimeType, sizeBytes);

    return successResponse(
      {
        assetId: fileAsset._id.toString(),
        key,
        presignedUrl,
      },
      "Presigned URL generated",
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
