import type { NextRequest } from "next/server";

import { requireResidentPrincipal } from "@/lib/api-auth";
import { handleRouteError, successResponse } from "@/lib/api-response";
import { createResidentReview } from "@/modules/reviews/review.service";
import { reviewCreateSchema } from "@/modules/reviews/review.validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const principal = await requireResidentPrincipal(request);
    const input = reviewCreateSchema.parse(await request.json());
    const result = await createResidentReview(input, principal);

    return successResponse(result, "Review submitted", { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
