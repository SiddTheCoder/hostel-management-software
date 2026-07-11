"use client";

import React, { useCallback, useState, useEffect } from "react";
import { Users } from "lucide-react";
import { EmptyState, LoadingRows, Panel, StatusBadge } from "@/app/_components/shared-ui";
import { browserApi } from "@/lib/browser-api";
import { Message, PageHeader, type LoadState, type ServiceProvider } from "./phase5-shared";

export const PlatformServiceProvidersPageContent = React.memo(
  function PlatformServiceProvidersPageContent() {
    const [providers, setProviders] = useState<ServiceProvider[]>([]);
    const [message, setMessage] = useState("");
    const [state, setState] = useState<LoadState>("idle");

    const load = useCallback(async () => {
      setState("loading");
      try {
        const data = await browserApi<{ providers: ServiceProvider[] }>(
          "/api/v1/platform/service-providers",
        );

        setProviders(data.providers);
        setState("ready");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not load providers.");
        setState("error");
      }
    }, []);

    useEffect(() => {
      const timer = window.setTimeout(() => {
        void load();
      }, 0);

      return () => window.clearTimeout(timer);
    }, [load]);

    const moderate = useCallback(
      async (providerId: string, action: "approve" | "hide" | "reject") => {
        const reason =
          action === "reject" ? window.prompt("Rejection reason")?.trim() : undefined;

        if (action === "reject" && !reason) {
          return;
        }

        try {
          await browserApi(`/api/v1/platform/service-providers/${providerId}/${action}`, {
            body: JSON.stringify(reason ? { reason } : {}),
            method: "PATCH",
          });
          setMessage(`Provider ${action}d.`);
          await load();
        } catch (error) {
          setMessage(error instanceof Error ? error.message : "Could not update provider.");
        }
      },
      [load, setMessage],
    );

    return (
      <div className="mx-auto max-w-[1448px] space-y-6">
        <PageHeader
          description="Review local workers before hostel admins can contact them."
          icon={Users}
          title="Service Providers"
        />
        <Message value={message} />
        <Panel>
          {state === "loading" ? <LoadingRows /> : null}
          {state === "error" ? <EmptyState label="Providers could not be loaded." /> : null}
          {state === "ready" && providers.length === 0 ? (
            <EmptyState label="No service provider applications." />
          ) : null}
          <div className="grid gap-3 xl:grid-cols-2">
            {providers.map((provider) => (
              <div className="rounded-lg border border-border p-4" key={provider.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{provider.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      {provider.category.replaceAll("_", " ")} / {provider.area}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{provider.phone}</p>
                  </div>
                  <StatusBadge>{provider.status}</StatusBadge>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {provider.description || provider.availability || "-"}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    className="rounded-md bg-role-platform px-3 py-2 text-sm font-semibold text-white"
                    onClick={() => void moderate(provider.id, "approve")}
                    type="button"
                  >
                    Approve
                  </button>
                  <button
                    className="rounded-md border border-border px-3 py-2 text-sm font-semibold"
                    onClick={() => void moderate(provider.id, "reject")}
                    type="button"
                  >
                    Reject
                  </button>
                  <button
                    className="rounded-md border border-border px-3 py-2 text-sm font-semibold"
                    onClick={() => void moderate(provider.id, "hide")}
                    type="button"
                  >
                    Hide
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    );
  },
);
