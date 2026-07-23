import type { NextRequest } from "next/server";

import { requireSuperadminPrincipal } from "@/lib/api-auth";
import { handleRouteError, successResponse } from "@/lib/api-response";
import {
  revokePlatformAdmin,
  updatePlatformAdminRole,
} from "@/modules/users/platform-admin.service";
import { platformAdminRoleUpdateSchema } from "@/modules/users/platform-admin.validation";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const runtime = "nodejs";

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const principal = await requireSuperadminPrincipal(request);
    const { id } = await context.params;
    const input = platformAdminRoleUpdateSchema.parse(await request.json());
    const result = await updatePlatformAdminRole(id, input.role, principal);

    return successResponse(result, "Platform admin updated");
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const principal = await requireSuperadminPrincipal(request);
    const { id } = await context.params;
    const result = await revokePlatformAdmin(id, principal);

    return successResponse(result, "Platform access revoked");
  } catch (error) {
    return handleRouteError(error);
  }
}
