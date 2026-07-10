# 🗺️ Multi-Hostel SaaS Platform — Sprint Tracker

This document is the consolidated source of truth for the development planning, sprints, technical decisions, and architecture of the Multi-Hostel SaaS Platform. It incorporates the plans from the previous phase documents, the client features from `cleint_features.md`, and the architectural guidance from `ARCHITECTURE_EXTRACTION.md`.

---

## 🏗️ Core Architecture & Security Strategy

> [!IMPORTANT]
> The platform is built as a web-first SaaS with hard tenant isolation and privacy safeguards. All APIs are mobile-ready to support a future React Native client.

### 1. Authentication & Authorization Flow
* **Unauthenticated Browsing**: By default, public visitors can browse hostels, search/filter listings, and compare options without logging in.
* **Google Authentication**: Any user can log in with Google. Logged-in Google users default to the `PUBLIC_USER` role, allowing them to browse, submit inquiries, and register as service providers.
* **Super Admin / Platform Owner Portal**:
  * Can be accessed via email and password credentials.
  * Supports Google login: When a user signs in with Google, the backend checks the email returned by Google against the configured system superadmin emails. If a match is found, the user is authenticated as `PLATFORM_OWNER` and redirected to the Platform Owner Portal.
* **Hostel Admin / Warden Portal**:
  * Similar to Super Admin, hostel admins can log in using email/password or Google login. The backend verifies their email matches the registered hostel admin/warden records before granting access to `/hostel-admin`.
* **Resident Portal (QR Code Activation / Switch)**:
  * Resident registration is **admin-controlled**. Public users cannot self-register as residents.
  * A hostel admin registers a student with details (phone, email, room, bed) and generates a one-time activation code/QR.
  * The student signs in with any normal account (email/password, OTP, or Google).
  * The student scans the QR code or enters the manual activation code from their portal.
  * The system links the student's user ID to their resident profile, updates their role to `RESIDENT`, adds the hostel ID to their accessible list, and marks the activation code as `USED`.
  * **Switching Experience**: Upon successful activation, the default home page and portal views automatically convert/switch into the authenticated Resident Portal.

### 2. Cloudflare R2 Storage & Optimization Layer
* Large binary files (such as hostel photos, food menu photos, payment proofs, emergency logs, and citizen documents) are **never** stored directly in MongoDB.
* **Optimization Layer Flow**:
  1. The client requests a presigned PUT URL from `/api/v1/files/presign` with the file metadata (name, MIME type, size).
  2. The backend validates the request against upload size limits and MIME types.
  3. The client uploads the file directly to Cloudflare R2 using the presigned URL, bypassing the Next.js server payload constraints.
  4. The client saves the metadata in MongoDB under the `FileAsset` collection, linking it to the relevant entity (hostel, resident, payment, complaint, etc.).
* **Access Control**:
  * **PUBLIC**: Read access open to everyone (hostel photos, public service provider photos).
  * **PRIVATE**: Accessed only by authorized tenants via signed get URLs (citizenship documents, payment proofs, complaint attachments).

### 3. Hard Tenant Isolation
* Every hostel-scoped collection (Floor, Room, Bed, Resident, Payment, Notice, Complaint, MaintenanceRequest, AuditLog) **must** contain a `hostelId` field.
* All queries in the hostel-admin, resident, and guardian portals must filter strictly by the active user's `hostelId` to prevent cross-tenant data leakage.

---

## 🛠️ Technology Stack Reference

| Layer | Technology | Purpose |
|---|---|---|
| **Web Portal** | Next.js 16 (App Router), TypeScript 5.x | Public site, admin panels, resident portal, unified API |
| **Styling** | Tailwind CSS | Utility-first styling for maximum flexibility |
| **Database** | MongoDB & Mongoose | Primary document store |
| **Authentication** | Jose JWT / Session Cookies | Custom token rotation and cookie/Bearer token authentication |
| **File Storage** | Cloudflare R2 | Asset and document hosting with metadata tracking |
| **Notifications** | FCM / In-app feed | FCM for push alerts, collection-backed feed for portals |

---

## 🏃 Sprint Progress Trackers

### Sprint 0 — Planning + Architecture Lock
*Goal: Finalize contracts, schemas, UI sitemaps, and structure before beginning development.*

- [x] Create project module list and specify role permissions.
- [x] Document REST API naming conventions and JSON error/success response shapes.
- [x] Set up monorepo directory structures (`apps/web` for Next.js, `apps/mobile` for Expo).
- [x] Configure environment templates (`.env.example`) and git branching strategies.
- [x] Define global role-based access control (RBAC) rules.

---

### Sprint 1 — Foundation + Auth + Tenant Core
*Goal: Build the project baseline, custom auth mechanisms, database helpers, and base dashboard shells.*

#### Backend Tasks
- [x] Setup Next.js App Router project and enable TypeScript strict mode.
- [x] Configure tailwindcss, eslint, and prettier for code styling and formatting.
- [x] Setup MongoDB connection singleton helper with connection caching.
- [x] Implement base API response helper with standardized JSON payload structure.
- [x] Implement global error handling patterns and Zod request validation.
- [x] Create platform owner seed script.
- [x] Build public account registration with phone OTP/email OTP and password.
- [x] Implement Google social login and account verification.
- [x] Implement JWT token issue, refresh token rotation, and secure revocation.
- [x] Implement session/device validation and logout handlers.
- [x] Define Role enum, permission helpers, and portal middleware/route guards.
- [x] Create Mongoose schemas for `User`, `Session`, `OtpChallenge`, `OAuthAccount`, `Hostel`, `HostelMember`, `RolePermission`, `AuditLog`, `FileAsset`, `Notification`.

#### Web Frontend Tasks
- [x] Build public layout and auth login/register screens.
- [x] Create platform owner, hostel admin, resident, and guardian dashboard layouts.
- [x] Implement protected route middleware for `/platform`, `/hostel-admin`, `/resident`, and `/guardian`.
- [x] Connect login flow to auth APIs and handle role-aware redirects.

#### Mobile / App Compatibility Tasks
- [x] Set up Expo app base and routing navigation.
- [x] Implement secure token storage in mobile clients.
- [x] Document Bearer token auth contracts and ensure API compatibility.

#### QA & Verification
- [x] Write automated tests for route access helper and token refresh.
- [x] Run linting, formatting, and build validation commands.
- [ ] Manual QA: Verify Google sign-in flow and cross-role portal blocks.

---

### Sprint 2 — Public Portal + Hostel Core
*Goal: Build hostel discovery, platform approvals, inquiries, hostel profiles, and digital room mapping.*

#### Backend Tasks
- [x] Create models for `HostelDocument`, `HostelVerification`, `HostelApplication`.
- [x] Implement platform approvals API (approve/reject/publish/unpublish hostel).
- [x] Implement public listing API with search/filters (price range, boys/girls, room types).
- [x] Create inquiry and inquiry notes models and APIs.
- [x] Implement hostel profile updates (details, facilities, pricing, rules, photos).
- [x] Implement Floor, Room, and Bed Mongoose schemas and management APIs.
- [x] Enforce hostel tenant isolation on all room and bed queries.

#### Web Frontend Tasks
- [x] Connect public `/hostels` listing and detail routes to database.
- [x] Build platform owner hostel review pages.
- [x] Build hostel admin profile editing and room/bed visual management dashboards.
- [x] Create public inquiry form.

#### Mobile / App Compatibility Tasks
- [x] Implement public hostel list, detail, and inquiry screens on mobile.
- [x] Verify API responses for search/filter return clean objects for mobile render.

#### QA & Verification
- [x] Write automated tests for hostel listing filters, platform actions, and tenant scopes.
- [x] Verify only approved and published hostels appear in public listings.

---

### Sprint 3 — Resident System + Payments + Food
*Goal: Implement manual resident registration, activation codes/QR, payment proof upload, notices, and food transparency.*

#### Backend Tasks
- [x] Create schemas for `Resident`, `Guardian`, `EmergencyContact`, `ResidentDocument`.
- [x] Implement admin resident registration API with room/bed vacancy checks.
- [x] Build `QRActivation` schema, code hashing, and activation linking logic.
- [x] Create schemas for `Payment`, `PaymentProof`, `Receipt`, `DepositRecord`.
- [x] Implement manual payment proof submission API for residents.
- [x] Implement payment proof review, approval, and receipt generation APIs for admins.
- [x] Create schemas for `FoodMenu`, `FoodPhoto`, `FoodFeedback`.
- [x] Implement food menu creation and photo upload APIs.
- [x] Build Notice and NoticeReadStatus models and feed APIs.

#### Web Frontend Tasks
- [x] Build hostel admin resident management pages with QR code generation.
- [x] Create hostel admin payments list and proof review views.
- [x] Create hostel admin weekly food menu and photo upload panel.
- [x] Build resident dashboard with fee statuses, notice feeds, and food menu.
- [x] Build resident payment upload form.

#### Mobile / App Compatibility Tasks
- [x] Implement QR scanning and manual code activation flow on mobile.
- [x] Build resident home screen dashboard, payments, notices, and food views.

#### QA & Verification
- [x] Write automated tests for QR activation (one-time use, expiry) and payment processing.
- [x] Verify resident portal access cannot be accessed without QR/code activation.

---

### Sprint 4 — Daily Operations + Trust + Safety
*Goal: Implement the complaint ticket workflow, night safety status logs, SOS alerts, guardian views, move-in/out checklists, and rating/reviews.*

#### Backend Tasks
- [x] Create schemas for `Complaint`, `ComplaintUpdate`, `ComplaintAttachment`.
- [x] Implement resident complaint submission (with optional anonymous status and file attachments).
- [x] Implement admin complaint responses, status changes, and student resolution confirmations.
- [x] Create schemas for `NightStatus`, `NightStatusLog`, `ManualStatusOverride`.
- [x] Implement night safety status log API (Inside/Outside/Not Verified) without leaking GPS data.
- [x] Build SOS alert API creating notifications for wardens/admins.
- [x] Build MoveInChecklist, MoveOutChecklist, RoomConditionPhoto, ProvidedItem schemas and APIs.
- [x] Create RatingReview schema and verified-resident review checks.
- [x] Implement in-app notification endpoints and mobile FCM save helpers.

#### Web Frontend Tasks
- [x] Build hostel admin and resident complaint management interfaces.
- [x] Build hostel admin move-in/out checklist forms.
- [x] Build guardian dashboard (view notices, food menus, fee status, and safety summaries).
- [x] Build resident review form and platform moderation pages.

#### Mobile / App Compatibility Tasks
- [x] Implement mobile complaint lists, night status update, and SOS triggers.
- [x] Verify FCM token registration endpoint compatibility.

#### QA & Verification
- [x] Write automated tests for anonymous complaint privacy, override audit logs, and review verification.
- [x] Confirm no exact location/GPS data is leaked through any public or dashboard APIs.

---

### Sprint 5 — Maintenance Network + Growth + Reports + Polish
*Goal: Set up local service providers, maintenance request lifecycle, comparison page, referral tracking, platform reports, and production hardening.*

#### Backend Tasks
- [x] Create schemas for `ServiceProvider`, `ServiceProviderApplication`, `ServiceProviderDocument`.
- [x] Implement public service provider registration and platform owner moderation APIs.
- [x] Build MaintenanceRequest, MaintenanceHistory, MaintenanceComment schemas and APIs.
- [x] Create public hostel comparison API.
- [x] Create ReferralCode, Referral, ReferralReward schemas and referral tracking service.
- [x] Build platform owner and hostel admin reports APIs.
- [x] Implement public API rate limiting and file upload size/MIME limits.

#### Web Frontend Tasks
- [x] Build public service provider registration form.
- [x] Build public hostel comparison views.
- [x] Build hostel admin maintenance requests dashboard with provider search.
- [x] Build platform owner provider moderation and listing flags review.
- [x] Connect platform owner and hostel admin reports views.

#### Mobile / App Compatibility Tasks
- [x] Build optional resident referral sharing screen.
- [x] Validate all endpoints under `/api/v1` return standardized formats.

#### QA & Verification
- [x] Write automated tests for maintenance requests, comparison query matching, and report queries.
- [ ] Manual QA: Verify end-to-end service provider registration, approval, search, and work log cycle.

#### Production Hardening Checklist
- [x] Verify dev/staging/prod environment variable templates match.
- [x] Create MongoDB indexes for all large collections.
- [x] Secure private document bucket policies (citizenship, payments proofs, complaints).
- [x] Implement structured server error logging to DB.
- [x] Create admin recovery and sandbox seed scripts.
- [x] Remove debug-level console logs.

---

## 📑 Verification Checklist & Command Reference

Verify the Next.js web application and API server using these scripts from the repository root:

```powershell
# Format Check
npm run web:format

# Run TypeScript Linting
npm run web:lint

# Run All Backend / API Integration Tests
npm run web:test

# Build Check for Production
npm run web:build
```