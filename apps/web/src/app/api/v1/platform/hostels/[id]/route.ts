import type { NextRequest } from "next/server";

import { handleRouteError, successResponse } from "@/lib/api-response";
import { requirePlatformPrincipal } from "@/lib/api-auth";
import { getPlatformHostel } from "@/modules/hostels/hostel.service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const runtime = "nodejs";

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await requirePlatformPrincipal(request);

    const { id } = await context.params;
    const result = await getPlatformHostel(id);

    return successResponse(result, "Hostel application loaded");
  } catch (error) {
    return handleRouteError(error);
  }
}
