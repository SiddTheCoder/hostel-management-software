"use client";

import { ShieldCheck } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";

import { browserApi } from "@/lib/browser-api";
import { type LoadState, type NightStatusRow, Message, PageHeader } from "./daily-operations-shared";
import { EmptyState, LoadingRows, Panel, StatusBadge } from "@/app/_components/shared-ui";

export const HostelAdminNightStatusPage = memo(function HostelAdminNightStatusPage() {
  const [rows, setRows] = useState<NightStatusRow[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setState("loading");
    try {
      const data = await browserApi<{ statuses: NightStatusRow[] }>(
        "/api/v1/hostel-admin/night-status",
      );

      setRows(data.statuses);
      setState("ready");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load statuses.");
      setState("error");
    }
  }, []);

  const override = useCallback(
    async (residentId: string, statusValue: string) => {
      const reason = window.prompt("Override reason")?.trim();

      if (!reason) {
        return;
      }

      try {
        await browserApi(`/api/v1/hostel-admin/night-status/${residentId}/override`, {
          body: JSON.stringify({ reason, status: statusValue }),
          method: "PATCH",
        });
        setMessage("Status overridden.");
        await load();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not override status.");
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
        description="Status-only safety summary for residents in this hostel."
        icon={ShieldCheck}
        title="Night Status"
      />
      <Message value={message} />
      <Panel>
        {state === "loading" ? <LoadingRows /> : null}
        {state === "error" ? (
          <EmptyState label="Night status could not be loaded." />
        ) : null}
        {state === "ready" && rows.length === 0 ? (
          <EmptyState label="No residents." />
        ) : null}
        <div className="space-y-3">
          {rows.map((row) => (
            <div className="rounded-lg border border-border p-4" key={row.resident.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">
                    {row.resident.firstName} {row.resident.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{row.resident.phone}</p>
                </div>
                <StatusBadge>{row.status.status}</StatusBadge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {["INSIDE_HOSTEL", "OUTSIDE_HOSTEL", "MARKED_SAFE"].map((item) => (
                  <button
                    className="rounded-md border border-role-admin px-3 py-2 text-sm font-semibold text-role-admin"
                    key={item}
                    onClick={() => void override(row.resident.id, item)}
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
