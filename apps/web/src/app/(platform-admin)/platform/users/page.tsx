import { DashboardCard } from "@/components/dashboard-card";
import { StatusBadge } from "@/components/status-badge";

const users = [
  {
    email: "platform.owner@hostelhub.local",
    name: "Platform Owner",
    role: "Platform owner",
    tone: "success" as const,
  },
  {
    email: "warden.demo@hostelhub.local",
    name: "Demo Warden",
    role: "Warden",
    tone: "warning" as const,
  },
  {
    email: "guardian.demo@hostelhub.local",
    name: "Demo Guardian",
    role: "Guardian",
    tone: "neutral" as const,
  },
];

export default function PlatformUsersPage() {
  return (
    <DashboardCard title="User management">
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold">User</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-background">
            {users.map((user) => (
              <tr key={user.email}>
                <td className="px-4 py-3">
                  <p className="font-semibold text-primary">{user.name}</p>
                  <p className="text-muted-foreground">{user.email}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{user.role}</td>
                <td className="px-4 py-3">
                  <StatusBadge tone={user.tone}>Active</StatusBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}
