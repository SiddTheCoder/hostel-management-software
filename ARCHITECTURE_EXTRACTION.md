# 🏗️ Jiwan-Mijhar — Reusable Architecture Extraction Document

> **Purpose:** This document captures the complete architecture, flows, and services used in this codebase so you can replicate the same patterns in a new project.

---

## Project Overview

| Aspect | Details |
|---|---|
| **Monorepo structure** | `app/` (React Native / Expo Router mobile) + `web/` (Next.js 16 API + PWA backend) |
| **Database** | MongoDB (Mongoose 9) — single DB shared by both apps |
| **Language** | TypeScript 5.x everywhere |
| **Package manager** | npm |
| **Deployment** | Web → Vercel; Mobile → EAS Build / Codemagic CI |

---

## 1. Authentication & Authorization Flow

### Services/Libraries
- **NextAuth.js v4** (`next-auth`) — web session auth (Credentials + Google OAuth)
- **jsonwebtoken** — mobile JWT access/refresh tokens
- **bcryptjs** — password hashing
- **Firebase Admin** — Google OAuth user creation
- **expo-secure-store** — mobile token persistence
- **redux-persist** — mobile auth state persistence

### Key Files
| File | Purpose |
|---|---|
| `web/lib/auth.ts` | NextAuth config, `authOptions`, `getSafeServerSession()`, Google sign-in callback, referral logic |
| `web/lib/unified-auth.ts` | Dual-auth gateway: Bearer token (mobile) OR session cookie (web) → `getAuthenticatedUser()` |
| `web/lib/mobile-auth.ts` | JWT generation (`generateAccessToken`, `generateRefreshToken`), verification, revocation |
| `web/models/User.ts` | User schema (roles: STUDENT/TEACHER/ADMIN, subscriptions, referral, points) |
| `web/models/RefreshToken.ts` | Refresh token storage for revocation tracking |
| `app/lib/api.ts` | Mobile Axios client with Bearer token injection, auto-refresh on 401, force logout |
| `app/store/slices/authSlice.ts` | Redux auth state (accessToken, user) |
| `app/lib/session.ts` | Session management + Pusher cleanup on logout |

### How It Works

**Web (NextAuth):**
1. User signs in via `/auth/signin` → NextAuth CredentialsProvider or GoogleProvider
2. `authorize()` callback: validates email+password via bcrypt against MongoDB `User.passwordHash`
3. Google flow: `signIn` callback creates new User if not exists (generates unique username, referral code, sends greeting email, creates trial transaction)
4. `jwt` callback: injects `id`, `role`, `username`, `isMasterAdmin` into JWT token
5. `session` callback: maps token fields to `session.user`
6. Session strategy: `jwt` (stateless), `NEXTAUTH_SECRET` env var
7. `getSafeServerSession()` wraps `getServerSession(authOptions)` with decryption error handling

**Mobile (JWT):**
1. `POST /api/mobile/register` → creates user, returns `{ accessToken, refreshToken }`
2. `POST /api/mobile/login` → validates credentials, returns tokens
3. `POST /api/mobile/refresh` → validates refresh token (DB lookup), issues new access token
4. Access token: 15-min expiry, contains `{ userId, role, email, name }`
5. Refresh token: 30-day expiry, stored in `RefreshToken` collection for revocation
6. Axios interceptor: attaches `Authorization: Bearer <token>` to every request
7. On 401: auto-refresh → retry; on refresh failure: wipe SecureStore + Redux + redirect to login
8. On 403 (suspended): redirect to `/suspended`

**Unified Auth (API routes):**
```
getAuthenticatedUser(request?)
  → Check Bearer token first (mobile)
  → Fall back to session cookie (web)
  → Verify user not suspended/deleted
  → Touch lastActiveAt (throttled 2min)
```

**RBAC:**
- Roles: `STUDENT`, `TEACHER`, `ADMIN`
- `isMasterAdmin` flag on User for super-admin
- `teacherModeVerified` flag gates teacher features
- Account suspension: `isSuspended` + `isDeleted` fields checked at auth gate

### Reusable Code Snippets

```typescript
// Unified auth — works for both web and mobile API routes
import { getAuthenticatedUser } from "@/lib/unified-auth";

export async function POST(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.isSuspended) return NextResponse.json({ error: "Suspended" }, { status: 403 });
  // ... business logic
}
```

```typescript
// Mobile Axios with auto-refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    // Refresh token → retry → force logout on failure
  },
);
```

### Environment Variables Needed
```
NEXTAUTH_SECRET
NEXTAUTH_URL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
MONGODB_URI
```

### Setup Steps
1. Install: `next-auth`, `bcryptjs`, `jsonwebtoken`
2. Create User model with passwordHash (select: false)
3. Configure NextAuth with CredentialsProvider + GoogleProvider
4. Create RefreshToken model for mobile token revocation
5. Set up mobile Axios interceptor for Bearer token + auto-refresh
6. Create `getAuthenticatedUser()` unified gateway for all API routes

---

## 2. App / Web Navigation & Core Flow

### Architecture Overview

**Web (Next.js 16):**
- App Router with route groups: `(workspace)`, `(admin)`, `(courses)`, auth routes
- API routes under `app/api/`
- shadcn/ui + Tailwind CSS v4 + Radix UI
- Redux Toolkit for client state
- React Hook Form + Zod for form validation

**Mobile (Expo Router):**
- File-based routing via `expo-router` v6
- Bottom tab navigation (`@react-navigation/bottom-tabs`)
- NativeWind v4 (Tailwind for RN)
- Redux Toolkit + redux-persist for state
- React Navigation for stack navigation

### Key Files
| File | Purpose |
|---|---|
| `web/app/layout.tsx` | Root layout, fonts, providers |
| `web/app/(workspace)/layout.tsx` | Authenticated shell (sidebar, header, Pusher subscription) |
| `web/components/shared/workspace-shell.tsx` | Main workspace container with realtime subscriptions |
| `web/store/store.ts` | Redux store config |
| `web/store/features/*/` | Auth, channels, feed, upload, user slices |
| `app/app/_layout.tsx` | Mobile root layout, Sentry init, LiveKit registration |
| `app/app/(tabs)/_layout.tsx` | Bottom tab navigator |
| `app/store/index.ts` | Mobile Redux store with persistence |
| `app/lib/api.ts` | Mobile API client (Axios) |
| `web/lib/axios.ts` | Web API client (Axios) |
| `web/lib/mongodb.ts` | Mongoose connection singleton |

### State Management

**Web:** Redux Toolkit with slices:
- `authSlice` — session/user state
- `channelSlice` — active channel chat state
- `channelsSlice` — channels list
- `feedSlice` — question feed
- `uploadSlice` — video upload progress
- `userSlice` — user profile data

**Mobile:** Redux Toolkit + redux-persist:
- `authSlice` — accessToken, user, registration status
- `walletSlice` — wallet data, withdrawal history
- `configSlice` — platform config cache
- `notificationsSlice` — in-app notifications (Pusher-fed)
- Plus feature slices for channels, feed, etc.

### Data Fetching
- **Web:** Direct server-side fetching in Server Components + `fetch()` in Client Components
- **Mobile:** Axios instance with Bearer token interceptor + Redux for caching
- No React Query — uses Redux as the data cache

### Reusable Code Snippets

```typescript
// MongoDB connection singleton (web)
const cached = globalThis.mongooseCache ?? { conn: null, promise: null };
if (!globalThis.mongooseCache) globalThis.mongooseCache = cached;

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI!, {
      bufferCommands: false, maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000, socketTimeoutMS: 10000,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
```

```typescript
// Web Axios instance with error normalization
export const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const message = error.response?.data?.message || error.response?.data?.error || error.message || "Request failed.";
    return Promise.reject(new Error(message));
  },
);
```

### Environment Variables Needed
```
MONGODB_URI
EXPO_PUBLIC_API_URL
EXPO_PUBLIC_PUSHER_KEY
EXPO_PUBLIC_PUSHER_CLUSTER
```

### Setup Steps
1. Initialize Next.js with App Router + MongoDB
2. Set up Expo project with expo-router
3. Create Redux store with feature slices
4. Configure Axios instances (web + mobile) with interceptors
5. Set up NativeWind (mobile) + Tailwind CSS (web)
6. Create MongoDB connection singleton with caching

---

## 3. Notification Flow

### Services/Libraries
- **Pusher** (server: `pusher` v5, client: `pusher-js` v8) — realtime in-app events
- **Web Push API** (`web-push` v3) — browser push notifications (VAPID)
- **Firebase Cloud Messaging** (`firebase-admin`) — Android push
- **Expo Push Notifications** (`expo-notifications`) — mobile push
- **Resend** (`resend` v6) — transactional emails
- **React Email** (`@react-email/components`) — email templates

### Key Files
| File | Purpose |
|---|---|
| `web/lib/pusher/pusherServer.ts` | Pusher server instance + all emit functions |
| `web/lib/pusher/pusherClient.ts` | Pusher client singleton (web) |
| `web/lib/pusher/events.ts` | All event name constants + channel name helpers |
| `app/lib/realtime.ts` | Pusher client for React Native |
| `web/lib/push/web-push.ts` | Web Push + Expo Push dispatcher |
| `web/lib/fcm-push.ts` | FCM push (legacy, delegates to web-push) |
| `web/lib/firebase-admin.ts` | Firebase Admin init |
| `web/lib/notification-prefs.ts` | Per-category push toggle logic |
| `web/models/PushSubscription.ts` | Push subscription storage |
| `web/lib/sendEmails/*.ts` | Email senders (greeting, verification, forgot-password, transaction, referral, live-session, admin notification, alert) |
| `web/lib/resend/resend.ts` | Resend client init |
| `web/emails/*.tsx` | React Email templates |

### How It Works

**Realtime (Pusher):**
1. Server triggers events via `pusherServer.trigger(channel, event, data)`
2. Client subscribes to channels and binds event handlers
3. Channel naming: `user-{userId}` for personal events, `channel-{channelId}` for chat, `questions-feed` for feed, `admin-updates` for admin

**Push Notifications:**
1. User registers subscription via `POST /api/push/subscribe` (saves to `PushSubscription` collection)
2. When event triggers → `sendPushNotificationToUser(userId, payload)`
3. Dispatcher checks `notificationPrefs` (per-category toggle) — skips if muted
4. Groups subscriptions by platform:
   - **Android** → Expo Push API (via `sendExpoPush`)
   - **Web/iOS** → Web Push API (VAPID)
5. Expired/invalid subscriptions auto-deleted (410 Gone handling)

**Email:**
1. All emails go through Resend API
2. Templates built with React Email (`@react-email/components`)
3. Sent fire-and-forget from API routes
4. Types: greeting, verification, forgot-password, transaction-alert, referral-invite, live-session-invite, admin-notification

**Notification Events:**
```
question:new, question:accepted
channel:message, channel:status, channel:closed
call:incoming, call:accepted, call:rejected, call:ended, call:missed
subscription:activated
withdrawal:processed
daily:target, monthly:bonus
admin:broadcast
```

### Reusable Code Snippets

```typescript
// Pusher event constants (reusable pattern)
export const QUESTION_FEED_CHANNEL = "questions-feed";
export const QUESTION_CREATED_EVENT = "question:created";
export function getChannelPusherName(channelId: string) { return `channel-${channelId}`; }
export function getUserPusherName(userId: string) { return `user-${userId}`; }
```

```typescript
// Push notification dispatcher with platform routing
export async function sendPushNotificationToUser(userId: string, notification: NotificationPayload) {
  const subscriptions = await PushSubscriptionModel.find({ userId });
  const androidSubs = subscriptions.filter(s => s.platform === "android");
  const webSubs = subscriptions.filter(s => s.platform === "web" || s.platform === "ios");
  
  if (androidSubs.length > 0) await sendExpoPush(androidSubs, { ... });
  if (webSubs.length > 0) await sendWebPush(webSubs, { ... });
}
```

### Environment Variables Needed
```
PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER
NEXT_PUBLIC_PUSHER_KEY, NEXT_PUBLIC_PUSHER_CLUSTER
VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT
NEXT_PUBLIC_VAPID_PUBLIC_KEY
FIREBASE_SERVICE_ACCOUNT_KEY
RESEND_API_KEY
```

### Setup Steps
1. Create Pusher app → get credentials
2. Set up `web-push` with VAPID keys (`npx tsx scripts/generate-vapid-keys.ts`)
3. Create Firebase project → download service account JSON
4. Set up Resend account → get API key
5. Create PushSubscription model + subscribe endpoint
6. Build notification dispatcher with platform routing
7. Create React Email templates
8. Set up notification preferences model/logic

---

## 4. Payment Flow

### Services/Libraries
- **eSewa ePay** — primary payment gateway (Nepal)
- **Manual payment** — QR code + admin verification
- **Cloudinary** — receipt screenshot upload
- **pdfkit** — receipt PDF generation

### Key Files
| File | Purpose |
|---|---|
| `web/lib/payment/esewa.ts` | HMAC signature generation |
| `web/app/api/payments/esewa/initiate/route.ts` | Create eSewa payment session |
| `web/app/api/payments/esewa/verify/route.ts` | Verify subscription payment callback |
| `web/app/api/payments/esewa/course-verify/route.ts` | Verify course purchase callback |
| `web/app/api/payments/manual/route.ts` | Manual payment submission (QR + screenshot) |
| `web/app/payment/esewa/success/page.tsx` | Success redirect page |
| `web/app/payment/esewa/failure/page.tsx` | Failure redirect page |
| `web/components/payment/esewa-pay-button.tsx` | eSewa checkout button |
| `web/components/checkout/checkout-shell.tsx` | Checkout UI shell |
| `web/models/Transaction.ts` | Transaction model |
| `web/lib/plans.ts` | Subscription plan definitions |
| `web/lib/config.ts` | Plan pricing + platform config seed |
| `web/lib/course-purchases.ts` | Course purchase logic |
| `web/lib/chapter-purchases.ts` | Chapter purchase logic |
| `web/app/api/admin/transactions/[id]/approve/route.ts` | Admin approval |
| `web/lib/generate-receipt-pdf.ts` | PDF receipt generation |

### How It Works

**Subscription Purchase (eSewa):**
1. User selects plan → clicks eSewa button
2. `POST /api/payments/esewa/initiate` → creates Transaction (PENDING), generates HMAC signature, returns eSewa form URL
3. User redirected to eSewa → completes payment
4. eSewa redirects to `/payment/esewa/success?data=<encoded>`
5. Success page calls `POST /api/payments/esewa/verify` → verifies HMAC, checks eSewa status API, updates Transaction to COMPLETED, activates subscription
6. Sends push notification + email receipt

**Manual Payment:**
1. User submits form with amount, plan, screenshot (uploaded to Cloudinary)
2. `POST /api/payments/manual` → creates Transaction (PENDING)
3. Admin reviews in `/admin/transactions` → approves or rejects
4. On approve: activates subscription, sends notifications + email + receipt PDF

**Course/Chapter Purchase:**
1. `POST /api/courses/[id]/purchase/initiate` → creates Transaction, uploads receipt
2. Admin approves → credits teacher (minus commission), marks course as purchased

**Withdrawal (Teacher):**
1. Teacher requests withdrawal → `POST /api/wallet/withdraw`
2. Creates WithdrawalRequest (PENDING), deducts points
3. Admin reviews → completes (marks eSewa number used) or rejects (refunds points)

### Transaction Model Schema
```typescript
{
  userId: ObjectId,
  type: "CREDIT" | "DEBIT" | "WITHDRAWAL" | "SUBSCRIPTION_MANUAL" | 
        "COURSE_PURCHASE" | "COURSE_SALE_CREDIT" | "CHAPTER_PURCHASE" | "CHAPTER_SALE_CREDIT",
  amount: Number,
  status: "PENDING" | "COMPLETED" | "FAILED",
  gateway?: "ESEWA" | "INTERNAL" | "MANUAL" | "KHALTI",
  transactionId?: String,
  planSlug?: String,
  screenshotUrl?: String,
  meta?: Mixed,
}
```

### Reusable Code Snippets

```typescript
// eSewa HMAC signature generation
import crypto from "crypto";

export function generateEsewaSignature(totalAmount: number, transactionUuid: string, productCode: string): string {
  const signedFieldNames = `total_amount,transaction_uuid,product_code`;
  const signData = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
  return crypto
    .createHmac("sha256", process.env.ESEWA_SECRET_KEY!)
    .update(signData)
    .digest("base64");
}
```

### Environment Variables Needed
```
ESEWA_MERCHANT_ID
ESEWA_SECRET_KEY
ESEWA_MERCHANT_CODE
ESEWA_PAYMENT_URL (sandbox: https://rc-epay.esewa.com.np/api/epay/main/v2/form)
ESEWA_STATUS_URL (sandbox: https://rc.esewa.com.np/api/epay/transaction/status/)
NEXT_PUBLIC_ESEWA_PAYMENT_URL
CLOUDINARY_URL
```

### Setup Steps
1. Register as eSewa merchant → get merchant ID, secret key, code
2. Set up sandbox credentials for testing
3. Implement HMAC signature generation (SHA-256)
4. Create initiate → redirect → verify flow
5. Set up Cloudinary for receipt screenshots
6. Create Transaction model + admin approval workflow
7. Implement PDF receipt generation

---

## 5. Other Important Flows

### 5a. File/Media Upload & Storage

**Services:** Cloudinary (images, course videos, receipts), Mux (course video hosting/playback), Cloudflare R2 (document uploads)

**Key Files:**
| File | Purpose |
|---|---|
| `web/lib/r2.ts` | Cloudflare R2 presigned URL generation |
| `web/lib/upload-manager.ts` | Mux video upload manager (UpChunk) |
| `web/lib/client-upload.ts` | Client-side upload utilities |
| `web/lib/chat-upload-manager.ts` | Chat attachment uploads |
| `web/lib/general-upload-manager.ts` | General file uploads |
| `web/app/api/upload/route.ts` | Image upload endpoint |
| `web/app/api/courses/[id]/videos/sign/route.ts` | Cloudinary video signing |

**How It Works:**
- **Images:** Direct upload to Cloudinary via signed upload stream
- **Course Videos:** Mux direct upload (UpChunk chunked upload) → poll status until READY
- **Documents:** Cloudflare R2 presigned PUT URLs (client uploads directly)
- **Chat Attachments:** Cloudinary upload with compression
- **Thumbnails:** Cloudinary upload + destroy old on replace

**Reusable Code Snippets:**
```typescript
// R2 presigned upload URL
export async function getPresignedUploadUrl(key: string, contentType: string, maxSizeBytes?: number): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
    ...(maxSizeBytes ? { ContentLength: maxSizeBytes } : {}),
  });
  return getSignedUrl(getR2Client(), command, { expiresIn: 600 });
}
```

**Env Vars:** `CLOUDINARY_URL`, `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`, `MUX_TOKEN_ID`, `MUX_TOKEN_SECRET`

---

### 5b. Realtime Features (Pusher + LiveKit)

**Services:** Pusher (signaling, chat, notifications), LiveKit (audio/video calls)

**Key Files:**
| File | Purpose |
|---|---|
| `web/lib/pusher/pusherServer.ts` | Server-side Pusher triggers |
| `web/lib/pusher/events.ts` | Event constants |
| `web/lib/livekit-room.ts` | LiveKit room management |
| `web/app/api/calls/create/route.ts` | Call creation + token issuance |
| `web/app/api/calls/[id]/accept/route.ts` | Call acceptance |
| `web/app/api/calls/[id]/token/route.ts` | LiveKit token generation |
| `app/lib/call-prewarm.ts` | Mobile LiveKit room pre-warming |
| `app/lib/realtime.ts` | Mobile Pusher client |
| `app/components/realtime/realtime-bridge.tsx` | Mobile realtime event bridge |

**Call Flow:**
1. Caller → `POST /api/calls/create` → creates CallSession, pre-warms LiveKit room, emits `CALL_INCOMING_EVENT` via Pusher
2. Callee receives Pusher event → full-screen incoming call UI
3. Callee accepts → `POST /api/calls/[id]/accept` → generates LiveKit token, updates status to ACTIVE
4. Both join LiveKit room → audio/video via WebRTC
5. Either ends → `POST /api/calls/[id]/end` → room cleanup

**Env Vars:** `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`

---

### 5c. Analytics & Logging

**Services:** Sentry (mobile crash reporting), custom ErrorLog model, API request logging

**Key Files:**
| File | Purpose |
|---|---|
| `app/app/_layout.tsx` | Sentry init (`@sentry/react-native`) |
| `web/lib/error-logging.ts` | Error logging to MongoDB |
| `web/models/ErrorLog.ts` | Error log model |
| `web/models/ApiRequestLog.ts` | API request logging |
| `web/lib/admin/services-usage.ts` | Service usage dashboard |

**Env Vars:** `EXPO_PUBLIC_SENTRY_DSN`

---

### 5d. Cron Jobs / Background Workers

**Key Files:**
| File | Purpose |
|---|---|
| `web/app/api/cron/expire-channels/route.ts` | Auto-close expired channels |
| `web/app/api/cron/expire-calls/route.ts` | Mark missed/expired calls |
| `web/app/api/cron/monthly-rewards/route.ts` | Monthly teacher bonus rewards |
| `web/app/api/cron/purge-deleted-accounts/route.ts` | Permanent account deletion |
| `web/lib/cron-auth.ts` | Cron endpoint authentication |

**How It Works:**
- Endpoints authenticated via `CRON_SECRET` (query param or header)
- Triggered by external cron service (cron-job.org)
- Schedule: channel expiration (hourly), call expiration (hourly), monthly rewards (monthly), account purge (daily)

**Env Vars:** `CRON_SECRET`

---

### 5e. Error Handling & Monitoring

- **Web:** `withApiHandler()` wrapper catches errors, logs to `ErrorLog` model, returns standardized `{ message, error }`
- **Mobile:** Sentry `@sentry/react-native` for crash reporting
- **Alert System:** `sendAlertEmail()` + `sendAdminNotificationEmail()` for critical errors
- **Error Logging:** `logError()` function stores errors in MongoDB with context
- **Threshold Alerting:** `checkThresholdAndAlert()` monitors error frequency

---

### 5f. CI/CD & Deployment

**Key Files:**
| File | Purpose |
|---|---|
| `app/codemagic.yaml` | Codemagic CI for Android builds |
| `app/eas.json` | EAS Build configuration |
| `app/app.json` | Expo app config |
| `web/next.config.ts` | Next.js config |

**Web:** Vercel auto-deploy from git
**Mobile:** Codemagic CI → Android APK/AAB → Play Store

---

## Quick Setup Checklist

### Core Infrastructure
- [ ] MongoDB instance (Atlas or self-hosted)
- [ ] Vercel account (web deployment)
- [ ] EAS Build / Codemagic account (mobile CI)

### Authentication
- [ ] NextAuth.js configured with `NEXTAUTH_SECRET`
- [ ] Google OAuth credentials (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`)
- [ ] bcryptjs for password hashing

### Realtime
- [ ] Pusher app created → `PUSHER_APP_ID`, `PUSHER_KEY`, `PUSHER_SECRET`, `PUSHER_CLUSTER`
- [ ] LiveKit server → `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`
- [ ] VAPID keys generated for Web Push

### Push Notifications
- [ ] Firebase project → `FIREBASE_SERVICE_ACCOUNT_KEY` (JSON)
- [ ] Expo push token registration
- [ ] PushSubscription model + subscribe endpoint

### Email
- [ ] Resend account → `RESEND_API_KEY`
- [ ] React Email templates created
- [ ] Domain verified in Resend

### Payments
- [ ] eSewa merchant account → `ESEWA_MERCHANT_ID`, `ESEWA_SECRET_KEY`, `ESEWA_MERCHANT_CODE`
- [ ] Sandbox credentials for testing
- [ ] HMAC signature implementation

### File Storage
- [ ] Cloudinary account → `CLOUDINARY_URL`
- [ ] Cloudflare R2 bucket → `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`
- [ ] Mux account → `MUX_TOKEN_ID`, `MUX_TOKEN_SECRET`

### Monitoring
- [ ] Sentry DSN → `EXPO_PUBLIC_SENTRY_DSN`
- [ ] `CRON_SECRET` for cron endpoints

---

## Complete Environment Variables Reference

```bash
# ─── Database ────────────────────────────────────────────────
MONGODB_URI

# ─── Authentication ─────────────────────────────────────────
NEXTAUTH_SECRET
NEXTAUTH_URL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET

# ─── Realtime (Pusher) ──────────────────────────────────────
PUSHER_APP_ID
PUSHER_KEY
PUSHER_SECRET
PUSHER_CLUSTER
NEXT_PUBLIC_PUSHER_KEY
NEXT_PUBLIC_PUSHER_CLUSTER

# ─── LiveKit (Video/Audio Calls) ────────────────────────────
LIVEKIT_URL
LIVEKIT_API_KEY
LIVEKIT_API_SECRET
NEXT_PUBLIC_LIVEKIT_URL

# ─── Push Notifications (VAPID) ─────────────────────────────
VAPID_PUBLIC_KEY
VAPID_PRIVATE_KEY
VAPID_SUBJECT
NEXT_PUBLIC_VAPID_PUBLIC_KEY

# ─── Push Notifications (Firebase) ──────────────────────────
FIREBASE_SERVICE_ACCOUNT_KEY

# ─── Email (Resend) ─────────────────────────────────────────
RESEND_API_KEY

# ─── Payments (eSewa) ───────────────────────────────────────
ESEWA_MERCHANT_ID
ESEWA_SECRET_KEY
ESEWA_MERCHANT_CODE
ESEWA_PAYMENT_URL
ESEWA_STATUS_URL
NEXT_PUBLIC_ESEWA_PAYMENT_URL

# ─── File Storage (Cloudinary) ──────────────────────────────
CLOUDINARY_URL
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET

# ─── File Storage (Cloudflare R2) ───────────────────────────
R2_ENDPOINT
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME
R2_PUBLIC_URL

# ─── Video Hosting (Mux) ───────────────────────────────────
MUX_TOKEN_ID
MUX_TOKEN_SECRET

# ─── Monitoring ─────────────────────────────────────────────
EXPO_PUBLIC_SENTRY_DSN
CRON_SECRET

# ─── Mobile App ─────────────────────────────────────────────
EXPO_PUBLIC_API_URL
EXPO_PUBLIC_PUSHER_KEY
EXPO_PUBLIC_PUSHER_CLUSTER
EXPO_PUBLIC_USE_LOCAL_WEB_API
EXPO_PUBLIC_WEB_DEV_HOST
EXPO_PUBLIC_WEB_DEV_PORT
```

---

## Architecture Diagram (Textual)

```
┌─────────────────────────────────────────────────────────────────┐
│                        MOBILE APP                                │
│  React Native + Expo Router + Redux Toolkit + NativeWind        │
│  ├── Auth (JWT + SecureStore)                                    │
│  ├── API Client (Axios + Bearer token + auto-refresh)           │
│  ├── Realtime (Pusher-JS React Native)                          │
│  ├── Calls (LiveKit React Native + CallKeep)                    │
│  └── Notifications (Expo Notifications + Firebase)              │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS (REST API)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     WEB BACKEND (Next.js 16)                    │
│  ├── API Routes (/api/*)                                        │
│  ├── Auth (NextAuth.js + JWT mobile tokens)                     │
│  ├── Database (MongoDB via Mongoose)                             │
│  ├── Realtime (Pusher Server)                                    │
│  ├── Calls (LiveKit Server SDK)                                  │
│  ├── Payments (eSewa HMAC + Manual)                              │
│  ├── Email (Resend + React Email)                                │
│  ├── Push (Web Push VAPID + Expo Push + FCM)                     │
│  ├── Upload (Cloudinary + Mux + R2)                              │
│  └── Cron (expire-channels, expire-calls, monthly-rewards)      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ MongoDB  │    │ Cloudinary│    │   Mux    │
    └──────────┘    └──────────┘    └──────────┘
          │                │                │
          ▼                ▼                ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │  Pusher  │    │ LiveKit  │    │ Cloudflare│
    │ (realtime)│    │  (SFU)   │    │    R2    │
    └──────────┘    └──────────┘    └──────────┘
```

---

*Generated from Jiwan-Mijhar codebase — July 2026*
