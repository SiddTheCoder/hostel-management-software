"use client";

import { Building2 } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";

import { EmptyState, LoadingRows, Panel } from "@/app/_components/shared-ui";
import { browserApi } from "@/lib/browser-api";
import {
  deferLoad,
  Hostel,
  HostelTable,
  LoadState,
  Message,
  PageHeader,
} from "./core-portal-shared";

export const PlatformHostelsPageContent = memo(function PlatformHostelsPageContent() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<LoadState>("idle");

  const load = useCallback(async () => {
    setState("loading");
    try {
      const data = await browserApi<{ hostels: Hostel[] }>("/api/v1/platform/hostels");

      setHostels(data.hostels);
      setState("ready");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load hostels.");
      setState("error");
    }
  }, []);

  useEffect(() => deferLoad(load), [load]);

  const action = useCallback(
    async (hostelId: string, nextAction: string) => {
      const body =
        nextAction === "reject"
          ? JSON.stringify({
              reason: window.prompt("Rejection reason") || "Rejected by platform owner.",
            })
          : JSON.stringify({});

      try {
        await browserApi(`/api/v1/platform/hostels/${hostelId}/${nextAction}`, {
          body,
          method: "PATCH",
        });
        setMessage(`Hostel ${nextAction} action completed.`);
        await load();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Action failed.");
      }
    },
    [load],
  );

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PageHeader
        description="Review, approve, reject, publish, and unpublish hostel listings."
        icon={Building2}
        title="Hostel Approvals"
      />
      <Message value={message} />
      <Panel>
        {state === "loading" ? <LoadingRows /> : null}
        {state === "error" ? <EmptyState label="Hostels could not be loaded." /> : null}
        {state === "ready" ? <HostelTable hostels={hostels} onAction={action} /> : null}
      </Panel>
    </div>
  );
});
