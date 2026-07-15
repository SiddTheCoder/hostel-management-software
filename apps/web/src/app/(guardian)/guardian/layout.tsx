import { PortalShell } from "@/components/portal-shell";

const navItems = [
  { href: "/guardian/dashboard", icon: "receipt" as const, label: "Fee Summary" },
  { href: "/guardian/notices", icon: "bell" as const, label: "Notices" },
  { href: "/guardian/food", icon: "food" as const, label: "Food View" },
  { href: "/guardian/safety", icon: "shield" as const, label: "Safety Summary" },
  {
    href: "/guardian/emergency-contact",
    icon: "siren" as const,
    label: "Emergency Contact",
  },
  { href: "/guardian/messages", icon: "message" as const, label: "Messages" },
  { href: "/guardian/help", icon: "help" as const, label: "Help & Support" },
];

export default function GuardianLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PortalShell
      navItems={navItems}
      portalName="HostelHub"
      searchPlaceholder="Search notices, payments..."
      subtitle="Guardian Portal"
      tone="guardian"
      workspaceName="Guardian"
    >
      {children}
    </PortalShell>
  );
}
