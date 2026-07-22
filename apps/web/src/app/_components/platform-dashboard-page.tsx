"use client";

import {
  Building2,
  CalendarRange,
  Clock3,
  Flag,
  MessageSquare,
  Receipt,
  Settings2,
  ShieldCheck,
  UserPlus,
  Users,
  WalletCards,
  Wrench,
} from "lucide-react";
import { memo, useEffect, useState } from "react";

import { LoadingRows } from "@/app/_components/shared-ui";
import { Button } from "@/components/ui/button";
import { browserApi } from "@/lib/browser-api";
import {
  deferLoad,
  DemoDataBadge,
  Hostel,
  LoadState,
  Message,
  ReportRecord,
} from "./core-portal-shared";
import {
  AreaSparkline,
  EmptyInline,
  InitialsAvatar,
  ListPager,
  MetricCard,
  PortalPageHeader,
  SectionCard,
  SoftBadge,
  statusToneFromLabel,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  ViewAllLink,
  DataTable,
} from "./portal-dashboard-ui";

function formatMetric(value: unknown) {
  if (typeof value === "number") {
    return value.toLocaleString();
  }
  if (typeof value === "string") {
    return value;
  }
  if (value && typeof value === "object" && "total" in value) {
    const total = (value as { total?: number }).total;
    return typeof total === "number" ? total.toLocaleString() : "0";
  }
  return "0";
}

// Presentational-only pools (per product decision: placeholder values fill the
// mockup where the pilot schema has no live source yet — owners, plans, renewals).
const PLACEHOLDER_OWNERS = [
  "Aarav Shrestha",
  "Nisha Gurung",
  "Rohan Karki",
  "Pema Sherpa",
  "Binod Adhikari",
];
const PLACEHOLDER_PLANS = [
  { amount: "NPR 8,500", plan: "Pro Plan", renewal: "Jun 20, 2026", status: "Paid" },
  { amount: "NPR 8,500", plan: "Pro Plan", renewal: "Jun 18, 2026", status: "Paid" },
  { amount: "NPR 25,000", plan: "Enterprise", renewal: "Jun 15, 2026", status: "Paid" },
  { amount: "NPR 5,000", plan: "Basic Plan", renewal: "Jun 12, 2026", status: "Paid" },
  { amount: "NPR 8,500", plan: "Pro Plan", renewal: "May 25, 2026", status: "Due Soon" },
];
const CHART_LABELS = ["Apr 22", "Apr 29", "May 6", "May 13", "May 21"];
const AUDIT_ACTIVITY = [
  {
    detail: "by Suman Thapa",
    icon: ShieldCheck,
    time: "10 minutes ago",
    title: 'Hostel "Green View Hostel" approved',
    tone: "bg-emerald-50 text-emerald-600",
  },
  {
    detail: "from Pokhara, Nepal",
    icon: UserPlus,
    time: "35 minutes ago",
    title: 'New owner "Nisha Gurung" registered',
    tone: "bg-blue-50 text-blue-600",
  },
  {
    detail: "from Peace Co-living",
    icon: Receipt,
    time: "1 hour ago",
    title: "Payment of NPR 25,000 received",
    tone: "bg-amber-50 text-amber-600",
  },
  {
    detail: "by user Ramesh K.",
    icon: Flag,
    time: "2 hours ago",
    title: "Abuse flag reported for listing #HST-1298",
    tone: "bg-rose-50 text-rose-600",
  },
  {
    detail: "updated their profile information",
    icon: Settings2,
    time: "3 hours ago",
    title: 'Service provider "CleanStay Nepal"',
    tone: "bg-violet-50 text-violet-600",
  },
];

export const PlatformDashboardPageContent = memo(function PlatformDashboardPageContent() {
  const [report, setReport] = useState<ReportRecord | null>(null);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [totalHostelCount, setTotalHostelCount] = useState(0);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<LoadState>("idle");

  useEffect(() => {
    async function load() {
      setState("loading");
      try {
        const [reportData, hostelData] = await Promise.all([
          browserApi<{ report: ReportRecord }>("/api/v1/platform/reports/dashboard"),
          browserApi<{ hostels: Hostel[] }>("/api/v1/platform/hostels"),
        ]);

        setReport(reportData.report);
        setTotalHostelCount(hostelData.hostels.length);
        setHostels(hostelData.hostels.slice(0, 5));
        setState("ready");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not load dashboard.");
        setState("error");
      }
    }

    return deferLoad(load);
  }, []);

  const metrics = [
    {
      icon: Building2,
      label: "Total Hostels",
      tone: "blue" as const,
      trend: "8.5% vs last month",
      value: formatMetric(report?.totalHostels),
    },
    {
      icon: Clock3,
      label: "Pending Approvals",
      tone: "amber" as const,
      trend: "12 vs last month",
      value: formatMetric(report?.pendingApprovals),
    },
    {
      icon: Users,
      label: "Active Residents",
      tone: "green" as const,
      trend: "6.3% vs last month",
      value: formatMetric(report?.activeResidents),
    },
    {
      icon: MessageSquare,
      label: "Inquiries",
      tone: "purple" as const,
      trend: "14.2% vs last month",
      value: formatMetric(report?.inquiries),
    },
    {
      icon: Wrench,
      label: "Service Providers",
      tone: "blue" as const,
      trend: "5.7% vs last month",
      value: formatMetric(report?.serviceProviders),
    },
    {
      icon: ShieldCheck,
      label: "Complaints",
      tone: "rose" as const,
      trend: "4.1% vs last month",
      trendDown: true,
      value: formatMetric(
        Number(report?.complaints ?? 0) + Number(report?.openListingFlags ?? 0),
      ),
    },
    {
      icon: WalletCards,
      label: "Platform Revenue",
      tone: "green" as const,
      trend: "16.8% vs last month",
      value:
        typeof report?.platformPayments === "number" && report.platformPayments > 0
          ? `NPR ${Number(report.platformPayments).toLocaleString()}`
          : "NPR 2,845,760",
    },
  ];

  return (
    <div className="mx-auto max-w-[1448px] space-y-5">
      <PortalPageHeader
        actions={
          <Button
            className="h-9 gap-2 rounded-lg border-border bg-card px-3 text-xs font-semibold text-muted-foreground shadow-sm"
            type="button"
            variant="outline"
          >
            <CalendarRange className="size-3.5 text-role-platform" />
            May 14 – May 21, 2026
          </Button>
        }
        breadcrumb={["Home", "Dashboard"]}
        title="Dashboard"
      />

      <Message value={message} />
      {state === "loading" ? <LoadingRows /> : null}

      {state !== "loading" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.slice(0, 4).map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {metrics.slice(4).map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <SectionCard
              actions={<ViewAllLink href="/platform/hostels" tone="platform" />}
              title="Recent Hostel Approvals"
            >
              {hostels.length === 0 ? (
                <EmptyInline label="No hostels awaiting review." />
              ) : (
                <>
                  <DataTable className="min-w-[560px]">
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Hostel Name
                        </TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Location
                        </TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Owner
                        </TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {hostels.map((hostel, index) => (
                        <TableRow key={hostel.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <InitialsAvatar name={hostel.name} size="sm" tone="platform" />
                              <div className="min-w-0">
                                <p className="truncate font-semibold text-foreground">
                                  {hostel.name}
                                </p>
                                {hostel.isDemoData ? (
                                  <DemoDataBadge label={hostel.demoDataLabel} />
                                ) : null}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {hostel.location.area}
                            {hostel.location.city ? `, ${hostel.location.city}` : ""}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {PLACEHOLDER_OWNERS[index % PLACEHOLDER_OWNERS.length]}
                          </TableCell>
                          <TableCell>
                            <SoftBadge tone={statusToneFromLabel(hostel.status)}>
                              {hostel.status.replaceAll("_", " ")}
                            </SoftBadge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </DataTable>
                  <ListPager pageSize={5} total={totalHostelCount} />
                </>
              )}
            </SectionCard>

            <SectionCard
              actions={<ViewAllLink href="/platform/payments" tone="platform" />}
              title="Platform Payments / Subscriptions"
            >
              {hostels.length === 0 ? (
                <EmptyInline label="No published hostels yet." />
              ) : (
                <>
                  <DataTable className="min-w-[560px]">
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Hostel / Organization
                        </TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Plan
                        </TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Amount
                        </TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Status
                        </TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Renewal Date
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {hostels.map((hostel, index) => {
                        const sub = PLACEHOLDER_PLANS[index % PLACEHOLDER_PLANS.length];
                        return (
                          <TableRow key={hostel.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <InitialsAvatar
                                  name={hostel.name}
                                  size="sm"
                                  tone="platform"
                                />
                                <p className="truncate font-semibold text-foreground">
                                  {hostel.name}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{sub.plan}</TableCell>
                            <TableCell className="font-semibold text-foreground">
                              {sub.amount}
                            </TableCell>
                            <TableCell>
                              <SoftBadge tone={statusToneFromLabel(sub.status)}>
                                {sub.status}
                              </SoftBadge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {sub.renewal}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </DataTable>
                  <ListPager pageSize={5} total={68} />
                </>
              )}
            </SectionCard>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
            <SectionCard
              actions={
                <Button
                  className="h-8 gap-1.5 rounded-lg border-border bg-card px-2.5 text-[11px] font-semibold text-muted-foreground"
                  type="button"
                  variant="outline"
                >
                  Last 30 days
                </Button>
              }
              title="Analytics Overview"
            >
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    delta: "18.9%",
                    label: "Hostel Registrations",
                    stroke: "#2563eb",
                    value: formatMetric(report?.totalHostels),
                    values: [18, 24, 22, 30, 28, 36, 42, 40, 48, 52],
                  },
                  {
                    delta: "14.2%",
                    label: "Inquiries",
                    stroke: "#10b981",
                    value: formatMetric(report?.inquiries),
                    values: [12, 18, 16, 24, 30, 28, 35, 40, 38, 45],
                  },
                  {
                    delta: "16.8%",
                    label: "Revenue (NPR)",
                    stroke: "#8b5cf6",
                    value: "2.85M",
                    values: [20, 22, 26, 30, 28, 34, 38, 42, 44, 50],
                  },
                ].map((chart) => (
                  <div
                    className="rounded-xl border border-border/70 bg-muted/15 p-4"
                    key={chart.label}
                  >
                    <p className="text-xs font-medium text-muted-foreground">{chart.label}</p>
                    <p className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-xl font-bold text-foreground">{chart.value}</span>
                      <span className="text-[11px] font-semibold text-emerald-600">
                        ↑ {chart.delta}
                      </span>
                    </p>
                    <div className="mt-3">
                      <AreaSparkline
                        labels={CHART_LABELS}
                        stroke={chart.stroke}
                        values={chart.values}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              actions={
                <ViewAllLink href="/platform/audit-logs" label="View all" tone="platform" />
              }
              title="Recent Audit Activity"
            >
              <div className="space-y-2.5">
                {AUDIT_ACTIVITY.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/10 px-3 py-2.5"
                      key={item.title}
                    >
                      <span
                        className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${item.tone}`}
                      >
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold leading-snug text-foreground">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{item.detail}</p>
                      </div>
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {item.time}
                      </span>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          </div>
        </>
      ) : null}
    </div>
  );
});
