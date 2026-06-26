import { Suspense } from "react";

import { PublicInquiryPage } from "@/app/_components/public-inquiry-page";
import { InquiryPageSkeleton } from "@/components/public-page-skeletons";

export default function InquiryPage() {
  return (
    <Suspense fallback={<InquiryPageSkeleton />}>
      <PublicInquiryPage />
    </Suspense>
  );
}
