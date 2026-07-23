import { handleRouteError, successResponse } from "@/lib/api-response";
import { getPublicSiteConfig } from "@/modules/platform-config/site-config.service";

export const runtime = "nodejs";

/**
 * Read-only projection of the platform owner's website configuration. Revalidated
 * rather than fully static so an admin save shows up without a redeploy.
 */
export const revalidate = 60;

export async function GET() {
  try {
    const config = await getPublicSiteConfig();

    return successResponse({ config }, "Site configuration loaded");
  } catch (error) {
    return handleRouteError(error);
  }
}
