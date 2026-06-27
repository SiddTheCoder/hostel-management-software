import type { NextRequest } from "next/server";

import { requirePlatformPrincipal } from "@/lib/api-auth";
import { handleRouteError, successResponse } from "@/lib/api-response";
import { getPlatformDashboardReport } from "@/modules/reports/report.service";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await requirePlatformPrincipal(request);
    const result = await getPlatformDashboardReport();

    return successResponse(result, "Platform report loaded");
  } catch (error) {
    return handleRouteError(error);
  }
}
