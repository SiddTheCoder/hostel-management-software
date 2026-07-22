import { notFound } from "next/navigation";

import { PlatformHostelsPageContent } from "@/app/_components/platform-hostels-page";

type PlatformScreenPageProps = {
  params: Promise<{
    screen: string;
  }>;
};

export default async function PlatformScreenPage({ params }: PlatformScreenPageProps) {
  const { screen } = await params;

  // "Verification" is an alias of the hostel-approvals queue.
  if (screen === "verification") {
    return <PlatformHostelsPageContent />;
  }

  notFound();
}
