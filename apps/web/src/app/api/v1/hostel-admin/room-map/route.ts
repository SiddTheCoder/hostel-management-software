import type { NextRequest } from "next/server";

import { handleRouteError, successResponse } from "@/lib/api-response";
import { requireHostelStaffPrincipal } from "@/lib/api-auth";
import { getHostelAdminRoomMap } from "@/modules/hostels/hostel-spatial.service";
import { hostelScopedListQuerySchema } from "@/modules/hostels/hostel.validation";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const principal = await requireHostelStaffPrincipal(request);
    const query = hostelScopedListQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams.entries()),
    );
    const result = await getHostelAdminRoomMap(query, principal);

    return successResponse(result, "Room map loaded");
  } catch (error) {
    return handleRouteError(error);
  }
}
