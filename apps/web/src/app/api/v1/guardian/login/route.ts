import type { NextRequest } from "next/server";

import { handleRouteError, successResponse } from "@/lib/api-response";
import { loginGuardian } from "@/modules/guardian/guardian.service";
import { guardianLoginSchema } from "@/modules/guardian/guardian.validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const input = guardianLoginSchema.parse(await request.json());
    const result = await loginGuardian(input);

    return successResponse(result, "Guardian login successful");
  } catch (error) {
    return handleRouteError(error);
  }
}
