import type { NextRequest } from "next/server";

import { requirePlatformPrincipal } from "@/lib/api-auth";
import { handleRouteError, successResponse } from "@/lib/api-response";
import { getPlatformPaymentsOverview } from "@/modules/reports/report.service";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await requirePlatformPrincipal(request);
    const result = await getPlatformPaymentsOverview();

    return successResponse(result, "Platform payments loaded");
  } catch (error) {
    return handleRouteError(error);
  }
}
