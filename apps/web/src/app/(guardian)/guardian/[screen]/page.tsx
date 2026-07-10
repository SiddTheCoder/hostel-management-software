import { notFound } from "next/navigation";
import { CircleHelp, MessageSquare } from "lucide-react";

import { PortalPlaceholderPage } from "@/components/portal-placeholder-page";

type GuardianScreenPageProps = {
  params: Promise<{
    screen: string;
  }>;
};

export default async function GuardianScreenPage({ params }: GuardianScreenPageProps) {
  const { screen } = await params;

  if (screen === "messages") {
    return (
      <PortalPlaceholderPage
        actions={[
          { href: "/guardian/notices", label: "Open Notices" },
          { href: "/guardian/emergency-contact", label: "Emergency Contact" },
        ]}
        description="Guardian communication summary for hostel notices and urgent contact paths."
        icon={MessageSquare}
        items={[
          "Hostel notices",
          "Emergency contact",
          "Payment updates",
          "Safety updates",
        ]}
        title="Messages"
      />
    );
  }

  if (screen === "help") {
    return (
      <PortalPlaceholderPage
        actions={[{ href: "/guardian/emergency-contact", label: "Emergency Contact" }]}
        description="Guardian support entry point for fee, safety, food, and hostel contact questions."
        icon={CircleHelp}
        items={["Fee summary", "Safety summary", "Food view", "Hostel contact"]}
        title="Help & Support"
      />
    );
  }

  notFound();
}
