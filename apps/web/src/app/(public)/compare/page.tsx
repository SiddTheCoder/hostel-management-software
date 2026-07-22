import type { Metadata } from "next";

import { PublicComparePage } from "@/app/_components/public-compare-page";

export const metadata: Metadata = {
  title: "Compare Hostels",
  description:
    "Compare up to 3 hostels side by side — price, facilities, room types, ratings and location.",
  alternates: { canonical: "/compare" },
};

export default function ComparePage() {
  return <PublicComparePage />;
}
