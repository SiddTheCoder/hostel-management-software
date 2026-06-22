import { PortalShell } from "@/components/portal-shell";

const navItems = [
  { href: "/resident/dashboard", label: "Dashboard" },
  { href: "/resident/food", label: "Food menu" },
  { href: "/resident/payments", label: "Payments" },
  { href: "/resident/notices", label: "Notices" },
  { href: "/resident/complaints", label: "Complaints" },
  { href: "/resident/sos", label: "SOS" },
];

export default function ResidentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PortalShell navItems={navItems} portalName="Resident" subtitle="Student portal">
      {children}
    </PortalShell>
  );
}
