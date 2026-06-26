import type { NextRequest } from "next/server";

import { requireResidentPrincipal } from "@/lib/api-auth";
import { handleRouteError, successResponse } from "@/lib/api-response";
import { listResidentPayments } from "@/modules/payments/payment.service";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const principal = await requireResidentPrincipal(request);
    const result = await listResidentPayments(principal);

    return successResponse(result, "Resident payments loaded");
  } catch (error) {
    return handleRouteError(error);
  }
}
