import type { NextRequest } from "next/server";

import { requireHostelStaffPrincipal } from "@/lib/api-auth";
import { handleRouteError, successResponse } from "@/lib/api-response";
import { updateMaintenanceRequestStatus } from "@/modules/maintenance/maintenance.service";
import { maintenanceStatusUpdateSchema } from "@/modules/maintenance/maintenance.validation";

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
    const input = maintenanceStatusUpdateSchema.parse(await request.json());
    const result = await updateMaintenanceRequestStatus(id, input, principal);

    return successResponse(result, "Maintenance status updated");
  } catch (error) {
    return handleRouteError(error);
  }
}
