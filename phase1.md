# Phase 1 - Foundation + Auth + Tenant Core

**Phase in roadmap:** Phase 1
**Status:** In progress
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
- [ ] Full Phase 1 auth is complete.
- [ ] Mobile app shell is complete.
- [ ] Phase 1 QA gate is complete.

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
- [ ] Public account registration with phone OTP plus password.
- [ ] Public account registration with email OTP plus password.
- [ ] Google sign-in/signup.
- [x] Login by phone plus password for existing users.
- [x] Login by email plus password for existing users.
- [x] Refresh token endpoint.
- [x] Logout endpoint.
- [ ] OTP request, verification, expiry, resend, and rate-limit rules.
- [x] Password hashing.
- [x] Current user endpoint.
- [x] Session/device storage baseline.
- [ ] Provider account linking for Google.
- [ ] Production-grade refresh-token rotation.

### 3.3 Auth APIs

- [ ] `POST /api/v1/auth/otp/request`
- [ ] `POST /api/v1/auth/otp/verify`
- [ ] `POST /api/v1/auth/register`
- [x] `POST /api/v1/auth/login`
- [ ] `POST /api/v1/auth/google`
- [x] `POST /api/v1/auth/refresh`
- [x] `POST /api/v1/auth/logout`
- [x] `GET /api/v1/auth/me`

### 3.4 Auth Models

- [x] `User`
- [x] `Session`
- [ ] `OtpChallenge`
- [ ] `OAuthAccount`

### 3.5 Auth Rules

- [ ] Registration does not automatically create a resident profile.
- [ ] New public registration starts as `PUBLIC_USER`.
- [ ] Unlinked public users can browse, inquire, compare hostels, and register as service providers.
- [ ] Admin, warden, guardian, and service-provider roles require admin/platform approval or controlled linking.
- [ ] Resident dashboard access requires successful QR/code activation against an admin-created resident record.

### 3.6 Role + Permission Module

- [x] Role enum.
- [x] Permission helper.
- [x] Tenant access helper.
- [x] Protected web route middleware/proxy.
- [x] Platform-only web route guard.
- [x] Hostel admin/warden web route guard.
- [x] Resident-only web route guard.
- [x] Guardian-only web route guard.
- [ ] Reusable API principal loader for protected endpoints.
- [ ] Platform-only API guard.
- [ ] Hostel-scoped API guard.
- [ ] Resident-only API guard.
- [ ] Guardian-only API guard.

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
- [ ] Hostel registration list placeholder page.
- [ ] User management placeholder page.
- [ ] Service provider placeholder page.

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
- [ ] Logout UI action in portal shell.
- [ ] Current-user loading in portal shell.
- [ ] Empty/loading/error states for auth screens.

---

## 5. Mobile Tasks

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
- [ ] Auth service login success test.
- [ ] Auth service wrong-password rejection test.
- [ ] Refresh token test.
- [ ] Logout session revocation test.
- [ ] API route integration tests for auth endpoints.
- [ ] Tenant guard tests.

### 6.2 Manual QA

- [ ] Login works.
- [ ] Phone OTP registration works.
- [ ] Email OTP registration works.
- [ ] Google sign-in/signup works.
- [ ] Wrong password rejected.
- [ ] Unverified phone/email cannot complete account registration.
- [ ] Unauthorized user blocked.
- [ ] Platform route blocks hostel admin.
- [ ] Hostel route blocks resident.
- [ ] Token refresh works.
- [ ] Logout removes session.

### 6.3 Required Verification Commands

- [ ] `npm --prefix apps/web run format:check`
- [ ] `npm run web:test`
- [ ] `npm run web:lint`
- [ ] `npm run web:build`
- [ ] `npm --prefix apps/web audit --audit-level=high`

---

## 7. Phase 1 Done Means

- [ ] The app has real auth.
- [x] Role-based web route access works.
- [x] MongoDB connection helper exists.
- [x] Base layouts exist.
- [x] API structure is clean.
- [x] Future modules can plug into the same pattern.
- [ ] Full Phase 1 QA checklist is passed.

---

## 8. Completion Log

| Date | Update |
|---|---|
| 2026-06-22 | Phase 1 tracker created from `step_plans.md`; completed baseline items marked from committed Phase 0 foundation. |
