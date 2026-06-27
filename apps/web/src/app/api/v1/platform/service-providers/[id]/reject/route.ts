import type { NextRequest } from "next/server";

import { requirePlatformPrincipal } from "@/lib/api-auth";
import { handleRouteError, successResponse } from "@/lib/api-response";
import { rejectServiceProvider } from "@/modules/service-providers/service-provider.service";
import { serviceProviderRejectSchema } from "@/modules/service-providers/service-provider.validation";

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
    const input = serviceProviderRejectSchema.parse(await request.json());
    const result = await rejectServiceProvider(id, input, principal);

    return successResponse(result, "Service provider rejected");
  } catch (error) {
    return handleRouteError(error);
  }
}
