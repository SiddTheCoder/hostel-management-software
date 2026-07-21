import type { NextRequest } from "next/server";

import { loadApiPrincipal } from "@/lib/api-auth";
import { handleRouteError, successResponse, errorResponse } from "@/lib/api-response";
import { optimizeImage } from "@/lib/image-optimizer";
import { FileAssetModel } from "@hostel/db/models/FileAsset";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    assetId: string;
  }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const principal = await loadApiPrincipal(request);

    if (!principal) {
      return errorResponse("Authentication required", "UNAUTHENTICATED", 401);
    }

    const { assetId } = await context.params;
    const fileAsset = await FileAssetModel.findOne({
      _id: assetId,
      isDeleted: false,
      status: "ACTIVE",
    });

    if (!fileAsset) {
      return errorResponse("File asset not found", "NOT_FOUND", 404);
    }

    if (
      fileAsset.ownerId?.toString() !== principal.userId &&
      principal.role !== "SUPERADMIN"
    ) {
      return errorResponse("Access denied", "FORBIDDEN", 403);
    }

    const variants = await optimizeImage(
      fileAsset.bucket,
      fileAsset.key,
      fileAsset.mimeType,
    );

    if (variants.length === 0) {
      return errorResponse(
        "File type does not support optimization",
        "NOT_OPTIMIZABLE",
        422,
      );
    }

    fileAsset.variants = variants;
    await fileAsset.save();

    return successResponse(
      {
        assetId: fileAsset._id.toString(),
        original: {
          key: fileAsset.key,
          mimeType: fileAsset.mimeType,
          sizeBytes: fileAsset.sizeBytes,
        },
        variants: variants.map((v) => ({
          variant: v.variant,
          width: v.width,
          height: v.height,
          sizeBytes: v.sizeBytes,
          mimeType: v.mimeType,
        })),
      },
      "Image optimized",
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
