import type { NextRequest } from "next/server";

import { requireResidentPrincipal } from "@/lib/api-auth";
import { handleRouteError, successResponse } from "@/lib/api-response";
import { submitPaymentProof } from "@/modules/payments/payment.service";
import { paymentProofSubmitSchema } from "@/modules/payments/payment.validation";

type RouteContext = {
  params: Promise<{
    paymentId: string;
  }>;
};

export const runtime = "nodejs";

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const principal = await requireResidentPrincipal(request);
    const { paymentId } = await context.params;
    const input = paymentProofSubmitSchema.parse(await request.json());
    const result = await submitPaymentProof(paymentId, input, principal);

    return successResponse(result, "Payment proof submitted", { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
