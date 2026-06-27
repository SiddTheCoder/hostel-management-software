import type { NextRequest } from "next/server";

import { requireHostelStaffPrincipal } from "@/lib/api-auth";
import { handleRouteError, successResponse } from "@/lib/api-response";
import { confirmReferralJoined } from "@/modules/referrals/referral.service";
import { referralConfirmSchema } from "@/modules/referrals/referral.validation";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const runtime = "nodejs";

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const principal = await requireHostelStaffPrincipal(request);
    const { id } = await context.params;
    const input = referralConfirmSchema.parse(await request.json());
    const result = await confirmReferralJoined(id, input, principal);

    return successResponse(result, "Referral confirmed");
  } catch (error) {
    return handleRouteError(error);
  }
}
