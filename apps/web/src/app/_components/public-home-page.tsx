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
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { checkAuthWithRefresh } from "@/lib/auth-check";
import { landingPathForRole } from "@/lib/route-access";
import { Role } from "@/lib/roles";

import { browserApi } from "@/lib/browser-api";
import { cn } from "@/lib/utils";
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
import {
  DEFAULT_HOSTEL_IMAGE,
  mapPublicHostelToSummary,
  type PublicHostel,
} from "./public-hostel-data";

const PUBLIC_HERO_IMAGE =
  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1600&q=80";

const DASHBOARD_ROLES = new Set([
  Role.PLATFORM_OWNER,
  Role.HOSTEL_OWNER,
  Role.HOSTEL_ADMIN,
  Role.WARDEN,
  Role.RESIDENT,
  Role.GUARDIAN,
]);

export function PublicHomePage() {
  const router = useRouter();
  const [searchVal, setSearchVal] = useState("");
  const [featuredHostels, setFeaturedHostels] = useState<
    ReturnType<typeof mapPublicHostelToSummary>[]
  >([]);

  useEffect(() => {
    async function redirectIfDashboardRole() {
      try {
        const response = await checkAuthWithRefresh();
        if (!response.ok) return;
        const payload = await response.json().catch(() => null);
        if (!payload?.success) return;
        const role = payload.data.user.role as Role;
        if (DASHBOARD_ROLES.has(role)) {
          const path = landingPathForRole(role);
          if (path) router.replace(path);
        }
      } catch {
        // not authenticated — stay on page
      }
    }
    void redirectIfDashboardRole();
  }, [router]);

  useEffect(() => {
    async function loadFeaturedHostels() {
      try {
        const data = await browserApi<{ hostels: PublicHostel[] }>(
          "/api/v1/public/hostels",
        );

        setFeaturedHostels(
          data.hostels
            .map(mapPublicHostelToSummary)
            .filter((hostel) => hostel.verified)
            .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
            .slice(0, 4),
        );
      } catch {
        setFeaturedHostels([]);
      }
    }

    void loadFeaturedHostels();
  }, []);

  const heroHostel = featuredHostels[0];

  const landingLinks = [
    {
      desc: "Explore verified listings with pricing, rooms, reviews, and vacancy.",
      href: "/hostels",
      icon: Home,
      title: "Browse Hostels",
    },
    {
      desc: "Compare rent, location, facilities, food score, and ratings side by side.",
      href: "/compare",
      icon: Users,
      title: "Compare Options",
    },
    {
      desc: "Send your room preference directly to a verified hostel team.",
      href: "/inquiry",
      icon: MessageSquare,
      title: "Send Inquiry",
    },
    {
      desc: "List your hostel and manage discovery, inquiries, rooms, and trust checks.",
      href: "/hostels/register",
      icon: Building2,
      title: "Register Hostel",
    },
  ];

  const footerGroups = [
    {
      links: [
        ["Browse hostels", "/hostels"],
        ["Compare hostels", "/compare"],
        ["Send inquiry", "/inquiry"],
      ],
      title: "Explore",
    },
    {
      links: [
        ["Hostel registration", "/hostels/register"],
        ["Service providers", "/service-providers/register"],
        ["Pricing", "/pricing"],
      ],
      title: "Partners",
    },
    {
      links: [
        ["About us", "/#about"],
        ["Contact", "/#contact"],
        ["Login", "/login"],
      ],
      title: "Company",
    },
  ];

  return (
    <PublicShell>
      <section className="relative w-full overflow-hidden bg-background -mt-16">
        {/* Right side background image with smooth fade on the left */}
        <div className="absolute right-0 top-0 hidden h-full w-[54%] lg:block">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url("${PUBLIC_HERO_IMAGE}")` }}
          />
          {/* Fading overlay from white to transparent (left-to-right) */}
          <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-background via-background/80 to-transparent" />

          {/* Slider Dots */}
          <div className="absolute bottom-10 left-[45%] flex gap-2">
            <span className="size-2 rounded-full bg-background" />
            <span className="size-2 rounded-full bg-background/40" />
          </div>
        </div>

        <div className="mx-auto relative z-10 grid min-h-[75vh] max-w-[1448px] gap-10 px-6 pt-32 pb-12 lg:grid-cols-[0.88fr_1fr] lg:items-center">
          <div className="py-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-sm">
              <ShieldCheck className="size-4 text-brand-teal" />
              Trusted by Students & Families
            </span>
            <h1 className="mt-8 max-w-xl font-heading text-5xl lg:text-[56px] font-extrabold leading-[1.15] text-foreground">
              Find the Best <span className="text-brand-teal font-extrabold">Hostel</span>{" "}
              for You
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
              Discover verified hostels, compare facilities, check reviews and book your
              stay.
            </p>
            <div className="mt-8 flex max-w-lg items-center gap-2 rounded-lg border border-border bg-card p-1.5 shadow-md focus-within:border-brand-teal focus-within:ring-2 focus-within:ring-brand-teal/15 transition">
              <Search className="ml-3 size-5 text-muted-foreground" />
              <input
                className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search by hostel name, area or location..."
                value={searchVal}
              />
              <Link
                className="rounded-md bg-brand-teal px-7 py-3 text-sm font-bold text-white hover:brightness-105 transition shrink-0"
                href={{
                  pathname: "/hostels",
                  query: searchVal ? { search: searchVal } : {},
                }}
              >
                Search
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-xs font-bold text-foreground">
              {[
                { label: "Verified Hostels", icon: CheckCircle2 },
                { label: "Trusted by Students", icon: CheckCircle2 },
                { label: "Easy & Secure", icon: CheckCircle2 },
              ].map((item) => (
                <span className="inline-flex items-center gap-1.5" key={item.label}>
                  <item.icon className="size-4 text-brand-teal" />
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          <div className="relative flex justify-end lg:pr-8 py-10">
            {/* Overlay card matching the reference image */}
            <div className="rounded-xl border border-border/80 bg-card/95 backdrop-blur-sm p-4 shadow-2xl flex gap-4 w-[320px] mt-36 transition hover:scale-[1.01]">
              <div
                className="size-24 rounded-lg bg-cover bg-center shrink-0 shadow-sm"
                style={{
                  backgroundImage: `url("${heroHostel?.image ?? DEFAULT_HOSTEL_IMAGE}")`,
                }}
              />
              <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                <div>
                  <h4
                    className="font-bold text-sm text-foreground truncate"
                    title={heroHostel?.name ?? "Verified hostel"}
                  >
                    {heroHostel?.name ?? "Verified hostel"}
                  </h4>
                  <div className="mt-1 flex flex-wrap items-center gap-1 text-[10px]">
                    <Star className="size-3 fill-warning text-warning" />
                    <span className="font-bold text-foreground">
                      {heroHostel?.rating ? heroHostel.rating.toFixed(1) : "New"}
                    </span>
                    <span className="text-muted-foreground font-normal">
                      ({heroHostel?.reviews ?? 0})
                    </span>
                    <StatusPill
                      tone="success"
                      className="ml-auto text-[8px] py-0 px-1 rounded-sm font-bold"
                    >
                      Verified
                    </StatusPill>
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground font-semibold truncate">
                    {heroHostel
                      ? `${heroHostel.area}, ${heroHostel.city}`
                      : "Published hostels appear here"}
                  </p>
                </div>
                <p className="mt-1 font-bold text-foreground text-xs">
                  {heroHostel ? formatMoney(heroHostel.price) : "NPR --"}{" "}
                  <span className="font-normal text-[10px] text-muted-foreground">
                    / month
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured verified hostels */}
      <section className="mx-auto max-w-[1448px] px-6 pb-12 pt-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-foreground">
              Featured Verified Hostels
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Explore verified options recommended for you
            </p>
          </div>
          <Link
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-teal hover:underline"
            href="/hostels"
          >
            View all hostels <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredHostels.length === 0 ? (
            <div className="col-span-full rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Published and verified hostels from the database will appear here.
            </div>
          ) : null}
          {featuredHostels.map((hostel) => (
            <HostelCard hostel={hostel} key={hostel.id} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1448px] px-6 pb-12">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {landingLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                className="group rounded-xl border border-border/80 bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-teal/40 hover:shadow-md"
                href={item.href}
                key={item.title}
              >
                <span className="flex size-11 items-center justify-center rounded-lg bg-muted text-brand-teal ring-1 ring-border transition group-hover:bg-brand-teal group-hover:text-white">
                  <Icon className="size-5" />
                </span>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-extrabold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                  <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-brand-teal" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1448px] px-6 pb-12">
        <Link
          className="group grid overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition hover:border-brand-teal/40 hover:shadow-md lg:grid-cols-[0.78fr_1fr]"
          href="/service-providers/register"
        >
          <div className="relative min-h-[260px] bg-slate-900">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-80 transition duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url("${PUBLIC_HERO_IMAGE}")` }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/40 to-brand-teal/50" />
            <div className="relative flex h-full flex-col justify-between p-7 text-white">
              <StatusPill className="w-fit bg-surface text-brand-teal" tone="teal">
                Service Providers
              </StatusPill>
              <div>
                <p className="text-3xl font-extrabold leading-tight">
                  Maintenance, food, cleaning, internet, and safety partners
                </p>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/80">
                  Grow your local service business with verified hostel operators.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center p-7 lg:p-9">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-teal">
              Provider Network
            </p>
            <h2 className="mt-3 text-2xl font-extrabold text-foreground">
              Join HostelHub as a verified service provider
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Service providers can register once, showcase availability, and receive
              hostel maintenance or operations leads from one dedicated page.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {["Cleaning", "Maintenance", "Food Supply"].map((item) => (
                <span
                  className="rounded-lg border border-border bg-muted px-3 py-3 text-xs font-bold text-foreground"
                  key={item}
                >
                  {item}
                </span>
              ))}
            </div>
            <span className="mt-7 inline-flex w-fit items-center gap-2 rounded-lg bg-brand-teal px-5 py-3 text-sm font-bold text-white transition group-hover:brightness-105">
              Open provider page <ArrowRight className="size-4" />
            </span>
          </div>
        </Link>
      </section>

      {/* How it works */}
      <section className="mx-auto mb-12 max-w-[1448px] px-6">
        <div className="rounded-xl border border-border/80 bg-surface p-8 shadow-sm">
          <h2 className="text-xl font-extrabold text-foreground">How it works</h2>
          <p className="mt-1 text-sm text-muted-foreground font-medium">
            Simple steps to find your perfect hostel
          </p>

          <div className="mt-8 flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Steps */}
            <div className="flex flex-1 flex-col sm:flex-row items-center justify-between gap-4 w-full">
              {[
                {
                  step: "1",
                  title: "Search",
                  desc: "Search hostels by name, area, or campus location.",
                  icon: Search,
                },
                {
                  step: "2",
                  title: "Compare",
                  desc: "Compare fees, facilities, reviews and vacancy.",
                  icon: Users,
                },
                {
                  step: "3",
                  title: "Inquire",
                  desc: "Send inquiry to hostels you are interested in.",
                  icon: MessageSquare,
                },
                {
                  step: "4",
                  title: "Connect",
                  desc: "Hostel will respond and help with next steps.",
                  icon: UserRound,
                },
              ].map((item, index) => (
                <div key={item.step} className="flex items-center gap-4 w-full">
                  <div className="flex items-center gap-4 flex-1">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted text-brand-teal border border-border">
                      <item.icon className="size-5" />
                    </span>
                    <div className="space-y-0.5">
                      <p className="font-extrabold text-sm text-foreground">
                        {item.step}. {item.title}
                      </p>
                      <p className="text-[11px] leading-normal text-muted-foreground max-w-[160px] font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  {index < 3 && (
                    <ArrowRight className="hidden lg:block size-4 text-muted-foreground/35 shrink-0 mx-2" />
                  )}
                </div>
              ))}
            </div>

            {/* Provider Card */}
            <Link
              className="w-full lg:w-[350px] rounded-xl border border-dashed border-brand-teal/40 bg-brand-teal-soft/10 p-5 flex items-start gap-4 shrink-0 transition hover:border-brand-teal hover:bg-brand-teal-soft/20"
              href="/service-providers/register"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-teal-soft/30 text-brand-teal border border-brand-teal/10">
                <Users className="size-5" />
              </span>
              <div className="flex-1 space-y-3">
                <div>
                  <p className="font-extrabold text-sm text-foreground">
                    Are you a Service Provider?
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed font-medium">
                    Register as a service provider and grow your business with us.
                  </p>
                </div>
                <span className="inline-flex rounded-md bg-brand-teal px-4.5 py-2 text-xs font-bold text-white transition">
                  Register Now
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-[#0f766e] py-8 text-white">
        <div className="mx-auto max-w-[1448px] px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
          {[
            { value: "500+", label: "Verified Hostels" },
            { value: "10,000+", label: "Happy Students" },
            { value: "50+", label: "Cities Covered" },
            { value: "4.6 ★", label: "Average Rating" },
          ].map((item, index) => (
            <div
              key={item.label}
              className={cn("space-y-1.5", index === 0 ? "" : "pl-4 md:pl-0")}
            >
              <p className="text-3xl font-extrabold tracking-tight">{item.value}</p>
              <p className="text-xs font-medium text-teal-100/90">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto grid max-w-[1448px] gap-10 px-6 py-10 lg:grid-cols-[1.2fr_2fr_0.9fr]">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 font-heading text-2xl font-bold text-brand-teal"
            >
              <Home className="size-7 fill-brand-teal/10" />
              HostelHub
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A Nepal-focused hostel discovery and operations platform for students,
              families, hostel teams, and trusted service partners.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <p className="text-sm font-extrabold text-foreground">{group.title}</p>
                <div className="mt-4 space-y-3">
                  {group.links.map(([label, href]) => (
                    <Link
                      className="block text-sm font-medium text-muted-foreground transition hover:text-brand-teal"
                      href={href}
                      key={label}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div>
            <p className="text-sm font-extrabold text-foreground">Contact</p>
            <div className="mt-4 space-y-3 text-sm font-medium text-muted-foreground">
              <a className="block transition hover:text-brand-teal" href="tel:015971234">
                01-5971234
              </a>
              <a
                className="block transition hover:text-brand-teal"
                href="mailto:support@hostelhub.local"
              >
                support@hostelhub.local
              </a>
              <p>Kathmandu, Nepal</p>
            </div>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto flex max-w-[1448px] flex-col gap-3 px-6 py-5 text-xs font-medium text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>Copyright 2026 HostelHub. All rights reserved.</p>
            <div className="flex gap-4">
              <Link className="hover:text-brand-teal" href="/privacy">
                Privacy
              </Link>
              <Link className="hover:text-brand-teal" href="/terms">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </PublicShell>
  );
}
