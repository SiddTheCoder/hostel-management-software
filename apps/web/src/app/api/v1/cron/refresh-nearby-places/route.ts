import type { NextRequest } from "next/server";

import { errorResponse, handleRouteError, successResponse } from "@/lib/api-response";
import { validateCronRequest } from "@/lib/cron-auth";
import { refreshStaleNearbyPlaces } from "@/modules/hostels/hostel-geo.service";

export const runtime = "nodejs";
// Geocoding + Overpass are external I/O with a 1s/req politeness delay.
export const maxDuration = 60;

/**
 * Cron: refresh stale/missing nearby-places caches on published hostels
 * (ARCHITECTURE.md §4.5). Idempotent; processes a small batch per run to stay
 * within the function timeout and the Nominatim rate limit.
 *
 * Auth: `x-cron-secret` (or `Authorization: Bearer <CRON_SECRET>`) header only.
 * Scheduled via cron-job.org with a POST request — see `docs/CRON.md`.
 */
export async function POST(request: NextRequest) {
  try {
    const auth = validateCronRequest(request);

    if (!auth.ok) {
      return errorResponse(
        auth.error,
        auth.status === 401 ? "UNAUTHORIZED" : "CRON_NOT_CONFIGURED",
        auth.status,
      );
    }

    const result = await refreshStaleNearbyPlaces({ limit: 5 });

    return successResponse(result, "Nearby places refreshed");
  } catch (error) {
    return handleRouteError(error);
  }
}
