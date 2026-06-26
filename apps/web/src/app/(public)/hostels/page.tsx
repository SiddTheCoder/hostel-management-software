import { Suspense } from "react";

import { PublicHostelListingPage } from "@/app/_components/public-hostel-listing-page";
import { HostelListingPageSkeleton } from "@/components/public-page-skeletons";

export default function HostelListingPage() {
  return (
    <Suspense fallback={<HostelListingPageSkeleton />}>
      <PublicHostelListingPage />
    </Suspense>
  );
}
