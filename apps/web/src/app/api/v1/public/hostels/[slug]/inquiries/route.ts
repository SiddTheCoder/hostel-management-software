import type { NextRequest } from "next/server";

import { handleRouteError, successResponse } from "@/lib/api-response";
import { rateLimitPublicForm } from "@/lib/rate-limit";
import { createPublicHostelInquiry } from "@/modules/hostels/hostel.service";
import { publicInquiryCreateSchema } from "@/modules/hostels/hostel.validation";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export const runtime = "nodejs";

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const rateLimited = rateLimitPublicForm(request, {
      namespace: "public-hostel-inquiry",
    });

    if (rateLimited) {
      return rateLimited;
    }

    const { slug: hostelId } = await context.params;
    const input = publicInquiryCreateSchema.parse(await request.json());
    const result = await createPublicHostelInquiry(hostelId, input);

    return successResponse(result, "Inquiry submitted", { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
