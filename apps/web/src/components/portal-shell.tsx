"use client";

import {
  BedDouble,
  Bell,
  Building2,
  CalendarDays,
  ClipboardList,
  CreditCard,
  Flag,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Moon,
  QrCode,
  ReceiptText,
  Search,
  Settings,
  ShieldCheck,
  Siren,
  Star,
  UserRound,
  Users,
  Utensils,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { PortalAccount } from "@/components/portal-account";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

type IconName =
  | "bed"
  | "bell"
  | "building"
  | "calendar"
  | "card"
  | "clipboard"
  | "dashboard"
  | "file"
  | "flag"
  | "food"
  | "help"
  | "message"
  | "moon"
  | "qr"
  | "receipt"
  | "settings"
  | "shield"
  | "siren"
  | "star"
  | "user"
  | "users"
  | "wrench";

type NavItem = {
  href: string;
  icon?: IconName;
  label: string;
};

type PortalTone = "platform" | "admin" | "resident" | "guardian";

type PortalShellProps = {
  children: ReactNode;
  navItems: NavItem[];
  portalName: string;
  searchPlaceholder?: string;
  subtitle: string;
  tone?: PortalTone;
  workspaceName?: string;
};

const iconMap: Record<IconName, LucideIcon> = {
  bed: BedDouble,
  bell: Bell,
  building: Building2,
  calendar: CalendarDays,
  card: CreditCard,
  clipboard: ClipboardList,
  dashboard: LayoutDashboard,
  file: FileText,
  flag: Flag,
  food: Utensils,
  help: HelpCircle,
  message: MessageSquare,
  moon: Moon,
  qr: QrCode,
  receipt: ReceiptText,
  settings: Settings,
  shield: ShieldCheck,
  siren: Siren,
  star: Star,
  user: UserRound,
  users: Users,
  wrench: Wrench,
};

const toneStyles: Record<
  PortalTone,
  {
    active: string;
    focus: string;
    icon: string;
    hover: string;
  }
> = {
  admin: {
    active: "bg-role-admin text-white shadow-sm shadow-cyan-900/10",
    focus: "focus:border-role-admin focus:ring-role-admin/20",
    hover: "hover:bg-role-admin-soft/60 hover:text-role-admin",
    icon: "text-role-admin",
  },
  guardian: {
    active: "bg-role-guardian text-white shadow-sm shadow-amber-900/10",
    focus: "focus:border-role-guardian focus:ring-role-guardian/20",
    hover: "hover:bg-role-guardian-soft/60 hover:text-role-guardian",
    icon: "text-role-guardian",
  },
  platform: {
    active: "bg-role-platform text-white shadow-sm shadow-blue-900/10",
    focus: "focus:border-role-platform focus:ring-role-platform/20",
    hover: "hover:bg-role-platform-soft/60 hover:text-role-platform",
    icon: "text-role-platform",
  },
  resident: {
    active: "bg-role-resident text-white shadow-sm shadow-green-900/10",
    focus: "focus:border-role-resident focus:ring-role-resident/20",
    hover: "hover:bg-role-resident-soft/70 hover:text-role-resident",
    icon: "text-role-resident",
  },
};

export function PortalShell({
  children,
  navItems,
  portalName,
  searchPlaceholder = "Search...",
  subtitle,
  tone = "platform",
  workspaceName,
}: PortalShellProps) {
  const pathname = usePathname();
  const styles = toneStyles[tone];
  const activeItem =
    navItems.find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    ) ?? navItems[0];

  return (
    <div className="min-h-screen bg-background text-foreground md:grid md:grid-cols-[248px_1fr]">
      <aside className="hidden border-r border-border bg-surface dark:bg-card md:flex md:min-h-screen md:flex-col">
        <div className="border-b border-border p-5">
          <Link href="/" className="flex items-center gap-3">
            <Building2 className={cn("size-8", styles.icon)} />
            <div>
              <p className="font-heading text-lg font-bold text-primary">{portalName}</p>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon ?? "dashboard"];
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-muted-foreground transition",
                  styles.hover,
                  isActive && styles.active,
                )}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 border-t border-border p-4">
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-sm font-bold text-primary">Need Help?</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Contact support or open the help center.
            </p>
            <button className="mt-3 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-semibold text-primary">
              Help Center
            </button>
          </div>
          <Link
            href="/help"
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition",
              styles.hover,
            )}
          >
            <HelpCircle className="size-5" />
            Help
          </Link>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-border bg-surface/90 backdrop-blur dark:bg-card/90">
          <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button className="rounded-lg border border-border p-2 text-muted-foreground md:hidden">
                <Menu className="size-5" />
              </button>
              <h1 className="truncate font-heading text-xl font-semibold text-primary">
                {workspaceName ?? activeItem?.label ?? "Dashboard"}
              </h1>
            </div>

            <div className="hidden max-w-sm flex-1 items-center rounded-lg border border-border bg-muted/60 px-3 py-2 lg:flex dark:bg-muted/20">
              <Search className="mr-2 size-4 text-muted-foreground" />
              <input
                className={cn(
                  "w-full bg-transparent text-sm text-primary outline-none placeholder:text-muted-foreground focus:ring-2",
                  styles.focus,
                )}
                placeholder={searchPlaceholder}
              />
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                aria-label="Notifications"
                className="relative inline-flex size-10 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground shadow-sm transition hover:text-primary dark:bg-card"
                type="button"
              >
                <Bell className="size-4" />
                <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-danger ring-2 ring-surface dark:ring-card" />
              </button>
              <PortalAccount />
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto border-t border-border px-4 py-2 md:hidden">
            {navItems.map((item) => {
              const Icon = iconMap[item.icon ?? "dashboard"];
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border px-3 py-2 text-xs font-semibold text-muted-foreground",
                    isActive && styles.active,
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
