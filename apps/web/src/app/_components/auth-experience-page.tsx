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

export function AuthExperiencePage({ mode }: { mode: AuthMode }) {
  const content = {
    activation: {
      title: "Activate Resident Access",
      subtitle: "Use the QR or activation code issued by your hostel admin.",
    },
    login: {
      title: "Login to your account",
      subtitle: "Enter your credentials to access your dashboard.",
    },
    otp: {
      title: "Verify your account",
      subtitle: "Enter the 6-digit OTP sent to your phone or email.",
    },
    reset: {
      title: "Reset Your Password",
      subtitle: "Request OTP, verify code, and set a new password.",
    },
    signup: {
      title: "Create your account",
      subtitle: "Signup creates a public account. Resident access needs activation.",
    },
  }[mode];

  return (
    <AnimatedPage className="min-h-screen bg-background p-6">
      <div className="grid min-h-[calc(100vh-48px)] overflow-hidden rounded-2xl border border-border bg-surface shadow-sm lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative hidden overflow-hidden bg-brand-teal-soft/50 p-14 lg:block">
          <Link className="inline-flex items-center gap-3 text-brand-teal" href="/">
            <Home className="size-10 fill-brand-teal/10" />
            <span className="font-heading text-4xl font-bold">HostelHub</span>
          </Link>
          <h1 className="mt-16 max-w-xl text-4xl font-bold leading-tight text-primary">
            Welcome back! Let us get you logged in.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-primary/80">
            HostelHub is the all-in-one platform to discover, manage, and grow your hostel
            operations.
          </p>
          <div className="mt-10 space-y-7">
            {[
              [
                "Secure & Role-based Access",
                "Your data is safe with enterprise-grade security.",
              ],
              [
                "Built for Every Role",
                "Owner, warden, staff, resident, and guardian on one platform.",
              ],
              ["Fast, Reliable & Always Available", "Access anytime from anywhere."],
            ].map(([title, detail]) => (
              <div className="flex items-center gap-5" key={title}>
                <span className="flex size-14 items-center justify-center rounded-full bg-brand-teal-soft text-brand-teal">
                  <ShieldCheck className="size-6" />
                </span>
                <div>
                  <p className="font-semibold text-primary">{title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div
            className="absolute bottom-0 left-0 h-[330px] w-full bg-cover bg-center"
            style={{ backgroundImage: `url("${imageSet.lobby}")` }}
          />
        </section>
        <section className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-xl rounded-xl border border-border bg-white p-10 shadow-lg">
            <h2 className="text-3xl font-bold text-primary">{content.title}</h2>
            <p className="mt-3 text-muted-foreground">{content.subtitle}</p>
            <div className="mt-8 space-y-5">
              {mode === "login" ? (
                <>
                  <FormField
                    icon={User}
                    label="Email or Phone Number"
                    placeholder="Enter your email or phone number"
                  />
                  <FormField
                    icon={LockKeyhole}
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-primary">
                      <input className="size-4 rounded border-border" type="checkbox" />
                      Remember me
                    </label>
                    <Link
                      className="font-semibold text-brand-teal"
                      href="/reset-password"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <button className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-slate-400 font-semibold">
                    <span className="font-bold text-[#4285f4]">G</span>
                    Continue with Google
                  </button>
                  <Link
                    className="flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-brand-teal font-semibold text-white"
                    href="/platform/dashboard"
                  >
                    <LockKeyhole className="size-4" />
                    Sign in
                  </Link>
                  <div className="rounded-lg border border-brand-teal/20 bg-brand-teal-soft/40 p-4 text-sm text-primary">
                    <p className="font-semibold">Role-aware redirect</p>
                    <p className="mt-1 text-muted-foreground">
                      You will be redirected to the right dashboard based on your role.
                    </p>
                  </div>
                  <div>
                    <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Continue as role
                    </p>
                    <div className="grid grid-cols-4 overflow-hidden rounded-lg border border-border">
                      {[
                        {
                          href: "/platform/dashboard",
                          Icon: Building2,
                          label: "Owner",
                        },
                        {
                          href: "/hostel-admin/dashboard",
                          Icon: UserRound,
                          label: "Warden",
                        },
                        {
                          href: "/resident/dashboard",
                          Icon: User,
                          label: "Resident",
                        },
                        {
                          href: "/guardian/dashboard",
                          Icon: Users,
                          label: "Guardian",
                        },
                      ].map(({ href, Icon, label }) => {
                        return (
                          <Link
                            className="flex items-center justify-center gap-2 border-r border-border px-3 py-4 text-sm font-semibold last:border-r-0 hover:bg-brand-teal-soft"
                            href={href}
                            key={label}
                          >
                            <Icon className="size-4 text-brand-teal" />
                            {label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : null}

              {mode === "signup" ? (
                <>
                  <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted p-1">
                    {["Email", "Phone", "Google"].map((item) => (
                      <button
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold shadow-sm"
                        key={item}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                  <FormField icon={UserRound} label="Full Name" placeholder="Asha Rai" />
                  <FormField icon={Mail} label="Email" placeholder="asha@example.com" />
                  <FormField
                    icon={LockKeyhole}
                    label="Password"
                    placeholder="At least 8 characters"
                    type="password"
                  />
                  <FormField
                    icon={KeyRound}
                    label="Confirm Password"
                    placeholder="Repeat password"
                    type="password"
                  />
                  <p className="rounded-lg bg-brand-teal-soft/50 p-4 text-sm text-brand-teal">
                    Normal signup creates a public account only. Resident private portal
                    access requires admin-created QR/code activation.
                  </p>
                  <Link
                    className="block rounded-lg bg-brand-teal px-5 py-3 text-center text-sm font-semibold text-white"
                    href="/otp"
                  >
                    Create Account
                  </Link>
                </>
              ) : null}

              {mode === "otp" ? (
                <>
                  <div className="mx-auto grid max-w-sm grid-cols-6 gap-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <input
                        className="h-14 rounded-lg border border-border text-center font-mono text-xl font-bold outline-none focus:border-brand-teal"
                        key={index}
                        maxLength={1}
                      />
                    ))}
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    OTP valid for 04:59. Resend available soon.
                  </p>
                  <Link
                    className="block rounded-lg bg-brand-teal px-5 py-3 text-center text-sm font-semibold text-white"
                    href="/login"
                  >
                    Verify & Continue
                  </Link>
                  <div className="rounded-lg border border-success/20 bg-emerald-50 p-4 text-sm text-success">
                    Your account has been verified successfully.
                  </div>
                </>
              ) : null}

              {mode === "reset" ? (
                <>
                  <div className="grid gap-3 md:grid-cols-4">
                    {["Request OTP", "Verify OTP", "Set Password", "Complete"].map(
                      (step, index) => (
                        <div
                          className="rounded-lg border border-border p-3 text-center"
                          key={step}
                        >
                          <span
                            className={cn(
                              "mx-auto flex size-7 items-center justify-center rounded-full text-xs font-bold",
                              index === 0
                                ? "bg-brand-teal text-white"
                                : "bg-muted text-muted-foreground",
                            )}
                          >
                            {index + 1}
                          </span>
                          <p className="mt-2 text-xs font-semibold">{step}</p>
                        </div>
                      ),
                    )}
                  </div>
                  <FormField
                    icon={Mail}
                    label="Email or Phone"
                    placeholder="name@example.com"
                  />
                  <FormField icon={KeyRound} label="OTP Code" placeholder="000000" />
                  <FormField
                    icon={LockKeyhole}
                    label="New Password"
                    placeholder="New password"
                    type="password"
                  />
                  <Link
                    className="block rounded-lg bg-brand-teal px-5 py-3 text-center text-sm font-semibold text-white"
                    href="/login"
                  >
                    Reset Password
                  </Link>
                </>
              ) : null}

              {mode === "activation" ? (
                <>
                  <div className="grid gap-5 md:grid-cols-[1fr_180px]">
                    <div>
                      <FormField
                        icon={QrCode}
                        label="Activation Code"
                        placeholder="HH-2026-AARAV-201B"
                      />
                      <p className="mt-3 text-sm text-muted-foreground">
                        Ask your hostel admin or warden for a fresh activation code.
                      </p>
                    </div>
                    <div className="flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/40">
                      <QrCode className="size-20 text-brand-teal" />
                    </div>
                  </div>
                  <div className="rounded-lg border border-success/20 bg-emerald-50 p-4 text-sm text-success">
                    Activation valid. Aarav Shrestha is linked to Room 201 / Bed B at
                    Green View Hostel.
                  </div>
                  <Link
                    className="block rounded-lg bg-brand-teal px-5 py-3 text-center text-sm font-semibold text-white"
                    href="/resident/dashboard"
                  >
                    Activate Access
                  </Link>
                </>
              ) : null}
            </div>
            <p className="mt-8 text-center text-sm text-muted-foreground">
              {mode === "signup" ? "Already have an account?" : "Do not have an account?"}{" "}
              <Link
                className="font-semibold text-brand-teal"
                href={mode === "signup" ? "/login" : "/signup"}
              >
                {mode === "signup" ? "Sign in" : "Sign up"}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </AnimatedPage>
  );
}
