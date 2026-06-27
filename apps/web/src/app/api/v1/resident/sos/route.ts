import type { NextRequest } from "next/server";

import { requireResidentPrincipal } from "@/lib/api-auth";
import { handleRouteError, successResponse } from "@/lib/api-response";
import { triggerSOS } from "@/modules/safety/safety.service";
import { sosCreateSchema } from "@/modules/safety/safety.validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const principal = await requireResidentPrincipal(request);
    const input = sosCreateSchema.parse(await request.json());
    const result = await triggerSOS(input, principal);

    return successResponse(result, "SOS alert triggered", { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
