import { successResponse } from "@/lib/api-response";

export const runtime = "nodejs";

export function GET() {
  return successResponse(
    {
      service: "hostelhub-web",
      status: "ok",
    },
    "API is healthy",
  );
}
