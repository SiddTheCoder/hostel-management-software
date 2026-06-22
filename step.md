# Step 1 - Planning + Architecture Lock

**Phase in roadmap:** Phase 0
**Status:** Completed for documentation lock and hardened local foundation baseline; full Phase 1 auth expansion continues in the next implementation phase
**Sources reviewed:** `graphify-out/GRAPH_REPORT.md`, `README.md`, `step_plans.md`, `cleint_features.md`, `color-theme.png`
**Goal:** Remove ambiguity before coding starts so we can build one connected multi-hostel SaaS product instead of disconnected modules.

---

## 1. Completion Tracker

### 1.1 Required Phase 0 Outputs

- [x] Final product scope confirmed.
- [x] Final technical stack locked.
- [x] Final module list locked.
- [x] Final role list locked.
- [x] Final database entity list locked.
- [x] API naming convention locked.
- [x] UI sitemap locked.
- [x] Mobile screen list locked.
- [x] Environment setup plan drafted.
- [x] Git branching strategy drafted.
- [x] Definition of done for every module drafted.
- [x] Phase 1 execution checklist drafted.
- [x] External provider/API-key requirements identified; user will add real credentials when integrations are implemented.
- [x] Production domain and hosting owner deferred until deployment/pre-production planning.

### 1.2 Phase 0 Done Gate

- [x] Solo execution model is clear.
- [x] API and model naming conventions are fixed.
- [x] UI routes are fixed.
- [x] Mobile app scope for early phases is fixed.
- [x] Privacy and tenant-isolation rules are written down.
- [x] No disconnected modules should be started.

### 1.3 Step 1 Completion Boundary

- [x] Local architecture lock is complete.
- [x] Local foundation baseline is implemented, tested, and verified.
- [x] Production-only credentials, API keys, domain, and hosting decisions are isolated in Section 19 and do not block local development.
- [x] Web portal access now has a real login path and role-based route protection.
- [x] Full Phase 1 auth expansion is explicitly deferred to the next phase: OTP registration, Google auth, OAuth account linking, and production-grade token rotation.

---

## 2. Locked Product Direction

Build a Nepal-focused multi-hostel SaaS platform with:

- Public hostel discovery website.
- Platform owner portal.
- Hostel owner/admin/warden portal.
- Resident portal.
- Guardian trust dashboard.
- Service provider registration and maintenance network.
- Mobile app for public browsing, resident activation, resident dashboard, notifications, and daily-use flows.
- Shared REST API consumed by web and mobile.

This is not a simple listing website. It is one product with multiple portals, one permission model, one tenant-safe database, and one shared API layer.

---

## 3. Locked Technical Direction

| Area | Decision |
|---|---|
| Web framework | Next.js App Router |
| Backend | Next.js Route Handlers |
| Language | TypeScript |
| Database | MongoDB |
| API style | REST under `/api/v1` |
| Mobile app | React Native / Expo |
| Validation | Zod |
| Auth | Custom JWT access token + refresh token |
| Web refresh token storage | Secure HTTP-only cookie |
| Mobile refresh token storage | Secure storage |
| Password hashing | bcrypt or Argon2 |
| File storage | Cloud object storage, not MongoDB |
| Notifications | Firebase Cloud Messaging after core flows |
| Payments | Manual QR payment: sender scans QR, uploads proof image, and submits transaction code |
| Maps/location | Basic map/location first, advanced distance later |
| Styling | Tailwind CSS |

---

## 4. Recommended Repo Structure

```txt
hostel-saas/
  apps/
    web/
    mobile/
  packages/
    shared/
    database/
    ui/
  docs/
    phase-plan.md
    api-contracts.md
    db-schema.md
```

Inside `apps/web`:

```txt
src/
  app/
    (public)/
    (platform-admin)/
    (hostel-admin)/
    (resident)/
    (guardian)/
    api/
      v1/
  modules/
    auth/
    users/
    platform/
    hostel/
    rooms/
    residents/
    guardian/
    inquiry/
    qr-activation/
    payments/
    food/
    notices/
    complaints/
    night-status/
    move-checklist/
    reviews/
    referrals/
    service-providers/
    maintenance/
    notifications/
    reports/
    audit/
  lib/
    db.ts
    auth.ts
    permissions.ts
    tenant.ts
    api-response.ts
    upload.ts
    rate-limit.ts
    validators.ts
  models/
```

---

## 5. Solo Work Model

There is no separate development team. The working model is:

- Product decisions and priority: user.
- Planning, implementation, verification, and documentation: Codex.
- Scope changes: discussed when they affect architecture, timeline, cost, or data/privacy risk.
- Default execution style: finish the next useful vertical slice, update this tracker, then continue.

| Lane | How It Will Be Covered |
|---|---|
| Product/PM | User confirms business decisions; Codex maintains this execution tracker |
| UI/UX | Codex builds practical, clean screens from the locked sitemap |
| Backend/API | Codex implements models, services, APIs, auth, RBAC, tenant rules, and audit logs |
| Web Frontend | Codex builds the public site and all web portals |
| Mobile App | Codex scaffolds and builds mobile flows after web/API foundation |
| QA | Codex writes and runs focused tests and manual checks |
| DevOps | Codex prepares env files, build scripts, deployment notes, and backup plan |
| Data/Security | Codex enforces privacy, tenant isolation, protected files, and audit behavior |

---

## 6. Locked Role List

| Role | Scope |
|---|---|
| `PLATFORM_OWNER` | Full platform management, approvals, reports, moderation, support access |
| `HOSTEL_OWNER` | Own hostel management, staff/admin management, profile, operations |
| `HOSTEL_ADMIN` | Own hostel admin operations |
| `WARDEN` | Own hostel resident, room, food, notice, complaint, maintenance operations based on permissions |
| `RESIDENT` | Own resident profile, own payments, notices, food, complaints, night status, SOS |
| `GUARDIAN` | Limited linked resident summary where enabled |
| `SERVICE_PROVIDER` | Provider profile only; no resident private data access |
| `PUBLIC_USER` | Public browsing, inquiry submission, provider registration |

Minimum permission rule for every protected endpoint:

1. User is authenticated.
2. User has an allowed role.
3. If data is hostel-scoped, user access is filtered by `hostelId`.
4. If data is resident-scoped, resident sees only self.
5. Sensitive platform/support access is audit logged.

---

## 7. Locked Module List

### 7.1 Foundation Modules

- Auth
- Users
- Sessions/devices
- Roles and permissions
- Tenant access guard
- API response helper
- Validation
- Audit logs
- File assets
- Notifications base

### 7.2 Platform Owner Modules

- Platform dashboard
- Hostel applications and approvals
- Hostel verification
- Listing publish/unpublish controls
- User management
- Service provider approval
- Review moderation
- Duplicate/ghost listing flags
- Platform reports
- Platform payments/subscriptions
- Abuse/spam controls

### 7.3 Public Modules

- Home
- Hostel listing
- Hostel detail
- Search and filters
- Hostel comparison
- Inquiry form
- Public reviews
- Verification badge display
- Service provider registration page

### 7.4 Hostel Admin/Warden Modules

- Dashboard
- Hostel profile
- Floors, rooms, and beds
- Resident management
- QR activation
- Inquiries
- Payments and payment proofs
- Food menus, photos, and feedback
- Notices
- Complaints
- Night status
- SOS alerts
- Guardian access
- Move-in/move-out checklist
- Maintenance requests
- Service provider search
- Reports

### 7.5 Resident Modules

- Resident dashboard
- Resident profile
- QR/code activation
- Food view
- Payment view
- Payment proof upload
- Receipts
- Notices
- Complaints
- Night status
- SOS
- Reviews
- Referral

### 7.6 Guardian Modules

- Guardian login/access
- Dashboard summary
- Fee summary
- Receipts summary
- Notices
- Food view
- Safety summary
- Emergency contact
- Complaint status only if resident allows

### 7.7 Service Provider/Maintenance Modules

- Service provider application
- Platform approval/rejection
- Approved provider search
- Provider profile
- Maintenance request
- Maintenance comments/history
- Cost/status notes

---

## 8. Locked Database Entity List

Minimum MongoDB collections:

```txt
users
sessions
hostels
hostel_members
hostel_documents
hostel_verifications
hostel_applications
floors
rooms
beds
residents
guardians
guardian_access
guardian_permissions
inquiries
inquiry_notes
qr_activations
payments
payment_proofs
receipts
deposit_records
food_menus
food_photos
food_feedback
notices
notice_read_status
complaints
complaint_updates
complaint_attachments
night_statuses
night_status_logs
manual_status_overrides
sos_alerts
emergency_contacts
incident_logs
move_in_checklists
move_out_checklists
room_condition_photos
provided_items
deposit_refunds
rating_reviews
review_moderation_logs
service_providers
service_provider_applications
service_provider_documents
maintenance_requests
maintenance_histories
maintenance_comments
referral_codes
referrals
referral_rewards
notifications
device_tokens
platform_payments
audit_logs
file_assets
listing_flags
duplicate_check_results
```

Every hostel-scoped document must include:

```txt
hostelId
createdBy
updatedBy
createdAt
updatedAt
status
```

Important records should also support soft delete:

```txt
isDeleted
deletedAt
deletedBy
```

---

## 9. Index Plan

Every collection that is queried by role, tenant, status, or public lookup needs indexes before production.

Initial required indexes:

```txt
users: email, phone, role, status
sessions: userId, refreshTokenHash, expiresAt
hostels: slug, status, location.area, verificationStatus
hostel_members: hostelId, userId, role, status
hostel_documents: hostelId, ownerId, documentType, status
floors: hostelId, status
rooms: hostelId, floorId, status, roomType
beds: hostelId, roomId, status
residents: hostelId, userId, phone, status, roomId, bedId
guardians: residentId, phone
guardian_access: hostelId, residentId, guardianId, status
inquiries: hostelId, status, createdAt
qr_activations: hostelId, residentId, codeHash, expiresAt, usedAt
payments: hostelId, residentId, month, status, dueDate
payment_proofs: hostelId, residentId, paymentId, status
food_menus: hostelId, date, weekStartDate
notices: hostelId, category, createdAt
notice_read_status: noticeId, userId
complaints: hostelId, residentId, status, category
night_statuses: hostelId, residentId, status, date
sos_alerts: hostelId, residentId, status, createdAt
rating_reviews: hostelId, residentId, status
service_providers: category, area, status
maintenance_requests: hostelId, status, category, providerId
referrals: hostelId, referrerResidentId, status
notifications: userId, readAt, createdAt
audit_logs: actorId, hostelId, action, createdAt
listing_flags: hostelId, status, riskLevel
```

---

## 10. API Naming Convention

### 10.1 Base Rules

- All public and app APIs use `/api/v1`.
- Use REST naming with nouns.
- Keep route handlers thin.
- Put business logic in `modules/*/*.service.ts`.
- Put validation in `modules/*/*.validation.ts`.
- Put permission checks in `modules/*/*.permissions.ts` or shared `lib/permissions.ts`.
- Mobile app must consume the same APIs as web.
- Do not rely on Server Actions for mobile-required flows.

### 10.2 Response Shape

Success:

```json
{
  "success": true,
  "message": "Resident created successfully",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Unauthorized access",
  "errorCode": "UNAUTHORIZED"
}
```

### 10.3 Route Groups

```txt
/api/v1/auth/*
/api/v1/public/*
/api/v1/platform/*
/api/v1/hostel-admin/*
/api/v1/resident/*
/api/v1/guardian/*
/api/v1/mobile/*
/api/v1/notifications/*
```

### 10.4 Core Phase 1 API Contracts

```txt
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

### 10.5 Core Phase 2 API Contracts

```txt
POST  /api/v1/platform/hostels
GET   /api/v1/platform/hostels
GET   /api/v1/platform/hostels/:id
PATCH /api/v1/platform/hostels/:id/approve
PATCH /api/v1/platform/hostels/:id/reject
PATCH /api/v1/platform/hostels/:id/publish
PATCH /api/v1/platform/hostels/:id/unpublish

GET   /api/v1/public/hostels
GET   /api/v1/public/hostels/:slug

POST  /api/v1/public/hostels/:hostelId/inquiries
GET   /api/v1/hostel-admin/inquiries
PATCH /api/v1/hostel-admin/inquiries/:id/status
POST  /api/v1/hostel-admin/inquiries/:id/notes
```

---

## 11. UI Sitemap Lock

### 11.1 Public Website

```txt
/
/hostels
/hostels/[slug]
/hostels/compare
/hostels/[slug]/inquiry
/service-providers/register
/login
```

### 11.2 Platform Owner Portal

```txt
/platform/dashboard
/platform/hostels
/platform/hostels/[id]
/platform/hostels/[id]/verification
/platform/users
/platform/service-providers
/platform/payments
/platform/reports
/platform/reviews
/platform/abuse-flags
```

### 11.3 Hostel Admin/Warden Portal

```txt
/hostel-admin/dashboard
/hostel-admin/profile
/hostel-admin/rooms
/hostel-admin/room-map
/hostel-admin/residents
/hostel-admin/residents/[id]
/hostel-admin/inquiries
/hostel-admin/payments
/hostel-admin/food
/hostel-admin/notices
/hostel-admin/complaints
/hostel-admin/night-status
/hostel-admin/sos-alerts
/hostel-admin/move-checklists
/hostel-admin/maintenance
/hostel-admin/service-providers
/hostel-admin/reports
```

### 11.4 Resident Portal

```txt
/resident/dashboard
/resident/profile
/resident/food
/resident/payments
/resident/receipts/[id]
/resident/notices
/resident/complaints
/resident/night-status
/resident/sos
/resident/reviews
/resident/referral
```

### 11.5 Guardian Portal

```txt
/guardian/login
/guardian/dashboard
/guardian/payments
/guardian/notices
/guardian/food
/guardian/safety-summary
/guardian/emergency
```

---

## 12. Mobile Screen List Lock

### 12.1 Phase 1 Mobile

- Public mode shell
- Login
- Token/session handling
- API client
- Resident mode shell

### 12.2 Phase 2 Mobile

- Public hostel listing
- Hostel detail
- Search/filter
- Inquiry submission

### 12.3 Phase 3 Mobile

- QR scan/code entry
- Resident activation
- Resident dashboard
- Resident profile
- Food view
- Payment list
- Payment proof upload
- Notices list

### 12.4 Phase 4 Mobile

- Complaint list/detail/create
- Night status update/view
- SOS button
- Emergency contacts
- Notifications feed

### 12.5 Phase 5 Mobile

- Notification token registration
- Final resident flow polish
- Optional referral screen

---

## 13. Environment Setup Plan

### 13.1 Required Tooling

- Node.js LTS.
- pnpm or npm, to be locked when repo is scaffolded.
- MongoDB connection.
- Expo tooling for mobile.
- Git hooks for Graphify updates.
- Deployment platform for web/API.

### 13.2 Required Environment Variables

```txt
NODE_ENV=
APP_URL=
NEXT_PUBLIC_APP_URL=
MONGODB_URI=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
ACCESS_TOKEN_TTL=
REFRESH_TOKEN_TTL=
COOKIE_DOMAIN=
COOKIE_SECURE=
OBJECT_STORAGE_PROVIDER=
OBJECT_STORAGE_BUCKET=
OBJECT_STORAGE_REGION=
OBJECT_STORAGE_ACCESS_KEY_ID=
OBJECT_STORAGE_SECRET_ACCESS_KEY=
OBJECT_STORAGE_PUBLIC_BASE_URL=
FCM_PROJECT_ID=
FCM_CLIENT_EMAIL=
FCM_PRIVATE_KEY=
MAPS_PROVIDER=
MAPS_API_KEY=
RATE_LIMIT_REDIS_URL=
LOG_LEVEL=
```

### 13.3 Environment Files

```txt
.env.example
.env.local
.env.staging
.env.production
```

Only `.env.example` should be committed. Real secrets must stay outside Git.

---

## 14. Git Branching Strategy

Use simple feature branches:

```txt
main
develop
feature/phase-1-auth
feature/phase-1-layouts
feature/phase-2-public-hostels
feature/phase-2-room-bed
feature/phase-3-residents
feature/phase-3-payments
feature/phase-4-complaints
feature/phase-5-maintenance
fix/<short-bug-name>
docs/<short-doc-name>
```

Rules:

- `main` stays production-ready.
- `develop` is integration/staging.
- Feature branches merge into `develop`.
- Release merges from `develop` into `main`.
- Run tests before merge.
- Run `graphify update .` after meaningful code changes when current structure needs to be reflected.
- Keep `graphify-out/` committed after graph generation.

---

## 15. Privacy And Security Lock

These rules are mandatory:

- Resident data is private.
- Every hostel-admin query must filter by `hostelId`.
- Resident endpoints return only the logged-in resident's data.
- Guardian dashboard shows limited summaries only.
- Night status must not expose full movement history.
- Exact GPS must not be shown in normal dashboards.
- Service providers must never access resident private data.
- Private documents must be protected files, not public URLs.
- Platform owner sensitive access must be audit logged.
- Public hostel responses must not include owner documents, resident data, payment data, guardian contacts, internal notes, or audit logs.

---

## 16. Audit Log Lock

Audit logs are required for:

- Hostel approved/rejected.
- Hostel published/unpublished.
- Owner document reviewed.
- Resident created/updated/status changed.
- Room or bed assigned.
- Payment marked paid/partial/overdue.
- Payment proof approved/rejected.
- Complaint status changed.
- Night status manually overridden.
- SOS alert status changed.
- Guardian access granted/revoked.
- Service provider approved/rejected/hidden.
- Maintenance request status changed.
- Review hidden/unhidden.

---

## 17. Definition Of Done For Any Module

A module is complete only when:

- Database model exists.
- Indexes exist for important queries.
- Validation exists.
- API endpoints exist.
- Permission checks are enforced.
- Tenant isolation is enforced.
- API response shape is standard.
- UI is connected to real API.
- Empty/loading/error states exist.
- Sensitive actions create audit logs.
- Mobile API compatibility is considered.
- Basic tests exist.
- QA has checked role-based access.

---

## 18. Phase 1 Handoff Checklist

Phase 1 can start when the team accepts this lock and begins foundation work:

- [x] Scaffold monorepo structure.
- [x] Setup Next.js App Router.
- [x] Setup TypeScript strict mode.
- [x] Setup Tailwind CSS.
- [x] Setup linting/formatting.
- [x] Add `.env.example`.
- [x] Setup MongoDB connection.
- [x] Add API response helper.
- [x] Add Zod validation pattern.
- [x] Add auth module.
- [x] Add role enum and permission helper.
- [x] Add tenant guard helper.
- [x] Add base models: User, Session, Hostel, HostelMember, RolePermission, AuditLog, FileAsset, Notification.
- [x] Add protected route/layout shells.
- [x] Add login and placeholder dashboards.
- [x] Add platform owner seed script for first local login.
- [x] Add explicit mobile refresh-token request-body contract.
- [x] Add first automated tests for route access and mobile auth contract.

---

## 19. User Action Needed Later

These do not block Step 1 or local development. User will provide these when the matching feature/integration is being implemented:

| User Action | Needed For |
|---|---|
| Add MongoDB connection string/API details | Hosted database integration |
| Add object storage credentials | Photos, documents, payment proofs |
| Add Firebase project credentials | Push notifications |
| Add maps provider/API key | Hostel location/map features |
| Choose deployment host | Web/API deployment when ready |
| Confirm production domain and DNS owner | Public launch when ready |
| Provide hostel payment QR assets | Manual QR payment flow |
| Confirm payment proof fields | Proof image upload plus transaction code |
| Choose SMS/WhatsApp/email provider if needed | Optional future communication |

---

## 20. Current Phase 0 Result

Planning and architecture are locked. There are no remaining Codex-side Step 1 blockers. Provider credentials, API keys, deployment host, and production domain are user-supplied setup items for later implementation/deployment work.

---

## 21. Current Phase 1 Local Foundation Result

Completed in the initialized `apps/web` Next.js app:

- Moved App Router code under `apps/web/src/app`.
- Added the exact `color-theme.png` design tokens to `apps/web/src/app/globals.css`:
  `#0F172A`, `#10B981`, `#38BDF8`, `#F8FAFC`, `#1E293B`, `#64748B`, `#E2E8F0`, `#EF4444`.
- Added public home, login, platform owner, hostel admin, resident, and guardian placeholder screens.
- Chose shadcn/ui with the Radix base for the web component system, so components stay accessible, Tailwind-native, and editable in the repo.
- Added initial UI components: button, card, badge, input, label, separator, dropdown menu, dialog, sheet, table, tabs, textarea, select, checkbox, skeleton, avatar, and alert.
- Set typography to Chelsea Market for display headings and Poppins for normal UI text.
- Added `/api/v1/health` plus `/api/v1/auth/login`, `/refresh`, `/logout`, and `/me` route handlers.
- Added `npm run web:seed:platform-owner` to create or update the first platform owner account from environment variables.
- Added MongoDB connection helper, API response helper, Zod validation pattern, JWT auth helpers, password helper, role/permission helper, and tenant guard helper.
- Added shared route-access helpers so portal redirect and role-prefix rules are testable outside the Next.js proxy.
- Added explicit mobile auth helpers: clients send `x-hostelhub-client: mobile` to receive `refreshToken` from login, then call refresh/logout with `{ "refreshToken": "..." }` in the request body.
- Added base Mongoose models with indexes for User, Session, Hostel, HostelMember, RolePermission, AuditLog, FileAsset, and Notification.
- Added root workspace scaffold, package placeholders, `.env.example`, and formatting scripts.
- Connected the web login form to `/api/v1/auth/login`.
- Added HTTP-only access-token cookie support for browser portal sessions while keeping bearer-token support for mobile/API clients.
- Added Next.js `proxy.ts` route protection for platform owner, hostel admin/warden, resident, and guardian portal routes.
- Added `/api/v1/auth/me` support for either bearer access tokens or the web access-token cookie.

Verification passed on 2026-06-22 from the repository root:

- `npm --prefix apps/web run format:check`
- `npm run web:test`
- `npm run web:lint`
- `npm run web:build`

Step 1 is complete for local development and ready to serve as the next-phase baseline. When a later feature needs credentials, API keys, QR payment assets, deployment, or domain setup, Codex will ask the user for the exact value/action at that time.

---

## 22. Deferred Phase 1 Expansion Items

These are still required for full Phase 1 completion from `step_plans.md`, but they are no longer Step 1 blockers:

- OTP request, verification, expiry, resend, and rate-limit APIs.
- Public registration by phone/email plus password.
- Google sign-in/signup and provider account linking.
- `OtpChallenge` and `OAuthAccount` models.
- Production refresh-token rotation and multi-device session hardening.
- Expo mobile app shell and secure-storage implementation.
- Broader role/tenant integration tests against real API endpoints.

---

## 23. Next Phase Tracker

Active tracker for the next phase:

- `step_2.md` - Phase 1 Foundation + Auth + Tenant Core todo list.

Use `step_2.md` as the working checklist. As each Phase 1 item is implemented and verified, tick the matching checkbox there before moving on.
