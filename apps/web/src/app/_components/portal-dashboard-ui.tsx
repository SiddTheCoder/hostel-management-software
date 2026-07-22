"use client";

import type { LucideIcon } from "lucide-react";
import { ChevronDown, Star, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type PortalTone = "platform" | "admin" | "resident" | "guardian";
export type SoftTone = "green" | "amber" | "rose" | "blue" | "slate" | "cyan" | "purple";

const softToneClasses: Record<SoftTone, string> = {
  amber:
    "border-amber-200/80 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
  blue: "border-blue-200/80 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300",
  cyan: "border-cyan-200/80 bg-cyan-50 text-cyan-700 dark:border-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-300",
  green:
    "border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
  purple:
    "border-violet-200/80 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-300",
  rose: "border-rose-200/80 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300",
  slate: "border-border bg-muted text-muted-foreground",
};

const roleLinkClasses: Record<PortalTone, string> = {
  admin: "text-role-admin hover:text-role-admin/80",
  guardian: "text-role-guardian hover:text-role-guardian/80",
  platform: "text-role-platform hover:text-role-platform/80",
  resident: "text-role-resident hover:text-role-resident/80",
};

const roleSolidClasses: Record<PortalTone, string> = {
  admin: "bg-role-admin text-white hover:bg-role-admin/90",
  guardian: "bg-role-guardian text-white hover:bg-role-guardian/90",
  platform: "bg-role-platform text-white hover:bg-role-platform/90",
  resident: "bg-role-resident text-white hover:bg-role-resident/90",
};

const avatarToneClasses: Record<PortalTone, string> = {
  admin: "bg-role-admin-soft text-role-admin",
  guardian: "bg-role-guardian-soft text-role-guardian",
  platform: "bg-role-platform-soft text-role-platform",
  resident: "bg-role-resident-soft text-role-resident",
};

export function PortalPageHeader({
  actions,
  breadcrumb,
  description,
  title,
}: {
  actions?: ReactNode;
  breadcrumb?: string[];
  description?: string;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 space-y-1">
        {breadcrumb && breadcrumb.length > 0 ? (
          <p className="text-xs font-medium text-muted-foreground">
            {breadcrumb.map((item, index) => (
              <span key={`${item}-${index}`}>
                {index > 0 ? (
                  <span className="mx-1.5 text-muted-foreground/50">›</span>
                ) : null}
                <span className={index === breadcrumb.length - 1 ? "text-foreground" : ""}>
                  {item}
                </span>
              </span>
            ))}
          </p>
        ) : null}
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-[1.75rem]">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

const noteToneClasses: Record<SoftTone, string> = {
  amber: "text-amber-600",
  blue: "text-blue-600",
  cyan: "text-cyan-600",
  green: "text-emerald-600",
  purple: "text-violet-600",
  rose: "text-rose-600",
  slate: "text-muted-foreground",
};

export function MetricCard({
  icon: Icon,
  label,
  note,
  noteTone = "slate",
  tone = "blue",
  trend,
  trendDown = false,
  value,
}: {
  icon: LucideIcon;
  label: string;
  note?: string;
  noteTone?: SoftTone;
  tone?: SoftTone;
  trend?: string;
  trendDown?: boolean;
  value: ReactNode;
}) {
  const iconTones: Record<SoftTone, string> = {
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    cyan: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400",
    green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    purple: "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
    slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  };

  return (
    <Card className="shadow-sm ring-border/60">
      <CardContent className="pt-1">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl",
              iconTones[tone],
            )}
          >
            <Icon className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className="mt-1 truncate text-2xl font-bold tracking-tight text-foreground">
              {value}
            </p>
            {trend ? (
              <p
                className={cn(
                  "mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold",
                  trendDown ? "text-rose-600" : "text-emerald-600",
                )}
              >
                {trendDown ? (
                  <TrendingDown className="size-3" />
                ) : (
                  <TrendingUp className="size-3" />
                )}
                {trend}
              </p>
            ) : note ? (
              <p className={cn("mt-1.5 text-[11px] font-semibold", noteToneClasses[noteTone])}>
                {note}
              </p>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SectionCard({
  actions,
  children,
  className,
  description,
  title,
}: {
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  description?: string;
  title?: string;
}) {
  return (
    <Card className={cn("shadow-sm ring-border/60", className)}>
      {title || actions || description ? (
        <CardHeader className="border-b border-border/60 pb-4">
          {title ? (
            <CardTitle className="font-heading text-base font-bold text-foreground">
              {title}
            </CardTitle>
          ) : null}
          {description ? <CardDescription>{description}</CardDescription> : null}
          {actions ? <CardAction>{actions}</CardAction> : null}
        </CardHeader>
      ) : null}
      <CardContent className={title || actions || description ? "pt-4" : undefined}>
        {children}
      </CardContent>
    </Card>
  );
}

export function SoftBadge({
  children,
  className,
  tone = "slate",
}: {
  children: ReactNode;
  className?: string;
  tone?: SoftTone;
}) {
  return (
    <Badge
      className={cn(
        "h-auto rounded-full border px-2.5 py-0.5 text-[11px] font-semibold shadow-none",
        softToneClasses[tone],
        className,
      )}
      variant="outline"
    >
      {children}
    </Badge>
  );
}

export function InitialsAvatar({
  className,
  name,
  size = "md",
  tone = "platform",
}: {
  className?: string;
  name: string;
  size?: "sm" | "md" | "lg";
  tone?: PortalTone;
}) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const sizeClass =
    size === "sm"
      ? "size-8 text-xs"
      : size === "lg"
        ? "size-14 text-lg data-[size=lg]:size-14"
        : "size-10 text-sm data-[size=default]:size-10";

  return (
    <Avatar className={cn(sizeClass, className)} size={size === "sm" ? "sm" : "lg"}>
      <AvatarFallback
        className={cn("font-bold", avatarToneClasses[tone], size === "sm" && "text-xs")}
      >
        {initials || "?"}
      </AvatarFallback>
    </Avatar>
  );
}

export function ViewAllLink({
  href,
  label = "View all",
  tone = "platform",
}: {
  href: string;
  label?: string;
  tone?: PortalTone;
}) {
  return (
    <Link
      className={cn("text-xs font-semibold transition hover:underline", roleLinkClasses[tone])}
      href={href}
    >
      {label}
    </Link>
  );
}

export function RoleButton({
  children,
  className,
  tone = "platform",
  variant = "solid",
  ...props
}: Omit<ComponentProps<typeof Button>, "variant"> & {
  tone?: PortalTone;
  variant?: "solid" | "outline" | "soft";
}) {
  return (
    <Button
      className={cn(
        "h-10 gap-2 rounded-xl px-4 font-semibold shadow-sm",
        variant === "solid" && roleSolidClasses[tone],
        variant === "outline" &&
          cn(
            "border bg-card",
            tone === "platform" && "border-role-platform/30 text-role-platform hover:bg-role-platform-soft",
            tone === "admin" && "border-role-admin/30 text-role-admin hover:bg-role-admin-soft",
            tone === "resident" &&
              "border-role-resident/30 text-role-resident hover:bg-role-resident-soft",
            tone === "guardian" &&
              "border-role-guardian/30 text-role-guardian hover:bg-role-guardian-soft",
          ),
        variant === "soft" &&
          cn(
            "border",
            tone === "platform" && "border-role-platform/20 bg-role-platform-soft text-role-platform",
            tone === "admin" && "border-role-admin/20 bg-role-admin-soft text-role-admin",
            tone === "resident" &&
              "border-role-resident/20 bg-role-resident-soft text-role-resident",
            tone === "guardian" &&
              "border-role-guardian/20 bg-role-guardian-soft text-role-guardian",
          ),
        className,
      )}
      variant={variant === "solid" ? "default" : "outline"}
      {...props}
    >
      {children}
    </Button>
  );
}

export function DataTable({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Table className={cn("min-w-full", className)}>
      {children}
    </Table>
  );
}

export {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
};

export function SimpleSparkline({
  color = "bg-role-platform",
  values,
}: {
  color?: string;
  values: number[];
}) {
  const max = Math.max(...values, 1);

  return (
    <div className="flex h-20 items-end gap-1">
      {values.map((value, index) => (
        <div
          className={cn("flex-1 rounded-t-sm opacity-80", color)}
          key={index}
          style={{ height: `${Math.max(12, (value / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}

export function AreaSparkline({
  labels,
  stroke = "#2563eb",
  values,
}: {
  labels?: string[];
  stroke?: string;
  values: number[];
}) {
  const width = 320;
  const height = 96;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const stepX = width / (values.length - 1 || 1);
  const points = values.map((value, index) => {
    const x = index * stepX;
    const y = height - ((value - min) / range) * (height - 8) - 4;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const line = points.map((point, index) => `${index === 0 ? "M" : "L"}${point}`).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;
  const gradientId = `area-${stroke.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <div>
      <svg
        className="h-24 w-full"
        preserveAspectRatio="none"
        viewBox={`0 0 ${width} ${height}`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.22" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${gradientId})`} />
        <path
          d={line}
          fill="none"
          stroke={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
      {labels && labels.length > 0 ? (
        <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
          {labels.map((label, index) => (
            <span key={`${label}-${index}`}>{label}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function EmptyInline({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-10 text-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}

export function FilterBar({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-muted/20 p-3 lg:flex-row lg:items-center lg:justify-between">
      {children}
    </div>
  );
}

export function SearchField({
  className,
  onChange,
  placeholder,
  value,
}: {
  className?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}) {
  return (
    <div
      className={cn(
        "flex h-10 max-w-md flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 shadow-sm",
        className,
      )}
    >
      <svg
        aria-hidden
        className="size-4 shrink-0 text-muted-foreground"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder ?? "Search..."}
        value={value}
      />
    </div>
  );
}

const pagerActiveTone: Record<PortalTone, string> = {
  admin: "bg-role-admin text-white",
  guardian: "bg-role-guardian text-white",
  platform: "bg-role-platform text-white",
  resident: "bg-role-resident text-white",
};

function PagerButton({
  active,
  disabled,
  label,
  tone = "platform",
}: {
  active?: boolean;
  disabled?: boolean;
  label: string;
  tone?: PortalTone;
}) {
  return (
    <button
      className={cn(
        "flex size-7 items-center justify-center rounded-md text-xs",
        active
          ? cn("font-semibold", pagerActiveTone[tone])
          : "border border-border font-medium text-muted-foreground disabled:opacity-40",
      )}
      disabled={disabled}
      type="button"
    >
      {label}
    </button>
  );
}

export function ListPager({
  pageSize = 10,
  showPageSize = false,
  tone = "platform",
  total,
  unit,
}: {
  pageSize?: number;
  showPageSize?: boolean;
  tone?: PortalTone;
  total: number;
  unit?: string;
}) {
  const shown = Math.min(pageSize, total);
  const lastPage = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="mt-4 flex flex-col gap-3 border-t border-border/60 pt-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <span>
        Showing {total === 0 ? 0 : 1} to {shown} of {total.toLocaleString()}
        {unit ? ` ${unit}` : ""}
      </span>
      <div className="flex items-center gap-1">
        <PagerButton disabled label="‹" tone={tone} />
        <PagerButton active label="1" tone={tone} />
        {lastPage >= 2 ? <PagerButton label="2" tone={tone} /> : null}
        {lastPage >= 3 ? <PagerButton label="3" tone={tone} /> : null}
        {lastPage > 4 ? <span className="px-1">…</span> : null}
        {lastPage > 3 ? <PagerButton label={String(lastPage)} tone={tone} /> : null}
        <PagerButton label="›" tone={tone} />
        {showPageSize ? (
          <span className="ml-2 inline-flex h-7 items-center gap-1 rounded-md border border-border px-2 text-[11px] font-medium text-muted-foreground">
            {pageSize} / page
            <ChevronDown className="size-3" />
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function RatingStars({ count, rating }: { count?: number; rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground">
      <Star className="size-3.5 fill-amber-400 text-amber-400" />
      {rating.toFixed(1)}
      {count != null ? (
        <span className="font-normal text-muted-foreground">({count})</span>
      ) : null}
    </span>
  );
}

export function FilterSelect({
  className,
  defaultLabel,
  options = [],
}: {
  className?: string;
  defaultLabel: string;
  options?: string[];
}) {
  return (
    <div className={cn("relative", className)}>
      <select
        className="h-10 w-full appearance-none rounded-xl border border-border bg-card px-3 pr-8 text-sm text-foreground shadow-sm outline-none"
        defaultValue=""
      >
        <option value="">{defaultLabel}</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

export function statusToneFromLabel(status: string): SoftTone {
  const value = status.toLowerCase();
  if (
    value.includes("paid") ||
    value.includes("active") ||
    value.includes("approved") ||
    value.includes("verified") ||
    value.includes("inside") ||
    value.includes("resolved") ||
    value.includes("activated") ||
    value.includes("normal")
  ) {
    return "green";
  }
  if (
    value.includes("pending") ||
    value.includes("review") ||
    value.includes("due") ||
    value.includes("partial") ||
    value.includes("not generated")
  ) {
    return "amber";
  }
  if (
    value.includes("overdue") ||
    value.includes("rejected") ||
    value.includes("unpaid") ||
    value.includes("outside") ||
    value.includes("open")
  ) {
    return "rose";
  }
  if (value.includes("progress") || value.includes("submitted")) {
    return "blue";
  }
  return "slate";
}
