"use client";

import { ChevronDown, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { checkAuthWithRefresh } from "@/lib/auth-check";
import { cn } from "@/lib/utils";

type CurrentUser = {
  email: string | null;
  image?: string | null;
  name: string;
  role: string;
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

type PortalTone = "platform" | "admin" | "resident" | "guardian";

function readableRole(role: string) {
  return role
    .toLowerCase()
    .split("_")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

const toneRing: Record<PortalTone, string> = {
  admin: "ring-role-admin/20",
  guardian: "ring-role-guardian/20",
  platform: "ring-role-platform/20",
  resident: "ring-role-resident/20",
};

const toneBg: Record<PortalTone, string> = {
  admin: "bg-role-admin-soft text-role-admin",
  guardian: "bg-role-guardian-soft text-role-guardian",
  platform: "bg-role-platform-soft text-role-platform",
  resident: "bg-role-resident-soft text-role-resident",
};

export function PortalAccount({ tone = "platform" }: { tone?: PortalTone }) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadCurrentUser() {
      try {
        const response = await checkAuthWithRefresh();
        const payload = (await response.json().catch(() => null)) as MeResponse | null;

        if (!response.ok || !payload?.success) {
          throw new Error(
            payload && !payload.success ? payload.message : "Unable to load account.",
          );
        }

        if (isMounted) {
          setUser(payload.data.user);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error ? loadError.message : "Unable to load account.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  async function handleLogout() {
    setIsLoggingOut(true);
    setError("");

    try {
      await fetch("/api/v1/auth/logout", {
        credentials: "include",
        method: "POST",
      });
    } finally {
      window.location.assign("/login");
    }
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "HH";

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-2 shadow-sm transition hover:bg-slate-50 dark:border-border dark:bg-card dark:hover:bg-muted sm:pr-2.5"
        onClick={() => setMenuOpen((open) => !open)}
        type="button"
      >
        {user?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt=""
            className={cn("size-8 rounded-full object-cover ring-2", toneRing[tone])}
            src={user.image}
          />
        ) : (
          <span
            className={cn(
              "flex size-8 items-center justify-center rounded-full text-xs font-bold ring-2 ring-white dark:ring-card",
              toneBg[tone],
            )}
          >
            {isLoading ? "…" : initials}
          </span>
        )}
        <span className="hidden min-w-0 text-left sm:block">
          {isLoading ? (
            <>
              <span className="block text-xs font-semibold text-foreground">Loading…</span>
              <span className="block text-[10px] text-muted-foreground">Session</span>
            </>
          ) : error ? (
            <>
              <span className="block text-xs font-semibold text-rose-600">Session issue</span>
              <span className="block max-w-[120px] truncate text-[10px] text-muted-foreground">
                {error}
              </span>
            </>
          ) : user ? (
            <>
              <span className="block max-w-[120px] truncate text-xs font-semibold text-foreground">
                {user.name}
              </span>
              <span className="block text-[10px] text-muted-foreground">
                {readableRole(user.role)}
              </span>
            </>
          ) : (
            <>
              <span className="block text-xs font-semibold text-foreground">Guest</span>
              <span className="block text-[10px] text-muted-foreground">Not signed in</span>
            </>
          )}
        </span>
        <ChevronDown className="hidden size-3.5 text-slate-400 sm:block" />
      </button>

      {menuOpen ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-border dark:bg-card">
          {user ? (
            <div className="border-b border-slate-100 px-3 py-2 dark:border-border">
              <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email ?? readableRole(user.role)}
              </p>
            </div>
          ) : null}
          <button
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-60 dark:hover:bg-rose-950/30"
            disabled={isLoggingOut}
            onClick={handleLogout}
            type="button"
          >
            <LogOut className="size-4" />
            {isLoggingOut ? "Signing out…" : "Logout"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
