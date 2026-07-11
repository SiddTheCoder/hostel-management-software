"use client";

import { ShieldCheck } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";

import { browserApi } from "@/lib/browser-api";
import { type GuardianDashboard, Message, PageHeader } from "./daily-operations-shared";
import { currency, Panel } from "@/app/_components/shared-ui";

export const GuardianDashboardPageContent = memo(function GuardianDashboardPageContent() {
  const [dashboard, setDashboard] = useState<GuardianDashboard | null>(null);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await browserApi<{ dashboard: GuardianDashboard }>(
        "/api/v1/guardian/dashboard",
      );

      setDashboard(data.dashboard);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not load guardian dashboard.",
      );
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
      <PageHeader
        description="Limited resident summary for guardian access."
        icon={ShieldCheck}
        title="Guardian Dashboard"
      />
      <Message value={message} />
      {dashboard ? (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Panel>
              <p className="text-sm text-muted-foreground">Resident</p>
              <p className="mt-2 text-xl font-bold text-primary">
                {dashboard.resident.firstName} {dashboard.resident.lastName}
              </p>
            </Panel>
            <Panel>
              <p className="text-sm text-muted-foreground">Due</p>
              <p className="mt-2 text-xl font-bold text-primary">
                {currency(dashboard.summary.dueAmount)}
              </p>
            </Panel>
            <Panel>
              <p className="text-sm text-muted-foreground">Safety</p>
              <p className="mt-2 text-xl font-bold text-primary">
                {dashboard.safety?.status ?? "NOT_VERIFIED"}
              </p>
            </Panel>
            <Panel>
              <p className="text-sm text-muted-foreground">Hostel</p>
              <p className="mt-2 text-xl font-bold text-primary">
                {dashboard.hostel?.name ?? "-"}
              </p>
            </Panel>
          </div>
          <div className="grid gap-5 xl:grid-cols-3">
            <Panel title="Payments">
              {dashboard.payments.map((payment) => (
                <p className="py-1 text-sm" key={payment.id}>
                  {payment.month}: {payment.status}
                </p>
              ))}
            </Panel>
            <Panel title="Notices">
              {dashboard.notices.map((notice) => (
                <p className="py-1 text-sm" key={notice.id}>
                  {notice.title}
                </p>
              ))}
            </Panel>
            <Panel title="Food">
              {dashboard.food.map((menu) => (
                <p className="py-1 text-sm" key={menu.id}>
                  {menu.mealType}: {menu.items.join(", ")}
                </p>
              ))}
            </Panel>
          </div>
        </>
      ) : null}
    </div>
  );
});
