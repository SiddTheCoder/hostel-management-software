import type { NextRequest } from "next/server";

import { requirePlatformPrincipal } from "@/lib/api-auth";
import { handleRouteError, successResponse } from "@/lib/api-response";
import { getSiteConfig } from "@/modules/platform-config/site-config.service";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await requirePlatformPrincipal(request);
    const config = await getSiteConfig();

    return successResponse({ config }, "Site configuration loaded");
  } catch (error) {
    return handleRouteError(error);
  }
}
