import { PortalShell } from "@/components/portal-shell";

const navItems = [
  { href: "/guardian/dashboard", label: "Dashboard" },
  { href: "/guardian/payments", label: "Payments" },
  { href: "/guardian/notices", label: "Notices" },
  { href: "/guardian/food", label: "Food" },
  { href: "/guardian/safety-summary", label: "Safety summary" },
];

export default function GuardianLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PortalShell navItems={navItems} portalName="Guardian" subtitle="Trust summary">
      {children}
    </PortalShell>
  );
}
