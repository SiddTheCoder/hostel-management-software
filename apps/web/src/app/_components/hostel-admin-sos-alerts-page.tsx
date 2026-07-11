"use client";

import { Siren } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";

import { browserApi } from "@/lib/browser-api";
import { type SOSAlert, Message, PageHeader } from "./daily-operations-shared";
import { EmptyState, Panel, StatusBadge } from "@/app/_components/shared-ui";

export const HostelAdminSOSAlertsPage = memo(function HostelAdminSOSAlertsPage() {
  const [alerts, setAlerts] = useState<SOSAlert[]>([]);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await browserApi<{ alerts: SOSAlert[] }>(
        "/api/v1/hostel-admin/sos-alerts",
      );

      setAlerts(data.alerts);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load SOS alerts.");
    }
  }, []);

  const update = useCallback(
    async (alertId: string, status: string) => {
      try {
        await browserApi(`/api/v1/hostel-admin/sos-alerts/${alertId}/status`, {
          body: JSON.stringify({ status }),
          method: "PATCH",
        });
        setMessage("SOS alert updated.");
        await load();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not update SOS alert.");
      }
    },
    [load],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PageHeader
        description="Emergency alerts raised by residents."
        icon={Siren}
        title="SOS Alerts"
      />
      <Message value={message} />
      <Panel>
        {alerts.length === 0 ? <EmptyState label="No SOS alerts." /> : null}
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div className="rounded-lg border border-border p-4" key={alert.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-primary">
                    Resident {alert.residentId}
                  </p>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                </div>
                <StatusBadge>{alert.status}</StatusBadge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {["ACKNOWLEDGED", "RESOLVED", "FALSE_ALARM"].map((item) => (
                  <button
                    className="rounded-md border border-role-admin px-3 py-2 text-sm font-semibold text-role-admin"
                    key={item}
                    onClick={() => void update(alert.id, item)}
                    type="button"
                  >
                    {item.replaceAll("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
});
