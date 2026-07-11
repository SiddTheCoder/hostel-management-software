"use client";

import { Users } from "lucide-react";
import { memo, useEffect, useState } from "react";

import { EmptyState, Panel, StatusBadge } from "@/app/_components/shared-ui";
import { browserApi } from "@/lib/browser-api";
import {
  deferLoad,
  DemoDataBadge,
  Message,
  PageHeader,
  UserRecord,
} from "./core-portal-shared";

export const PlatformUsersPageContent = memo(function PlatformUsersPageContent() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await browserApi<{ users: UserRecord[] }>("/api/v1/platform/users");

        setUsers(data.users);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not load users.");
      }
    }

    return deferLoad(load);
  }, []);

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PageHeader
        description="Platform-visible users and role assignments."
        icon={Users}
        title="Users"
      />
      <Message value={message} />
      <Panel>
        {users.length === 0 ? <EmptyState label="No users found." /> : null}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="py-2">User</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Status</th>
                <th>Hostels</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-primary">{user.name}</span>
                      {user.isDemoData ? (
                        <DemoDataBadge label={user.demoDataLabel} />
                      ) : null}
                    </div>
                  </td>
                  <td>
                    {user.email || "-"}
                    <p className="text-xs text-muted-foreground">{user.phone}</p>
                  </td>
                  <td>{user.role}</td>
                  <td>
                    <StatusBadge>{user.status}</StatusBadge>
                  </td>
                  <td>{user.hostelIds.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
});
