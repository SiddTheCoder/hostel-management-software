"use client";

import {
  Building2,
  CalendarRange,
  Clock3,
  Flag,
  MessageSquare,
  ShieldCheck,
  Users,
  WalletCards,
  Wrench,
} from "lucide-react";
import Link from "next/link";
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
  EmptyInline,
  InitialsAvatar,
  MetricCard,
  PortalPageHeader,
  SectionCard,
  SimpleSparkline,
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

export const PlatformDashboardPageContent = memo(function PlatformDashboardPageContent() {
  const [report, setReport] = useState<ReportRecord | null>(null);
  const [hostels, setHostels] = useState<Hostel[]>([]);
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
        setHostels(hostelData.hostels.slice(0, 8));
        setState("ready");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not load dashboard.");
        setState("error");
      }
    }

    return deferLoad(load);
  }, []);

  const pendingHostels = hostels.filter(
    (hostel) =>
      hostel.status === "PENDING_APPROVAL" ||
      hostel.verificationStatus === "PENDING" ||
      hostel.verificationStatus === "UNDER_REVIEW",
  );
  const recentApprovals = (pendingHostels.length > 0 ? pendingHostels : hostels).slice(0, 5);
  const revenueHostels = hostels.slice(0, 5);

  const metrics = [
    {
      icon: Building2,
      label: "Total Hostels",
      tone: "blue" as const,
      trend: "Live platform total",
      value: formatMetric(report?.totalHostels),
    },
    {
      icon: Clock3,
      label: "Pending Approvals",
      tone: "amber" as const,
      trend: "Awaiting review",
      value: formatMetric(report?.pendingApprovals),
    },
    {
      icon: Users,
      label: "Active Residents",
      tone: "green" as const,
      trend: "Across verified hostels",
      value: formatMetric(report?.activeResidents),
    },
    {
      icon: MessageSquare,
      label: "Inquiries",
      tone: "purple" as const,
      trend: "Discovery funnel",
      value: formatMetric(report?.inquiries),
    },
    {
      icon: Wrench,
      label: "Service Providers",
      tone: "cyan" as const,
      trend: "Registered partners",
      value: formatMetric(report?.serviceProviders),
    },
    {
      icon: Flag,
      label: "Complaints / Flags",
      tone: "rose" as const,
      trendDown: true,
      trend: "Needs moderation",
      value: formatMetric(
        Number(report?.complaints ?? 0) + Number(report?.openListingFlags ?? 0),
      ),
    },
    {
      icon: WalletCards,
      label: "Platform Revenue",
      tone: "green" as const,
      trend: "Payments tracked",
      value:
        typeof report?.platformPayments === "number"
          ? `NPR ${Number(report.platformPayments).toLocaleString()}`
          : formatMetric(report?.platformPayments),
    },
  ];

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PortalPageHeader
        actions={
          <Button
            className="h-10 gap-2 rounded-xl border-border bg-card px-3 text-xs font-semibold text-muted-foreground shadow-sm"
            type="button"
            variant="outline"
          >
            <CalendarRange className="size-3.5 text-role-platform" />
            Live metrics
          </Button>
        }
        breadcrumb={["Home", "Dashboard"]}
        description="Platform-wide live metrics, approvals, and moderation status."
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
              {recentApprovals.length === 0 ? (
                <EmptyInline label="No hostels awaiting review." />
              ) : (
                <DataTable className="min-w-[520px]">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Hostel Name
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Location
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Status
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Verification
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentApprovals.map((hostel) => (
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
                      </TableRow>
                    ))}
                  </TableBody>
                </DataTable>
              )}
            </SectionCard>

            <SectionCard
              actions={<ViewAllLink href="/platform/reports" tone="platform" />}
              title="Platform Payments / Subscriptions"
            >
              {revenueHostels.length === 0 ? (
                <EmptyInline label="No published hostels yet." />
              ) : (
                <DataTable className="min-w-[520px]">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Hostel
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Type
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Rent From
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenueHostels.map((hostel) => (
                      <TableRow key={hostel.id}>
                        <TableCell>
                          <p className="font-semibold text-foreground">{hostel.name}</p>
                          <p className="text-xs text-muted-foreground">{hostel.slug}</p>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {hostel.hostelType.replaceAll("_", " ")}
                        </TableCell>
                        <TableCell className="font-semibold text-foreground">
                          {hostel.pricing?.monthlyRentMin
                            ? `NPR ${hostel.pricing.monthlyRentMin.toLocaleString()}`
                            : "—"}
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
              )}
            </SectionCard>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
            <SectionCard title="Analytics Overview">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    color: "bg-role-platform",
                    label: "Hostel Registrations",
                    value: formatMetric(report?.totalHostels),
                    values: [18, 24, 22, 30, 28, 36, 42, 40, 48, 52],
                  },
                  {
                    color: "bg-emerald-500",
                    label: "Inquiries",
                    value: formatMetric(report?.inquiries),
                    values: [12, 18, 16, 24, 30, 28, 35, 40, 38, 45],
                  },
                  {
                    color: "bg-violet-500",
                    label: "Active Residents",
                    value: formatMetric(report?.activeResidents),
                    values: [20, 22, 26, 30, 28, 34, 38, 42, 44, 50],
                  },
                ].map((chart) => (
                  <div
                    className="rounded-xl border border-border/70 bg-muted/20 p-4"
                    key={chart.label}
                  >
                    <p className="text-xs font-medium text-muted-foreground">{chart.label}</p>
                    <p className="mt-1 text-xl font-bold text-foreground">{chart.value}</p>
                    <div className="mt-4">
                      <SimpleSparkline color={chart.color} values={chart.values} />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              actions={
                <ViewAllLink href="/platform/abuse-flags" label="View all" tone="platform" />
              }
              title="Recent Audit Activity"
            >
              <div className="space-y-3">
                {[
                  {
                    detail: `${formatMetric(report?.pendingApprovals)} hostels pending approval`,
                    icon: Building2,
                    title: "Hostel approvals queue",
                  },
                  {
                    detail: `${formatMetric(report?.openListingFlags)} open listing flags`,
                    icon: Flag,
                    title: "Moderation backlog",
                  },
                  {
                    detail: `${formatMetric(report?.serviceProviders)} registered providers`,
                    icon: Wrench,
                    title: "Service provider network",
                  },
                  {
                    detail: `${formatMetric(report?.reviews)} reviews on platform`,
                    icon: MessageSquare,
                    title: "Review volume",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/15 px-3 py-3"
                      key={item.title}
                    >
                      <span className="mt-0.5 flex size-8 items-center justify-center rounded-full bg-role-platform-soft text-role-platform shadow-sm">
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.detail}</p>
                      </div>
                    </div>
                  );
                })}
                <Button asChild className="h-auto p-0 text-xs font-semibold text-role-platform" variant="link">
                  <Link href="/platform/hostels">
                    <ShieldCheck className="size-3.5" />
                    Open hostel approvals →
                  </Link>
                </Button>
              </div>
            </SectionCard>
          </div>
        </>
      ) : null}
    </div>
  );
});
