"use client";

import { memo, useEffect, useMemo, useState } from "react";
import { CircleUser, ShieldCheck, UserCheck, Users } from "lucide-react";

import { EmptyState, LoadingRows, Panel } from "@/app/_components/shared-ui";
import { browserApi } from "@/lib/browser-api";
import {
  DataTable,
  FilterBar,
  FilterSelect,
  InitialsAvatar,
  ListPager,
  MetricCard,
  PortalPageHeader,
  SoftBadge,
  statusToneFromLabel,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/portal-dashboard-ui";
import {
  deferLoad,
  DemoDataBadge,
  LoadState,
  Message,
  UserRecord,
} from "./core-portal-shared";

export const PlatformUsersPageContent = memo(function PlatformUsersPageContent() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<LoadState>("idle");
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function load() {
      setState("loading");
      try {
        const data = await browserApi<{ users: UserRecord[] }>("/api/v1/platform/users");

        setUsers(data.users);
        setState("ready");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not load users.");
        setState("error");
      }
    }

    return deferLoad(load);
  }, []);

  const counts = useMemo(() => {
    const by = (role: string) => users.filter((user) => user.role === role).length;
    return {
      admins: by("HOSTEL_ADMIN"),
      residents: by("RESIDENT"),
      active: users.filter((user) => user.status === "ACTIVE").length,
      total: users.length,
    };
  }, [users]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return users;
    return users.filter((user) =>
      `${user.name} ${user.email ?? ""} ${user.phone ?? ""} ${user.role}`
        .toLowerCase()
        .includes(term),
    );
  }, [users, query]);

  return (
    <div className="mx-auto max-w-[1448px] space-y-5">
      <PortalPageHeader
        breadcrumb={["Home", "Users"]}
        description="Platform-visible users and role assignments."
        title="Users"
      />
      <Message value={message} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Users} label="Total Users" note="All roles" tone="blue" value={counts.total} />
        <MetricCard icon={ShieldCheck} label="Hostel Admins" note="Owners & wardens" tone="purple" value={counts.admins} />
        <MetricCard icon={CircleUser} label="Residents" note="Active accounts" tone="green" value={counts.residents} />
        <MetricCard icon={UserCheck} label="Active" note="Currently enabled" noteTone="green" tone="cyan" value={counts.active} />
      </div>

      <Panel>
        <FilterBar>
          <div className="flex h-10 max-w-md flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 shadow-sm">
            <svg aria-hidden className="size-4 shrink-0 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, email, phone..."
              value={query}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterSelect defaultLabel="All Roles" options={["SUPERADMIN", "HOSTEL_ADMIN", "WARDEN", "RESIDENT", "GUARDIAN", "PUBLIC"]} />
            <FilterSelect defaultLabel="All Status" options={["ACTIVE", "INVITED", "SUSPENDED", "ARCHIVED"]} />
          </div>
        </FilterBar>

        {state === "loading" ? <LoadingRows /> : null}
        {state === "error" ? <EmptyState label="Users could not be loaded." /> : null}
        {state === "ready" && filtered.length === 0 ? (
          <EmptyState label="No users found." />
        ) : null}

        {state === "ready" && filtered.length > 0 ? (
          <>
            <DataTable className="min-w-[720px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">User</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contact</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Role</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hostels</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <InitialsAvatar name={user.name} size="sm" tone="platform" />
                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                          <span className="truncate font-semibold text-foreground">{user.name}</span>
                          {user.isDemoData ? <DemoDataBadge label={user.demoDataLabel} /> : null}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-foreground">{user.email || "-"}</p>
                      <p className="text-xs text-muted-foreground">{user.phone}</p>
                    </TableCell>
                    <TableCell>
                      <SoftBadge tone="slate">{user.role}</SoftBadge>
                    </TableCell>
                    <TableCell>
                      <SoftBadge tone={statusToneFromLabel(user.status)}>{user.status}</SoftBadge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.hostelIds.length}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </DataTable>
            <ListPager showPageSize total={filtered.length} unit="users" />
          </>
        ) : null}
      </Panel>
    </div>
  );
});
