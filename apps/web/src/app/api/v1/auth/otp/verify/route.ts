import type { NextRequest } from "next/server";

import { errorResponse, handleRouteError, successResponse } from "@/lib/api-response";
import { AuthServiceError, verifyOtpChallenge } from "@/modules/auth/auth.service";
import { otpVerifySchema } from "@/modules/auth/auth.validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const input = otpVerifySchema.parse(await request.json());
    const result = await verifyOtpChallenge(input);

    return successResponse(result, "OTP verified");
  } catch (error) {
    if (error instanceof AuthServiceError) {
      return errorResponse(error.message, error.errorCode, error.status);
    }

    return handleRouteError(error);
  }
}
