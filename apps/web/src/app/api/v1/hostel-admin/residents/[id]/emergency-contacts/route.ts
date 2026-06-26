import type { NextRequest } from "next/server";

import { handleRouteError, successResponse } from "@/lib/api-response";
import { requireHostelStaffPrincipal } from "@/lib/api-auth";
import { addEmergencyContact } from "@/modules/residents/resident.service";
import { emergencyContactCreateSchema } from "@/modules/residents/resident.validation";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const runtime = "nodejs";

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const principal = await requireHostelStaffPrincipal(request);
    const { id } = await context.params;
    const input = emergencyContactCreateSchema.parse(await request.json());
    const result = await addEmergencyContact(id, input, principal);

    return successResponse(result, "Emergency contact added", { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
