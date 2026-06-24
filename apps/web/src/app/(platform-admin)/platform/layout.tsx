import { PortalShell } from "@/components/portal-shell";

const navItems = [
  { href: "/platform/dashboard", icon: "dashboard" as const, label: "Dashboard" },
  { href: "/platform/hostels", icon: "building" as const, label: "Hostel Approvals" },
  { href: "/platform/verification", icon: "shield" as const, label: "Verification" },
  { href: "/platform/users", icon: "users" as const, label: "Users" },
  {
    href: "/platform/service-providers",
    icon: "wrench" as const,
    label: "Service Providers",
  },
  { href: "/platform/payments", icon: "card" as const, label: "Payments" },
  { href: "/platform/reports", icon: "file" as const, label: "Reports" },
  { href: "/platform/reviews", icon: "star" as const, label: "Reviews" },
  { href: "/platform/abuse-flags", icon: "flag" as const, label: "Abuse Flags" },
  { href: "/platform/settings", icon: "settings" as const, label: "Settings" },
];

export default function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PortalShell
      navItems={navItems}
      portalName="HostelHub"
      searchPlaceholder="Search hostels, residents..."
      subtitle="Platform Owner Portal"
      tone="platform"
    >
      {children}
    </PortalShell>
  );
}
