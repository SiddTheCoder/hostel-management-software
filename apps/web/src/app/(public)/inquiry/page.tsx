import { Suspense } from "react";

import { PublicInquiryPage } from "@/components/desktop-ui";

export default function InquiryPage() {
  return (
    <Suspense fallback={null}>
      <PublicInquiryPage />
    </Suspense>
  );
}
