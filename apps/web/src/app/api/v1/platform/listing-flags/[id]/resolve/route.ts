import type { NextRequest } from "next/server";

import { requirePlatformPrincipal } from "@/lib/api-auth";
import { handleRouteError, successResponse } from "@/lib/api-response";
import { resolveListingFlag } from "@/modules/listing-flags/listing-flag.service";
import { listingFlagResolveSchema } from "@/modules/listing-flags/listing-flag.validation";

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
    const input = listingFlagResolveSchema.parse(await request.json());
    const result = await resolveListingFlag(id, input, principal);

    return successResponse(result, "Listing flag resolved");
  } catch (error) {
    return handleRouteError(error);
  }
}
