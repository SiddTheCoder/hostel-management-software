import { DashboardCard } from "@/components/dashboard-card";
import { StatusBadge } from "@/components/status-badge";

const pendingHostels = [
  {
    city: "Kathmandu",
    name: "Green View Hostel",
    owner: "Sanjay Lama",
  },
  {
    city: "Pokhara",
    name: "Pokhara Student Stay",
    owner: "Mina Gurung",
  },
  {
    city: "Lalitpur",
    name: "Lalitpur Girls Home",
    owner: "Anita Shrestha",
  },
];

export default function PlatformHostelsPage() {
  return (
    <DashboardCard title="Hostel registration approvals">
      <div className="grid gap-3">
        {pendingHostels.map((hostel) => (
          <div
            key={hostel.name}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-background p-4"
          >
            <div>
              <p className="font-semibold text-primary">{hostel.name}</p>
              <p className="text-sm text-muted-foreground">
                {hostel.owner} submitted documents for {hostel.city}.
              </p>
            </div>
            <StatusBadge tone="warning">Pending review</StatusBadge>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
