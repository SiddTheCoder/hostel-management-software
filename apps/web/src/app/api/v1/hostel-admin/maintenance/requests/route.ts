import type { NextRequest } from "next/server";

import { requireHostelStaffPrincipal } from "@/lib/api-auth";
import { handleRouteError, successResponse } from "@/lib/api-response";
import {
  createMaintenanceRequest,
  listMaintenanceRequests,
} from "@/modules/maintenance/maintenance.service";
import {
  maintenanceRequestCreateSchema,
  maintenanceRequestListQuerySchema,
} from "@/modules/maintenance/maintenance.validation";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const principal = await requireHostelStaffPrincipal(request);
    const query = maintenanceRequestListQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams.entries()),
    );
    const result = await listMaintenanceRequests(query, principal);

    return successResponse(result, "Maintenance requests loaded");
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const principal = await requireHostelStaffPrincipal(request);
    const input = maintenanceRequestCreateSchema.parse(await request.json());
    const result = await createMaintenanceRequest(input, principal);

    return successResponse(result, "Maintenance request created", { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
