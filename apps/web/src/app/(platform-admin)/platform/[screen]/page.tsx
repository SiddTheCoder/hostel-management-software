import { notFound } from "next/navigation";
import { CreditCard, Settings } from "lucide-react";

import { PlatformHostelsPageContent } from "@/app/_components/platform-hostels-page";
import { PortalPlaceholderPage } from "@/components/portal-placeholder-page";

type PlatformScreenPageProps = {
  params: Promise<{
    screen: string;
  }>;
};

export default async function PlatformScreenPage({ params }: PlatformScreenPageProps) {
  const { screen } = await params;

  if (screen === "verification") {
    return <PlatformHostelsPageContent />;
  }

  if (screen === "payments") {
    return (
      <PortalPlaceholderPage
        actions={[
          { href: "/platform/reports", label: "Open Reports" },
          { href: "/platform/dashboard", label: "Back to Dashboard" },
        ]}
        description="Platform payment controls are grouped with reporting while billing APIs are finalized."
        icon={CreditCard}
        items={["Payment status", "Hostel billing", "Settlement notes", "Export queue"]}
        title="Payments"
      />
    );
  }

  if (screen === "settings") {
    return (
      <PortalPlaceholderPage
        actions={[{ href: "/platform/users", label: "Manage Users" }]}
        description="Platform account and access controls for the owner workspace."
        icon={Settings}
        items={["Owner account", "Role access", "Notification defaults", "Audit basics"]}
        title="Settings"
      />
    );
  }

  notFound();
}
