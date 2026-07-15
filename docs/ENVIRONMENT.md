# ENVIRONMENT.md — Environment Variables & Setup

## 1. Prerequisites

- Node.js 20 LTS
- pnpm 9+ (`corepack enable`)
- MongoDB Atlas account (or local MongoDB 7.0+)
- Cloudflare account with R2 bucket
- Resend account for transactional emails
- Google Cloud project (optional, for Maps fallback — requires billing enabled)

---

## 2. Environment Variables

Create `.env` at the repo root (never commit it — `.env.example` is the tracked template).

```bash
# --- App ---
NODE_ENV=development
APP_URL=http://localhost:3000

# --- Database ---
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority"

# --- Auth / JWT ---
JWT_ACCESS_SECRET=replace-with-a-long-random-string-min-32-chars
JWT_REFRESH_SECRET=replace-with-a-different-long-random-string-min-32-chars
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=30d

# --- Google OAuth (login) ---
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# --- Google Maps Platform (optional - runtime fallback) ---
# Leave blank to use OpenStreetMap only (free)
# If set, system will auto-detect and use Google Maps if available
GOOGLE_MAPS_API_KEY=                # server-only: Geocoding + Places (never expose to client)
NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY=   # restricted by HTTP referrer, safe for client bundle

# --- Cloudflare R2 (S3-compatible) ---
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET_NAME=multi-hostel-uploads
R2_PUBLIC_URL=https://multi-hostel-uploads.your-account.r2.dev   # or custom domain

# --- Email (Resend) ---
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM="Multi-Hostel Platform <no-reply@yourdomain.com>"

# --- Seed / bootstrap ---
SEED_SUPERADMIN_EMAIL=admin@yourdomain.com
SEED_SUPERADMIN_PASSWORD=set-a-strong-one-time-password

# --- Cron Secret (protect cron endpoints) ---
CRON_SECRET=random-secret-for-vercel-cron-endpoints

# --- Firebase Cloud Messaging (Phase 6 only, leave blank until then) ---
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# --- Production only ---
# SENTRY_DSN=                       # Error monitoring (optional)
# NEXT_PUBLIC_ANALYTICS_ID=          # Google Analytics/Plausible (optional)
```

---

## 3. Secrets Handling

**Never commit:**
- `.env` (actual secrets)
- `google-services.json` / `GoogleService-Info.plist` (Firebase config)
- Any file with real API keys, passwords, or tokens

**Always commit:**
- `.env.example` (template with blank/placeholder values)

**Server-only secrets** (never exposed to client):
- `GOOGLE_MAPS_API_KEY` (server key)
- `R2_SECRET_ACCESS_KEY`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
- `RESEND_API_KEY`
- `FIREBASE_PRIVATE_KEY`
- `DATABASE_URL`
- `CRON_SECRET`

**Client-accessible vars** (must be prefixed `NEXT_PUBLIC_`):
- `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY` (restricted by HTTP referrer in Google Cloud Console)
- `NEXT_PUBLIC_ANALYTICS_ID` (if using analytics)

**Security measures:**
- Restrict `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY` to your production domain(s) via HTTP referrer restrictions
- Restrict `GOOGLE_MAPS_API_KEY` by API (Geocoding, Places only) and server IP if possible
- Set a budget alert on Google Cloud project — Maps/Places billing is usage-based
- Rotate `JWT_*_SECRET` keys if compromised (invalidates all sessions)

---

## 4. Local Setup

### First-time setup

```bash
# 1. Clone repo
git clone <repo-url>
cd multi-hostel-platform

# 2. Install pnpm if not already installed
corepack enable
pnpm --version  # Should be 9.x

# 3. Install dependencies (monorepo)
pnpm install

# 4. Copy env template
cp .env.example .env
# Fill in real values in .env

# 5. MongoDB setup
# - Create MongoDB Atlas cluster (or run local MongoDB)
# - Whitelist your IP
# - Get connection string and set DATABASE_URL in .env

# 6. Cloudflare R2 setup
# - Create R2 bucket
# - Generate R2 API tokens
# - Set R2_* vars in .env
# - Configure CORS for your domain (in Cloudflare dashboard)

# 7. Resend setup
# - Sign up at resend.com
# - Get API key
# - Set RESEND_API_KEY in .env
# - (Production: verify your sending domain)

# 8. Google OAuth setup
# - Go to Google Cloud Console
# - Create OAuth 2.0 client ID (Web application)
# - Add http://localhost:3000/api/auth/google/callback to Authorized redirect URIs
# - Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env

# 9. (Optional) Google Maps setup
# - Enable Maps JavaScript API, Places API, Geocoding API in Google Cloud Console
# - Create two API keys:
#   - Server key (no restrictions) → GOOGLE_MAPS_API_KEY
#   - Browser key (HTTP referrer restriction to your domain) → NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY
# - Enable billing (required for Places API)
# - Set budget alert
# - If not configured, system will use free OpenStreetMap

# 10. Run database seed (creates SUPERADMIN account)
pnpm --filter @packages/db seed

# 11. Start dev server
pnpm dev
# Web app runs at http://localhost:3000
```

---

## 5. Development Commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Start dev server (Turborepo runs `apps/web` dev) |
| `pnpm build` | Production build across monorepo |
| `pnpm lint` | ESLint across all packages |
| `pnpm format` | Prettier format all code |
| `pnpm test` | Run all tests (see TESTING.md) |
| `pnpm --filter @packages/db seed` | Run database seed script |
| `pnpm --filter @packages/db migrate` | Run any pending migrations (if migration system implemented) |

---

## 6. Production Deployment (Vercel)

### Prerequisites
- Vercel account created
- MongoDB Atlas production cluster created
- R2 bucket for production (separate from dev)
- Resend domain verified
- (Optional) Google Cloud project with billing enabled

### Deployment Steps

1. **Push to GitHub/GitLab:**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel:**
   - Import project in Vercel dashboard
   - Select `apps/web` as root directory
   - Framework Preset: Next.js (auto-detected)

3. **Set Environment Variables in Vercel:**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.example`
   - Use **production values** (different DB, different R2 bucket, etc.)
   - Scope critical secrets to **Production only**
   - Scope preview-safe vars to **Production + Preview**

4. **Configure Vercel Cron:**
   Add `vercel.json` at repo root:
   ```json
   {
     "crons": [
       {
         "path": "/api/cron/payment-reminders",
         "schedule": "0 9 * * *"
       },
       {
         "path": "/api/cron/subscription-expiry",
         "schedule": "0 9 * * *"
       },
       {
         "path": "/api/cron/complaint-sla-check",
         "schedule": "0 * * * *"
       },
       {
         "path": "/api/cron/nearby-places-refresh",
         "schedule": "0 2 * * 0"
       }
     ]
   }
   ```

5. **Protect Cron Endpoints:**
   Each cron route checks for `X-Cron-Secret` header:
   ```typescript
   // app/api/cron/payment-reminders/route.ts
   export async function POST(req: Request) {
     const secret = req.headers.get('X-Cron-Secret');
     if (secret !== process.env.CRON_SECRET) {
       return new Response('Unauthorized', { status: 401 });
     }
     // ... cron logic
   }
   ```

6. **Deploy:**
   - Vercel auto-deploys on push to main
   - Preview deployments on PRs
   - Check build logs for errors

7. **Post-Deployment Checks:**
   - [ ] Homepage loads
   - [ ] Can create PUBLIC account and verify email
   - [ ] Superadmin can log in
   - [ ] Hostel registration works
   - [ ] File uploads to R2 work
   - [ ] Emails send successfully (check Resend dashboard)
   - [ ] Cron jobs run on schedule (check logs)
   - [ ] MongoDB connection stable (check Atlas metrics)

---

## 7. Database Migrations (Mongoose)

Mongoose doesn't have formal migrations like Prisma. Options:

**Option A: Manual migration scripts**
Create `packages/db/migrations/` folder:
```
migrations/
  001_seed_platform_config.ts
  002_add_nearby_places_field.ts
  003_create_indexes.ts
```

Run manually during deployment:
```bash
pnpm --filter @packages/db run-migration 001
```

**Option B: Schema changes with Mongoose**
- Mongoose is schema-less at MongoDB level (flexible)
- Add new fields anytime (old documents auto-get defaults)
- Remove fields by stopping code from writing them (old data remains but unused)
- Rename fields requires manual migration script to update all documents

**Recommended approach for this project:**
- Use Mongoose schema defaults for new fields
- For breaking changes (renames, type changes), write one-off migration scripts
- Run migrations manually in production before deploying new code

---

## 8. Monitoring & Logging (Production)

**Error Monitoring:**
- Integrate Sentry (optional but recommended):
  ```bash
  pnpm add @sentry/nextjs
  ```
- Set `SENTRY_DSN` in Vercel env vars
- Configure in `next.config.js`

**Logging:**
- Server-side: use `console.log`/`console.error` (captured by Vercel logs)
- Structured logging (JSON) for easier parsing:
  ```typescript
  console.log(JSON.stringify({
    level: 'info',
    timestamp: new Date().toISOString(),
    userId: session.userId,
    action: 'payment_verified',
    message: 'Payment proof verified successfully',
  }));
  ```

**Performance Monitoring:**
- Vercel Analytics (built-in, free tier)
- Optional: Google Analytics, Plausible

**Database Monitoring:**
- MongoDB Atlas has built-in performance monitoring
- Set up alerts for slow queries, high CPU, connection limits

---

## 9. Phase 6 (Mobile) Additional Setup

Not needed until Phase 6:

**Expo EAS Build:**
- Install EAS CLI: `npm install -g eas-cli`
- Login: `eas login`
- Configure `eas.json` in `apps/mobile/`
- Build: `eas build --platform android --profile preview`

**Firebase Cloud Messaging:**
- Create Firebase project
- Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
- Place in `apps/mobile/` (gitignored)
- Set Firebase env vars

**App Store Accounts:**
- Google Play Console account (one-time $25 fee)
- Apple Developer Program ($99/year)
- Out of scope per PRD.md §5 — client-payable

---

## 10. Troubleshooting

**"Cannot connect to MongoDB":**
- Check `DATABASE_URL` is correct
- Verify IP is whitelisted in Atlas
- Check network access settings

**"Google OAuth not working":**
- Verify `GOOGLE_OAUTH_REDIRECT_URI` matches exactly in Google Cloud Console
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Ensure OAuth consent screen is configured

**"Emails not sending":**
- Check `RESEND_API_KEY` is valid
- Verify sending domain in Resend (for production)
- Check Resend dashboard for delivery logs
- In development, emails go to test mode if domain not verified

**"R2 uploads failing":**
- Verify `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY`
- Check CORS configuration in Cloudflare dashboard
- Ensure bucket name matches `R2_BUCKET_NAME`

**"Map not loading":**
- If using Google Maps: check browser key is restricted properly
- If using OpenStreetMap: check Leaflet CSS is imported
- Check browser console for errors

**"Push notifications not working":**
- Check `FIREBASE_SERVICE_ACCOUNT_KEY` is valid JSON
- Verify FCM project is enabled in Firebase console
- For iOS: check APNS certificate is uploaded to Firebase
- Check device tokens are being stored correctly

---

## 8. Push Notifications (Phase 6 - Mobile)

### Firebase Cloud Messaging (FCM) + APNS

```bash
# Firebase Admin SDK service account (JSON file)
FIREBASE_SERVICE_ACCOUNT_KEY='{...}'  # Full JSON content or path to file
# Or separate fields:
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Firebase Cloud Messaging Server Key (legacy, for older SDK)
FCM_SERVER_KEY=AAAA...

# APNS (iOS) - configured in Firebase console, no env var needed
```

**Setup Steps:**
1. Create Firebase project at https://console.firebase.google.com
2. Enable Cloud Messaging
3. Download service account JSON from Settings → Service Accounts
4. For iOS: Upload APNS certificate (development + production) in Firebase → Project Settings → Cloud Messaging
5. Add `FIREBASE_SERVICE_ACCOUNT_KEY` to `.env`

---

## 9. QuestionCall Integration (Phase 5)

```bash
# QuestionCall API for SSO redirect
QUESTIONCALL_API_URL=https://questioncall.com/api
QUESTIONCALL_SSO_SECRET=your-shared-secret  # For signing JWT tokens
```

---

## 10. Location Tracking Configuration Defaults

Platform defaults (stored in PlatformConfig, but can be overridden via env for initial seed):

```bash
# Default geofence radii (meters)
DEFAULT_INSIDE_ZONE_RADIUS=50
DEFAULT_NEARBY_ZONE_RADIUS=200

# Default tracking times (HH:mm format)
DEFAULT_TRACKING_TIME_MORNING=08:00
DEFAULT_TRACKING_TIME_EVENING=18:00
DEFAULT_TRACKING_TIME_NIGHT=22:00

# Default data retention (days)
DEFAULT_LOCATION_DATA_RETENTION_DAYS=600
DEFAULT_ATTENDANCE_ALERT_THRESHOLD_DAYS=14
```

---

_End of ENVIRONMENT.md_

