import type { NextRequest } from "next/server";

import { requireApiPrincipal } from "@/lib/api-auth";
import { handleRouteError, successResponse } from "@/lib/api-response";
import { saveDeviceToken } from "@/modules/notifications/notification.service";
import { deviceTokenSaveSchema } from "@/modules/notifications/notification.validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const principal = await requireApiPrincipal(request);
    const input = deviceTokenSaveSchema.parse(await request.json());
    const result = await saveDeviceToken(input, principal);

    return successResponse(result, "Device token saved", { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
