import type { NextRequest } from "next/server";

import { requireResidentPrincipal } from "@/lib/api-auth";
import { handleRouteError, successResponse } from "@/lib/api-response";
import { markNoticeAsRead } from "@/modules/notices/notice.service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const runtime = "nodejs";

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const principal = await requireResidentPrincipal(request);
    const { id } = await context.params;
    const result = await markNoticeAsRead(id, principal);

    return successResponse(result, "Notice marked as read");
  } catch (error) {
    return handleRouteError(error);
  }
}
