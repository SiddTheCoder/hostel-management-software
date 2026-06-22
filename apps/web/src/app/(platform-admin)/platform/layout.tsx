import { PortalShell } from "@/components/portal-shell";

const navItems = [
  { href: "/platform/dashboard", label: "Dashboard" },
  { href: "/platform/hostels", label: "Hostel approvals" },
  { href: "/platform/users", label: "Users" },
  { href: "/platform/reports", label: "Reports" },
  { href: "/platform/reviews", label: "Review moderation" },
];

export default function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PortalShell
      navItems={navItems}
      portalName="Platform Owner"
      subtitle="Global operations"
    >
      {children}
    </PortalShell>
  );
}
