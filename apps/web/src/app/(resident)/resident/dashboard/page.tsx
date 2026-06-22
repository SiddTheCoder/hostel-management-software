import { DashboardCard } from "@/components/dashboard-card";
import { StatusBadge } from "@/components/status-badge";

export default function ResidentDashboardPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <DashboardCard title="Night status">
        <div className="rounded-xl bg-emerald-50 p-5">
          <p className="text-sm font-semibold text-muted-foreground">Current status</p>
          <p className="mt-2 text-2xl font-bold text-primary">Inside Hostel</p>
          <p className="mt-1 text-sm text-muted-foreground">Checked in at 9:15 PM</p>
        </div>
      </DashboardCard>
      <DashboardCard title="Upcoming due">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-primary">June rent</p>
            <p className="mt-1 text-sm text-muted-foreground">Due on 25 Jun 2026</p>
          </div>
          <StatusBadge tone="warning">NPR 8,500</StatusBadge>
        </div>
      </DashboardCard>
      <DashboardCard title="Today menu">
        <div className="grid gap-3">
          {["Breakfast: Puffed rice, boiled egg, tea", "Lunch: Dal rice and curry"].map(
            (item) => (
              <p
                key={item}
                className="rounded-lg border border-border bg-background p-4 text-sm text-primary"
              >
                {item}
              </p>
            ),
          )}
        </div>
      </DashboardCard>
    </div>
  );
}
