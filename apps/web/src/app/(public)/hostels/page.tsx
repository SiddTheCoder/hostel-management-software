import { Suspense } from "react";

import { PublicHostelListingPage } from "@/components/desktop-ui";

export default function HostelListingPage() {
  return (
    <Suspense fallback={null}>
      <PublicHostelListingPage />
    </Suspense>
  );
}
