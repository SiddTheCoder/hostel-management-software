import * as SecureStore from "expo-secure-store";

import type { AuthSession } from "../api/client";

const ACCESS_TOKEN_KEY = "hostelhub.accessToken";
const REFRESH_TOKEN_KEY = "hostelhub.refreshToken";
const USER_KEY = "hostelhub.user";

export async function saveSession(session: AuthSession) {
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_TOKEN_KEY, session.accessToken),
    SecureStore.setItemAsync(REFRESH_TOKEN_KEY, session.refreshToken),
    SecureStore.setItemAsync(USER_KEY, JSON.stringify(session.user)),
  ]);
}

export async function readStoredSession() {
  const [accessToken, refreshToken, userJson] = await Promise.all([
    SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
    SecureStore.getItemAsync(USER_KEY),
  ]);

  if (!accessToken || !refreshToken || !userJson) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
    user: JSON.parse(userJson) as AuthSession["user"],
  };
}

export async function clearSession() {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    SecureStore.deleteItemAsync(USER_KEY),
  ]);
}
