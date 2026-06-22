import { PortalShell } from "@/components/portal-shell";

const navItems = [
  { href: "/hostel-admin/dashboard", label: "Dashboard" },
  { href: "/hostel-admin/rooms", label: "Rooms and beds" },
  { href: "/hostel-admin/residents", label: "Residents" },
  { href: "/hostel-admin/payments", label: "Fees and payments" },
  { href: "/hostel-admin/complaints", label: "Complaints" },
  { href: "/hostel-admin/maintenance", label: "Maintenance" },
];

export default function HostelAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PortalShell
      navItems={navItems}
      portalName="Hostel Admin"
      subtitle="Hostel operations"
    >
      {children}
    </PortalShell>
  );
}
