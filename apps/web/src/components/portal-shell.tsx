"use client";

import {
  BedDouble,
  Bell,
  Building2,
  CalendarDays,
  ClipboardList,
  CreditCard,
  ExternalLink,
  Flag,
  FileText,
  HelpCircle,
  Home,
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
import { useState, type ReactNode } from "react";

import { PortalAccount } from "@/components/portal-account";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
  badge?: number;
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
    badge: string;
    brand: string;
    brandSoft: string;
    focus: string;
    hover: string;
    icon: string;
    ring: string;
    softBg: string;
  }
> = {
  admin: {
    active: "bg-role-admin text-white shadow-sm",
    badge: "border-role-admin/20 bg-role-admin-soft text-role-admin",
    brand: "text-role-admin",
    brandSoft: "bg-role-admin",
    focus: "focus-within:border-role-admin/40 focus-within:ring-role-admin/15",
    hover: "hover:bg-role-admin-soft/70 hover:text-role-admin",
    icon: "text-role-admin",
    ring: "ring-role-admin/20",
    softBg: "bg-role-admin-soft",
  },
  guardian: {
    active: "bg-role-guardian text-white shadow-sm",
    badge: "border-role-guardian/20 bg-role-guardian-soft text-role-guardian",
    brand: "text-role-guardian",
    brandSoft: "bg-role-guardian",
    focus: "focus-within:border-role-guardian/40 focus-within:ring-role-guardian/15",
    hover: "hover:bg-role-guardian-soft/70 hover:text-role-guardian",
    icon: "text-role-guardian",
    ring: "ring-role-guardian/20",
    softBg: "bg-role-guardian-soft",
  },
  platform: {
    active: "bg-role-platform text-white shadow-sm",
    badge: "border-role-platform/20 bg-role-platform-soft text-role-platform",
    brand: "text-brand-teal",
    brandSoft: "bg-brand-teal",
    focus: "focus-within:border-role-platform/40 focus-within:ring-role-platform/15",
    hover: "hover:bg-role-platform-soft/70 hover:text-role-platform",
    icon: "text-role-platform",
    ring: "ring-role-platform/20",
    softBg: "bg-role-platform-soft",
  },
  resident: {
    active: "bg-role-resident text-white shadow-sm",
    badge: "border-role-resident/20 bg-role-resident-soft text-role-resident",
    brand: "text-role-resident",
    brandSoft: "bg-role-resident",
    focus: "focus-within:border-role-resident/40 focus-within:ring-role-resident/15",
    hover: "hover:bg-role-resident-soft/70 hover:text-role-resident",
    icon: "text-role-resident",
    ring: "ring-role-resident/20",
    softBg: "bg-role-resident-soft",
  },
};

const planCopy: Record<PortalTone, { cta: string; label: string; renews: string }> = {
  admin: { cta: "Manage Plan", label: "Premium", renews: "Valid till 25 Dec 2026" },
  guardian: {
    cta: "Contact Hostel",
    label: "Guardian Access",
    renews: "Linked resident view",
  },
  platform: {
    cta: "Manage Subscription",
    label: "Enterprise",
    renews: "Renews on Jul 25, 2026",
  },
  resident: { cta: "View Plan", label: "Standard", renews: "Valid till 10 Dec 2026" },
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
  const plan = planCopy[tone];
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [navPathname, setNavPathname] = useState(pathname);

  // Close the mobile nav on navigation (state reset during render, per
  // react.dev "adjusting state when props change" — avoids an effect).
  if (navPathname !== pathname) {
    setNavPathname(pathname);
    setMobileNavOpen(false);
  }

  const roleLabel = workspaceName ?? subtitle;

  function renderNav(onNavigate?: () => void) {
    return (
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon ?? "dashboard"];
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 transition dark:text-slate-300",
                styles.hover,
                isActive && styles.active,
              )}
            >
              <Icon className="size-[18px] shrink-0" strokeWidth={isActive ? 2.25 : 2} />
              <span className="truncate">{item.label}</span>
              {item.badge && item.badge > 0 ? (
                <Badge
                  className={cn(
                    "ml-auto h-5 min-w-5 rounded-full px-1.5 text-[10px] font-bold",
                    isActive
                      ? "border-white/20 bg-white/20 text-white"
                      : "border-transparent bg-role-resident text-white",
                  )}
                >
                  {item.badge}
                </Badge>
              ) : null}
            </Link>
          );
        })}
      </nav>
    );
  }

  function renderSidebarFooter() {
    const helpCopy =
      tone === "guardian"
        ? "Contact the hostel for any queries or assistance."
        : tone === "resident"
          ? "Contact hostel warden or support team."
          : "Visit our help center or contact support.";

    return (
      <div className="mt-auto space-y-3 border-t border-slate-100 p-3 dark:border-border">
        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 dark:border-border dark:bg-muted/30">
          <div className="flex items-start gap-2.5">
            <span
              className={cn(
                "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full",
                styles.badge,
              )}
            >
              <HelpCircle className="size-3.5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">Need Help?</p>
              <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">{helpCopy}</p>
            </div>
          </div>
          <Button
            className="mt-3 h-9 w-full rounded-xl border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-sm dark:border-border dark:bg-card dark:text-foreground"
            type="button"
            variant="outline"
          >
            {tone === "guardian" ? "Contact Hostel" : "Help Center"}
            <ExternalLink className="size-3" />
          </Button>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-3.5 dark:border-border dark:bg-card">
          <p className="text-[11px] font-medium text-muted-foreground">Current Plan</p>
          <p className="mt-0.5 text-sm font-bold text-foreground">{plan.label}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">{plan.renews}</p>
          <Button
            className={cn("mt-3 h-9 w-full rounded-xl border text-xs font-semibold", styles.badge)}
            type="button"
            variant="outline"
          >
            {plan.cta}
          </Button>
        </div>
      </div>
    );
  }

  function renderBrand() {
    return (
      <Link href="/" className="flex items-center gap-2.5">
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl text-white shadow-sm",
            styles.brandSoft,
          )}
        >
          <Home className="size-4 fill-white/20" />
        </span>
        <div className="min-w-0 leading-tight">
          <p className={cn("font-heading text-[17px] font-bold tracking-tight", styles.brand)}>
            {portalName}
          </p>
          <p className="truncate text-[11px] font-medium text-slate-500 dark:text-muted-foreground">
            {subtitle}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f7fb] text-foreground dark:bg-background">
      <aside className="hidden h-screen w-[260px] shrink-0 flex-col border-r border-slate-200/80 bg-white dark:border-border dark:bg-card md:flex">
        <div className="shrink-0 border-b border-slate-100 px-4 py-4 dark:border-border">
          {renderBrand()}
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {renderNav()}
          {renderSidebarFooter()}
        </div>
      </aside>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent className="w-[280px] gap-0 p-0 sm:max-w-[280px]" side="left">
          <SheetHeader className="border-b border-slate-100 px-4 py-4 dark:border-border">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            {renderBrand()}
          </SheetHeader>
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            {renderNav(() => setMobileNavOpen(false))}
            {renderSidebarFooter()}
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur dark:border-border dark:bg-card/95">
          <div className="flex h-[64px] items-center gap-3 px-4 md:px-6">
            <Button
              aria-label="Open navigation"
              className="size-9 rounded-xl border-slate-200 bg-white text-slate-600 shadow-sm md:inline-flex"
              onClick={() => setMobileNavOpen(true)}
              size="icon"
              type="button"
              variant="outline"
            >
              <Menu className="size-4" />
            </Button>

            <div
              className={cn(
                "hidden min-w-0 flex-1 items-center rounded-full border border-slate-200 bg-slate-50/80 px-3 py-1 shadow-sm transition dark:border-border dark:bg-muted/30 md:flex",
                styles.focus,
                "focus-within:ring-2",
              )}
            >
              <Search className="mr-2 size-4 shrink-0 text-slate-400" />
              <Input
                className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:border-0 focus-visible:ring-0"
                placeholder={searchPlaceholder}
              />
              <kbd className="ml-2 hidden shrink-0 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 shadow-sm sm:inline-block dark:border-border dark:bg-card">
                ⌘K
              </kbd>
            </div>

            <div className="ml-auto flex items-center gap-2 md:gap-2.5">
              <ThemeToggle className="hidden sm:inline-flex" />

              <Button
                aria-label="Notifications"
                className="relative size-10 rounded-full border-slate-200 bg-white text-slate-600 shadow-sm dark:border-border dark:bg-card dark:text-foreground"
                size="icon"
                type="button"
                variant="outline"
              >
                <Bell className="size-4" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-card">
                  3
                </span>
              </Button>

              <Badge
                className={cn(
                  "hidden h-auto items-center rounded-full border px-3 py-1.5 text-xs font-semibold sm:inline-flex",
                  styles.badge,
                )}
                variant="outline"
              >
                {roleLabel}
              </Badge>

              <PortalAccount tone={tone} />
            </div>
          </div>

          <div className="border-t border-slate-100 px-4 py-2.5 md:hidden dark:border-border">
            <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 dark:border-border dark:bg-muted/30">
              <Search className="mr-2 size-4 text-slate-400" />
              <Input
                className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:border-0 focus-visible:ring-0"
                placeholder={searchPlaceholder}
              />
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <main className="px-4 py-5 md:px-7 md:py-6">{children}</main>

          <footer className="mt-auto border-t border-slate-200/80 px-4 py-4 text-[11px] text-slate-500 dark:border-border dark:text-muted-foreground md:px-7">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p>© 2026 HostelHub Platform. All rights reserved.</p>
              <p>
                Made with <span className="text-rose-500">♥</span> in Nepal 🇳🇵
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
