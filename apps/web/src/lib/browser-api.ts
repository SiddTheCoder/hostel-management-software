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
  const payload = (await response.json()) as ApiPayload<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Request failed");
  }

  return payload.data;
}
