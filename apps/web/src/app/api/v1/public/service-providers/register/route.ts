import type { NextRequest } from "next/server";

import { handleRouteError, successResponse } from "@/lib/api-response";
import { rateLimitPublicForm } from "@/lib/rate-limit";
import { registerPublicServiceProvider } from "@/modules/service-providers/service-provider.service";
import { serviceProviderRegisterSchema } from "@/modules/service-providers/service-provider.validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const rateLimited = rateLimitPublicForm(request, {
      namespace: "public-service-provider-registration",
    });

    if (rateLimited) {
      return rateLimited;
    }

    const input = serviceProviderRegisterSchema.parse(await request.json());
    const result = await registerPublicServiceProvider(input);

    return successResponse(result, "Service provider registration submitted", {
      status: 201,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
