# HostelHub Mobile

Expo/React Native app for the phase 1 mobile auth shell.

## Setup

```bash
npm --prefix apps/mobile install
npm --prefix apps/mobile run start
```

Set the API base URL for device testing:

```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
```

Physical devices usually need the LAN URL for the machine running the web app.

## Phase 1 Auth Contract

- Sends `x-hostelhub-client: mobile` on auth requests.
- Stores access and refresh tokens with `expo-secure-store`.
- Supports login, signup with phone/email OTP, OTP verification, Google ID token exchange, token refresh, and logout.
- Public registrations start as `PUBLIC_USER`; resident mode still requires later QR activation.
