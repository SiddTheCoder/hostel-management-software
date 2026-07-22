"use client";

import { Building2, CheckCircle2, Clock3, XCircle } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

import { currency, EmptyState, LoadingRows, Panel } from "@/app/_components/shared-ui";
import { browserApi } from "@/lib/browser-api";
import {
  DataTable,
  FilterBar,
  FilterSelect,
  InitialsAvatar,
  ListPager,
  MetricCard,
  PortalPageHeader,
  SearchField,
  SoftBadge,
  statusToneFromLabel,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/portal-dashboard-ui";
import { deferLoad, DemoDataBadge, Hostel, LoadState, Message } from "./core-portal-shared";

const ACTIONS = ["approve", "reject", "request-documents", "publish", "unpublish"] as const;

export const PlatformHostelsPageContent = memo(function PlatformHostelsPageContent() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<LoadState>("idle");
  const [query, setQuery] = useState("");

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
      let body = JSON.stringify({});

      if (nextAction === "reject") {
        body = JSON.stringify({
          reason: window.prompt("Rejection reason") || "Rejected by platform owner.",
        });
      } else if (nextAction === "request-documents") {
        const raw = window.prompt(
          "Which documents are needed? Separate multiple with commas.\ne.g. Citizenship (clearer scan), Hostel license",
        );
        if (!raw) return;
        const documents = raw
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
          .map((documentType) => ({ documentType }));
        if (documents.length === 0) return;
        const note =
          window.prompt("Optional message to the owner (leave blank to skip):") || undefined;
        body = JSON.stringify({ documents, note });
      }

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

  const counts = useMemo(() => {
    const has = (value: string) => (status: string) => status?.includes(value);
    return {
      approved: hostels.filter((hostel) => hostel.status === "APPROVED").length,
      pending: hostels.filter(
        (hostel) =>
          hostel.status === "PENDING_APPROVAL" ||
          has("PENDING")(hostel.verificationStatus) ||
          hostel.verificationStatus === "UNDER_REVIEW",
      ).length,
      rejected: hostels.filter((hostel) => hostel.status === "REJECTED").length,
      total: hostels.length,
    };
  }, [hostels]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return hostels;
    return hostels.filter((hostel) =>
      `${hostel.name} ${hostel.slug} ${hostel.location.area} ${hostel.location.city ?? ""}`
        .toLowerCase()
        .includes(term),
    );
  }, [hostels, query]);

  return (
    <div className="mx-auto max-w-[1448px] space-y-5">
      <PortalPageHeader
        breadcrumb={["Home", "Hostel Approvals"]}
        description="Review, approve, reject, publish, and unpublish hostel listings."
        title="Hostel Approvals"
      />
      <Message value={message} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Building2} label="Total Hostels" note="On the platform" tone="blue" value={counts.total} />
        <MetricCard icon={Clock3} label="Pending Approval" note="Awaiting review" noteTone="amber" tone="amber" value={counts.pending} />
        <MetricCard icon={CheckCircle2} label="Approved" note="Verified & live" noteTone="green" tone="green" value={counts.approved} />
        <MetricCard icon={XCircle} label="Rejected" note="Declined listings" noteTone="rose" tone="rose" value={counts.rejected} />
      </div>

      <Panel>
        <FilterBar>
          <SearchField onChange={setQuery} placeholder="Search hostels by name or area..." value={query} />
          <div className="flex flex-wrap gap-2">
            <FilterSelect defaultLabel="All Status" options={["PENDING_APPROVAL", "APPROVED", "REJECTED"]} />
            <FilterSelect defaultLabel="All Verification" options={["PENDING", "UNDER_REVIEW", "VERIFIED", "REJECTED"]} />
          </div>
        </FilterBar>

        {state === "loading" ? <LoadingRows /> : null}
        {state === "error" ? <EmptyState label="Hostels could not be loaded." /> : null}
        {state === "ready" && filtered.length === 0 ? (
          <EmptyState label="No hostels found." />
        ) : null}

        {state === "ready" && filtered.length > 0 ? (
          <>
            <DataTable className="min-w-[880px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hostel</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Location</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rent</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Verification</TableHead>
                  <TableHead className="text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((hostel) => (
                  <TableRow key={hostel.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <InitialsAvatar name={hostel.name} size="sm" tone="platform" />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate font-semibold text-foreground">{hostel.name}</p>
                            {hostel.isDemoData ? <DemoDataBadge label={hostel.demoDataLabel} /> : null}
                          </div>
                          <p className="truncate text-xs text-muted-foreground">{hostel.slug}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {hostel.location.area}
                      {hostel.location.city ? `, ${hostel.location.city}` : ""}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {hostel.pricing?.monthlyRentMin ? currency(hostel.pricing.monthlyRentMin) : "-"}
                    </TableCell>
                    <TableCell>
                      <SoftBadge tone={statusToneFromLabel(hostel.status)}>
                        {hostel.status.replaceAll("_", " ")}
                      </SoftBadge>
                    </TableCell>
                    <TableCell>
                      <SoftBadge tone={statusToneFromLabel(hostel.verificationStatus)}>
                        {hostel.verificationStatus.replaceAll("_", " ")}
                      </SoftBadge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap justify-end gap-1.5">
                        {ACTIONS.map((nextAction) => (
                          <button
                            className="rounded-md border border-border px-2 py-1 text-[11px] font-semibold text-foreground hover:bg-muted"
                            key={nextAction}
                            onClick={() => action(hostel.id, nextAction)}
                            type="button"
                          >
                            {nextAction}
                          </button>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </DataTable>
            <ListPager showPageSize total={filtered.length} unit="hostels" />
          </>
        ) : null}
      </Panel>
    </div>
  );
});
