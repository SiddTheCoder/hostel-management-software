import type { NextRequest } from "next/server";

import { requirePlatformPrincipal } from "@/lib/api-auth";
import { handleRouteError, successResponse } from "@/lib/api-response";
import { hideReview } from "@/modules/reviews/review.service";
import { reviewModerationSchema } from "@/modules/reviews/review.validation";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const runtime = "nodejs";

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const principal = await requirePlatformPrincipal(request);
    const { id } = await context.params;
    const input = reviewModerationSchema.parse(await request.json());
    const result = await hideReview(id, input, principal);

    return successResponse(result, "Review hidden");
  } catch (error) {
    return handleRouteError(error);
  }
}
