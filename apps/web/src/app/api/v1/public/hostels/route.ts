import type { NextRequest } from "next/server";

import { handleRouteError, successResponse } from "@/lib/api-response";
import { listPublicHostels } from "@/modules/hostels/hostel.service";
import { publicHostelListQuerySchema } from "@/modules/hostels/hostel.validation";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const query = publicHostelListQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams.entries()),
    );
    const result = await listPublicHostels(query);

    return successResponse(result, "Public hostels loaded");
  } catch (error) {
    return handleRouteError(error);
  }
}
