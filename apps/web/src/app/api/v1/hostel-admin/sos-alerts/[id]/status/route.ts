import type { NextRequest } from "next/server";

import { requireHostelStaffPrincipal } from "@/lib/api-auth";
import { handleRouteError, successResponse } from "@/lib/api-response";
import { updateSOSAlertStatus } from "@/modules/safety/safety.service";
import { sosStatusUpdateSchema } from "@/modules/safety/safety.validation";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const runtime = "nodejs";

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const principal = await requireHostelStaffPrincipal(request);
    const { id } = await context.params;
    const input = sosStatusUpdateSchema.parse(await request.json());
    const result = await updateSOSAlertStatus(id, input, principal);

    return successResponse(result, "SOS alert updated");
  } catch (error) {
    return handleRouteError(error);
  }
}
