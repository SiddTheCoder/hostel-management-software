import { NextResponse, type NextRequest } from "next/server";

import { loadApiPrincipal } from "@/lib/api-auth";
import { handleRouteError, errorResponse } from "@/lib/api-response";
import { getPresignedReadUrl } from "@/lib/r2";
import { FileAssetModel } from "@hostel/db/models/FileAsset";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    assetId: string;
  }>;
};

const VALID_VARIANTS = new Set(["ORIGINAL", "THUMBNAIL", "MEDIUM", "LARGE"]);

function resolveVariantKey(
  fileAsset: {
    key: string;
    variants?: Array<{ key: string; variant: string }>;
  },
  variant: string,
) {
  if (variant === "ORIGINAL") {
    return fileAsset.key;
  }

  const match = fileAsset.variants?.find((v) => v.variant === variant);
  return match?.key ?? fileAsset.key;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { assetId } = await context.params;
    const { searchParams } = new URL(request.url);
    const rawVariant = searchParams.get("variant") ?? "ORIGINAL";
    const variant = rawVariant.toUpperCase();

    if (!VALID_VARIANTS.has(variant)) {
      return errorResponse(
        `Invalid variant. Must be one of: ${[...VALID_VARIANTS].join(", ")}`,
        "INVALID_VARIANT",
        422,
      );
    }

    const fileAsset = await FileAssetModel.findOne({
      _id: assetId,
      isDeleted: false,
      status: "ACTIVE",
    });

    if (!fileAsset) {
      return errorResponse("File asset not found", "NOT_FOUND", 404);
    }

    let targetUrl: string | null = null;

    if (fileAsset.accessLevel === "PUBLIC") {
      const resolvedKey = resolveVariantKey(fileAsset, variant);
      const publicBase = process.env.R2_PUBLIC_URL;

      if (publicBase) {
        targetUrl = `${publicBase}/${resolvedKey}`;
      }
    }

    if (!targetUrl) {
      const principal = await loadApiPrincipal(request);

      if (!principal) {
        return errorResponse(
          "Authentication required for private assets",
          "UNAUTHENTICATED",
          401,
        );
      }

      if (
        fileAsset.ownerId?.toString() !== principal.userId &&
        fileAsset.hostelId &&
        !principal.hostelIds.includes(fileAsset.hostelId.toString()) &&
        principal.role !== "SUPERADMIN"
      ) {
        return errorResponse("Access denied", "FORBIDDEN", 403);
      }

      const resolvedKey = resolveVariantKey(fileAsset, variant);
      targetUrl = await getPresignedReadUrl(resolvedKey);
    }

    return NextResponse.redirect(targetUrl, 302);
  } catch (error) {
    return handleRouteError(error);
  }
}
