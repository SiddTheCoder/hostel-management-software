"use client";

import {
  Bell,
  CreditCard,
  Home,
  UserRound,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import { memo, useCallback, useEffect, useState } from "react";

import {
  currency,
  EmptyState,
  LoadingRows,
  Panel,
  StatusBadge,
} from "@/app/_components/shared-ui";
import { browserApi } from "@/lib/browser-api";
import {
  type LoadState,
  type ResidentDashboard,
  ResidentHeader,
  Message,
} from "./resident-shared";

export const ResidentDashboardPageContent = memo(function ResidentDashboardPageContent() {
  const [dashboard, setDashboard] = useState<ResidentDashboard | null>(null);
  const [state, setState] = useState<LoadState>("idle");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setState("loading");
    try {
      const data = await browserApi<{ dashboard: ResidentDashboard }>(
        "/api/v1/resident/dashboard",
      );

      setDashboard(data.dashboard);
      setState("ready");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load dashboard.");
      setState("error");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <ResidentHeader
        description="Your room, dues, notices, menu, and daily status."
        icon={Home}
        title="Resident Dashboard"
      />
      <Message value={message} />
      {state === "loading" ? <LoadingRows /> : null}
      {state === "error" ? <EmptyState label="Dashboard could not be loaded." /> : null}
      {dashboard ? (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              [
                "Room / Bed",
                `${dashboard.roomBed.room?.roomNumber ?? "-"} / ${dashboard.roomBed.bed?.bedNumber ?? "-"}`,
              ],
              ["Due Amount", currency(dashboard.feeStatus.dueAmount)],
              [
                "Unread Notices",
                String(dashboard.notices.filter((notice) => !notice.isRead).length),
              ],
              ["Night Status", dashboard.nightStatus.status],
            ].map(([label, value]) => (
              <Panel key={label}>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
              </Panel>
            ))}
          </div>
          <div className="grid gap-5 xl:grid-cols-[1fr_1fr_360px]">
            <Panel title="Hostel">
              <p className="text-xl font-bold text-foreground">
                {dashboard.hostel?.name ?? "Hostel"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {dashboard.hostel?.location?.area} {dashboard.hostel?.location?.city}
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                {dashboard.hostel?.contact?.phone} {dashboard.hostel?.contact?.email}
              </p>
            </Panel>
            <Panel title="Today's Menu">
              {dashboard.foodMenu.length === 0 ? (
                <EmptyState label="No menu posted." />
              ) : null}
              <div className="space-y-3">
                {dashboard.foodMenu.map((menu) => (
                  <div className="rounded-lg border border-border p-3" key={menu.id}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-foreground">{menu.mealType}</p>
                      <span className="text-xs text-muted-foreground">{menu.timing}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {menu.items.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel title="Quick Actions">
              <div className="grid gap-2">
                {[
                  ["/resident/payments", "Payments", CreditCard],
                  ["/resident/food", "Food", Utensils],
                  ["/resident/notices", "Notices", Bell],
                  ["/resident/profile", "Profile", UserRound],
                ].map(([href, label, Icon]) => {
                  const ActionIcon = Icon as typeof Home;

                  return (
                    <Link
                      className="inline-flex items-center gap-3 rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted"
                      href={href as string}
                      key={href as string}
                    >
                      <ActionIcon className="size-4 text-role-resident" />
                      {label as string}
                    </Link>
                  );
                })}
              </div>
            </Panel>
          </div>
          <Panel title="Recent Notices">
            {dashboard.notices.length === 0 ? <EmptyState label="No notices." /> : null}
            <div className="space-y-3">
              {dashboard.notices.map((notice) => (
                <div className="rounded-lg border border-border p-4" key={notice.id}>
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-foreground">{notice.title}</p>
                    {notice.isUrgent ? <StatusBadge>URGENT</StatusBadge> : null}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{notice.content}</p>
                </div>
              ))}
            </div>
          </Panel>
        </>
      ) : null}
    </div>
  );
});
