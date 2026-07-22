import type { Metadata } from "next";
import { Suspense } from "react";

import { PublicHostelListingPage } from "@/app/_components/public-hostel-listing-page";
import { HostelListingPageSkeleton } from "@/components/public-page-skeletons";

export const metadata: Metadata = {
  title: "Browse Hostels",
  description:
    "Search verified hostels across Nepal. Filter by city, gender, price, room type, facilities and proximity to your college.",
  alternates: { canonical: "/hostels" },
};

export default function HostelListingPage() {
  return (
    <Suspense fallback={<HostelListingPageSkeleton />}>
      <PublicHostelListingPage />
    </Suspense>
  );
}
