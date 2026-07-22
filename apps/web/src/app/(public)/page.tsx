import type { Metadata } from "next";

import { PublicHomePage } from "@/app/_components/public-home-page";

export const metadata: Metadata = {
  description:
    "Discover verified hostels across Nepal and manage your hostel end to end — rooms, residents, payments, food and safety.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <PublicHomePage />;
}
