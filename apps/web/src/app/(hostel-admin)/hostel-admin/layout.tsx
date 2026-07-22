import { PortalShell } from "@/components/portal-shell";

const navItems = [
  {
    href: "/hostel-admin/dashboard",
    icon: "dashboard" as const,
    label: "Dashboard",
  },
  { href: "/hostel-admin/profile", icon: "building" as const, label: "Hostel Profile" },
  { href: "/hostel-admin/rooms", icon: "bed" as const, label: "Rooms & Beds" },
  { href: "/hostel-admin/residents", icon: "users" as const, label: "Residents" },
  { href: "/hostel-admin/wardens", icon: "shield" as const, label: "Wardens" },
  { href: "/hostel-admin/inquiries", icon: "clipboard" as const, label: "Inquiries" },
  { href: "/hostel-admin/payments", icon: "card" as const, label: "Payments" },
  { href: "/hostel-admin/food", icon: "food" as const, label: "Food" },
  { href: "/hostel-admin/notices", icon: "bell" as const, label: "Notices" },
  {
    href: "/hostel-admin/complaints",
    icon: "clipboard" as const,
    label: "Complaints",
  },
  { href: "/hostel-admin/night-status", icon: "moon" as const, label: "Night Status" },
  { href: "/hostel-admin/sos-alerts", icon: "siren" as const, label: "SOS Alerts" },
  {
    href: "/hostel-admin/move-in-out",
    icon: "receipt" as const,
    label: "Move-In/Move-Out",
  },
  {
    href: "/hostel-admin/service-providers",
    icon: "wrench" as const,
    label: "Service Providers",
  },
  { href: "/hostel-admin/maintenance", icon: "wrench" as const, label: "Maintenance" },
  { href: "/hostel-admin/referrals", icon: "message" as const, label: "Referrals" },
  { href: "/hostel-admin/reports", icon: "file" as const, label: "Reports" },
  { href: "/hostel-admin/settings", icon: "settings" as const, label: "Settings" },
];

export default function HostelAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PortalShell
      navItems={navItems}
      portalName="HostelHub"
      searchPlaceholder="Search residents, rooms, payments..."
      subtitle="Hostel Admin Portal"
      tone="admin"
      workspaceName="Hostel Workspace"
    >
      {children}
    </PortalShell>
  );
}
