import { DashboardCard } from "@/components/dashboard-card";
import { StatusBadge } from "@/components/status-badge";

const providers = [
  {
    category: "Plumbing",
    contact: "+977 9800000001",
    name: "Rapid Repairs Nepal",
  },
  {
    category: "Electrical",
    contact: "+977 9800000002",
    name: "BrightFix Services",
  },
  {
    category: "Cleaning",
    contact: "+977 9800000003",
    name: "FreshStay Cleaners",
  },
];

export default function PlatformServiceProvidersPage() {
  return (
    <DashboardCard title="Service provider approvals">
      <div className="grid gap-3">
        {providers.map((provider) => (
          <div
            key={provider.name}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-background p-4"
          >
            <div>
              <p className="font-semibold text-primary">{provider.name}</p>
              <p className="text-sm text-muted-foreground">
                {provider.category} contact: {provider.contact}
              </p>
            </div>
            <StatusBadge tone="warning">Needs approval</StatusBadge>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
