import { refreshSession } from "@/lib/auth-refresh";

export async function checkAuthWithRefresh(): Promise<Response> {
  let res = await fetch("/api/v1/auth/me", { credentials: "include" });

  if (res.status === 401) {
    // Shared single-flight refresh: if a data request already kicked off a
    // refresh, we await the same one instead of racing it (which would rotate
    // the refresh token twice and kill the session).
    const refreshed = await refreshSession();

    if (refreshed) {
      res = await fetch("/api/v1/auth/me", { credentials: "include" });
    }
  }

  return res;
}
