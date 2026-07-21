import type { NextRequest } from "next/server";

import { validateCronRequest } from "@/lib/cron-auth";
import { errorResponse, handleRouteError, successResponse } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/db";
import { OtpChallengeModel } from "@hostel/db/models/OtpChallenge";

export const runtime = "nodejs";

/**
 * Cron: purge expired OTP challenges.
 *
 * The `OtpChallenge` TTL index already expires these, but MongoDB's TTL monitor
 * runs on its own (~60s) schedule and can lag under load. This endpoint is an
 * explicit, idempotent backup sweep — the same "cron is primary, with fallbacks"
 * posture used across the platform's maintenance jobs.
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

    await connectToDatabase();

    const result = await OtpChallengeModel.deleteMany({
      expiresAt: { $lt: new Date() },
    });

    return successResponse(
      { deleted: result.deletedCount ?? 0 },
      "Expired OTP challenges purged",
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
