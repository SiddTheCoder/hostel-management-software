"use client";

import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { checkAuthWithRefresh } from "@/lib/auth-check";
import { landingPathForRole } from "@/lib/route-access";
import { Role } from "@/lib/roles";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

type PublicHeaderProps = {
  active?: "blog" | "browse" | "compare" | "pricing" | "providers" | "register-hostel";
};

type CurrentUser = {
  email: string | null;
  image: string | null;
  name: string;
  role: Role;
};

type MeResponse =
  | {
      data: {
        user: CurrentUser;
      };
      success: true;
    }
  | {
      message: string;
      success: false;
    };

const DASHBOARD_ROLES = new Set([
  Role.PLATFORM_OWNER,
  Role.HOSTEL_OWNER,
  Role.HOSTEL_ADMIN,
  Role.WARDEN,
  Role.RESIDENT,
  Role.GUARDIAN,
]);

function hasDashboard(role: Role) {
  return DASHBOARD_ROLES.has(role);
}

function dashboardHrefForRole(role: Role) {
  if (role === Role.PUBLIC_USER || role === Role.SERVICE_PROVIDER) {
    return "/hostels";
  }

  return landingPathForRole(role) ?? "/hostels";
}

const navItems = [
  { href: "/hostels", id: "browse", label: "Hostels" },
  { href: "/compare", id: "compare", label: "Compare" },
  { href: "/register-hostel", id: "register-hostel", label: "Register Hostel" },
  { href: "/service-providers/register", id: "providers", label: "Service Providers" },
  { href: "/#blog", id: "blog", label: "Blog" },
  { href: "/#about", id: "about", label: "About Us" },
  { href: "/#contact", id: "contact", label: "Contact" },
] as const;

export function PublicHeader({ active }: PublicHeaderProps) {
  const router = useRouter();
  const [isSessionChecked, setIsSessionChecked] = useState(false);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const loadCurrentUser = useCallback(async () => {
    try {
      const response = await checkAuthWithRefresh();
      const payload = (await response.json().catch(() => null)) as MeResponse | null;

      if (!response.ok || !payload?.success) {
        setUser(null);
        return;
      }

      setUser(payload.data.user);
    } catch {
      setUser(null);
    } finally {
      setIsSessionChecked(true);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadCurrentUser();
    }, 0);

    function handleFocus() {
      void loadCurrentUser();
    }

    window.addEventListener("focus", handleFocus);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("focus", handleFocus);
    };
  }, [loadCurrentUser]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 50); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleLogout() {
    await fetch("/api/v1/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    setMenuOpen(false);
    router.push("/");
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled ? "bg-surface/80 backdrop-blur-lg" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 font-heading text-lg font-semibold text-brand-teal">
          <span className="flex size-8 items-center justify-center rounded-md bg-brand-teal text-sm font-bold text-white">
            H
          </span>
        </Link>

        <nav className="hidden h-full items-center gap-6 text-sm font-medium text-primary md:flex">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex h-full items-center border-b-2 border-transparent pt-1 transition hover:text-brand-teal",
                active === item.id && "border-b-2 border-brand-teal text-brand-teal",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden md:inline-flex" />
          {isSessionChecked ? (
            user && hasDashboard(user.role) ? (
              <Link
                href={dashboardHrefForRole(user.role)}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-teal px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-110"
              >
                Dashboard
              </Link>
            ) : user ? (
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-full p-1 pr-3 text-sm font-medium text-primary transition hover:bg-muted"
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt=""
                      width={32}
                      height={32}
                      className="size-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex size-8 items-center justify-center rounded-full bg-brand-teal/10 text-sm font-semibold text-brand-teal">
                      {(user.email ?? user.name).charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className="hidden md:inline text-muted-foreground">{user.email ?? user.name}</span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border bg-surface p-1 shadow-lg">
                    <div className="border-b border-border px-3 py-2">
                      <p className="truncate text-sm font-medium text-primary">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut className="size-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-primary transition hover:bg-muted"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-brand-teal px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-110"
                >
                  Sign Up
                </Link>
              </div>
            )
          ) : (
            <span className="inline-flex h-10 w-28 rounded-lg bg-muted md:h-10 md:w-32" />
          )}
        </div>
      </div>
    </header>
  );
}
