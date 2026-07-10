import { notFound } from "next/navigation";
import { Settings } from "lucide-react";

import { PortalPlaceholderPage } from "@/components/portal-placeholder-page";

type HostelAdminScreenPageProps = {
  params: Promise<{
    screen: string;
  }>;
};

export default async function HostelAdminScreenPage({
  params,
}: HostelAdminScreenPageProps) {
  const { screen } = await params;

  if (screen === "settings") {
    return (
      <PortalPlaceholderPage
        actions={[
          { href: "/hostel-admin/profile", label: "Open Hostel Profile" },
          { href: "/hostel-admin/residents", label: "Manage Residents" },
        ]}
        description="Hostel workspace controls for profile, resident access, and daily operations."
        icon={Settings}
        items={[
          "Hostel profile",
          "Resident activation",
          "Notice defaults",
          "Staff access",
        ]}
        title="Settings"
      />
    );
  }

  notFound();
}
