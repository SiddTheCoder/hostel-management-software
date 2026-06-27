import type { NextRequest } from "next/server";

import { requirePlatformPrincipal } from "@/lib/api-auth";
import { handleRouteError, successResponse } from "@/lib/api-response";
import { hideServiceProvider } from "@/modules/service-providers/service-provider.service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const runtime = "nodejs";

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const principal = await requirePlatformPrincipal(request);
    const { id } = await context.params;
    const result = await hideServiceProvider(id, principal);

    return successResponse(result, "Service provider hidden");
  } catch (error) {
    return handleRouteError(error);
  }
}
