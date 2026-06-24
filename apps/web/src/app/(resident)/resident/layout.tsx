import { PortalShell } from "@/components/portal-shell";

const navItems = [
  { href: "/resident/dashboard", icon: "dashboard" as const, label: "Dashboard" },
  { href: "/resident/profile", icon: "user" as const, label: "My Profile" },
  { href: "/resident/room-bed", icon: "bed" as const, label: "Room & Bed" },
  { href: "/resident/payments", icon: "card" as const, label: "Payments" },
  { href: "/resident/payment-proof", icon: "qr" as const, label: "Payment Proof" },
  { href: "/resident/food", icon: "food" as const, label: "Food Menu" },
  { href: "/resident/notices", icon: "clipboard" as const, label: "Notices" },
  { href: "/resident/complaints", icon: "help" as const, label: "Complaints" },
  { href: "/resident/night-status", icon: "moon" as const, label: "Night Status" },
  { href: "/resident/sos", icon: "siren" as const, label: "SOS" },
  { href: "/resident/reviews", icon: "star" as const, label: "Reviews" },
  { href: "/resident/referral", icon: "message" as const, label: "Referral" },
  { href: "/resident/documents", icon: "file" as const, label: "Documents" },
  { href: "/resident/settings", icon: "settings" as const, label: "Settings" },
];

export default function ResidentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PortalShell
      navItems={navItems}
      portalName="HostelHub"
      searchPlaceholder="Search notices, menu..."
      subtitle="Resident Portal"
      tone="resident"
    >
      {children}
    </PortalShell>
  );
}
