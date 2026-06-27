import type { NextRequest } from "next/server";

import { handleRouteError, successResponse } from "@/lib/api-response";
import { rateLimitPublicForm } from "@/lib/rate-limit";
import { createReferredInquiry } from "@/modules/referrals/referral.service";
import { referredInquiryCreateSchema } from "@/modules/referrals/referral.validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const rateLimited = rateLimitPublicForm(request, {
      namespace: "public-referral-inquiry",
    });

    if (rateLimited) {
      return rateLimited;
    }

    const input = referredInquiryCreateSchema.parse(await request.json());
    const result = await createReferredInquiry(input);

    return successResponse(result, "Referral inquiry submitted", { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
