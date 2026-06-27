import type { NextRequest } from "next/server";

import { requireResidentPrincipal } from "@/lib/api-auth";
import { handleRouteError, successResponse } from "@/lib/api-response";
import { confirmComplaintResolution } from "@/modules/complaints/complaint.service";
import { complaintResolutionConfirmSchema } from "@/modules/complaints/complaint.validation";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const runtime = "nodejs";

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const principal = await requireResidentPrincipal(request);
    const { id } = await context.params;
    const input = complaintResolutionConfirmSchema.parse(await request.json());
    const result = await confirmComplaintResolution(id, input, principal);

    return successResponse(result, "Complaint resolution confirmed");
  } catch (error) {
    return handleRouteError(error);
  }
}
