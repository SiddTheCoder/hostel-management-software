"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  AlertCircle,
  AlertCircle as AlertIcon,
  ArrowRight,
  BadgeCheck,
  BedDouble,
  Bell,
  Building2,
  Calendar,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  Grid2X2,
  Heart,
  HelpCircle,
  Home,
  KeyRound,
  List,
  LockKeyhole,
  Mail,
  MapPin,
  MessageSquare,
  Moon,
  MoreVertical,
  Phone,
  PhoneCall,
  Plus,
  QrCode,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Trash2,
  Upload,
  User,
  UserRound,
  Users,
  Utensils,
  Wifi,
  WalletCards,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import {
  adminMetrics,
  auditActivity,
  complaints,
  imageSet,
  notices,
  payments,
  platformMetrics,
  providers,
  hostelListings,
  residents,
  weeklyMenu,
  type HostelSummary,
  type Tone,
} from "@/lib/hostelhub-data";
import {
  AnimatedPage,
  Breadcrumbs,
  FormField,
  HostelCard,
  HostelListCard,
  MetricCard,
  NepalBannerGraphic,
  PublicShell,
  SectionCard,
  StatusPill,
  TableView,
  formatMoney,
  humanize,
  metricIcons,
  toneStyles,
  type AuthMode,
  type PortalKind,
} from "./shared";

function MetricGrid({
  metrics,
}: {
  metrics: readonly (readonly [string, string, string, string])[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map(([label, value, detail, tone], index) => (
        <MetricCard
          detail={detail}
          icon={metricIcons[index % metricIcons.length]}
          key={label}
          label={label}
          tone={tone as Tone}
          value={value}
        />
      ))}
    </div>
  );
}

function Sparkline({ tone = "platform" }: { tone?: Tone }) {
  return (
    <div className="mt-5 flex h-32 items-end gap-2 rounded-lg bg-muted/30 px-4 py-3">
      {[42, 54, 49, 76, 62, 88, 70, 79, 96, 82, 91, 105].map((height, index) => (
        <div
          className={cn("w-full rounded-t", toneStyles[tone].bg)}
          key={index}
          style={{ height: `${height}%`, opacity: 0.35 + index / 24 }}
        />
      ))}
    </div>
  );
}

function PlatformDashboard() {
  return (
    <AnimatedPage className="mx-auto max-w-[1448px] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Home / Dashboard</p>
        </div>
        <button className="app-control inline-flex items-center gap-2">
          <CalendarDays className="size-4" />
          May 14 - May 21, 2026
        </button>
      </div>
      <MetricGrid metrics={platformMetrics} />
      <div className="grid gap-5 xl:grid-cols-2">
        <SectionCard
          action={
            <Link
              className="text-sm font-semibold text-role-platform"
              href="/platform/hostels"
            >
              View all
            </Link>
          }
          title="Recent Hostel Approvals"
        >
          <TableView
            headers={["Hostel Name", "Location", "Owner", "Submitted On", "Status"]}
            rows={hostelListings.map((hostel) => [
              <NameCell image={hostel.image} key={hostel.id} name={hostel.name} />,
              `${hostel.city}, ${hostel.area}`,
              hostel.owner,
              "May 21, 2026",
              <StatusPill key={hostel.status}>{hostel.status}</StatusPill>,
            ])}
          />
        </SectionCard>
        <SectionCard title="Platform Payments / Subscriptions">
          <TableView
            headers={[
              "Hostel / Organization",
              "Plan",
              "Amount",
              "Status",
              "Renewal Date",
            ]}
            rows={hostelListings.map((hostel, index) => [
              <NameCell image={hostel.image} key={hostel.id} name={hostel.name} />,
              index === 3 ? "Enterprise" : "Pro Plan",
              index === 3 ? "NPR 25,000" : "NPR 8,500",
              <StatusPill key={hostel.id} tone={index === 4 ? "warning" : "success"}>
                {index === 4 ? "Due Soon" : "Paid"}
              </StatusPill>,
              `Jun ${20 - index * 2}, 2026`,
            ])}
          />
        </SectionCard>
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard
          action={<button className="app-control">Last 30 days</button>}
          title="Analytics Overview"
        >
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Hostel Registrations", "124", "18.9%", "platform"],
              ["Inquiries", "2,356", "14.2%", "success"],
              ["Revenue (NPR)", "NPR 2.85M", "16.8%", "guardian"],
            ].map(([label, value, change, tone]) => (
              <div className="rounded-lg border border-border p-4" key={label}>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-3 text-2xl font-bold text-primary">{value}</p>
                <p
                  className={cn(
                    "mt-1 text-xs font-semibold",
                    toneStyles[tone as Tone].text,
                  )}
                >
                  {change}
                </p>
                <Sparkline tone={tone as Tone} />
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Recent Audit Activity">
          <div className="divide-y divide-border">
            {auditActivity.map((item, index) => (
              <div className="flex items-start gap-3 py-3 first:pt-0" key={item}>
                <span
                  className={cn(
                    "mt-1 rounded-lg p-2",
                    toneStyles[index % 2 ? "platform" : "success"].icon,
                  )}
                >
                  <FileCheck2 className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-primary">{item}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {index + 1}0 minutes ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </AnimatedPage>
  );
}

function NameCell({
  image,
  name,
  subtitle,
}: {
  image?: string;
  name: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      {image ? (
        <div
          className="size-9 rounded-md bg-cover bg-center"
          style={{ backgroundImage: `url("${image}")` }}
        />
      ) : (
        <span className="flex size-9 items-center justify-center rounded-full bg-muted text-xs font-bold">
          {name.slice(0, 2).toUpperCase()}
        </span>
      )}
      <div>
        <p className="font-semibold text-primary">{name}</p>
        {subtitle ? <p className="text-xs text-muted-foreground">{subtitle}</p> : null}
      </div>
    </div>
  );
}

function AdminResidentsScreen() {
  const selected = residents[1];

  return (
    <AnimatedPage className="mx-auto grid max-w-[1448px] gap-6 xl:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Residents</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage hostel residents, their details, and status.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="app-control inline-flex items-center gap-2">
              <QrCode className="size-4" />
              Generate Activation Code
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-role-admin px-5 py-3 text-sm font-semibold text-white">
              <Plus className="size-4" />
              Add Resident
            </button>
          </div>
        </div>
        <SectionCard>
          <div className="grid gap-4 p-5 lg:grid-cols-[1.6fr_1fr_1fr_1fr_auto]">
            <label className="flex h-12 items-center gap-3 rounded-lg border border-border px-3">
              <Search className="size-4 text-muted-foreground" />
              <input
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Search by name, phone, room..."
              />
            </label>
            {["Status", "Room", "Payment Status", "Activation Status"].map((item) => (
              <button
                className="app-control flex items-center justify-between"
                key={item}
              >
                All {item === "Room" ? "Rooms" : ""}
                <ChevronDown className="size-4" />
              </button>
            ))}
            <button className="app-control inline-flex items-center justify-center gap-2">
              <Filter className="size-4" />
              Filters
            </button>
          </div>
        </SectionCard>
        <SectionCard
          action={
            <button className="app-control inline-flex items-center gap-2">
              <Download className="size-4" /> Export
            </button>
          }
          title="Total Residents: 128"
        >
          <TableView
            headers={[
              "Resident",
              "Room / Bed",
              "Guardian Contact",
              "Emergency Contact",
              "Fee Status",
              "Night Status",
              "Activation Code",
            ]}
            rows={residents.map((resident) => [
              <NameCell
                image={resident.avatar}
                key={resident.id}
                name={resident.name}
                subtitle={`Room ${resident.room}`}
              />,
              `${resident.room} / ${resident.bed}`,
              `${resident.guardian} ${resident.guardianPhone}`,
              `${resident.emergencyContact} ${resident.emergencyPhone}`,
              <StatusPill key={resident.id}>{resident.feeStatus}</StatusPill>,
              <StatusPill key={`${resident.id}-night`}>
                {resident.nightStatus}
              </StatusPill>,
              <StatusPill key={`${resident.id}-activation`}>
                {resident.activationStatus}
              </StatusPill>,
            ])}
          />
        </SectionCard>
      </div>
      <aside className="app-card sticky top-20 h-fit p-5">
        <button className="float-right text-muted-foreground">
          <X className="size-5" />
        </button>
        <div className="mt-6 flex items-center gap-4">
          <div
            className="size-20 rounded-full bg-cover bg-center"
            style={{ backgroundImage: `url("${selected.avatar}")` }}
          />
          <div>
            <h2 className="text-xl font-bold text-primary">{selected.name}</h2>
            <p className="text-sm text-muted-foreground">
              Room {selected.room} / {selected.bed}
            </p>
            <div className="mt-2">
              <StatusPill>{selected.nightStatus}</StatusPill>
            </div>
          </div>
        </div>
        <div className="mt-7 flex border-b border-border text-sm font-semibold">
          {["Details", "Payments", "Activity", "Documents"].map((tab, index) => (
            <button
              className={cn(
                "border-b-2 px-4 py-3",
                index === 0
                  ? "border-role-admin text-role-admin"
                  : "border-transparent text-muted-foreground",
              )}
              key={tab}
            >
              {tab}
            </button>
          ))}
        </div>
        {[
          [
            "Personal Information",
            ["Full Name", selected.name],
            ["Date of Birth", "12 Feb 2003"],
            ["Phone", "9801234567"],
            ["Email", "ritesh.kumar@example.com"],
          ],
          [
            "Guardian Information",
            ["Name", selected.guardian],
            ["Relationship", "Father"],
            ["Phone", selected.guardianPhone],
          ],
          [
            "Emergency Contact",
            ["Name", selected.emergencyContact],
            ["Relationship", "Mother"],
            ["Phone", selected.emergencyPhone],
          ],
          [
            "Hostel Information",
            ["Room / Bed", `${selected.room} / ${selected.bed}`],
            ["Date of Join", selected.joinedOn],
            ["Stay Type", "Single"],
          ],
        ].map(([title, ...items]) => (
          <div className="mt-4 rounded-lg border border-border p-4" key={title as string}>
            <h3 className="font-semibold text-primary">{title as string}</h3>
            <dl className="mt-4 space-y-3 text-sm">
              {items.map(([label, value]) => (
                <div className="flex justify-between gap-4" key={label}>
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="font-semibold text-primary">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </aside>
    </AnimatedPage>
  );
}

function AdminDashboard() {
  return (
    <AnimatedPage className="mx-auto max-w-[1448px] space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Hostel Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Daily operating overview for Green View Hostel.
        </p>
      </div>
      <MetricGrid metrics={adminMetrics} />
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard title="Night Status">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Inside Hostel", "98", "success"],
              ["Outside Hostel", "10", "danger"],
            ].map(([label, value, tone]) => (
              <div className="rounded-lg border border-border p-5" key={label}>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-3 text-4xl font-bold text-primary">{value}</p>
                <StatusPill tone={tone as Tone}>{label}</StatusPill>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Payment Proofs">
          <TableView
            headers={["Resident", "Room", "Amount", "Status"]}
            rows={residents
              .slice(0, 4)
              .map((resident, index) => [
                <NameCell
                  image={resident.avatar}
                  key={resident.id}
                  name={resident.name}
                />,
                resident.room,
                "NPR 8,500",
                <StatusPill key={resident.id}>
                  {index % 2 ? "verified" : "pending"}
                </StatusPill>,
              ])}
          />
        </SectionCard>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {complaints.map((complaint) => (
          <SectionCard key={complaint.id}>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <AlertCircle className="size-5 text-role-admin" />
                <StatusPill>{complaint.priority}</StatusPill>
              </div>
              <h2 className="mt-4 font-semibold text-primary">{complaint.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                SLA: {complaint.sla} / Status: {complaint.status}
              </p>
            </div>
          </SectionCard>
        ))}
      </div>
    </AnimatedPage>
  );
}

function ResidentDashboard() {
  return (
    <AnimatedPage className="mx-auto max-w-[1448px] space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">
          Welcome back, <span className="text-role-resident">Aarav!</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here is what is happening at your hostel today.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-4">
        {[
          ["Room / Bed", "201 / Bed B", "Your Room", BedDouble, "resident"],
          ["Fee Status", "NPR 8,500", "Due on 25 Jun 2026", WalletCards, "warning"],
          ["Unread Notices", "3", "New notices", Bell, "platform"],
          ["Night Status", "Inside Hostel", "Checked in at 9:15 PM", Moon, "guardian"],
        ].map(([label, value, detail, Icon, tone]) => {
          const CardIcon = Icon as LucideIcon;

          return (
            <MetricCard
              detail={detail as string}
              icon={CardIcon}
              key={label as string}
              label={label as string}
              tone={tone as Tone}
              value={value as string}
            />
          );
        })}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_1.1fr_0.9fr]">
        <SectionCard title="Today's Menu">
          <div className="space-y-4">
            {weeklyMenu.map((meal) => (
              <div
                className="flex gap-4 border-b border-border pb-4 last:border-0"
                key={meal.id}
              >
                <div
                  className="size-24 rounded-lg bg-cover bg-center"
                  style={{ backgroundImage: `url("${meal.image}")` }}
                />
                <div>
                  <p className="font-semibold text-primary">{meal.meal}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{meal.items}</p>
                  <StatusPill tone="resident">{meal.time}</StatusPill>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
        <div className="space-y-5">
          <SectionCard title="Quick Actions">
            <div className="grid grid-cols-5 gap-4">
              {[
                {
                  href: "/resident/payments",
                  Icon: WalletCards,
                  label: "Payments",
                },
                {
                  href: "/resident/notices",
                  Icon: Bell,
                  label: "Notices",
                },
                {
                  href: "/resident/complaints",
                  Icon: AlertCircle,
                  label: "Complaints",
                },
                {
                  href: "/resident/sos",
                  Icon: ShieldCheck,
                  label: "SOS",
                },
                {
                  href: "/resident/reviews",
                  Icon: Star,
                  label: "Reviews",
                },
              ].map(({ href, Icon, label }) => {
                return (
                  <Link
                    className="text-center text-sm font-semibold text-primary"
                    href={href}
                    key={label}
                  >
                    <span className="mx-auto mb-2 flex size-14 items-center justify-center rounded-lg bg-role-resident-soft text-role-resident">
                      <Icon className="size-6" />
                    </span>
                    {label}
                  </Link>
                );
              })}
            </div>
          </SectionCard>
          <SectionCard title="Recent Notices">
            <div className="divide-y divide-border">
              {notices.map((notice) => (
                <div className="py-3 first:pt-0" key={notice.id}>
                  <div className="flex justify-between gap-4">
                    <p className="font-semibold text-primary">{notice.title}</p>
                    <span className="text-xs text-muted-foreground">{notice.date}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{notice.detail}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
        <SectionCard title="Payment Due">
          <div className="rounded-lg border border-border p-5">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-primary">June 2026 Fee</p>
              <p className="text-xl font-bold text-primary">NPR 8,500</p>
            </div>
            <p className="mt-5 text-sm text-danger">Due 25 Jun 2026 (5 days left)</p>
            <Link
              className="mt-5 flex justify-center rounded-md bg-role-resident px-4 py-3 text-sm font-semibold text-white"
              href="/resident/payment-proof"
            >
              Pay Now
            </Link>
          </div>
        </SectionCard>
      </div>
      <SectionCard>
        <div className="grid gap-5 p-5 lg:grid-cols-[260px_1fr_1fr_1fr_1fr]">
          <div
            className="h-40 rounded-lg bg-cover bg-center"
            style={{ backgroundImage: `url("${hostelListings[0].image}")` }}
          />
          {[
            ["Green View Hostel", "Lalitpur, Kathmandu", "info@greenviewhostel.com"],
            ["Warden", "Ritesh Kumar", "01-9851122334"],
            ["Assistant Warden", "Sujan Acharya", "01-9812345678"],
            ["Check-in Time", "9:15 PM", "May 20, 2026"],
          ].map(([title, line1, line2]) => (
            <div className="border-l border-border pl-5" key={title}>
              <p className="font-semibold text-primary">{title}</p>
              <p className="mt-3 text-sm text-muted-foreground">{line1}</p>
              <p className="mt-2 text-sm text-muted-foreground">{line2}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </AnimatedPage>
  );
}

function GuardianDashboard() {
  return (
    <AnimatedPage className="mx-auto max-w-[1260px] space-y-5">
      <div>
        <h1 className="text-3xl font-bold text-primary">Fee Summary</h1>
        <p className="mt-1 text-muted-foreground">
          Overview of fees, payments, and dues for your ward.
        </p>
      </div>
      <SectionCard>
        <div className="grid gap-5 p-6 lg:grid-cols-[1.2fr_repeat(4,1fr)]">
          <NameCell
            image={imageSet.portraitA}
            name="Aarav Shrestha"
            subtitle="Green View Hostel / Room 201 - Bed B"
          />
          {[
            ["Paid Amount", "NPR 68,500", "This Session", "success"],
            ["Due Amount", "NPR 8,500", "Pending", "guardian"],
            ["Due Date", "Jun 10, 2026", "12 days left", "guardian"],
            ["Last Receipt", "NPR 8,500", "May 10, 2026", "slate"],
          ].map(([label, value, detail, tone]) => (
            <div className="rounded-lg border border-border p-4" key={label}>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className={cn("mt-3 text-xl font-bold", toneStyles[tone as Tone].text)}>
                {value}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
      </SectionCard>
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <SectionCard title="Monthly Dues">
          <TableView
            headers={[
              "Month",
              "Due Date",
              "Amount (NPR)",
              "Status",
              "Paid On",
              "Receipt",
            ]}
            rows={["Jun", "May", "Apr", "Mar", "Feb", "Jan"].map((month, index) => [
              `${month} 2026`,
              `${month} 10, 2026`,
              "8,500",
              <StatusPill key={month}>{index === 0 ? "unpaid" : "paid"}</StatusPill>,
              index === 0 ? "-" : `${month} 09, 2026`,
              index === 0 ? "-" : <Download className="size-4" key={month} />,
            ])}
          />
        </SectionCard>
        <SectionCard title="Receipt Summary">
          <div className="space-y-4 text-sm">
            {[
              ["Total Paid", "NPR 68,500"],
              ["Total Due", "NPR 8,500"],
              ["Total Charges", "NPR 77,000"],
              ["Advance / Credit", "NPR 0"],
            ].map(([label, value]) => (
              <div className="flex justify-between" key={label}>
                <span className="text-muted-foreground">{label}</span>
                <span className="font-semibold text-primary">{value}</span>
              </div>
            ))}
            <div className="rounded-lg border border-role-guardian/25 bg-role-guardian-soft/60 p-4">
              <p className="text-muted-foreground">Outstanding Balance</p>
              <p className="mt-2 text-2xl font-bold text-role-guardian">NPR 8,500</p>
            </div>
            <button className="w-full rounded-md bg-role-guardian px-4 py-3 text-sm font-semibold text-white">
              Make a Payment
            </button>
          </div>
        </SectionCard>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Notes from Hostel">
          <div className="rounded-lg border border-role-guardian/20 bg-amber-50 p-5 text-sm leading-7 text-primary">
            Please ensure the June installment is paid by Jun 10, 2026 to avoid late fees.
            For any payment-related queries, contact the hostel office.
          </div>
        </SectionCard>
        <SectionCard title="Contact Hostel">
          <div className="flex gap-4">
            <div
              className="size-24 rounded-lg bg-cover bg-center"
              style={{ backgroundImage: `url("${hostelListings[0].image}")` }}
            />
            <div>
              <p className="font-semibold text-primary">Green View Hostel</p>
              <p className="mt-2 text-sm text-muted-foreground">Lalitpur, Kathmandu</p>
              <p className="mt-1 text-sm text-muted-foreground">01-5523456</p>
            </div>
          </div>
          <button className="mt-5 w-full rounded-md border border-role-guardian px-4 py-3 text-sm font-semibold text-role-guardian">
            Contact Hostel
          </button>
        </SectionCard>
      </div>
    </AnimatedPage>
  );
}

function GenericPortalScreen({ portal, screen }: { portal: PortalKind; screen: string }) {
  const tone: Tone =
    portal === "platform"
      ? "platform"
      : portal === "admin"
        ? "admin"
        : portal === "resident"
          ? "resident"
          : "guardian";
  const title = portalTitle(portal, screen);
  const rows = portalRows(portal, screen);

  return (
    <AnimatedPage className="mx-auto max-w-[1448px] space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">{title}</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            Production UI for {title.toLowerCase()} with API-ready data, filters, loading,
            empty, and review states represented visually using local seed data.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="app-control inline-flex items-center gap-2">
            <Filter className="size-4" />
            Filters
          </button>
          <button
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold",
              toneStyles[tone].button,
            )}
          >
            <Plus className="size-4" />
            New
          </button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Total", String(rows.length * 24), "Updated now"],
          ["Pending", "14", "Needs review"],
          ["Approved", "86", "Live records"],
          ["Flagged", "3", "Needs attention"],
        ].map(([label, value, detail], index) => (
          <MetricCard
            detail={detail}
            icon={metricIcons[index]}
            key={label}
            label={label}
            tone={index === 1 ? "warning" : index === 3 ? "danger" : tone}
            value={value}
          />
        ))}
      </div>
      <SectionCard>
        <div className="grid gap-4 p-5 lg:grid-cols-[1.5fr_repeat(4,1fr)_auto]">
          <label className="flex h-11 items-center gap-3 rounded-lg border border-border px-3">
            <Search className="size-4 text-muted-foreground" />
            <input
              className="w-full bg-transparent text-sm outline-none"
              placeholder={`Search ${title.toLowerCase()}...`}
            />
          </label>
          {["Status", "Category", "Date", "Owner"].map((filter) => (
            <button
              className="app-control flex items-center justify-between"
              key={filter}
            >
              {filter}
              <ChevronDown className="size-4" />
            </button>
          ))}
          <button className="app-control">Reset</button>
        </div>
      </SectionCard>
      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <SectionCard
          action={
            <button className="app-control inline-flex items-center gap-2">
              <Download className="size-4" /> Export
            </button>
          }
          title={`${title} List`}
        >
          <TableView
            headers={rows[0]?.headers ?? ["Name", "Detail", "Status"]}
            rows={rows.map((row) => row.cells)}
          />
        </SectionCard>
        <div className="space-y-5">
          <SectionCard title="State Preview">
            <div className="space-y-3">
              {[
                ["Loading", "Skeleton rows and summary cards are ready."],
                ["Empty", "Empty state appears after filters return no data."],
                ["Error", "Retry card can map to failed API requests."],
              ].map(([state, detail]) => (
                <div className="rounded-lg border border-border p-4" key={state}>
                  <p className="font-semibold text-primary">{state}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Detail Drawer">
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                Row action opens a right-side detail area for approval notes, audit
                history, form edits, status transitions, and API-bound fields.
              </p>
              <button
                className={cn(
                  "w-full rounded-md px-4 py-3 text-sm font-semibold",
                  toneStyles[tone].button,
                )}
              >
                Review Selected Record
              </button>
            </div>
          </SectionCard>
        </div>
      </div>
    </AnimatedPage>
  );
}

function portalRows(portal: PortalKind, screen: string) {
  if (screen.includes("payment") || screen.includes("subscription")) {
    return payments.map((payment) => ({
      headers: ["Record", "Month", "Method", "Amount", "Status", "Date"],
      cells: [
        payment.resident,
        payment.month,
        payment.method,
        payment.amount,
        <StatusPill key={payment.id}>{payment.status}</StatusPill>,
        payment.date,
      ],
    }));
  }

  if (screen.includes("notice")) {
    return notices.map((notice) => ({
      headers: ["Notice", "Category", "Visibility", "Status", "Date"],
      cells: [
        notice.title,
        notice.category,
        notice.visibility,
        <StatusPill key={notice.id}>{notice.status}</StatusPill>,
        notice.date,
      ],
    }));
  }

  if (screen.includes("food")) {
    return weeklyMenu.map((meal) => ({
      headers: ["Meal", "Time", "Items", "Rating", "Status"],
      cells: [
        meal.meal,
        meal.time,
        meal.items,
        meal.rating,
        <StatusPill key={meal.id}>published</StatusPill>,
      ],
    }));
  }

  if (screen.includes("provider") || screen.includes("maintenance")) {
    return providers.map((provider) => ({
      headers: ["Provider", "Category", "Area", "Phone", "Rating", "Status"],
      cells: [
        provider.name,
        provider.category,
        provider.area,
        provider.phone,
        provider.rating,
        <StatusPill key={provider.id}>{provider.status}</StatusPill>,
      ],
    }));
  }

  if (
    screen.includes("complaint") ||
    screen.includes("abuse") ||
    screen.includes("flag")
  ) {
    return complaints.map((complaint) => ({
      headers: ["Issue", "Resident", "Priority", "SLA", "Status"],
      cells: [
        complaint.title,
        complaint.resident,
        <StatusPill key={complaint.id}>{complaint.priority}</StatusPill>,
        complaint.sla,
        <StatusPill key={`${complaint.id}-status`}>{complaint.status}</StatusPill>,
      ],
    }));
  }

  if (portal === "admin" || portal === "resident" || screen.includes("user")) {
    return residents.map((resident) => ({
      headers: [
        "Resident",
        "Room / Bed",
        "Guardian",
        "Fee Status",
        "Night Status",
        "Activation",
      ],
      cells: [
        <NameCell image={resident.avatar} key={resident.id} name={resident.name} />,
        `${resident.room} / ${resident.bed}`,
        resident.guardian,
        <StatusPill key={resident.id}>{resident.feeStatus}</StatusPill>,
        <StatusPill key={`${resident.id}-night`}>{resident.nightStatus}</StatusPill>,
        <StatusPill key={`${resident.id}-activation`}>
          {resident.activationStatus}
        </StatusPill>,
      ],
    }));
  }

  return hostelListings.map((hostel) => ({
    headers: ["Hostel", "Location", "Owner", "Type", "Status", "Rating"],
    cells: [
      <NameCell image={hostel.image} key={hostel.id} name={hostel.name} />,
      `${hostel.city}, ${hostel.area}`,
      hostel.owner,
      hostel.type,
      <StatusPill key={hostel.id}>{hostel.status}</StatusPill>,
      hostel.rating,
    ],
  }));
}

function portalTitle(portal: PortalKind, screen: string) {
  const overrides: Record<string, string> = {
    "abuse-flags": "Abuse / Flags",
    activation: "Resident Activation",
    complaints: "Complaints",
    dashboard: "Dashboard",
    "emergency-contact": "Emergency Contact",
    food: "Food Menu",
    hostels: portal === "platform" ? "Hostel Approvals" : "Hostel Profile",
    inquiries: "Inquiries",
    maintenance: "Maintenance",
    "move-in-out": "Move-In / Move-Out",
    "night-status": "Night Status",
    notices: "Notices",
    payments: portal === "guardian" ? "Payments & Receipts" : "Payments",
    profile: portal === "resident" ? "My Profile" : "Hostel Profile",
    referral: "Referral",
    reports: "Reports",
    reviews: portal === "platform" ? "Reviews Moderation" : "Reviews",
    rooms: "Rooms & Beds",
    safety: "Safety Summary",
    "service-providers": "Service Providers",
    sos: "SOS",
    subscriptions: "Payments / Subscriptions",
    users: "Users",
    verification: "Hostel Verification",
  };

  return overrides[screen] ?? humanize(screen);
}

export function PortalExperiencePage({
  portal,
  screen = "dashboard",
}: {
  portal: PortalKind;
  screen?: string;
}) {
  if (portal === "platform" && screen === "dashboard") {
    return <PlatformDashboard />;
  }

  if (portal === "admin" && screen === "dashboard") {
    return <AdminDashboard />;
  }

  if (portal === "admin" && screen === "residents") {
    return <AdminResidentsScreen />;
  }

  if (portal === "resident" && screen === "dashboard") {
    return <ResidentDashboard />;
  }

  if (portal === "guardian" && (screen === "dashboard" || screen === "fee-summary")) {
    return <GuardianDashboard />;
  }

  return <GenericPortalScreen portal={portal} screen={screen} />;
}
