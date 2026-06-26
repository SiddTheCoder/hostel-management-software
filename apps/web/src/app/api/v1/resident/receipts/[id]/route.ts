import type { NextRequest } from "next/server";

import { requireResidentPrincipal } from "@/lib/api-auth";
import { handleRouteError, successResponse } from "@/lib/api-response";
import { getResidentReceipt } from "@/modules/payments/payment.service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const runtime = "nodejs";

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const principal = await requireResidentPrincipal(request);
    const { id } = await context.params;
    const result = await getResidentReceipt(id, principal);

    return successResponse(result, "Receipt loaded");
  } catch (error) {
    return handleRouteError(error);
  }
}
