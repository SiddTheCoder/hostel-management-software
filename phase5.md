# Phase 5 - Maintenance Network + Growth + Reports + Production Polish

**Phase in roadmap:** Phase 5  
**Status:** Implementation And Production Hardening Complete - Manual QA Pending  
**Started:** 2026-06-26  
**Source:** `step_plans.md` Phase 5  
**Rule:** Every work item below is a checkbox. Tick a task only after implementation and verification. If a task is partly started but not verified, keep it unchecked and add a note.

---

## 1. Phase Goal

Complete the final pilot-readiness modules:

- Public service-provider registration.
- Platform service-provider approval and hiding.
- Hostel-admin service-provider search and maintenance requests.
- Public hostel comparison API.
- Resident referral codes and referred inquiry tracking.
- Manual duplicate/ghost listing flags.
- Platform and hostel-admin reports.
- Production hardening checklist for pilot handover.

---

## 2. Current Progress Summary

- [x] Phase 5 tracker created from `step_plans.md`.
- [x] Service provider registration and moderation complete.
- [x] Hostel maintenance module complete.
- [x] Public hostel comparison API complete.
- [x] Referral system complete.
- [x] Duplicate / ghost listing detection complete.
- [x] Reports complete.
- [x] Production hardening checklist complete.
- [x] Phase 5 automated QA gate complete.
- [ ] Phase 5 manual QA gate complete.

---

## 3. Backend Tasks

### 3.1 Service Provider Registration

**Models:**

- [x] Add `ServiceProvider` model.
- [x] Add `ServiceProviderApplication` model.
- [x] Add `ServiceProviderDocument` model.

**Service Layer:**

- [x] Implement public service provider registration.
- [x] Implement platform service provider list.
- [x] Implement service provider approval.
- [x] Implement service provider rejection.
- [x] Implement service provider hide action.
- [x] Audit approve/reject/hide actions.

**APIs:**

- [x] `POST /api/v1/public/service-providers/register`
- [x] `GET /api/v1/platform/service-providers`
- [x] `PATCH /api/v1/platform/service-providers/:id/approve`
- [x] `PATCH /api/v1/platform/service-providers/:id/reject`
- [x] `PATCH /api/v1/platform/service-providers/:id/hide`

---

### 3.2 Hostel Maintenance Module

**Models:**

- [x] Add `MaintenanceRequest` model.
- [x] Add `MaintenanceHistory` model.
- [x] Add `MaintenanceComment` model.

**Service Layer:**

- [x] Implement approved provider search for hostel admins.
- [x] Implement approved provider detail.
- [x] Implement maintenance request creation.
- [x] Implement maintenance request list.
- [x] Implement maintenance status update.
- [x] Implement maintenance comments.
- [x] Maintain service history.
- [x] Audit maintenance status changes.

**APIs:**

- [x] `GET /api/v1/hostel-admin/service-providers`
- [x] `GET /api/v1/hostel-admin/service-providers/:id`
- [x] `POST /api/v1/hostel-admin/maintenance/requests`
- [x] `GET /api/v1/hostel-admin/maintenance/requests`
- [x] `PATCH /api/v1/hostel-admin/maintenance/requests/:id/status`
- [x] `POST /api/v1/hostel-admin/maintenance/requests/:id/comment`

---

### 3.3 Hostel Comparison

- [x] Implement public compare API for 2-3 hostels.
- [x] Compare monthly fee.
- [x] Compare distance/location text.
- [x] Compare room type/vacancy.
- [x] Compare food score.
- [x] Compare facilities.
- [x] Compare verification badge.
- [x] Compare rating summary.

**API:**

- [x] `GET /api/v1/public/hostels/compare?ids=id1,id2,id3`

---

### 3.4 Referral System

**Models:**

- [x] Add `ReferralCode` model.
- [x] Add `Referral` model.
- [x] Add `ReferralReward` model.

**Service Layer:**

- [x] Implement resident referral code.
- [x] Implement referral link data.
- [x] Implement inquiry with referral code.
- [x] Implement hostel-admin referral list.
- [x] Implement joined confirmation.
- [x] Track reward status.

**APIs:**

- [x] `GET /api/v1/resident/referral`
- [x] `POST /api/v1/public/inquiries/with-referral`
- [x] `GET /api/v1/hostel-admin/referrals`
- [x] `PATCH /api/v1/hostel-admin/referrals/:id/confirm`

---

### 3.5 Duplicate / Ghost Listing Detection

**Models:**

- [x] Add `ListingFlag` model.
- [x] Add `DuplicateCheckResult` model.

**Service Layer:**

- [x] Implement manual duplicate check by address, phone, owner, and similar name.
- [x] Implement listing flags list.
- [x] Implement listing flag resolution.

**APIs:**

- [x] `GET /api/v1/platform/listing-flags`
- [x] `POST /api/v1/platform/hostels/:id/run-duplicate-check`
- [x] `PATCH /api/v1/platform/listing-flags/:id/resolve`

---

### 3.6 Reports

- [x] Implement platform dashboard report.
- [x] Implement hostel-admin dashboard report.
- [x] Implement hostel-admin payments report.
- [x] Implement hostel-admin complaints report.
- [x] Implement hostel-admin maintenance report.

**APIs:**

- [x] `GET /api/v1/platform/reports/dashboard`
- [x] `GET /api/v1/hostel-admin/reports/dashboard`
- [x] `GET /api/v1/hostel-admin/reports/payments`
- [x] `GET /api/v1/hostel-admin/reports/complaints`
- [x] `GET /api/v1/hostel-admin/reports/maintenance`

---

## 4. Web Frontend Tasks

### 4.1 Public Website

- [x] Connect `/service-providers/register` to service provider registration API.
- [x] Connect hostel comparison page to comparison API.
- [x] Connect referred inquiry flow.
- [x] Show empty/loading/error states.

### 4.2 Platform Owner Portal

- [x] Connect `/platform/service-providers` to moderation APIs.
- [x] Connect `/platform/reports` to platform report API.
- [x] Connect `/platform/abuse-flags` to listing flags APIs.
- [x] Show empty/loading/error states.

### 4.3 Hostel Admin/Warden Portal

- [x] Add `/hostel-admin/service-providers` page.
- [x] Add `/hostel-admin/maintenance` page.
- [x] Add `/hostel-admin/reports` page.
- [x] Add `/hostel-admin/referrals` page or connected generic fallback.
- [x] Show empty/loading/error states.

### 4.4 Resident Portal

- [x] Add `/resident/referral` page.
- [x] Connect referral page to resident referral API.
- [x] Show empty/loading/error states.

---

## 5. Mobile Tasks

- [x] Notification token registration remains supported.
- [x] Resident final flow polish keeps Phase 3/4 routes reachable.
- [x] Optional resident referral screen implemented.
- [x] Mobile typecheck passes.

---

## 6. QA Tasks

### 6.1 Automated Tests

- [x] Service provider route tests.
- [x] Maintenance request route tests.
- [x] Referral route tests.
- [x] Duplicate listing route tests.
- [x] Reports route tests.
- [x] Public comparison route tests.
- [x] Tenant isolation tests for maintenance and reports.

### 6.2 Manual QA

- [ ] Service provider approval flow.
- [ ] Hostel admin sees only approved providers.
- [ ] Maintenance request links to correct hostel.
- [ ] Referral cannot be abused repeatedly.
- [ ] Comparison only shows public data.
- [ ] Reports do not leak other hostel data.
- [ ] Public forms are rate-limited.

### 6.3 Required Verification Commands

- [x] `npm --prefix apps/web run format:check`
- [x] `npm run web:test`
- [x] `npm run web:lint`
- [x] `npm run web:build`
- [x] `npm run mobile:typecheck`

---

## 7. Phase 5 Done Means

- [x] Maintenance and service-provider network works.
- [x] Growth features work.
- [x] Reports work.
- [ ] System is ready for pilot hostel onboarding after manual QA and deployment setup.
- [x] Client can see a connected production-ready flow.

---

## 8. Production Hardening Checklist

Must complete before client handover:

- [x] Environment variables separated by dev/staging/prod.
- [x] MongoDB indexes created.
- [x] API rate limit for public forms.
- [x] Upload size limits.
- [x] Image validation.
- [x] Error logging.
- [x] Audit logs.
- [x] Role-based tests.
- [x] Tenant isolation tests.
- [x] Seed data script.
- [x] Backup plan.
- [x] Admin account recovery flow.
- [x] Security check for private documents.
- [x] Remove debug logs.
- [x] Mobile app build test.
- [x] Web deployment test.

---

## 9. Completion Log

| Date | Update |
|---|---|
| 2026-06-26 | Phase 5 tracker created from `step_plans.md`. Implementation started with service providers, maintenance, referrals, listing flags, reports, and comparison as the target slices. |
| 2026-06-26 | Completed Phase 5 implementation: models, validations, services, route handlers, connected public/platform/admin/resident/mobile screens, focused route tests, full web tests, lint, build, format check, and mobile typecheck. Production hardening and manual QA remain pending. |
| 2026-06-27 | Completed Phase 5 production hardening: dev/staging/prod env templates, public form rate limiting, upload size and image/document MIME validation, structured error logging, demo seed script, admin recovery script, private document security check, backup plan, mobile build export test, and web deployment build check. Manual QA remains pending for owner verification. |
