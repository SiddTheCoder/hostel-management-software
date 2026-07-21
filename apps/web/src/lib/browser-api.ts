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
    };

export async function browserApi<T>(input: RequestInfo | URL, init?: RequestInit) {
  const headers = new Headers(init?.headers);

  if (init?.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  const response = await fetch(input, {
    ...init,
    headers,
  });

  const text = await response.text();
  let payload: ApiPayload<T>;

  try {
    payload = JSON.parse(text) as ApiPayload<T>;
  } catch {
    const isHtml = text.trim().startsWith("<!");
    throw new Error(
      isHtml
        ? `Server returned an HTML page (${response.status}). The API endpoint "${typeof input === "string" ? input : input instanceof URL ? input.href : input.url}" may not exist or there is a server error.`
        : `Invalid JSON response (${response.status}) from the server.`,
    );
  }

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Request failed");
  }

  return payload.data;
}
