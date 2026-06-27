import type { NextRequest } from "next/server";

import { requirePlatformPrincipal } from "@/lib/api-auth";
import { handleRouteError, successResponse } from "@/lib/api-response";
import { listPlatformReviews } from "@/modules/reviews/review.service";
import { platformReviewListQuerySchema } from "@/modules/reviews/review.validation";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await requirePlatformPrincipal(request);
    const query = platformReviewListQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams.entries()),
    );
    const result = await listPlatformReviews(query);

    return successResponse(result, "Reviews loaded");
  } catch (error) {
    return handleRouteError(error);
  }
}
