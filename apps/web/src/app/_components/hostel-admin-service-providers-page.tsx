"use client";

import React, { useCallback, useState, useEffect } from "react";
import { Search } from "lucide-react";
import { EmptyState, LoadingRows, Panel } from "@/app/_components/shared-ui";
import { browserApi } from "@/lib/browser-api";
import { Message, PageHeader, type LoadState, type ServiceProvider } from "./phase5-shared";

export const HostelAdminServiceProvidersPageContent = React.memo(
  function HostelAdminServiceProvidersPageContent() {
    const [providers, setProviders] = useState<ServiceProvider[]>([]);
    const [message, setMessage] = useState("");
    const [state, setState] = useState<LoadState>("idle");

    const load = useCallback(async () => {
      setState("loading");
      try {
        const data = await browserApi<{ providers: ServiceProvider[] }>(
          "/api/v1/hostel-admin/service-providers",
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

    return (
      <div className="mx-auto max-w-[1448px] space-y-6">
        <PageHeader
          description="Approved local providers available for hostel maintenance."
          icon={Search}
          title="Service Provider Search"
        />
        <Message value={message} />
        <Panel>
          {state === "loading" ? <LoadingRows /> : null}
          {state === "error" ? <EmptyState label="Providers could not be loaded." /> : null}
          {state === "ready" && providers.length === 0 ? (
            <EmptyState label="No approved providers." />
          ) : null}
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {providers.map((provider) => (
              <div className="rounded-lg border border-border p-4" key={provider.id}>
                <p className="font-semibold text-foreground">{provider.fullName}</p>
                <p className="text-sm text-muted-foreground">
                  {provider.category.replaceAll("_", " ")} / {provider.area}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{provider.phone}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {provider.availability || provider.description || "-"}
                </p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    );
  },
);
