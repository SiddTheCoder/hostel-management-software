import type { NextRequest } from "next/server";

import { requireApiPrincipal } from "@/lib/api-auth";
import { handleRouteError, successResponse } from "@/lib/api-response";
import { listNotifications } from "@/modules/notifications/notification.service";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const principal = await requireApiPrincipal(request);
    const result = await listNotifications(principal);

    return successResponse(result, "Notifications loaded");
  } catch (error) {
    return handleRouteError(error);
  }
}
