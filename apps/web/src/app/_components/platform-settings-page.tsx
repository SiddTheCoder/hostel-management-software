"use client";

import { KeyRound, Settings, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { memo, useEffect, useState } from "react";

import { EmptyState, LoadingRows, Panel, StatusBadge } from "@/app/_components/shared-ui";
import { browserApi } from "@/lib/browser-api";
import { deferLoad, LoadState, Message, PageHeader, ReportRecord } from "./core-portal-shared";

type PlatformOwner = {
  email: string | null;
  emailVerified: boolean;
  id: string;
  name: string;
  phone: string | null;
  role: string;
  status: string;
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/60 py-2 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

export const PlatformSettingsPageContent = memo(function PlatformSettingsPageContent() {
  const [owner, setOwner] = useState<PlatformOwner | null>(null);
  const [report, setReport] = useState<ReportRecord | null>(null);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<LoadState>("idle");

  useEffect(() => {
    async function load() {
      setState("loading");
      try {
        const [me, reportData] = await Promise.all([
          browserApi<{ user: PlatformOwner }>("/api/v1/auth/me"),
          browserApi<{ report: ReportRecord }>("/api/v1/platform/reports/dashboard"),
        ]);

        setOwner(me.user);
        setReport(reportData.report);
        setState("ready");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not load settings.");
        setState("error");
      }
    }

    return deferLoad(load);
  }, []);

  return (
    <div className="mx-auto max-w-[1000px] space-y-6">
      <PageHeader
        description="Platform owner account and workspace overview."
        icon={Settings}
        title="Settings"
      />
      <Message value={message} />

      {state === "loading" ? <LoadingRows /> : null}
      {state === "error" ? <EmptyState label="Settings could not be loaded." /> : null}

      {state === "ready" ? (
        <div className="grid gap-5 lg:grid-cols-2">
          <Panel title="Owner Account">
            {owner ? (
              <div className="space-y-1">
                <DetailRow label="Name" value={owner.name} />
                <DetailRow label="Email" value={owner.email ?? "-"} />
                <DetailRow label="Phone" value={owner.phone ?? "-"} />
                <div className="flex items-center justify-between gap-4 border-b border-border/60 py-2">
                  <span className="text-sm text-muted-foreground">Role</span>
                  <StatusBadge>{owner.role}</StatusBadge>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-border/60 py-2">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <StatusBadge>{owner.status}</StatusBadge>
                </div>
                <div className="flex items-center justify-between gap-4 py-2">
                  <span className="text-sm text-muted-foreground">Email verified</span>
                  <StatusBadge>{owner.emailVerified ? "VERIFIED" : "UNVERIFIED"}</StatusBadge>
                </div>
              </div>
            ) : (
              <EmptyState label="Account is not loaded." />
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground"
                href="/reset-password"
              >
                <KeyRound className="size-4" /> Change password
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground"
                href="/platform/users"
              >
                <ShieldCheck className="size-4" /> Manage users
              </Link>
            </div>
          </Panel>

          <Panel title="Platform Snapshot">
            <div className="space-y-1">
              <DetailRow label="Total hostels" value={String(report?.totalHostels ?? 0)} />
              <DetailRow
                label="Pending approvals"
                value={String(report?.pendingApprovals ?? 0)}
              />
              <DetailRow
                label="Active residents"
                value={String(report?.activeResidents ?? 0)}
              />
              <DetailRow
                label="Service providers"
                value={String(report?.serviceProviders ?? 0)}
              />
              <DetailRow label="Reviews" value={String(report?.reviews ?? 0)} />
              <DetailRow
                label="Open listing flags"
                value={String(report?.openListingFlags ?? 0)}
              />
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Platform-wide configuration controls (defaults, limits, overrides) arrive with the
              Phase 5 settings module.
            </p>
          </Panel>
        </div>
      ) : null}
    </div>
  );
});
