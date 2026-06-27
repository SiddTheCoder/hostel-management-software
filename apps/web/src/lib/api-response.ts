import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { logger } from "@/lib/logger";

export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiError = {
  success: false;
  message: string;
  errorCode: string;
  details?: unknown;
};

export function successResponse<T>(
  data: T,
  message = "Request successful",
  init?: ResponseInit,
) {
  return NextResponse.json<ApiSuccess<T>>(
    {
      success: true,
      message,
      data,
    },
    init,
  );
}

export function errorResponse(
  message: string,
  errorCode = "BAD_REQUEST",
  status = 400,
  details?: unknown,
) {
  return NextResponse.json<ApiError>(
    {
      success: false,
      message,
      errorCode,
      ...(details ? { details } : {}),
    },
    { status },
  );
}

export function handleRouteError(error: unknown) {
  if (error instanceof ZodError) {
    return errorResponse("Validation failed", "VALIDATION_ERROR", 422, error.flatten());
  }

  if (
    error instanceof Error &&
    "status" in error &&
    typeof error.status === "number" &&
    "errorCode" in error &&
    typeof error.errorCode === "string"
  ) {
    return errorResponse(error.message, error.errorCode, error.status);
  }

  logger.error("Unhandled API route error", { error });
  return errorResponse("Internal server error", "INTERNAL_SERVER_ERROR", 500);
}
