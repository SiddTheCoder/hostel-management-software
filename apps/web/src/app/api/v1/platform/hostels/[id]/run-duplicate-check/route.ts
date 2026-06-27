import type { NextRequest } from "next/server";

import { requirePlatformPrincipal } from "@/lib/api-auth";
import { handleRouteError, successResponse } from "@/lib/api-response";
import { runDuplicateCheck } from "@/modules/listing-flags/listing-flag.service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const runtime = "nodejs";

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const principal = await requirePlatformPrincipal(request);
    const { id } = await context.params;
    const result = await runDuplicateCheck(id, principal);

    return successResponse(result, "Duplicate check completed");
  } catch (error) {
    return handleRouteError(error);
  }
}
