"use client";

import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { checkAuthWithRefresh } from "@/lib/auth-check";

type CurrentUser = {
  email: string | null;
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

function readableRole(role: string) {
  return role
    .toLowerCase()
    .split("_")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

export function PortalAccount() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState<CurrentUser | null>(null);

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

    loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

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
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <div className="hidden text-right sm:block">
        {isLoading ? (
          <>
            <p className="text-sm font-semibold text-primary">Loading account</p>
            <p className="text-xs text-muted-foreground">Checking session...</p>
          </>
        ) : error ? (
          <>
            <p className="text-sm font-semibold text-red-700">Session issue</p>
            <p className="max-w-56 truncate text-xs text-muted-foreground">{error}</p>
          </>
        ) : user ? (
          <>
            <p className="text-sm font-semibold text-primary">{user.name}</p>
            <p className="text-xs text-muted-foreground">{readableRole(user.role)}</p>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold text-primary">No account loaded</p>
            <p className="text-xs text-muted-foreground">Refresh or login again</p>
          </>
        )}
      </div>
      <div className="flex size-9 items-center justify-center rounded-full border border-border bg-muted text-xs font-bold text-primary shadow-sm">
        {initials || "HH"}
      </div>
      <button
        aria-label="Logout"
        className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground shadow-sm transition hover:border-danger hover:text-danger disabled:cursor-not-allowed disabled:opacity-60 dark:bg-card"
        disabled={isLoggingOut}
        onClick={handleLogout}
        type="button"
      >
        <LogOut className="size-4" />
      </button>
    </div>
  );
}
