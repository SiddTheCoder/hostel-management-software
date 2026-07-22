import type { NextRequest } from "next/server";

import { handleRouteError, successResponse } from "@/lib/api-response";
import { requirePlatformPrincipal } from "@/lib/api-auth";
import { requestPlatformHostelDocuments } from "@/modules/hostels/hostel.service";
import { hostelRequestDocumentsSchema } from "@/modules/hostels/hostel.validation";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const runtime = "nodejs";

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const principal = await requirePlatformPrincipal(request);
    const { id } = await context.params;
    const input = hostelRequestDocumentsSchema.parse(await request.json());
    const result = await requestPlatformHostelDocuments(id, input, principal);

    return successResponse(result, "Documents requested from owner");
  } catch (error) {
    return handleRouteError(error);
  }
}
