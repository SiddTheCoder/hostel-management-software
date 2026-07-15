"use client";

import {
  AlertTriangle,
  BedDouble,
  ClipboardList,
  Moon,
  Users,
  Utensils,
  WalletCards,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { memo, useEffect, useState } from "react";

import { currency, LoadingRows } from "@/app/_components/shared-ui";
import { browserApi } from "@/lib/browser-api";
import { deferLoad, Message, ReportRecord } from "./core-portal-shared";
import {
  MetricCard,
  PortalPageHeader,
  SectionCard,
  SoftBadge,
} from "./portal-dashboard-ui";

function num(value: unknown) {
  return typeof value === "number" ? value : 0;
}

export const HostelAdminDashboardPageContent = memo(function HostelAdminDashboardPageContent() {
  const [report, setReport] = useState<ReportRecord | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await browserApi<{ report: ReportRecord }>(
          "/api/v1/hostel-admin/reports/dashboard",
        );
        setReport(data.report);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not load dashboard.");
      } finally {
        setLoading(false);
      }
    }

    return deferLoad(load);
  }, []);

  const nightSummary =
    report?.nightStatusSummary && typeof report.nightStatusSummary === "object"
      ? (report.nightStatusSummary as Record<string, number>)
      : {};

  const metrics = [
    {
      href: "/hostel-admin/residents",
      icon: Users,
      label: "Residents",
      tone: "cyan" as const,
      value: num(report?.residents).toLocaleString(),
    },
    {
      href: "/hostel-admin/rooms",
      icon: BedDouble,
      label: "Vacant Beds",
      tone: "green" as const,
      value: num(report?.vacantBeds).toLocaleString(),
    },
    {
      href: "/hostel-admin/payments",
      icon: WalletCards,
      label: "Monthly Dues",
      tone: "amber" as const,
      value: currency(num(report?.monthlyDues)),
    },
    {
      href: "/hostel-admin/payments",
      icon: WalletCards,
      label: "Collected",
      tone: "green" as const,
      value: currency(num(report?.paidAmount)),
    },
    {
      href: "/hostel-admin/complaints",
      icon: AlertTriangle,
      label: "Complaints",
      tone: "rose" as const,
      value: num(report?.complaints).toLocaleString(),
    },
    {
      href: "/hostel-admin/maintenance",
      icon: Wrench,
      label: "Maintenance",
      tone: "purple" as const,
      value: num(report?.maintenanceRequests).toLocaleString(),
    },
    {
      href: "/hostel-admin/food",
      icon: Utensils,
      label: "Food Feedback",
      tone: "blue" as const,
      value: num(report?.foodFeedback).toLocaleString(),
    },
    {
      href: "/hostel-admin/payments",
      icon: ClipboardList,
      label: "Pending Proofs",
      tone: "amber" as const,
      value: num(report?.pendingPaymentProofs).toLocaleString(),
    },
  ];

  const quickLinks = [
    { href: "/hostel-admin/residents", label: "Manage Residents" },
    { href: "/hostel-admin/payments", label: "Review Payments" },
    { href: "/hostel-admin/inquiries", label: "New Inquiries" },
    { href: "/hostel-admin/night-status", label: "Night Status" },
    { href: "/hostel-admin/maintenance", label: "Maintenance Queue" },
    { href: "/hostel-admin/notices", label: "Publish Notice" },
  ];

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PortalPageHeader
        breadcrumb={["Home", "Dashboard"]}
        description="Live hostel-scoped operations metrics from the database."
        title="Dashboard"
      />
      <Message value={message} />
      {loading ? <LoadingRows /> : null}

      {!loading ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <Link className="transition hover:-translate-y-0.5" href={metric.href} key={metric.label}>
                <MetricCard
                  icon={metric.icon}
                  label={metric.label}
                  tone={metric.tone}
                  value={metric.value}
                />
              </Link>
            ))}
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
            <SectionCard title="Night Status Snapshot">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Object.keys(nightSummary).length === 0 ? (
                  <p className="col-span-full text-sm text-muted-foreground">
                    No night status records yet.
                  </p>
                ) : (
                  Object.entries(nightSummary).map(([status, count]) => (
                    <div
                      className="rounded-lg border border-border bg-muted/20 p-4"
                      key={status}
                    >
                      <div className="flex items-center gap-2">
                        <Moon className="size-4 text-role-admin" />
                        <SoftBadge
                          tone={
                            status.toLowerCase().includes("inside")
                              ? "green"
                              : status.toLowerCase().includes("outside")
                                ? "rose"
                                : "amber"
                          }
                        >
                          {status.replaceAll("_", " ")}
                        </SoftBadge>
                      </div>
                      <p className="mt-3 text-2xl font-bold text-foreground">{count}</p>
                    </div>
                  ))
                )}
              </div>
            </SectionCard>

            <SectionCard title="Quick Actions">
              <div className="grid gap-2 sm:grid-cols-2">
                {quickLinks.map((item) => (
                  <Link
                    className="rounded-lg border border-border bg-muted/20 px-3 py-3 text-sm font-semibold text-foreground transition hover:border-role-admin/40 hover:bg-role-admin-soft/40"
                    href={item.href}
                    key={item.href}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SectionCard>
          </div>
        </>
      ) : null}
    </div>
  );
});
