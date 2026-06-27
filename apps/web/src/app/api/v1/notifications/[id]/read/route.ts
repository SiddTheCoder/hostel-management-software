import type { NextRequest } from "next/server";

import { requireApiPrincipal } from "@/lib/api-auth";
import { handleRouteError, successResponse } from "@/lib/api-response";
import { markNotificationRead } from "@/modules/notifications/notification.service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const runtime = "nodejs";

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const principal = await requireApiPrincipal(request);
    const { id } = await context.params;
    const result = await markNotificationRead(id, principal);

    return successResponse(result, "Notification marked read");
  } catch (error) {
    return handleRouteError(error);
  }
}
