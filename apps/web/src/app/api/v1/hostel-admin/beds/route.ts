import type { NextRequest } from "next/server";

import { handleRouteError, successResponse } from "@/lib/api-response";
import { requireHostelStaffPrincipal } from "@/lib/api-auth";
import { createHostelAdminBed } from "@/modules/hostels/hostel.service";
import { bedCreateSchema } from "@/modules/hostels/hostel.validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const principal = await requireHostelStaffPrincipal(request);
    const input = bedCreateSchema.parse(await request.json());
    const result = await createHostelAdminBed(input, principal);

    return successResponse(result, "Bed created", { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
