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
  type AuthMode,
  type PortalKind,
} from "./shared";

export function ServiceProviderRegistrationPage() {
  return (
    <PublicShell active="providers">
      <section className="mx-auto grid max-w-[1280px] gap-6 px-6 py-8 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionCard title="Join as a Service Provider">
          <div className="p-1">
            <p className="text-muted-foreground">
              Register plumbing, electrical, cleaning, medical, internet, repair, or water
              supply services for hostel admins to discover.
            </p>
            <div className="mt-6 grid gap-3">
              {[
                "Verified provider profile",
                "Area-based hostel discovery",
                "Approval by platform owner",
                "Service history and ratings",
              ].map((item) => (
                <div className="rounded-lg bg-brand-teal-soft/50 p-4" key={item}>
                  <p className="font-semibold text-brand-teal">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
        <SectionCard
          action={<StatusPill tone="warning">Pending approval</StatusPill>}
          title="Provider Details"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField icon={UserRound} label="Full Name" placeholder="CleanStay Nepal" />
            <FormField icon={Phone} label="Phone" placeholder="9841002300" />
            <FormField label="Category" placeholder="Cleaner / Plumber / Electrician" />
            <FormField icon={MapPin} label="Area" placeholder="Lalitpur, Kathmandu" />
            <FormField
              icon={CalendarDays}
              label="Availability"
              placeholder="Weekdays, emergency, on-call"
            />
            <FormField label="Experience" placeholder="5+ years serving hostels" />
          </div>
          <label className="mt-4 block text-sm font-semibold text-primary">
            Description
            <textarea
              className="mt-2 min-h-28 w-full rounded-lg border border-border bg-surface p-3 text-sm outline-none focus:border-brand-teal"
              placeholder="Describe your service coverage, tools, and response time."
            />
          </label>
          <div className="mt-4 rounded-lg border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
            <Upload className="mx-auto mb-2 size-5" />
            Optional photo or document upload UI
          </div>
          <button className="mt-5 w-full rounded-md bg-brand-teal px-5 py-3 text-sm font-semibold text-white">
            Submit Provider Registration
          </button>
        </SectionCard>
      </section>
    </PublicShell>
  );
}
