import type { NextRequest } from "next/server";

import { errorResponse } from "@/lib/api-response";

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

type PublicFormRateLimitOptions = {
  limit?: number;
  namespace: string;
  windowMs?: number;
};

const buckets = new Map<string, RateLimitBucket>();

function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function publicFormLimit() {
  return positiveInteger(
    process.env.PUBLIC_FORM_RATE_LIMIT_MAX,
    process.env.NODE_ENV === "test" ? 1000 : 10,
  );
}

function publicFormWindowMs() {
  return positiveInteger(process.env.PUBLIC_FORM_RATE_LIMIT_WINDOW_SECONDS, 60) * 1000;
}

function clientKey(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const userAgent = request.headers.get("user-agent")?.trim() ?? "unknown-agent";

  return `${forwardedFor || realIp || "unknown-ip"}:${userAgent}`;
}

export function rateLimitPublicForm(
  request: NextRequest,
  {
    limit = publicFormLimit(),
    namespace,
    windowMs = publicFormWindowMs(),
  }: PublicFormRateLimitOptions,
) {
  const now = Date.now();
  const key = `${namespace}:${clientKey(request)}`;
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  existing.count += 1;

  if (existing.count <= limit) {
    return null;
  }

  const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));

  return errorResponse(
    "Too many requests. Please wait before submitting again.",
    "RATE_LIMITED",
    429,
    { retryAfterSeconds },
  );
}

export function resetPublicFormRateLimitForTests() {
  buckets.clear();
}
