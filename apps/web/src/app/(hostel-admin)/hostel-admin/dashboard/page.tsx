import { DashboardCard } from "@/components/dashboard-card";
import { StatusBadge } from "@/components/status-badge";

const stats = [
  ["Total residents", "128"],
  ["Monthly collection", "NPR 245,000"],
  ["Due amount", "NPR 32,500"],
  ["Open complaints", "8"],
];

export default function HostelAdminDashboardPage() {
  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-4">
        {stats.map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-border bg-surface p-5 shadow-sm"
          >
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-3 text-2xl font-bold text-primary">{value}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard title="Recent payments">
          <div className="grid gap-3">
            {["Aarav Shrestha", "Bikash Gurung", "Anjali Thapa"].map((name) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
              >
                <div>
                  <p className="font-semibold text-primary">{name}</p>
                  <p className="text-sm text-muted-foreground">NPR 8,500</p>
                </div>
                <StatusBadge tone="success">Paid</StatusBadge>
              </div>
            ))}
          </div>
        </DashboardCard>
        <DashboardCard title="Operations alerts">
          <div className="grid gap-3">
            {["Water issue in bathroom", "Wifi not working", "Room 102 due"].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
                >
                  <p className="font-semibold text-primary">{item}</p>
                  <StatusBadge tone="warning">Open</StatusBadge>
                </div>
              ),
            )}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
