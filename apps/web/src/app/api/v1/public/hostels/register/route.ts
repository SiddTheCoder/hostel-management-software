import type { NextRequest } from "next/server";

import { handleRouteError, successResponse } from "@/lib/api-response";
import { rateLimitPublicForm } from "@/lib/rate-limit";
import { registerPublicHostelApplication } from "@/modules/hostels/hostel.service";
import { publicHostelApplicationCreateSchema } from "@/modules/hostels/hostel.validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const rateLimited = rateLimitPublicForm(request, {
      namespace: "public-hostel-registration",
    });

    if (rateLimited) {
      return rateLimited;
    }

    const input = publicHostelApplicationCreateSchema.parse(await request.json());
    const result = await registerPublicHostelApplication(input);

    return successResponse(result, "Hostel registration submitted", { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
