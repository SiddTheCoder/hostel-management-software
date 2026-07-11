"use client";

import { Moon } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";

import { browserApi } from "@/lib/browser-api";
import { Message, PageHeader } from "./daily-operations-shared";
import { Panel } from "@/app/_components/shared-ui";

export const ResidentNightStatusPageContent = memo(function ResidentNightStatusPageContent() {
  const [status, setStatus] = useState<{
    checkedAt: string | null;
    status: string;
  } | null>(null);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await browserApi<{ status: NonNullable<typeof status> }>(
        "/api/v1/resident/night-status",
      );

      setStatus(data.status);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load status.");
    }
  }, []);

  const update = useCallback(
    async (statusValue: string) => {
      try {
        await browserApi("/api/v1/resident/night-status", {
          body: JSON.stringify({ status: statusValue }),
          method: "POST",
        });
        setMessage("Night status updated.");
        await load();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not update status.");
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
        description="Share a privacy-first safety status with hostel staff."
        icon={Moon}
        title="Night Status"
      />
      <Message value={message} />
      <Panel>
        <p className="text-sm text-muted-foreground">Current status</p>
        <p className="mt-2 text-3xl font-bold text-primary">
          {status?.status ?? "NOT_VERIFIED"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {status?.checkedAt ? new Date(status.checkedAt).toLocaleString() : "-"}
        </p>
      </Panel>
      <div className="grid gap-3 md:grid-cols-4">
        {["INSIDE_HOSTEL", "OUTSIDE_HOSTEL", "MARKED_SAFE", "NOT_VERIFIED"].map(
          (item) => (
            <button
              className="h-11 rounded-md bg-role-resident text-sm font-semibold text-white"
              key={item}
              onClick={() => void update(item)}
              type="button"
            >
              {item.replaceAll("_", " ")}
            </button>
          ),
        )}
      </div>
    </div>
  );
});
