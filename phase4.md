# Phase 4 - Daily Operations + Trust + Safety

**Phase in roadmap:** Phase 4  
**Status:** Implementation Complete - Manual QA Pending  
**Started:** 2026-06-26  
**Source:** `step_plans.md` Phase 4  
**Rule:** Every work item below is a checkbox. Tick a task only after implementation and verification. If a task is partly started but not verified, keep it unchecked and add a note.

---

## 1. Phase Goal

Build operational modules that make the platform useful every day:

- Residents can report issues and confirm complaint resolution.
- Hostel staff can triage and respond to resident complaints.
- Night safety status exists without exposing exact tracking data.
- SOS flow creates an emergency alert for hostel staff/wardens.
- Guardian dashboard provides a limited trust-focused view.
- Move-in and move-out checklists support operational handover.
- Reviews are verified and moderated.
- Notifications foundation supports in-app feeds and mobile tokens.

---

## 2. Current Progress Summary

- [x] Phase 4 tracker created.
- [x] Phase 4 implementation started.
- [x] Complaint system backend/API/web portal slice complete.
- [x] Complaint system complete.
- [x] Night safety status complete.
- [x] SOS / emergency flow complete.
- [x] Guardian dashboard complete.
- [x] Move-in / move-out checklist complete.
- [x] Ratings and reviews complete.
- [x] Notifications foundation complete.
- [x] Phase 4 automated QA gate complete.
- [ ] Phase 4 manual QA gate complete.

---

## 3. Backend Tasks

### 3.1 Complaint System

**Models:**

- [x] Add `Complaint` model with fields:
  - [x] `hostelId`
  - [x] `residentId`
  - [x] `title`
  - [x] `description`
  - [x] `category`
  - [x] `isAnonymous`
  - [x] `status` (pending, in progress, resolved, rejected)
  - [x] `adminResponse`
  - [x] `slaDueAt`
  - [x] `resolvedAt`
  - [x] `confirmedAt`
  - [x] `createdBy`
  - [x] `updatedBy`
  - [x] `createdAt`
  - [x] `updatedAt`
- [x] Add `ComplaintUpdate` model with fields:
  - [x] `hostelId`
  - [x] `complaintId`
  - [x] `actorId`
  - [x] `actorRole`
  - [x] `type`
  - [x] `message`
  - [x] `previousStatus`
  - [x] `nextStatus`
  - [x] `createdAt`
- [x] Add `ComplaintAttachment` model with fields:
  - [x] `hostelId`
  - [x] `complaintId`
  - [x] `fileAssetId`
  - [x] `uploadedBy`
  - [x] `uploadedAt`

**Service Layer:**

- [x] Implement `createComplaint` service function.
- [x] Implement `listResidentComplaints` service function.
- [x] Implement `listAdminComplaints` service function with hostel tenant filters.
- [x] Implement `updateComplaintStatus` service function.
- [x] Implement `replyToComplaint` service function.
- [x] Implement `confirmComplaintResolution` service function.
- [x] Implement complaint summary counts for admin reporting.
- [x] Audit complaint creation, status changes, replies, and confirmations.

**Validation:**

- [x] Add `complaintCreateSchema`.
- [x] Add `complaintListQuerySchema`.
- [x] Add `complaintStatusUpdateSchema`.
- [x] Add `complaintReplySchema`.
- [x] Add `complaintResolutionConfirmSchema`.

**APIs:**

- [x] `POST /api/v1/resident/complaints`
- [x] `GET /api/v1/resident/complaints`
- [x] `GET /api/v1/hostel-admin/complaints`
- [x] `PATCH /api/v1/hostel-admin/complaints/:id/status`
- [x] `POST /api/v1/hostel-admin/complaints/:id/reply`
- [x] `PATCH /api/v1/resident/complaints/:id/confirm-resolution`

**Permissions:**

- [x] Resident can create and view only own complaints.
- [x] Hostel staff can view and update complaints only for own hostel.
- [x] Anonymous complaints hide resident identity in hostel admin responses.
- [x] Complaint attachments stay linked to the correct hostel complaint.

**Indexes:**

- [x] Add indexes: `complaints: hostelId, residentId, status, category, slaDueAt`
- [x] Add indexes: `complaint_updates: hostelId, complaintId, createdAt`
- [x] Add indexes: `complaint_attachments: hostelId, complaintId`

---

### 3.2 Night Safety Status

**Privacy rule:** This is status only, not prisoner tracking. Exact GPS must not be shown in dashboards.

**Models:**

- [x] Add `NightStatus` model.
- [x] Add `NightStatusLog` model.
- [x] Add `ManualStatusOverride` model.

**Service Layer:**

- [x] Implement resident status update.
- [x] Implement resident own status read.
- [x] Implement hostel admin status summary.
- [x] Implement manual warden override with reason.
- [x] Audit manual overrides.

**APIs:**

- [x] `POST /api/v1/resident/night-status`
- [x] `GET /api/v1/resident/night-status`
- [x] `GET /api/v1/hostel-admin/night-status`
- [x] `PATCH /api/v1/hostel-admin/night-status/:residentId/override`

**Permissions:**

- [x] Resident sees only own status.
- [x] Hostel staff sees only own hostel summary.
- [x] Guardian sees only limited summary later.
- [x] No exact GPS is returned from dashboard APIs.

---

### 3.3 SOS / Emergency

**Models:**

- [x] Add `SOSAlert` model.
- [x] Add `IncidentLog` model.

**Service Layer:**

- [x] Implement resident SOS creation.
- [x] Implement hostel staff SOS alert list.
- [x] Implement SOS status update.
- [x] Implement resident emergency contact list.
- [x] Audit SOS alert status changes.

**APIs:**

- [x] `POST /api/v1/resident/sos`
- [x] `GET /api/v1/hostel-admin/sos-alerts`
- [x] `PATCH /api/v1/hostel-admin/sos-alerts/:id/status`
- [x] `GET /api/v1/resident/emergency-contacts`

---

### 3.4 Guardian Dashboard

**Models:**

- [x] Add `GuardianAccess` model.
- [x] Add `GuardianPermission` model.

**Service Layer:**

- [x] Implement guardian access creation for a resident.
- [x] Implement guardian login or controlled linking flow.
- [x] Implement guardian dashboard summary.
- [x] Implement guardian payment summary.
- [x] Implement guardian notices feed.
- [x] Implement guardian food view.
- [x] Implement guardian safety summary.
- [x] Enforce resident permission before showing complaint status.

**APIs:**

- [x] `POST /api/v1/hostel-admin/residents/:id/guardian-access`
- [x] `POST /api/v1/guardian/login`
- [x] `GET /api/v1/guardian/dashboard`
- [x] `GET /api/v1/guardian/payments`
- [x] `GET /api/v1/guardian/notices`
- [x] `GET /api/v1/guardian/food`
- [x] `GET /api/v1/guardian/safety-summary`

---

### 3.5 Move-In / Move-Out Checklist

**Models:**

- [x] Add `MoveInChecklist` model.
- [x] Add `MoveOutChecklist` model.
- [x] Add `RoomConditionPhoto` model.
- [x] Add `ProvidedItem` model.
- [x] Add `DepositRefund` model.

**Service Layer:**

- [x] Implement move-in checklist create/read.
- [x] Implement move-out checklist create/read.
- [x] Implement pending fee check.
- [x] Implement damage and item return checks.
- [x] Implement deposit refund decision.
- [x] Audit move-in and move-out decisions.

**APIs:**

- [x] `POST /api/v1/hostel-admin/residents/:id/move-in`
- [x] `GET /api/v1/hostel-admin/residents/:id/move-in`
- [x] `POST /api/v1/hostel-admin/residents/:id/move-out`
- [x] `GET /api/v1/hostel-admin/residents/:id/move-out`

---

### 3.6 Ratings and Reviews

**Models:**

- [x] Add `RatingReview` model.
- [x] Add `ReviewModerationLog` model.

**Service Layer:**

- [x] Implement verified resident review creation.
- [x] Enforce one review per resident per hostel.
- [x] Implement public hostel review summary.
- [x] Implement platform review moderation.
- [x] Audit hide/unhide moderation actions.

**APIs:**

- [x] `POST /api/v1/resident/reviews`
- [x] `GET /api/v1/public/hostels/:id/reviews`
- [x] `GET /api/v1/platform/reviews`
- [x] `PATCH /api/v1/platform/reviews/:id/hide`
- [x] `PATCH /api/v1/platform/reviews/:id/unhide`

---

### 3.7 Notifications Foundation

**Models:**

- [x] Extend/use `Notification` model for in-app feed.
- [x] Add `DeviceToken` model.

**Service Layer:**

- [x] Implement notification feed.
- [x] Implement mark notification read.
- [x] Implement event-based notification creation helper.
- [x] Implement mobile FCM token save.

**APIs:**

- [x] `GET /api/v1/notifications`
- [x] `PATCH /api/v1/notifications/:id/read`
- [x] `POST /api/v1/mobile/device-token`

---

## 4. Web Frontend Tasks

### 4.1 Hostel Admin Complaint Management

- [x] Add `/hostel-admin/complaints` page.
- [x] List complaints with status/category filters.
- [x] Hide resident identity for anonymous complaints.
- [x] Add status update action.
- [x] Add admin reply action.
- [x] Show empty/loading/error states.

### 4.2 Resident Complaint Management

- [x] Add `/resident/complaints` page.
- [x] Add complaint creation form.
- [x] Add optional attachment asset input.
- [x] Add anonymous complaint option.
- [x] List own complaints.
- [x] Add confirm resolution action.
- [x] Show empty/loading/error states.

### 4.3 Safety and SOS Screens

- [x] Add resident night status page.
- [x] Add hostel admin night status page.
- [x] Add resident SOS page.
- [x] Add hostel admin SOS alert page.

### 4.4 Guardian, Move Checklist, Reviews, Notifications Screens

- [x] Add guardian dashboard pages.
- [x] Add hostel admin move-in/out checklist pages.
- [x] Add resident reviews page.
- [x] Add notification feed/bell foundation.

---

## 5. Mobile Tasks

- [x] Complaint create/list screen.
- [x] Complaint resolution confirmation flow.
- [x] Night status update screen.
- [x] SOS trigger screen.
- [x] Notifications feed foundation.
- [x] Save FCM token through API.

---

## 6. QA Tasks

### 6.1 Automated Tests

- [x] Complaint service tests.
- [x] Complaint route tests.
- [x] Complaint privacy and tenant isolation tests.
- [x] Night status privacy tests.
- [x] SOS alert tests.
- [x] Guardian limited-access tests.
- [x] Move-out resident status tests.
- [x] Verified review tests.
- [x] Notification feed tests.

### 6.2 Manual QA

- [ ] Resident can create complaint.
- [ ] Resident can see only own complaints.
- [ ] Anonymous complaint hides resident identity from hostel staff UI/API.
- [ ] Hostel staff cannot see another hostel's complaints.
- [ ] Staff can reply and update complaint status.
- [ ] Resident can confirm resolved complaint.
- [ ] Night status does not leak GPS.
- [ ] Guardian cannot see full movement history.
- [ ] SOS creates alert correctly.
- [ ] Move-out checklist updates resident status.
- [ ] Only verified residents can review.

### 6.3 Required Verification Commands

- [x] `npm --prefix apps/web run format:check`
- [x] `npm run web:test`
- [x] `npm run web:lint`
- [x] `npm run web:build`
- [x] `npm run mobile:typecheck`

---

## 7. Phase 4 Done Means

- [x] Daily hostel operations work.
- [x] Residents can report issues.
- [x] Admin can manage complaints.
- [x] Safety status exists without privacy abuse.
- [x] Guardian dashboard is limited and trust-focused.
- [x] Emergency/SOS flow exists.
- [x] Reviews are verified.
- [x] Tenant isolation is verified for all Phase 4 resident-scoped data.

---

## 8. Completion Log

| Date       | Update                                                                                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-06-26 | Phase 4 tracker created from `step_plans.md`. Started with the complaint system as the first daily-operations slice.                                       |
| 2026-06-26 | Completed complaint backend/API/web portal slice with anonymous privacy, tenant isolation, service/route tests, and full web/mobile verification commands. |
| 2026-06-26 | Completed the remaining daily operations, safety, guardian, move-in/out, reviews, notifications, and mobile slices with production-named app files.        |
| 2026-06-26 | Re-ran automated verification: web tests, web lint, web build, web format check, and mobile typecheck passed. Manual QA remains pending.                   |
