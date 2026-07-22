import { refreshSession } from "@/lib/auth-refresh";

type ApiPayload<T> =
  | {
      success: true;
      message: string;
      data: T;
    }
  | {
      success: false;
      message: string;
      errorCode: string;
      details?: unknown;
    };

export class ApiRequestError extends Error {
  details?: unknown;
  status?: number;

  constructor(message: string, details?: unknown, status?: number) {
    super(message);
    this.name = "ApiRequestError";
    this.details = details;
    this.status = status;
  }
}

function requestUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") {
    return input;
  }

  if (input instanceof URL) {
    return input.href;
  }

  return input.url;
}

/**
 * Auth endpoints (login, refresh, me, …) manage their own token lifecycle.
 * A 401 from them is a real credential failure — refreshing and retrying would
 * be wrong (e.g. retrying a failed login) and could loop, so skip the interceptor.
 */
function isAuthEndpoint(url: string): boolean {
  return url.includes("/api/v1/auth/") || url.includes("/api/auth/");
}

function redirectToLogin(): void {
  if (typeof window === "undefined") {
    return;
  }

  // Avoid a redirect loop if we're already on the login screen.
  if (window.location.pathname.startsWith("/login")) {
    return;
  }

  const next = encodeURIComponent(window.location.pathname + window.location.search);
  window.location.assign(`/login?next=${next}`);
}

function sendRequest(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);

  if (init?.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  return fetch(input, {
    credentials: "same-origin",
    ...init,
    headers,
  });
}

async function parseResponse<T>(
  response: Response,
  input: RequestInfo | URL,
): Promise<T> {
  const text = await response.text();
  let payload: ApiPayload<T>;

  try {
    payload = JSON.parse(text) as ApiPayload<T>;
  } catch {
    const isHtml = text.trim().startsWith("<!");
    throw new Error(
      isHtml
        ? `Server returned an HTML page (${response.status}). The API endpoint "${requestUrl(input)}" may not exist or there is a server error.`
        : `Invalid JSON response (${response.status}) from the server.`,
    );
  }

  if (!response.ok || !payload.success) {
    throw new ApiRequestError(
      payload.message || "Request failed",
      "details" in payload ? payload.details : undefined,
      response.status,
    );
  }

  return payload.data;
}

export async function browserApi<T>(input: RequestInfo | URL, init?: RequestInit) {
  const response = await sendRequest(input, init);

  // Access token expired mid-session: transparently refresh once, then replay
  // the original request. 403 (role / tenant denied) is intentionally NOT
  // retried — the caller is authenticated but not allowed, so refreshing the
  // token would change nothing.
  if (response.status === 401 && !isAuthEndpoint(requestUrl(input))) {
    const refreshed = await refreshSession();

    if (refreshed) {
      const retry = await sendRequest(input, init);
      return parseResponse<T>(retry, input);
    }

    // Refresh token is gone or invalid — the session is truly over.
    redirectToLogin();
    throw new ApiRequestError(
      "Your session has expired. Please sign in again.",
      undefined,
      401,
    );
  }

  return parseResponse<T>(response, input);
}
