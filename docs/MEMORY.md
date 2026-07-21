# MEMORY.md — Running Project Memory

This file is the project's working memory across coding sessions. Update it every time meaningful work happens — don't let it go stale. An AI assistant picking up this project should read this file first, before PHASES.md, before touching code.

---

## Completed Work

- **2026-07-14** — Full `docs/` set created: README, PRD, ARCHITECTURE, DATABASE (MongoDB+Mongoose), EMAIL_SYSTEM, FOLDER_STRUCTURE, PHASES, RULES, DESIGN, CODING_STANDARDS, ENVIRONMENT, TESTING, MEMORY, CHANGELOG. No code written yet.
- **2026-07-14 (Late)** — Documentation updated with 7 major new features: Cook Portal, Community Feature, Location Tracking/Auto-Attendance, QuestionCall Integration, Advanced Notifications, Configuration System, Privacy Policy. All features integrated into DATABASE.md, API.md, PHASES.md, ARCHITECTURE.md, RULES.md, PRIVACY_POLICY.md.
- **2026-07-20 — Phase 1 alignment session (IMPORTANT CONTEXT):** Contrary to the older note above, a large codebase ALREADY EXISTED in `apps/web` (built under the deleted `sprints.md` spec: 60+ models, 18 service modules, all portals, `/api/v1/*` routes, OTP-based auth). This session aligned it to `docs/`:
  1. **Monorepo scaffold** — root `package.json` with npm workspaces (`apps/web`, `packages/db`, `packages/shared`) + `turbo.json` + turbo devDependency. **Deviation:** npm workspaces instead of pnpm (pnpm not installed on the machine; corepack shim needs admin). `packages/database` and `packages/ui` are obsolete empty placeholders — delete manually (agent tooling blocked deletes).
  2. **packages/db** — all 61 Mongoose models moved from `apps/web/src/models` (git mv, history preserved), `connection.ts`, `seed.ts` (SUPERADMIN, run via `npm run db:seed`), `migrate-roles.ts` (one-shot legacy→canonical role migration; NOT yet run against the dev DB). `apps/web` imports via `@hostel/db/models/*`; `@/lib/db` is a thin re-export.
  3. **packages/shared** — canonical `Role` enum + `LEGACY_ROLE_MAP`, all DATABASE.md enums, auth Zod schemas, `sendEmail()` (Resend REST; logs + no-throw when unconfigured), 7 Phase 1 email templates (**deviation:** plain `.ts` HTML-string templates, not React Email `.tsx`).
  4. **Role alignment** — `PLATFORM_OWNER→SUPERADMIN`, `HOSTEL_OWNER→HOSTEL_ADMIN` (merged), `PUBLIC_USER→PUBLIC`, `SERVICE_PROVIDER` role removed (directory only), added `PLATFORM_MODERATOR` + `COOK`. Updated route-access, permissions, seed/demo scripts. **Existing dev-DB users still carry legacy role strings until `migrate-roles.ts` is run.**
  5. **User model** — added `emailVerified`, `authProvider`, `googleId`, `mustChangePassword`, `tokenVersion` per DATABASE.md (kept richer `status` enum + soft-delete fields).
  6. **Auth flows (ARCHITECTURE §3)** — new `/api/auth/*` routes: signup (email verification link, JWT purpose token, 24 h), verify-email (+ `/verify-email` page), resend-verification, login (EMAIL_NOT_VERIFIED gate, `redirectPath`, `mustChangePassword`, rate-limited 5/15 min), google (ID-token POST — **deviation** from docs' GET redirect flow; server-side verification per §3.1), refresh, logout, me, change-password, forgot-password, reset-password (tokenVersion-stale check, revokes all sessions). Legacy `/api/v1/auth/*` (incl. OTP flow) kept working — frontend still calls v1.
  7. **Account upgrade (§3.2)** — `registerOrUpgradeUserByEmail()` in `apps/web/src/modules/users/user.service.ts`: create-with-temp-password / upgrade-PUBLIC-in-place / same-role-idempotent / 409 EMAIL_ALREADY_HAS_ROLE; AuditLog entries; credentials-issued or account-upgraded emails. 6 unit tests. **Gap:** §3.2's email-confirmation step before HOSTEL_ADMIN/SUPERADMIN upgrades is NOT implemented (upgrade applies immediately on approval).
  8. **Hostel flow emails** — submission-received on public registration (owner now created as PUBLIC, upgraded at approval), hostel-approved (with temp credentials when owner never had a password), hostel-rejected with reason.
  9. **Tests/quality** — all 91 vitest tests pass (fixed 10 pre-existing failures: stale mocks in `auth.service.test.ts` + `phase2-hostel-routes.test.ts`), `tsc --noEmit` clean, ESLint 0 errors, `.env.example` + README rewritten.

---

## New Features Added (14 July 2026)

**1. Cook Portal (Phase 3):**
- Mobile-only portal for cooks, "Food Ready" notifications, device fingerprint tracking, food timing analytics

**2. Community Feature (Phase 4):**
- Resident social feed with PUBLIC/HOSTEL_ONLY visibility, reactions, comments, moderation, anonymous posting

**3. Location Tracking & Auto-Attendance (Phase 4):**
- Privacy-first (no GPS storage), zone-based tracking (INSIDE/NEARBY/OUTSIDE), 3x daily pings, attendance alerts, 600-day auto-deletion

**4. QuestionCall Integration (Phase 5):**
- Study platform button for STUDENT residents, click tracking, conversion analytics, superadmin dashboard

**5. Advanced Notifications (Phase 5):**
- Priority levels, categories, targeted delivery, scheduled notifications, delivery stats, read receipts

**6. Configuration System (Phase 5):**
- Two-level hierarchy (Platform → Hostel), admin-configurable tracking times/geofence/retention, superadmin overrides

**7. Privacy & Compliance:**
- Consent logging, 60-day grace period for account deletion, GDPR-style rights, PRIVACY_POLICY.md created

**Database Impact:**
- 14 new models added: Notification, NotificationReceipt, FoodReadyLog, AttendanceLog, AttendanceAlert, CommunityPost, CommunityComment, CommunityReaction, QuestionCallClick, HostelSettings, PlatformConfig, ConsentLog, AccountDeletionRequest, (plus Cook role in User)

---

## Current Progress

- **Phase:** Phase 1 — Foundation & Auth (all code-side deliverables done; remaining items are external infra or deliberately deferred — see below and `TODO.md`).
- **Status (2026-07-21):** Production **build is GREEN**, tests **95/95**, typecheck + lint clean. Session of 2026-07-21 cleared the build blocker, added the audit log viewer, closed the §3.2 safeguard, and renamed all `phase*`-named source files to production names.

### 2026-07-21 session — what was done
1. **Build green** — re-ran `npm --prefix apps/web run build` after the prior `useSearchParams()`→Suspense fixes; exit 0, no further prerender errors.
2. **Typecheck fix** — `user.service.test.ts` mock was missing `mustChangePassword` (TS2339); added it. Suite + tsc now clean.
3. **Audit log viewer (read-only)** — PHASES.md §1.1 deliverable. New `apps/web/src/modules/audit/audit.service.ts` (`listPlatformAuditLogs`, actor/hostel labels resolved, capped, newest-first) + `audit.validation.ts`, `GET /api/v1/platform/audit-logs` (SUPERADMIN-gated), `/platform/audit-logs` page + `platform-audit-logs-page.tsx`, nav item, 3 service tests.
4. **§3.2 high-privilege upgrade safeguard** — `registerOrUpgradeUserByEmail` now rotates a PUBLIC→HOSTEL_ADMIN/SUPERADMIN upgrade to a fresh emailed temporary password + `mustChangePassword`, so the elevated role can't be exercised with an un-verified pre-existing password (mailbox-proof). Lower-trust roles (RESIDENT/WARDEN/GUARDIAN) keep credentials. `HIGH_PRIVILEGE_ROLES` set added; 1 new test.
5. **Index audit** — verified the Phase 1 model set (User, Hostel, Room, Bed, HostelDocument, HostelMember, Session, HostelApplication, HostelVerification, AuditLog) already satisfies DATABASE.md "Indexing Strategy Summary" (hostelId compound indexes, unique email/googleId, session TTL). No changes needed.
6. **Production naming** — renamed `phase5-shared.tsx`→`portal-shared.tsx` (8 importers updated), `phase2-hostel-routes.test.ts`→`platform-hostel-routes.test.ts`, `phase5-routes.test.ts`→`growth-routes.test.ts` (via `git mv`, history preserved; `describe()` labels updated). No `phase*`-named source files remain.

---

## RESUME POINT (next session starts here)

Code-side Phase 1 is done. What's left is **external/infra or deliberately deferred** — full list in `TODO.md`:

1. **External infra (needs the user):**
   - Cloudflare R2 bucket + `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME` in `.env` (upload helper + validation already coded).
   - Live `RESEND_API_KEY` + verified sender to test the 7 Phase 1 email templates end-to-end.
   - Role migration against the dev DB: `node --experimental-transform-types packages/db/src/migrate-roles.ts` (PLATFORM_OWNER→SUPERADMIN etc.), then `npm run db:seed`.
   - Manual acceptance-test pass (PHASES.md §1.2) against a running instance once the above are provisioned; unit coverage exists for auth/upgrade/§3.2.
2. **Deliberately deferred (not part of a clean Phase 1):**
   - App-wide response-envelope migration (`{ success, message, data|errorCode }` → docs' `{ success, data|error:{code,message} }`) — do in ONE pass later, not piecemeal.
   - Dedicated `packages/db/src/repositories/` layer — tenant scoping is functionally covered by `apps/web/src/modules/*` services + `lib/tenant.ts`.
   - Field-level alignment of all ~60 models + Phase 3–5 model creation — phase discipline defers future-phase work.
3. **Known deviations from docs (decided 2026-07-20, revisit deliberately, don't "fix" casually):**
   - npm workspaces + turbo instead of pnpm (pnpm needs admin install; switch later via `corepack enable`).
   - API stays under `/api/v1/*` for existing portals ("platform" naming instead of docs' "superadmin"); new docs-standard auth lives at `/api/auth/*`. Frontend still calls `/api/v1` via `browser-api.ts`.
   - Response envelope is `{ success, message, data | errorCode }` (existing app-wide) vs docs' `{ success, data | error:{code,message} }`. Migrate app-wide in one pass later, not piecemeal.
   - Email templates are `.ts` HTML-string functions, not React Email `.tsx`.
   - Google auth = Google Identity Services ID-token POST (server-verified), not GET redirect+callback (no GOOGLE_CLIENT_SECRET in env).
   - Hostel model keeps old shape (slug/location object, `PENDING_APPROVAL`/`PUBLISHED` statuses) vs DATABASE.md — reconcile in Phase 2 public-discovery work.
   - `packages/database` + `packages/ui` are dead placeholder dirs — delete manually.

---

## Pending Tasks (Immediate Next Steps)

- [ ] Re-confirm the real project end date with client — original brief said 5 weeks from 22 June 2026; as of 14 July 2026, ~3 weeks have elapsed. Get updated timeline agreement.
- [ ] **Provision infrastructure:**
  - [ ] MongoDB Atlas account + create database
  - [ ] Cloudflare R2 bucket for file storage
  - [ ] Resend account for transactional emails
  - [ ] Google Cloud project (optional for Maps fallback - billing-enabled if client wants Google Maps)
  - [ ] Vercel account for deployment
- [ ] **Phase 1 Kickoff:**
  - [ ] Scaffold Turborepo monorepo per FOLDER_STRUCTURE.md
  - [ ] Set up `apps/web` (Next.js 14 App Router)
  - [ ] Set up `packages/db` with Mongoose connection
  - [ ] Set up `packages/shared` for Zod schemas, types, email templates
  - [ ] Write Mongoose models per DATABASE.md
  - [ ] Create seed script (`packages/db/seed.ts`) that creates the initial SUPERADMIN account
  - [ ] Build unified auth system (ARCHITECTURE.md §3): email/password + Google OAuth + account upgrade logic
  - [ ] Implement email sending infrastructure (EMAIL_SYSTEM.md)
  - [ ] Create hostel registration form (public)
  - [ ] Create superadmin hostel approval portal

---

## Important Decisions (Locked - Don't Re-Litigate)

| Decision | Choice | Where Documented |
|---|---|---|
| Database | **MongoDB + Mongoose** | ARCHITECTURE.md §1, DATABASE.md |
| Backend architecture | **Next.js 14+ App Router** (full-stack, no separate backend) | ARCHITECTURE.md §1 |
| UI library | **shadcn/ui + Tailwind + lucide-react** | ARCHITECTURE.md §1, DESIGN.md |
| State management | **TanStack Query** (server) + **Zustand** (client) | ARCHITECTURE.md §1 |
| Auth | **Custom JWT + Google OAuth**, unified login gateway, admin-issued accounts with email-based account upgrade | ARCHITECTURE.md §3, PRD.md §8 |
| Email | **Resend** with template system (30+ scenarios documented) | EMAIL_SYSTEM.md |
| File storage | **Cloudflare R2** (S3-compatible) | ARCHITECTURE.md §1 |
| Maps | **OpenStreetMap + Leaflet** (default) with runtime fallback to **Google Maps Platform** if env configured | ARCHITECTURE.md §4 |
| Mobile timing | **Phase 6** (post web-launch, ~2-3 weeks after Phase 5) | PHASES.md, PRD.md §6 |
| Payments (v1) | **Manual proof upload + admin verification only**, no live gateway | ARCHITECTURE.md §6, PRD.md §5 |
| Monorepo | **Turborepo + pnpm workspaces** | FOLDER_STRUCTURE.md |
| Timeline | **5 weeks for web** (Phases 1-5) + **2-3 weeks for mobile** (Phase 6) = ~7-8 weeks total | PRD.md, PHASES.md |

---

## Tech Stack Summary (Quick Reference)

**Core:**
- MongoDB Atlas (database)
- Mongoose (ODM)
- Next.js 14+ App Router (full-stack framework)
- TypeScript (strict mode)
- Turborepo + pnpm (monorepo)

**Frontend:**
- React 18+
- shadcn/ui (components)
- Tailwind CSS (styling)
- lucide-react (icons)
- TanStack Query (server state)
- Zustand (client UI state)
- Axios (HTTP client)
- Zod (validation)
- react-hook-form (forms)

**Backend/API:**
- Next.js API Route Handlers
- Mongoose repositories (tenant-scoped queries)
- Custom JWT + Google OAuth 2.0
- Resend (email with templates)

**Infrastructure:**
- Vercel (hosting)
- Cloudflare R2 (file storage)
- OpenStreetMap + Leaflet (maps, default)
- Google Maps Platform (maps, optional runtime fallback)
- Firebase Cloud Messaging (Phase 6, mobile push)

**Mobile (Phase 6):**
- React Native + Expo
- Same REST API as web
- Expo SecureStore (token storage)
- FCM push notifications

---

## Bugs & Fixes

_(None yet — log here as they're found and fixed, with a one-line root cause, once code exists)_

---

## Context Needed for Future Chats

### Critical Architecture Patterns

**1. Account Upgrade Mechanism (ARCHITECTURE.md §3.2)**
This is the single most important piece of custom logic in this app. When a hostel admin registers a new resident/warden/guardian by email:
- System checks if that email already exists as a PUBLIC account
- If YES → upgrade the existing account in place (change role, link profile, keep existing credentials)
- If NO → create new account with temporary password, send credentials
- Never create duplicate User documents for the same email

**2. Multi-Tenancy Enforcement (ARCHITECTURE.md §2, RULES.md §3)**
Every hostel-scoped query MUST filter by `hostelId` from the session, never from client input:
```typescript
// WRONG - client controls hostelId
const rooms = await RoomModel.find({ hostelId: req.body.hostelId });

// RIGHT - session controls hostelId
const rooms = await RoomModel.find({ hostelId: session.hostelId });
```
Use repository functions in `packages/db/src/repositories/` to enforce this pattern.

**3. Privacy Rules (PRD.md §10, RULES.md §5)**
- Night status is COARSE (`Inside/Outside/Not Verified/SOS`) — never GPS coordinates or timestamps visible to guardians
- Guardian access is field-level opt-in, enforced server-side by filtering response fields before sending
- Complaint content is NEVER visible to guardians unless resident explicitly enables it

**4. PlatformConfig Pattern (ARCHITECTURE.md §5)**
- Singleton document in MongoDB (`_id: 'default'`)
- Loaded at server boot → cached in memory → background revalidation
- Client-side: cached via TanStack Query, served from cache immediately, background refetch
- Used for runtime-configurable values (SLA timers, fee reminders, feature flags, pricing)

**5. Email System (EMAIL_SYSTEM.md)**
- All 30+ email scenarios must be implemented as features are built
- Templates live in `packages/shared/email-templates/`
- Sent via Resend using `sendEmail()` helper
- Guardian emails respect opt-in permissions
- SOS emails are highest priority and cannot be disabled

**6. Maps Provider Fallback (ARCHITECTURE.md §4)**
- Default: OpenStreetMap + Leaflet (free, no API key)
- Fallback: Google Maps (if `GOOGLE_MAPS_API_KEY` env var set and valid)
- System auto-detects at runtime which provider to use
- Never expose server API key to client

---

## Open Questions / Risks

1. **Timeline Baseline:** Original 5-week window started 22 June 2026; as of 14 July, ~3 weeks have passed. Need to re-baseline the actual end date with the client so PHASES.md dates are realistic.

2. **Google Maps Billing:** If client wants Google Maps fallback (richer POI data), they need a billing-enabled Google Cloud project. This is client-payable (PRD.md §5). Confirm if they want this or if free OpenStreetMap-only is acceptable.

3. **Automated Payment Gateway:** eSewa/Khalti/connectIPS integration is explicitly deferred (ARCHITECTURE.md §6, PRD.md §5). v1 ships with manual proof upload only. Confirm client understands this limitation.

4. **Mobile App Scope:** Original brief may have implied mobile in the 5-week window. Docs now treat mobile as Phase 6 (post web-launch). Confirm client is aligned with this split.

---

## Performance & Optimization Notes

_(Log here as optimizations are identified during development)_

- MongoDB indexes are defined in DATABASE.md — ensure they're created during first migration
- PlatformConfig caching reduces DB queries for frequently-accessed config values
- TanStack Query caching reduces redundant API calls
- R2 file URLs are pre-signed with short expiry for private files (payment proofs, documents)

---

## Known Limitations (v1 Scope)

Per PRD.md §5, the following are explicitly OUT OF SCOPE for v1:
- Automated payment gateway integration
- SMS/WhatsApp/email provider costs (client-payable)
- Domain, hosting, Play Store fees (client-payable)
- Government certification/legal verification claims
- Long-term maintenance beyond agreed free-support window

---

_End of MEMORY.md — Update this file continuously as work progresses_
