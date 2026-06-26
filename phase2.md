# Phase 2 - Public Portal + Hostel Core

**Phase in roadmap:** Phase 2  
**Status:** Implementation complete; automated QA passed; seeded manual QA pending  
**Started:** 2026-06-22  
**Source:** `step_plans.md` Phase 2  
**Rule:** Every work item below is a checkbox. Tick a task only after implementation and verification. If a task is partly started but not verified, keep it unchecked and add a note.

---

## 1. Phase Goal

Build the first real hostel discovery and hostel-admin core:

- Platform owner can receive, review, approve, reject, publish, and unpublish hostel applications.
- Public users can browse approved and published hostel listings.
- Public users can submit inquiries to a hostel.
- Hostel admins can manage their hostel profile.
- Hostel admins can create floors, rooms, and beds.
- Tenant isolation is enforced for hostel-scoped admin data.

---

## 2. Current Progress Summary

- [x] Phase 2 tracker created from `step_plans.md`.
- [x] Hostel application/review API foundation implemented.
- [x] Public hostel listing/detail API foundation implemented.
- [x] Inquiry flow implemented.
- [x] Hostel admin profile management implemented.
- [x] Room and bed management implemented.
- [x] Mobile Phase 2 screens fully implemented.
- [x] Phase 2 automated QA gate complete.
- [ ] Phase 2 manual QA gate complete.

---

## 3. Backend Tasks

### 3.1 Platform Owner Hostel Approval

- [x] Create or finalize `Hostel` fields needed for Phase 2 application and public listing.
- [x] Add `HostelDocument` model.
- [x] Add `HostelVerification` model.
- [x] Add `HostelApplication` model.
- [x] Implement hostel owner/application submission.
- [x] Implement platform hostel application list.
- [x] Implement platform hostel application detail.
- [x] Implement approve hostel.
- [x] Implement reject hostel.
- [x] Implement publish listing.
- [x] Implement unpublish listing.
- [x] Implement basic verification status.
- [x] Add audit logs for approve/reject/publish/unpublish.

Required APIs:

- [x] `POST /api/v1/platform/hostels`
- [x] `GET /api/v1/platform/hostels`
- [x] `GET /api/v1/platform/hostels/:id`
- [x] `PATCH /api/v1/platform/hostels/:id/approve`
- [x] `PATCH /api/v1/platform/hostels/:id/reject`
- [x] `PATCH /api/v1/platform/hostels/:id/publish`
- [x] `PATCH /api/v1/platform/hostels/:id/unpublish`

### 3.2 Public Hostel Listing

- [x] Implement public hostel listing API.
- [x] Implement public hostel detail API.
- [x] Search by area/name.
- [x] Filter by price range.
- [x] Filter by boys/girls/co-living.
- [x] Filter by room type.
- [x] Filter by food/facility.
- [x] Basic map/location fields.
- [x] Verification badge display fields.
- [x] Ensure only approved and published hostels appear publicly.

Required APIs:

- [x] `GET /api/v1/public/hostels`
- [x] `GET /api/v1/public/hostels/:slug`

### 3.3 Inquiry Flow

- [x] Add `Inquiry` model.
- [x] Add `InquiryNote` model.
- [x] Implement public inquiry form API.
- [x] Implement hostel admin inquiry list.
- [x] Implement inquiry status update.
- [x] Implement inquiry follow-up notes.
- [x] Enforce hostel tenant isolation for admin inquiry access.

Required APIs:

- [x] `POST /api/v1/public/hostels/:hostelId/inquiries`
- [x] `GET /api/v1/hostel-admin/inquiries`
- [x] `PATCH /api/v1/hostel-admin/inquiries/:id/status`
- [x] `POST /api/v1/hostel-admin/inquiries/:id/notes`

### 3.4 Hostel Profile Management

- [x] Admin can edit hostel name.
- [x] Admin can edit hostel type.
- [x] Admin can edit location.
- [x] Admin can edit contact details.
- [x] Admin can edit rules.
- [x] Admin can edit facilities.
- [x] Admin can edit food details.
- [x] Admin can edit pricing/rent details.
- [x] Admin can manage photo gallery metadata.
- [x] Admin can edit room/bed capacity summary.

Required APIs:

- [x] `GET /api/v1/hostel-admin/profile`
- [x] `PATCH /api/v1/hostel-admin/profile`
- [x] `POST /api/v1/hostel-admin/profile/photos`
- [x] `DELETE /api/v1/hostel-admin/profile/photos/:photoId`

### 3.5 Room + Bed Management

- [x] Add `Floor` model.
- [x] Add `Room` model.
- [x] Add `Bed` model.
- [x] Floor creation.
- [x] Room creation.
- [x] Bed creation.
- [x] Assign bed status.
- [x] Vacancy status.
- [x] Room facilities.
- [x] Repair status.
- [x] Bed availability.
- [x] Room map API.
- [x] Enforce hostel tenant isolation for all room/bed data.

Required APIs:

- [x] `POST /api/v1/hostel-admin/floors`
- [x] `GET /api/v1/hostel-admin/floors`
- [x] `POST /api/v1/hostel-admin/rooms`
- [x] `GET /api/v1/hostel-admin/rooms`
- [x] `PATCH /api/v1/hostel-admin/rooms/:id`
- [x] `POST /api/v1/hostel-admin/beds`
- [x] `PATCH /api/v1/hostel-admin/beds/:id`
- [x] `GET /api/v1/hostel-admin/room-map`

---

## 4. Web Frontend Tasks

### 4.1 Public Website

- [x] Connect `/hostels` to real public hostel listing API.
- [x] Add `/hostels/[slug]` detail page.
- [x] Add search/filter state for public listing.
- [x] Add inquiry entry point from hostel detail.
- [x] Show verification badge from backend fields.
- [x] Empty/loading/error states for public listing and detail.

### 4.2 Platform Owner Portal

- [x] Connect `/platform/hostels` to real platform hostel application API.
- [x] Add platform hostel review detail page.
- [x] Add approve/reject actions.
- [x] Add publish/unpublish actions.
- [x] Show basic verification status.
- [x] Empty/loading/error states.

### 4.3 Hostel Admin/Warden Portal

- [x] Add `/hostel-admin/profile` page.
- [x] Add profile edit form.
- [x] Add `/hostel-admin/rooms` page.
- [x] Add floor/room/bed management views.
- [x] Add `/hostel-admin/inquiries` page.
- [x] Add inquiry status/note actions.
- [x] Empty/loading/error states.

---

## 5. Mobile Tasks

- [x] Public hostel listing screen.
- [x] Hostel detail screen.
- [x] Search/filter screen behavior.
- [x] Inquiry submission screen.
- [x] Mobile API compatibility checked for public hostel and inquiry APIs.
- [x] All Phase 2 mobile screens fully implemented and integrated with APIs.

---

## 6. QA Tasks

### 6.1 Automated Tests

- [x] Platform hostel create/list/detail tests.
- [x] Platform approve/reject tests.
- [x] Platform publish/unpublish tests.
- [x] Public listing only returns approved and published hostels.
- [x] Public filters work.
- [x] Public hostel detail excludes private fields.
- [x] Inquiry creates against the correct hostel.
- [x] Hostel admin inquiry tenant isolation tests.
- [x] Room/bed tenant isolation tests.

### 6.2 Manual QA

Pending a seeded browser/API environment with platform owner and hostel-admin accounts.

- [ ] Platform owner can create/review a hostel application.
- [ ] Platform owner can approve and publish a hostel.
- [ ] Rejected hostel stays hidden publicly.
- [ ] Unpublished hostel stays hidden publicly.
- [ ] Public listing search/filter works.
- [ ] Inquiry appears in correct hostel admin dashboard.
- [ ] Hostel admin cannot see another hostel's inquiry.
- [ ] Room/bed belongs to correct hostel.

### 6.3 Required Verification Commands

- [x] `npm --prefix apps/web run format:check`
- [x] `npm run web:test`
- [x] `npm run web:lint`
- [x] `npm run web:build`
- [x] `npm run mobile:typecheck`

---

## 7. Phase 2 Done Means

- [x] Public can browse hostels.
- [x] Hostel profile pages exist.
- [x] Inquiry flow works.
- [x] Hostel admin can manage profile.
- [x] Room/bed system works.
- [x] Multi-tenant separation is verified.

---

## 8. Completion Log

| Date | Update |
|---|---|
| 2026-06-23 | Completed Phase 2 implementation: inquiry models/APIs, hostel-admin profile/photo APIs, floor/room/bed APIs, public/platform/admin web pages, mobile public listing/detail/inquiry screens, route/service tests, web format/test/lint/build, and mobile typecheck. Seeded manual browser QA remains pending before pilot signoff. |
| 2026-06-22 | Implemented and verified the first Phase 2 backend slice: platform hostel application/review lifecycle APIs, public hostel listing/detail APIs, public filters, lifecycle audit logging, and focused route tests. |
| 2026-06-22 | Phase 2 tracker created from `step_plans.md`; initial implementation focus set to hostel application/review and public listing API foundation. |
| 2026-06-25 | Verified mobile Phase 2 completion: All public browsing, hostel detail, search/filter, and inquiry submission screens are fully implemented and connected to Phase 2 APIs. |
