# Phase 1 - Foundation + Auth + Tenant Core

**Phase in roadmap:** Phase 1
**Status:** Web/backend Phase 1 complete; mobile deferred; external OTP delivery and final provider/browser QA pending
**Started:** 2026-06-22
**Source:** `step_plans.md` Phase 1
**Rule:** Every work item below is a checkbox. Tick a task only after implementation and verification. If a task is partly started but not verified, keep it unchecked and add a note.

---

## 1. Phase Goal

Build the system backbone:

- Real authentication.
- Role-based route access.
- MongoDB connection and base models.
- Clean `/api/v1` API structure.
- Base portal layouts.
- Mobile-ready auth/session contract.
- Focused QA for auth, role access, token refresh, and logout.

---

## 2. Current Progress Summary

- [x] Local foundation baseline exists and is committed.
- [x] Web app builds successfully.
- [x] Initial auth login/refresh/logout/me endpoints exist.
- [x] Portal route protection exists for platform, hostel admin/warden, resident, and guardian routes.
- [x] Base MongoDB models exist.
- [x] Full Phase 1 web/backend auth implementation is complete.
- [ ] Mobile app shell is deferred for now by user direction.
- [x] Phase 1 web automated QA gate is complete.
- [x] DB-backed seed and live auth smoke tests pass against the configured MongoDB Atlas URI.
- [ ] External OTP delivery is blank by current decision and pending the later Nepal-based email provider/SMS sender setup.

---

## 3. Backend Tasks

### 3.1 Project Setup

- [x] Setup Next.js App Router project.
- [x] Setup TypeScript strict mode.
- [x] Setup Tailwind CSS.
- [x] Setup ESLint.
- [x] Setup Prettier.
- [x] Setup environment variables with `.env.example`.
- [x] Setup MongoDB connection helper.
- [x] Setup base API response helper.
- [x] Setup global route error handler pattern.
- [x] Setup Zod validation pattern.

### 3.2 Auth Module

- [x] Register platform owner seed account script.
- [x] Public account registration with phone OTP plus password.
- [x] Public account registration with email OTP plus password.
- [x] Google sign-in/signup.
- [x] Login by phone plus password for existing users.
- [x] Login by email plus password for existing users.
- [x] Refresh token endpoint.
- [x] Logout endpoint.
- [x] OTP request, verification, expiry, resend, and rate-limit rules.
- [x] Password hashing.
- [x] Current user endpoint.
- [x] Session/device storage baseline.
- [x] Provider account linking for Google.
- [x] Production-grade refresh-token rotation.

### 3.3 Auth APIs

- [x] `POST /api/v1/auth/otp/request`
- [x] `POST /api/v1/auth/otp/verify`
- [x] `POST /api/v1/auth/register`
- [x] `POST /api/v1/auth/login`
- [x] `POST /api/v1/auth/google`
- [x] `POST /api/v1/auth/refresh`
- [x] `POST /api/v1/auth/logout`
- [x] `GET /api/v1/auth/me`

### 3.4 Auth Models

- [x] `User`
- [x] `Session`
- [x] `OtpChallenge`
- [x] `OAuthAccount`

### 3.5 Auth Rules

- [x] Registration does not automatically create a resident profile.
- [x] New public registration starts as `PUBLIC_USER`.
- [x] Unlinked public users can browse, inquire, compare hostels, and register as service providers.
- [x] Admin, warden, guardian, and service-provider roles require admin/platform approval or controlled linking.
- [x] Resident dashboard access requires successful QR/code activation against an admin-created resident record.

### 3.6 Role + Permission Module

- [x] Role enum.
- [x] Permission helper.
- [x] Tenant access helper.
- [x] Protected web route middleware/proxy.
- [x] Platform-only web route guard.
- [x] Hostel admin/warden web route guard.
- [x] Resident-only web route guard.
- [x] Guardian-only web route guard.
- [x] Reusable API principal loader for protected endpoints.
- [x] Platform-only API guard.
- [x] Hostel-scoped API guard.
- [x] Resident-only API guard.
- [x] Guardian-only API guard.

### 3.7 Core Models

- [x] `User`
- [x] `Hostel`
- [x] `HostelMember`
- [x] `RolePermission`
- [x] `AuditLog`
- [x] `FileAsset`
- [x] `Notification`

### 3.8 Platform Owner Base

- [x] Platform owner dashboard shell.
- [x] Hostel registration list placeholder page.
- [x] User management placeholder page.
- [x] Service provider placeholder page.

---

## 4. Web Frontend Tasks

### 4.1 Layouts

- [x] Root/public shell.
- [x] Login/auth page shell.
- [x] Platform owner layout.
- [x] Hostel admin layout.
- [x] Resident layout.
- [x] Guardian layout.

### 4.2 Pages

- [x] `/login`
- [x] `/platform/dashboard`
- [x] `/hostel-admin/dashboard`
- [x] `/resident/dashboard`
- [x] `/guardian/dashboard`

### 4.3 Web Auth Integration

- [x] Login form connects to `/api/v1/auth/login`.
- [x] Role-aware redirect after login.
- [x] Safe `next` redirect handling.
- [x] HTTP-only cookie support for browser portal sessions.
- [x] Bearer access token support for mobile/API clients.
- [x] Logout UI action in portal shell.
- [x] Current-user loading in portal shell.
- [x] Empty/loading/error states for auth screens.

---

## 5. Mobile Tasks

Deferred for now by user direction. Some scaffold files were started, but mobile is
not part of the current completion gate.

- [ ] Expo app setup.
- [ ] Navigation structure.
- [ ] Login screen.
- [ ] Signup screen with phone OTP, email OTP, password, and Google options.
- [ ] OTP verification screen.
- [ ] Secure token storage.
- [ ] API client.
- [x] Mobile refresh-token API contract documented.
- [x] Mobile login can receive refresh token using `x-hostelhub-client: mobile`.
- [ ] Public mode shell.
- [ ] Resident mode shell.

---

## 6. QA Tasks

### 6.1 Automated Tests

- [x] Route access helper tests.
- [x] Mobile auth contract tests.
- [x] Auth service login success test.
- [x] Auth service wrong-password rejection test.
- [x] Refresh token test.
- [x] Logout session revocation test.
- [x] API route integration tests for auth endpoints.
- [x] Tenant guard tests.

### 6.2 Manual QA

Live API smoke testing passed against MongoDB Atlas for login, refresh, logout,
wrong-password rejection, unverified-registration rejection, unauthenticated route
blocking, and development-mode email/phone OTP registration. External OTP
delivery remains blank by design until provider setup is chosen.

- [x] Login works.
- [x] Phone OTP registration works in development delivery mode.
- [x] Email OTP registration works in development delivery mode.
- [ ] Google sign-in/signup browser flow needs a real Google account click test.
- [x] Wrong password rejected.
- [x] Unverified phone/email cannot complete account registration.
- [x] Unauthorized user blocked.
- [ ] Platform route blocks hostel admin.
- [ ] Hostel route blocks resident.
- [x] Token refresh works.
- [x] Logout removes session.

### 6.3 Required Verification Commands

- [x] `npm --prefix apps/web run format:check`
- [x] `npm run web:test`
- [x] `npm run web:lint`
- [x] `npm run web:build`
- [x] `npm --prefix apps/web audit --audit-level=high`

---

## 7. Phase 1 Done Means

- [x] The app has real auth.
- [x] Role-based web route access works.
- [x] MongoDB connection helper exists.
- [x] Base layouts exist.
- [x] API structure is clean.
- [x] Future modules can plug into the same pattern.
- [ ] Full Phase 1 manual QA checklist is pending real Google browser flow and cross-role portal account smoke tests.

---

## 8. Completion Log

| Date | Update |
|---|---|
| 2026-06-22 | Phase 1 tracker created from `step_plans.md`; completed baseline items marked from committed Phase 0 foundation. |
| 2026-06-22 | Completed web/backend Phase 1 implementation: OTP registration, Google auth endpoint/linking, refresh-token rotation, API guards, platform placeholders, portal current-user/logout, and automated web QA. Manual DB/provider checks remain pending until MongoDB and phase 1 keys are available. |
| 2026-06-22 | MongoDB Atlas seed and live auth smoke passed. Email OTP provider was intentionally blanked for later Nepal-based provider selection; OTP registration currently works in development delivery mode. |
