import { PortalShell } from "@/components/portal-shell";
import { PLATFORM_NAV, PLATFORM_SEARCH_ENTRIES } from "@/lib/portal-nav";

export default function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PortalShell
      navGroups={PLATFORM_NAV}
      portalName="HostelHub"
      searchEntries={PLATFORM_SEARCH_ENTRIES}
      searchPlaceholder="Search hostels, users, payments, settings..."
      subtitle="Platform Owner Portal"
      tone="platform"
      workspaceName="Platform Owner"
    >
      {children}
    </PortalShell>
  );
}
