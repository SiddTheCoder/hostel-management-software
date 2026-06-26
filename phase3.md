# Phase 3 - Resident System + Payments + Food

**Phase in roadmap:** Phase 3  
**Status:** Implementation Complete - Manual QA Pending  
**Started:** 2026-06-26  
**Source:** `step_plans.md` Phase 3  
**Rule:** Every work item below is a checkbox. Tick a task only after implementation and verification. If a task is partly started but not verified, keep it unchecked and add a note.

---

## 1. Phase Goal

Build the resident daily-use foundation:

- Hostel admin can register residents manually.
- Residents can activate their private dashboard using QR/code after normal account login.
- Resident dashboard works on web and mobile.
- Payment tracking and payment proof upload works.
- Food transparency system works.
- Notice system works.
- Multi-tenant separation is verified for all resident data.

---

## 2. Current Progress Summary

- [x] Phase 3 implementation started.
- [x] Resident registration module complete.
- [x] QR activation module complete.
- [x] Resident dashboard complete.
- [x] Payment records module complete.
- [x] Food transparency module complete.
- [x] Notice system module complete.
- [x] Mobile resident flows complete.
- [x] Phase 3 automated QA gate complete.
- [ ] Phase 3 manual QA gate complete.

---

## 3. Backend Tasks

### 3.1 Resident Registration

**Important rule:** Resident registration is admin-controlled. Public users can create normal app accounts, but they cannot create their own resident record or enter a private resident portal by signup alone.

**Models:**

- [x] Add `Resident` model with fields:
  - [x] `hostelId`
  - [x] `userId` (optional, linked after activation)
  - [x] `firstName`
  - [x] `lastName`
  - [x] `phone`
  - [x] `email`
  - [x] `roomId`
  - [x] `bedId`
  - [x] `moveInDate`
  - [x] `depositAmount`
  - [x] `status` (pending, active, suspended, moved_out)
  - [x] `createdBy`
  - [x] `updatedBy`
  - [x] `createdAt`
  - [x] `updatedAt`
  - [x] Soft delete fields: `isDeleted`, `deletedAt`, `deletedBy`
- [x] Add `Guardian` model with fields:
  - [x] `residentId`
  - [x] `firstName`
  - [x] `lastName`
  - [x] `phone`
  - [x] `email`
  - [x] `relation`
  - [x] `isPrimary`
  - [x] `createdAt`
  - [x] `updatedAt`
- [x] Add `EmergencyContact` model with fields:
  - [x] `residentId`
  - [x] `name`
  - [x] `phone`
  - [x] `relation`
  - [x] `isPrimary`
  - [x] `createdAt`
  - [x] `updatedAt`
- [x] Add `ResidentDocument` model with fields:
  - [x] `residentId`
  - [x] `hostelId`
  - [x] `documentType`
  - [x] `fileAssetId`
  - [x] `uploadedBy`
  - [x] `uploadedAt`

**Service Layer:**

- [x] Implement `createResident` service function.
- [x] Implement `listResidents` service function with hostel tenant filter.
- [x] Implement `getResidentById` service function with hostel tenant check.
- [x] Implement `updateResident` service function with hostel tenant check.
- [x] Implement `updateResidentStatus` service function with hostel tenant check and audit log.
- [x] Implement `addGuardian` service function.
- [x] Implement `addEmergencyContact` service function.
- [x] Implement room/bed assignment validation (check vacancy, hostel match).

**Validation:**

- [x] Add `residentCreateSchema` with Zod.
- [x] Add `residentUpdateSchema` with Zod.
- [x] Add `residentStatusSchema` with Zod.
- [x] Add `guardianCreateSchema` with Zod.
- [x] Add `emergencyContactCreateSchema` with Zod.

**APIs:**

- [x] `POST /api/v1/hostel-admin/residents`
- [x] `GET /api/v1/hostel-admin/residents`
- [x] `GET /api/v1/hostel-admin/residents/:id`
- [x] `PATCH /api/v1/hostel-admin/residents/:id`
- [x] `PATCH /api/v1/hostel-admin/residents/:id/status`
- [x] `POST /api/v1/hostel-admin/residents/:id/guardians`
- [x] `POST /api/v1/hostel-admin/residents/:id/emergency-contacts`

**Permissions:**

- [x] Enforce hostel admin/warden role for all resident management APIs.
- [x] Enforce hostel tenant isolation for all resident queries.
- [x] Audit log for resident creation, status changes.

**Indexes:**

- [x] Add indexes: `residents: hostelId, userId, phone, status, roomId, bedId`
- [x] Add indexes: `guardians: residentId, phone`
- [x] Add indexes: `emergency_contacts: residentId`

---

### 3.2 QR Activation

**Important rule:** Private resident portal access happens through activation, not through normal login alone.

**Activation flow:**

1. Admin creates resident record and generates one-time QR/code.
2. Resident first logs in with any normal account created by phone OTP, email OTP, password, or Google.
3. Logged-in resident scans QR or enters code from admin.
4. Current user account gets linked to the hostel and resident profile.
5. Linked account receives resident access for that hostel.
6. QR expires after use or timeout.

**Models:**

- [x] Add `QRActivation` model with fields:
  - [x] `hostelId`
  - [x] `residentId`
  - [x] `codeHash` (hashed activation code)
  - [x] `code` (plain code - only for generation, not stored)
  - [x] `expiresAt`
  - [x] `usedAt`
  - [x] `usedBy` (userId)
  - [x] `deviceInfo`
  - [x] `sessionInfo`
  - [x] `createdBy`
  - [x] `createdAt`
  - [x] `status` (pending, used, expired, cancelled)

**Service Layer:**

- [x] Implement `generateActivationCode` service function.
- [x] Implement code hashing before storage.
- [x] Implement `activateResident` service function:
  - [x] Verify logged-in user.
  - [x] Verify code hash match.
  - [x] Check code not used/expired.
  - [x] Link `resident.userId` to current user.
  - [x] Mark QR as used with metadata.
  - [x] Prevent duplicate active resident profiles per account.
  - [x] Audit log activation event.
- [x] Implement `getActivationStatus` service function.
- [x] Implement `regenerateActivationCode` service function (admin only).

**Validation:**

- [x] Add `activationCodeSchema` with Zod.
- [x] Add resident activation input validation.

**APIs:**

- [x] `POST /api/v1/hostel-admin/residents/:id/activation-code`
- [x] `POST /api/v1/resident/activate`
- [x] `GET /api/v1/resident/activation-status`
- [x] `GET /api/v1/resident/me`

**Permissions:**

- [x] Admin can generate activation codes for own hostel residents.
- [x] Logged-in user can activate only once per code.
- [x] Activated resident can access only own hostel data.

**Indexes:**

- [x] Add indexes: `qr_activations: hostelId, residentId, codeHash, expiresAt, usedAt, status`

---

### 3.3 Resident Dashboard

**Service Layer:**

- [x] Implement `getResidentDashboard` service function returning:
  - [x] Hostel summary
  - [x] Room/bed assignment
  - [x] Fee status summary
  - [x] Recent notices
  - [x] Food menu summary
  - [x] Recent complaints
  - [x] Night status summary
- [x] Implement `getResidentProfile` service function.
- [x] Enforce resident can only see own data.

**APIs:**

- [x] `GET /api/v1/resident/dashboard`
- [x] `GET /api/v1/resident/profile`

**Permissions:**

- [x] Resident role required.
- [x] Returns only current resident's data.

---

### 3.4 Payment Records

**Initial version is manual proof-based.**

**Models:**

- [x] Add `Payment` model with fields:
  - [x] `hostelId`
  - [x] `residentId`
  - [x] `month` (YYYY-MM format)
  - [x] `dueAmount`
  - [x] `paidAmount`
  - [x] `dueDate`
  - [x] `paidDate`
  - [x] `status` (unpaid, paid, partial, overdue, pending_proof)
  - [x] `paymentMethod` (cash, esewa, khalti, fonepay, bank_transfer, other)
  - [x] `remarks`
  - [x] `createdBy`
  - [x] `updatedBy`
  - [x] `createdAt`
  - [x] `updatedAt`
- [x] Add `PaymentProof` model with fields:
  - [x] `hostelId`
  - [x] `residentId`
  - [x] `paymentId`
  - [x] `proofImageAssetId`
  - [x] `transactionCode`
  - [x] `submittedAt`
  - [x] `submittedBy`
  - [x] `reviewedBy`
  - [x] `reviewedAt`
  - [x] `status` (pending, approved, rejected)
  - [x] `rejectionReason`
- [x] Add `Receipt` model with fields:
  - [x] `hostelId`
  - [x] `residentId`
  - [x] `paymentId`
  - [x] `receiptNumber`
  - [x] `issuedAt`
  - [x] `issuedBy`
  - [x] `amount`
  - [x] `month`
- [x] Add `DepositRecord` model with fields:
  - [x] `hostelId`
  - [x] `residentId`
  - [x] `amount`
  - [x] `paidDate`
  - [x] `status` (held, refunded, forfeited)
  - [x] `refundedDate`
  - [x] `refundedAmount`
  - [x] `remarks`

**Service Layer:**

- [x] Implement `createPaymentRecord` service function (admin only).
- [x] Implement `listPayments` service function with hostel/resident filters.
- [x] Implement `updatePaymentRecord` service function (admin only).
- [x] Implement `submitPaymentProof` service function (resident).
- [x] Implement `approvePaymentProof` service function (admin).
- [x] Implement `rejectPaymentProof` service function (admin).
- [x] Implement `generateReceipt` service function.
- [x] Auto-update payment status when proof is approved.
- [x] Audit log payment status changes and proof decisions.

**Validation:**

- [x] Add `paymentCreateSchema` with Zod.
- [x] Add `paymentUpdateSchema` with Zod.
- [x] Add `paymentProofSubmitSchema` with Zod.
- [x] Add `paymentProofReviewSchema` with Zod.

**APIs:**

- [x] `POST /api/v1/hostel-admin/payments`
- [x] `GET /api/v1/hostel-admin/payments`
- [x] `PATCH /api/v1/hostel-admin/payments/:id`
- [x] `POST /api/v1/resident/payments/:paymentId/proof`
- [x] `GET /api/v1/resident/payments`
- [x] `PATCH /api/v1/hostel-admin/payment-proofs/:id/approve`
- [x] `PATCH /api/v1/hostel-admin/payment-proofs/:id/reject`
- [x] `GET /api/v1/resident/receipts/:id`

**Permissions:**

- [x] Admin can create/update payments for own hostel.
- [x] Resident can view own payments.
- [x] Resident can submit proof for own payments.
- [x] Admin can approve/reject proofs for own hostel.
- [x] Resident can view own receipts.

**Indexes:**

- [x] Add indexes: `payments: hostelId, residentId, month, status, dueDate`
- [x] Add indexes: `payment_proofs: hostelId, residentId, paymentId, status`
- [x] Add indexes: `receipts: hostelId, residentId, paymentId`

---

### 3.5 Food Transparency

**Models:**

- [x] Add `FoodMenu` model with fields:
  - [x] `hostelId`
  - [x] `date` or `weekStartDate`
  - [x] `dayOfWeek`
  - [x] `mealType` (breakfast, lunch, snacks, dinner)
  - [x] `items` (array of food item names)
  - [x] `timing`
  - [x] `specialNotes`
  - [x] `createdBy`
  - [x] `updatedBy`
  - [x] `createdAt`
  - [x] `updatedAt`
- [x] Add `FoodPhoto` model with fields:
  - [x] `hostelId`
  - [x] `residentId` (optional, if resident uploads)
  - [x] `mealType`
  - [x] `date`
  - [x] `photoAssetId`
  - [x] `caption`
  - [x] `uploadedBy`
  - [x] `uploadedAt`
- [x] Add `FoodFeedback` model with fields:
  - [x] `hostelId`
  - [x] `residentId`
  - [x] `menuId` (optional)
  - [x] `date`
  - [x] `mealType`
  - [x] `rating` (1-5)
  - [x] `comment`
  - [x] `isAnonymous`
  - [x] `createdAt`

**Service Layer:**

- [x] Implement `createFoodMenu` service function (admin).
- [x] Implement `listFoodMenus` service function with hostel/date filters.
- [x] Implement `updateFoodMenu` service function (admin).
- [x] Implement `uploadFoodPhoto` service function (admin or resident).
- [x] Implement `submitFoodFeedback` service function (resident).
- [x] Implement `listFoodForResident` service function (resident view).

**Validation:**

- [x] Add `foodMenuCreateSchema` with Zod.
- [x] Add `foodMenuUpdateSchema` with Zod.
- [x] Add `foodPhotoUploadSchema` with Zod.
- [x] Add `foodFeedbackSchema` with Zod.

**APIs:**

- [x] `POST /api/v1/hostel-admin/food/menu`
- [x] `GET /api/v1/hostel-admin/food/menu`
- [x] `PATCH /api/v1/hostel-admin/food/menu/:id`
- [x] `POST /api/v1/hostel-admin/food/photos`
- [x] `GET /api/v1/resident/food`
- [x] `POST /api/v1/resident/food/feedback`

**Permissions:**

- [x] Admin can manage menu for own hostel.
- [x] Admin/resident can upload food photos for own hostel.
- [x] Resident can view food menu/photos for own hostel.
- [x] Resident can submit feedback for own hostel.

**Indexes:**

- [x] Add indexes: `food_menus: hostelId, date, weekStartDate, mealType`
- [x] Add indexes: `food_photos: hostelId, date, mealType`
- [x] Add indexes: `food_feedback: hostelId, residentId, date`

---

### 3.6 Notice System

**Models:**

- [x] Add `Notice` model with fields:
  - [x] `hostelId`
  - [x] `title`
  - [x] `content`
  - [x] `category` (general, urgent, event, rule, maintenance, etc.)
  - [x] `isUrgent`
  - [x] `publishedAt`
  - [x] `expiresAt`
  - [x] `createdBy`
  - [x] `updatedBy`
  - [x] `createdAt`
  - [x] `updatedAt`
- [x] Add `NoticeReadStatus` model with fields:
  - [x] `noticeId`
  - [x] `userId`
  - [x] `readAt`

**Service Layer:**

- [x] Implement `createNotice` service function (admin).
- [x] Implement `listNotices` service function with hostel filter.
- [x] Implement `listNoticesForResident` service function with read status.
- [x] Implement `markNoticeAsRead` service function (resident).

**Validation:**

- [x] Add `noticeCreateSchema` with Zod.
- [x] Add `noticeUpdateSchema` with Zod.

**APIs:**

- [x] `POST /api/v1/hostel-admin/notices`
- [x] `GET /api/v1/hostel-admin/notices`
- [x] `GET /api/v1/resident/notices`
- [x] `PATCH /api/v1/resident/notices/:id/read`

**Permissions:**

- [x] Admin can create/list notices for own hostel.
- [x] Resident can view notices for own hostel.
- [x] Resident can mark notices as read.

**Indexes:**

- [x] Add indexes: `notices: hostelId, category, publishedAt, expiresAt`
- [x] Add indexes: `notice_read_status: noticeId, userId, readAt`

---

## 4. Web Frontend Tasks

### 4.1 Hostel Admin Resident Management

- [x] Add `/hostel-admin/residents` page with list view.
- [x] Add resident create form.
- [x] Add resident detail/edit page.
- [x] Add guardian management UI.
- [x] Add emergency contact management UI.
- [x] Add QR/code generation button and display.
- [x] Connect to resident APIs.
- [x] Empty/loading/error states.

### 4.2 Hostel Admin Payment Management

- [x] Add `/hostel-admin/payments` page.
- [x] Add payment record creation form.
- [x] Add payment list with filters (resident, month, status).
- [x] Add payment proof review UI.
- [x] Add approve/reject actions.
- [x] Connect to payment APIs.
- [x] Empty/loading/error states.

### 4.3 Hostel Admin Food Management

- [x] Add `/hostel-admin/food` page.
- [x] Add weekly menu creation/edit form.
- [x] Add food photo upload UI.
- [x] Connect to food APIs.
- [x] Empty/loading/error states.

### 4.4 Hostel Admin Notice Management

- [x] Add `/hostel-admin/notices` page.
- [x] Add notice creation form.
- [x] Add notice list view.
- [x] Connect to notice APIs.
- [x] Empty/loading/error states.

### 4.5 Resident Dashboard

- [x] Add `/resident/dashboard` page with summary cards.
- [x] Connect to resident dashboard API.
- [x] Display hostel info, room/bed, fee summary, recent notices.
- [x] Empty/loading/error states.

### 4.6 Resident Payment View

- [x] Add `/resident/payments` page.
- [x] Add payment proof upload UI.
- [x] Add transaction code input.
- [x] Connect to payment and proof APIs.
- [x] Empty/loading/error states.

### 4.7 Resident Food View

- [x] Add `/resident/food` page.
- [x] Display weekly menu.
- [x] Display food photos.
- [x] Add feedback submission form.
- [x] Connect to food APIs.
- [x] Empty/loading/error states.

### 4.8 Resident Notice View

- [x] Add `/resident/notices` page.
- [x] Display notices with read/unread status.
- [x] Add mark-as-read action.
- [x] Connect to notice APIs.
- [x] Empty/loading/error states.

---

## 5. Mobile Tasks

### 5.1 QR Activation

- [x] Build QR scan screen using device camera.
- [x] Build manual code entry screen.
- [x] Build activation flow after login.
- [x] Show activation status (pending/success/error).
- [x] Handle already-activated state.
- [x] Connect to activation API.

### 5.2 Resident Dashboard

- [x] Build resident dashboard home screen.
- [x] Display hostel summary card.
- [x] Display room/bed info.
- [x] Display fee status summary.
- [x] Add quick action buttons (food, payments, notices, complaints, SOS).
- [x] Connect to resident dashboard API.

### 5.3 Resident Profile

- [x] Build resident profile screen.
- [x] Display resident details (read-only or editable basic fields).
- [x] Connect to resident profile API.

### 5.4 Food View

- [x] Build food menu screen.
- [x] Display today's menu and weekly menu.
- [x] Display food photos.
- [x] Add feedback submission form.
- [x] Connect to food APIs.

### 5.5 Payment View

- [x] Build payment list screen.
- [x] Display payment status (paid, unpaid, pending proof).
- [x] Build payment proof upload screen.
- [x] Add image picker for proof photo.
- [x] Add transaction code input.
- [x] Connect to payment APIs.

### 5.6 Notices View

- [x] Build notices feed screen.
- [x] Display unread badge.
- [x] Show notice detail view.
- [x] Add mark-as-read action.
- [x] Connect to notice APIs.

---

## 6. QA Tasks

### 6.1 Automated Tests

- [x] Resident creation API tests.
- [x] Resident tenant isolation tests (admin cannot see other hostel residents).
- [x] QR activation tests (code verification, expiry, one-time use).
- [x] Resident dashboard API tests (only own data returned).
- [x] Payment creation tests.
- [x] Payment proof approval/rejection tests.
- [x] Payment tenant isolation tests.
- [x] Food menu/feedback tests.
- [x] Food tenant isolation tests.
- [x] Notice creation/read status tests.
- [x] Notice tenant isolation tests.

### 6.2 Manual QA

- [ ] Hostel admin can create resident with room/bed assignment.
- [ ] Admin cannot assign bed from another hostel.
- [ ] QR/code generation works.
- [ ] Resident cannot activate with expired code.
- [ ] Resident cannot activate with used code.
- [ ] Activation links user to resident profile.
- [ ] Activated resident sees only own dashboard.
- [ ] Resident cannot see another resident's payments.
- [ ] Payment proof upload works.
- [ ] Admin can approve/reject proof.
- [ ] Food menu displays correctly for residents.
- [ ] Resident can submit food feedback.
- [ ] Notice appears in resident feed.
- [ ] Notice read status works.
- [ ] Mobile QR scan works.
- [ ] Mobile resident dashboard displays correct data.

### 6.3 Required Verification Commands

- [x] `npm --prefix apps/web run format:check`
- [x] `npm run web:test`
- [x] `npm run web:lint`
- [x] `npm run web:build`
- [x] `npm run mobile:typecheck`

---

## 7. Phase 3 Done Means

- [x] Hostel admin can register residents.
- [x] Resident can activate dashboard using QR/code.
- [x] Payment tracking works.
- [x] Payment proof upload and admin review works.
- [x] Food transparency system works.
- [x] Notices work.
- [x] Mobile app has resident activation, dashboard, and daily-use basics.
- [x] Tenant isolation verified for all resident-scoped data.

---

## 8. Completion Log

| Date | Update |
|---|---|
| 2026-06-25 | Phase 3 tracker created from `step_plans.md`. Ready for implementation. |
| 2026-06-26 | Started Phase 3. Completed resident registration backend slice: models, validation, hostel-admin APIs, service tenant checks, bed assignment validation, audit logs, and route/service tests. |
| 2026-06-26 | Completed Phase 3 implementation across resident activation, dashboard, payments, food, notices, admin/resident web screens, mobile resident flows, and automated QA. Manual device/browser QA remains pending. |
