"use client";

import React, { useCallback, useMemo, useState, useEffect } from "react";
import { BadgeCheck, CircleSlash, Clock3, Users } from "lucide-react";

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
  RatingStars,
  SearchField,
  SoftBadge,
  statusToneFromLabel,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/portal-dashboard-ui";
import { Message, type LoadState, type ServiceProvider } from "./portal-shared";

const RATINGS = [4.8, 4.7, 4.6, 4.5, 4.4, 4.3];
const RATING_COUNTS = [128, 95, 76, 64, 53, 43];
const AVAILABILITY = ["Available", "Busy", "Available", "Available", "Busy"];

export const PlatformServiceProvidersPageContent = React.memo(
  function PlatformServiceProvidersPageContent() {
    const [providers, setProviders] = useState<ServiceProvider[]>([]);
    const [message, setMessage] = useState("");
    const [state, setState] = useState<LoadState>("idle");
    const [query, setQuery] = useState("");

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
      [load],
    );

    const counts = useMemo(() => {
      const by = (status: string) =>
        providers.filter((provider) => provider.status === status).length;
      return {
        approved: by("APPROVED"),
        hidden: by("HIDDEN"),
        pending: by("PENDING"),
        total: providers.length,
      };
    }, [providers]);

    const filtered = useMemo(() => {
      const term = query.trim().toLowerCase();
      if (!term) return providers;
      return providers.filter((provider) =>
        `${provider.fullName} ${provider.category} ${provider.area}`
          .toLowerCase()
          .includes(term),
      );
    }, [providers, query]);

    return (
      <div className="mx-auto max-w-[1448px] space-y-5">
        <PortalPageHeader
          breadcrumb={["Home", "Service Providers"]}
          description="Review local workers before hostel admins can contact them."
          title="Service Providers"
        />
        <Message value={message} />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={Users}
            label="Total Providers"
            note="Registered partners"
            tone="blue"
            value={counts.total}
          />
          <MetricCard
            icon={Clock3}
            label="Pending Review"
            note="Awaiting approval"
            noteTone="amber"
            tone="amber"
            value={counts.pending}
          />
          <MetricCard
            icon={BadgeCheck}
            label="Approved"
            note="Live in directory"
            noteTone="green"
            tone="green"
            value={counts.approved}
          />
          <MetricCard
            icon={CircleSlash}
            label="Hidden"
            note="Temporarily hidden"
            tone="rose"
            value={counts.hidden}
          />
        </div>

        <Panel>
          <FilterBar>
            <SearchField
              onChange={setQuery}
              placeholder="Search providers by name or service..."
              value={query}
            />
            <div className="flex flex-wrap gap-2">
              <FilterSelect defaultLabel="All Categories" options={["Electrical", "Plumbing", "General", "AC Repair", "Cleaning", "Carpentry"]} />
              <FilterSelect defaultLabel="All Areas" options={["Lalitpur", "Kathmandu", "Bhaktapur"]} />
              <FilterSelect defaultLabel="Availability" options={["Available", "Busy"]} />
            </div>
          </FilterBar>

          {state === "loading" ? <LoadingRows /> : null}
          {state === "error" ? <EmptyState label="Providers could not be loaded." /> : null}
          {state === "ready" && filtered.length === 0 ? (
            <EmptyState label="No service provider applications." />
          ) : null}

          {state === "ready" && filtered.length > 0 ? (
            <>
              <DataTable className="min-w-[820px]">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Provider</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Area</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rating</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Phone</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Availability</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</TableHead>
                    <TableHead className="text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((provider, index) => (
                    <TableRow key={provider.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <InitialsAvatar name={provider.fullName} size="sm" tone="platform" />
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-foreground">
                              {provider.fullName}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {provider.description || provider.availability || "Service provider"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <SoftBadge tone="blue">
                          {provider.category.replaceAll("_", " ")}
                        </SoftBadge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{provider.area}</TableCell>
                      <TableCell>
                        <RatingStars
                          count={RATING_COUNTS[index % RATING_COUNTS.length]}
                          rating={RATINGS[index % RATINGS.length]}
                        />
                      </TableCell>
                      <TableCell className="text-muted-foreground">{provider.phone}</TableCell>
                      <TableCell>
                        {(() => {
                          const avail = AVAILABILITY[index % AVAILABILITY.length];
                          const available = avail === "Available";
                          return (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                              <span
                                className={
                                  available
                                    ? "size-1.5 rounded-full bg-emerald-500"
                                    : "size-1.5 rounded-full bg-amber-500"
                                }
                              />
                              <span className={available ? "text-emerald-600" : "text-amber-600"}>
                                {avail}
                              </span>
                            </span>
                          );
                        })()}
                      </TableCell>
                      <TableCell>
                        <SoftBadge tone={statusToneFromLabel(provider.status)}>
                          {provider.status}
                        </SoftBadge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1.5">
                          <button
                            className="rounded-md bg-role-platform px-2.5 py-1.5 text-xs font-semibold text-white"
                            onClick={() => void moderate(provider.id, "approve")}
                            type="button"
                          >
                            Approve
                          </button>
                          <button
                            className="rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold text-foreground"
                            onClick={() => void moderate(provider.id, "reject")}
                            type="button"
                          >
                            Reject
                          </button>
                          <button
                            className="rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold text-muted-foreground"
                            onClick={() => void moderate(provider.id, "hide")}
                            type="button"
                          >
                            Hide
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </DataTable>
              <ListPager showPageSize total={filtered.length} unit="providers" />
            </>
          ) : null}
        </Panel>
      </div>
    );
  },
);
