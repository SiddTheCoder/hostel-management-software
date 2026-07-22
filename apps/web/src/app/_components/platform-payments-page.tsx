"use client";

import { AlertTriangle, Clock3, FileText, WalletCards } from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";

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
  SoftBadge,
  statusToneFromLabel,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/portal-dashboard-ui";
import { deferLoad, LoadState, Message } from "./core-portal-shared";

type PlatformPayment = {
  dueAmount: number;
  dueDate: string | null;
  hostelName: string;
  id: string;
  month: string;
  paidAmount: number;
  status: string;
};

type PlatformPaymentsResponse = {
  overview: {
    outstanding: number;
    pendingProofs: number;
    statusCounts: Record<string, number>;
    totalDue: number;
    totalPaid: number;
  };
  recent: PlatformPayment[];
};

const TABS: Array<{ key: string; label: string }> = [
  { key: "ALL", label: "All" },
  { key: "PAID", label: "Paid" },
  { key: "UNPAID", label: "Unpaid" },
  { key: "PARTIAL", label: "Partial" },
  { key: "OVERDUE", label: "Overdue" },
];

function formatDate(value: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
}

export const PlatformPaymentsPageContent = memo(function PlatformPaymentsPageContent() {
  const [data, setData] = useState<PlatformPaymentsResponse | null>(null);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<LoadState>("idle");
  const [tab, setTab] = useState("ALL");

  useEffect(() => {
    async function load() {
      setState("loading");
      try {
        const result = await browserApi<PlatformPaymentsResponse>(
          "/api/v1/platform/payments",
        );

        setData(result);
        setState("ready");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not load payments.");
        setState("error");
      }
    }

    return deferLoad(load);
  }, []);

  const overview = data?.overview;
  const recent = useMemo(() => data?.recent ?? [], [data]);
  const rows = useMemo(
    () => (tab === "ALL" ? recent : recent.filter((payment) => payment.status === tab)),
    [recent, tab],
  );

  const tabCount = (key: string) =>
    key === "ALL" ? recent.length : (overview?.statusCounts[key] ?? 0);

  return (
    <div className="mx-auto max-w-[1448px] space-y-5">
      <PortalPageHeader
        breadcrumb={["Home", "Payments"]}
        description="Platform-wide roll-up of resident payments recorded across all hostels."
        title="Payments"
      />
      <Message value={message} />

      {state === "loading" ? <LoadingRows /> : null}
      {state === "error" ? <EmptyState label="Payments could not be loaded." /> : null}

      {state === "ready" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              icon={WalletCards}
              label="Total Collection"
              note="Across all hostels"
              noteTone="green"
              tone="green"
              value={currency(overview?.totalPaid ?? 0)}
            />
            <MetricCard
              icon={FileText}
              label="Due Amount"
              note="Outstanding balance"
              noteTone="amber"
              tone="blue"
              value={currency(overview?.outstanding ?? 0)}
            />
            <MetricCard
              icon={Clock3}
              label="Pending Proofs"
              note="Awaiting approval"
              noteTone="amber"
              tone="amber"
              value={overview?.pendingProofs ?? 0}
            />
            <MetricCard
              icon={AlertTriangle}
              label="Overdue"
              note="Needs follow-up"
              noteTone="rose"
              tone="rose"
              value={overview?.statusCounts.OVERDUE ?? 0}
            />
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
            <Panel>
              <div className="mb-4 flex flex-wrap gap-4 border-b border-border/60">
                {TABS.map((item) => (
                  <button
                    className={
                      tab === item.key
                        ? "-mb-px border-b-2 border-role-platform pb-2.5 text-sm font-semibold text-role-platform"
                        : "-mb-px border-b-2 border-transparent pb-2.5 text-sm font-medium text-muted-foreground"
                    }
                    key={item.key}
                    onClick={() => setTab(item.key)}
                    type="button"
                  >
                    {item.label} ({tabCount(item.key)})
                  </button>
                ))}
              </div>

              <FilterBar>
                <FilterSelect className="max-w-40" defaultLabel="All Hostels" />
                <div className="flex flex-wrap gap-2">
                  <FilterSelect defaultLabel="All Methods" options={["eSewa", "Khalti", "Fonepay", "Bank Transfer", "Cash"]} />
                  <FilterSelect defaultLabel="This Month" options={["May 2026", "Apr 2026", "Mar 2026"]} />
                </div>
              </FilterBar>

              {rows.length === 0 ? (
                <EmptyState label="No payments in this view." />
              ) : (
                <>
                  <DataTable className="min-w-[640px]">
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hostel</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Month</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Billed</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Paid</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Due Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <InitialsAvatar name={payment.hostelName} size="sm" tone="platform" />
                              <p className="truncate font-semibold text-foreground">
                                {payment.hostelName}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{payment.month}</TableCell>
                          <TableCell>{currency(payment.dueAmount)}</TableCell>
                          <TableCell className="font-semibold text-foreground">
                            {currency(payment.paidAmount)}
                          </TableCell>
                          <TableCell>
                            <SoftBadge tone={statusToneFromLabel(payment.status)}>
                              {payment.status.replaceAll("_", " ")}
                            </SoftBadge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-muted-foreground">
                            {formatDate(payment.dueDate)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </DataTable>
                  <ListPager showPageSize total={rows.length} unit="results" />
                </>
              )}
            </Panel>

            <div className="space-y-5">
              <Panel title="Collection Summary">
                <div className="space-y-3">
                  {[
                    { label: "Total Collected", value: currency(overview?.totalPaid ?? 0) },
                    { label: "Outstanding", value: currency(overview?.outstanding ?? 0) },
                    { label: "Total Billed", value: currency(overview?.totalDue ?? 0) },
                  ].map((item) => (
                    <div
                      className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0 last:pb-0"
                      key={item.label}
                    >
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="text-sm font-semibold text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Status Breakdown">
                {overview && Object.keys(overview.statusCounts).length > 0 ? (
                  <div className="space-y-2.5">
                    {Object.entries(overview.statusCounts).map(([status, count]) => (
                      <div className="flex items-center justify-between" key={status}>
                        <SoftBadge tone={statusToneFromLabel(status)}>
                          {status.replaceAll("_", " ")}
                        </SoftBadge>
                        <span className="text-sm font-semibold text-foreground">{count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState label="No payment records yet." />
                )}
              </Panel>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
});
