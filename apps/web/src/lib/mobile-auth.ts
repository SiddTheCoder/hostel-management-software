export const AUTH_CLIENT_HEADER = "x-hostelhub-client";
export const MOBILE_AUTH_CLIENT = "mobile";

export function isMobileAuthClient(headers: Headers) {
  return headers.get(AUTH_CLIENT_HEADER)?.toLowerCase() === MOBILE_AUTH_CLIENT;
}

export function shouldExposeRefreshToken(headers: Headers) {
  return isMobileAuthClient(headers);
}

export async function readBodyRefreshToken(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    refreshToken?: unknown;
  } | null;

  if (!body || typeof body.refreshToken !== "string") {
    return null;
  }

  const refreshToken = body.refreshToken.trim();

  return refreshToken.length > 0 ? refreshToken : null;
}
