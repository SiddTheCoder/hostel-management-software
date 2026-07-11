import { notFound } from "next/navigation";
import { FileText, Settings } from "lucide-react";

import { ResidentPaymentsPageContent } from "@/app/_components/resident-payments-page";
import { ResidentProfilePageContent } from "@/app/_components/resident-profile-page";
import { PortalPlaceholderPage } from "@/components/portal-placeholder-page";

type ResidentScreenPageProps = {
  params: Promise<{
    screen: string;
  }>;
};

export default async function ResidentScreenPage({ params }: ResidentScreenPageProps) {
  const { screen } = await params;

  if (screen === "room-bed") {
    return <ResidentProfilePageContent />;
  }

  if (screen === "payment-proof") {
    return <ResidentPaymentsPageContent />;
  }

  if (screen === "documents") {
    return (
      <PortalPlaceholderPage
        actions={[
          { href: "/resident/profile", label: "Open Profile" },
          { href: "/resident/payments", label: "Open Payments" },
        ]}
        description="Resident document references linked to profile and move-in records."
        icon={FileText}
        items={["Move-in documents", "Payment receipts", "Hostel rules", "ID references"]}
        title="Documents"
      />
    );
  }

  if (screen === "settings") {
    return (
      <PortalPlaceholderPage
        actions={[{ href: "/resident/profile", label: "Open Profile" }]}
        description="Resident account preferences and hostel contact details."
        icon={Settings}
        items={["Account email", "Emergency contacts", "Guardian visibility", "Alerts"]}
        title="Settings"
      />
    );
  }

  notFound();
}
