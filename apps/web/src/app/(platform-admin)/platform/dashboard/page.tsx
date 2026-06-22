import { DashboardCard } from "@/components/dashboard-card";
import { StatusBadge } from "@/components/status-badge";

const stats = [
  ["Hostels pending approval", "12"],
  ["Published hostels", "84"],
  ["Open abuse flags", "3"],
  ["Service providers pending", "9"],
];

export default function PlatformDashboardPage() {
  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-4">
        {stats.map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-border bg-surface p-5 shadow-sm"
          >
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-3 text-3xl font-bold text-primary">{value}</p>
          </div>
        ))}
      </section>

      <DashboardCard title="Approval queue">
        <div className="grid gap-3">
          {["Green View Hostel", "Pokhara Student Stay", "Lalitpur Girls Home"].map(
            (name) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
              >
                <div>
                  <p className="font-semibold text-primary">{name}</p>
                  <p className="text-sm text-muted-foreground">
                    Owner documents need review
                  </p>
                </div>
                <StatusBadge tone="warning">Pending</StatusBadge>
              </div>
            ),
          )}
        </div>
      </DashboardCard>
    </div>
  );
}
