import type { NextRequest } from "next/server";

import { handleRouteError, successResponse } from "@/lib/api-response";
import { listPublicHostelReviews } from "@/modules/reviews/review.service";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export const runtime = "nodejs";

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { slug: hostelId } = await context.params;
    const result = await listPublicHostelReviews(hostelId);

    return successResponse(result, "Reviews loaded");
  } catch (error) {
    return handleRouteError(error);
  }
}
