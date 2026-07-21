"use client";

import React, { useCallback, useState, useEffect, type FormEvent } from "react";
import { Wrench } from "lucide-react";
import {
  EmptyState,
  Input,
  LoadingRows,
  Panel,
  Select,
  StatusBadge,
  TextArea,
} from "@/app/_components/shared-ui";
import { browserApi } from "@/lib/browser-api";
import {
  Message,
  PageHeader,
  field,
  optionalField,
  type LoadState,
  type MaintenanceRequest,
  type ServiceProvider,
} from "./portal-shared";

export const HostelAdminMaintenancePageContent = React.memo(
  function HostelAdminMaintenancePageContent() {
    const [providers, setProviders] = useState<ServiceProvider[]>([]);
    const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
    const [message, setMessage] = useState("");
    const [state, setState] = useState<LoadState>("idle");

    const load = useCallback(async () => {
      setState("loading");
      try {
        const [providerData, requestData] = await Promise.all([
          browserApi<{ providers: ServiceProvider[] }>(
            "/api/v1/hostel-admin/service-providers",
          ),
          browserApi<{ requests: MaintenanceRequest[] }>(
            "/api/v1/hostel-admin/maintenance/requests",
          ),
        ]);

        setProviders(providerData.providers);
        setRequests(requestData.requests);
        setState("ready");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not load maintenance.");
        setState("error");
      }
    }, []);

    useEffect(() => {
      const timer = window.setTimeout(() => {
        void load();
      }, 0);

      return () => window.clearTimeout(timer);
    }, [load]);

    const create = useCallback(
      async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);

        try {
          await browserApi("/api/v1/hostel-admin/maintenance/requests", {
            body: JSON.stringify({
              category: field(form, "category"),
              costNote: optionalField(form, "costNote"),
              description: optionalField(form, "description"),
              priority: field(form, "priority"),
              providerId: optionalField(form, "providerId"),
              title: field(form, "title"),
            }),
            method: "POST",
          });
          event.currentTarget.reset();
          setMessage("Maintenance request created.");
          await load();
        } catch (error) {
          setMessage(error instanceof Error ? error.message : "Could not create request.");
        }
      },
      [load, setMessage],
    );

    const updateStatus = useCallback(
      async (requestId: string, status: string) => {
        try {
          await browserApi(`/api/v1/hostel-admin/maintenance/requests/${requestId}/status`, {
            body: JSON.stringify({ status }),
            method: "PATCH",
          });
          await load();
        } catch (error) {
          setMessage(error instanceof Error ? error.message : "Could not update request.");
        }
      },
      [load, setMessage],
    );

    return (
      <div className="mx-auto max-w-[1448px] space-y-6">
        <PageHeader
          description="Create and track hostel repair work with approved providers."
          icon={Wrench}
          title="Maintenance"
        />
        <Message value={message} />
        <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
          <Panel title="Requests">
            {state === "loading" ? <LoadingRows /> : null}
            {state === "error" ? (
              <EmptyState label="Requests could not be loaded." />
            ) : null}
            {state === "ready" && requests.length === 0 ? (
              <EmptyState label="No maintenance requests." />
            ) : null}
            <div className="space-y-3">
              {requests.map((request) => (
                <div className="rounded-lg border border-border p-4" key={request.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{request.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {request.category.replaceAll("_", " ")} / {request.priority}
                      </p>
                    </div>
                    <StatusBadge>{request.status}</StatusBadge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {request.description || request.costNote || "-"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["CONTACTED", "SCHEDULED", "COMPLETED", "CANCELLED"].map((status) => (
                      <button
                        className="rounded-md border border-role-admin px-3 py-2 text-sm font-semibold text-role-admin"
                        key={status}
                        onClick={() => void updateStatus(request.id, status)}
                        type="button"
                      >
                        {status.replaceAll("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="New Request">
            <form className="grid gap-3" onSubmit={create}>
              <Input label="Title" name="title" required />
              <Select label="Category" name="category" required>
                {[
                  "PLUMBING",
                  "ELECTRICAL",
                  "INTERNET",
                  "CLEANING",
                  "CARPENTRY",
                  "PAINTING",
                  "WATER",
                  "APPLIANCE",
                  "ROOM_REPAIR",
                  "HEALTH",
                  "OTHER",
                ].map((category) => (
                  <option key={category} value={category}>
                    {category.replaceAll("_", " ")}
                  </option>
                ))}
              </Select>
              <Select label="Priority" name="priority">
                {["LOW", "MEDIUM", "HIGH", "URGENT"].map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </Select>
              <Select label="Provider" name="providerId">
                <option value="">Manual contact later</option>
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.fullName} / {provider.category.replaceAll("_", " ")}
                  </option>
                ))}
              </Select>
              <TextArea label="Description" name="description" />
              <Input label="Cost note" name="costNote" />
              <button className="h-11 rounded-md bg-role-admin text-sm font-semibold text-white">
                Create Request
              </button>
            </form>
          </Panel>
        </div>
      </div>
    );
  },
);
