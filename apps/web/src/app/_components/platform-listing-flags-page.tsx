"use client";

import React, { useCallback, useState, useEffect, useMemo, type FormEvent } from "react";
import { AlertOctagon, CheckCircle2, Flag, XCircle } from "lucide-react";

import { EmptyState, Panel } from "@/app/_components/shared-ui";
import { browserApi } from "@/lib/browser-api";
import {
  MetricCard,
  PortalPageHeader,
  SoftBadge,
  statusToneFromLabel,
} from "@/app/_components/portal-dashboard-ui";
import { Message, field, type ListingFlag } from "./portal-shared";

export const PlatformListingFlagsPageContent = React.memo(
  function PlatformListingFlagsPageContent() {
    const [flags, setFlags] = useState<ListingFlag[]>([]);
    const [message, setMessage] = useState("");

    const load = useCallback(async () => {
      try {
        const data = await browserApi<{ flags: ListingFlag[] }>(
          "/api/v1/platform/listing-flags",
        );

        setFlags(data.flags);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not load flags.");
      }
    }, []);

    useEffect(() => {
      const timer = window.setTimeout(() => {
        void load();
      }, 0);

      return () => window.clearTimeout(timer);
    }, [load]);

    const runCheck = useCallback(
      async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const hostelId = field(form, "hostelId");
        const currentForm = event.currentTarget;

        try {
          await browserApi(`/api/v1/platform/hostels/${hostelId}/run-duplicate-check`, {
            body: JSON.stringify({}),
            method: "POST",
          });
          setMessage("Duplicate check completed.");
          currentForm.reset();
          await load();
        } catch (error) {
          setMessage(error instanceof Error ? error.message : "Could not run check.");
        }
      },
      [load],
    );

    const resolve = useCallback(
      async (flagId: string, status: "DISMISSED" | "RESOLVED") => {
        const resolutionNote = window.prompt("Resolution note")?.trim();

        if (!resolutionNote) {
          return;
        }

        try {
          await browserApi(`/api/v1/platform/listing-flags/${flagId}/resolve`, {
            body: JSON.stringify({ resolutionNote, status }),
            method: "PATCH",
          });
          await load();
        } catch (error) {
          setMessage(error instanceof Error ? error.message : "Could not resolve flag.");
        }
      },
      [load],
    );

    const counts = useMemo(() => {
      const by = (status: string) => flags.filter((flag) => flag.status === status).length;
      return {
        dismissed: by("DISMISSED"),
        highRisk: flags.filter((flag) => flag.riskLevel?.toUpperCase() === "HIGH").length,
        open: by("OPEN"),
        resolved: by("RESOLVED"),
      };
    }, [flags]);

    return (
      <div className="mx-auto max-w-[1448px] space-y-5">
        <PortalPageHeader
          breadcrumb={["Home", "Abuse Flags"]}
          description="Manual duplicate and ghost-listing checks for hostel records."
          title="Abuse Flags"
        />
        <Message value={message} />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={Flag} label="Open Flags" note="Needs review" noteTone="amber" tone="amber" value={counts.open} />
          <MetricCard icon={AlertOctagon} label="High Risk" note="Duplicate signals" noteTone="rose" tone="rose" value={counts.highRisk} />
          <MetricCard icon={CheckCircle2} label="Resolved" note="Actioned" noteTone="green" tone="green" value={counts.resolved} />
          <MetricCard icon={XCircle} label="Dismissed" note="No action needed" tone="slate" value={counts.dismissed} />
        </div>

        <Panel title="Run Duplicate Check">
          <form className="flex flex-wrap gap-3" onSubmit={runCheck}>
            <input
              className="h-11 min-w-80 flex-1 rounded-xl border border-border bg-background px-3 text-sm"
              name="hostelId"
              placeholder="Hostel id"
              required
            />
            <button className="rounded-xl bg-role-platform px-4 py-2 text-sm font-semibold text-white" type="submit">
              Run Check
            </button>
          </form>
        </Panel>

        <Panel title="Flags">
          {flags.length === 0 ? <EmptyState label="No listing flags." /> : null}
          <div className="space-y-3">
            {flags.map((flag) => (
              <div className="rounded-xl border border-border p-4" key={flag.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{flag.reason}</p>
                    <p className="text-sm text-muted-foreground">
                      Hostel {flag.hostelId} / Matches {flag.matchedHostelIds.length}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {flag.signals.join(", ") || "No duplicate signal"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <SoftBadge tone={statusToneFromLabel(flag.riskLevel)}>{flag.riskLevel}</SoftBadge>
                    <SoftBadge tone={statusToneFromLabel(flag.status)}>{flag.status}</SoftBadge>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-foreground"
                    onClick={() => void resolve(flag.id, "RESOLVED")}
                    type="button"
                  >
                    Resolve
                  </button>
                  <button
                    className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-foreground"
                    onClick={() => void resolve(flag.id, "DISMISSED")}
                    type="button"
                  >
                    Dismiss
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
