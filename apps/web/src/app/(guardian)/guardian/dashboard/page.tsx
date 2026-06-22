import { DashboardCard } from "@/components/dashboard-card";
import { StatusBadge } from "@/components/status-badge";

export default function GuardianDashboardPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <DashboardCard title="Linked resident">
        <p className="text-2xl font-bold text-primary">Aarav Shrestha</p>
        <p className="mt-2 text-sm text-muted-foreground">Room 101, Green View Hostel</p>
      </DashboardCard>
      <DashboardCard title="Fee summary">
        <p className="text-2xl font-bold text-primary">NPR 8,500 due</p>
        <p className="mt-2 text-sm text-muted-foreground">Due on 25 Jun 2026</p>
      </DashboardCard>
      <DashboardCard title="Safety summary">
        <StatusBadge tone="success">Inside Hostel</StatusBadge>
        <p className="mt-4 text-sm text-muted-foreground">Last update: 9:15 PM</p>
      </DashboardCard>
    </div>
  );
}
