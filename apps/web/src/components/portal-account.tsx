"use client";

import { useEffect, useState } from "react";

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
        const response = await fetch("/api/v1/auth/me", {
          credentials: "include",
        });
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

  return (
    <div className="flex items-center gap-3">
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
      <button
        className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-primary transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isLoggingOut}
        onClick={handleLogout}
        type="button"
      >
        {isLoggingOut ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}
