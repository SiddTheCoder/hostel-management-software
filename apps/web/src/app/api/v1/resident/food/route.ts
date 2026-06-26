import type { NextRequest } from "next/server";

import { requireResidentPrincipal } from "@/lib/api-auth";
import { handleRouteError, successResponse } from "@/lib/api-response";
import { listFoodForResident } from "@/modules/food/food.service";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const principal = await requireResidentPrincipal(request);
    const result = await listFoodForResident(principal);

    return successResponse(result, "Resident food loaded");
  } catch (error) {
    return handleRouteError(error);
  }
}
