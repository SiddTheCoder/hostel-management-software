export async function checkAuthWithRefresh(): Promise<Response> {
  let res = await fetch("/api/v1/auth/me", { credentials: "include" });

  if (res.status === 401) {
    const refreshRes = await fetch("/api/v1/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      res = await fetch("/api/v1/auth/me", { credentials: "include" });
    }
  }

  return res;
}
