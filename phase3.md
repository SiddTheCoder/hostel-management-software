# Phase 3 - Resident System + Payments + Food

**Phase in roadmap:** Phase 3  
**Status:** Not Started  
**Started:** TBD  
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

- [ ] Phase 3 implementation started.
- [ ] Resident registration module complete.
- [ ] QR activation module complete.
- [ ] Resident dashboard complete.
- [ ] Payment records module complete.
- [ ] Food transparency module complete.
- [ ] Notice system module complete.
- [ ] Mobile resident flows complete.
- [ ] Phase 3 automated QA gate complete.
- [ ] Phase 3 manual QA gate complete.

---

## 3. Backend Tasks

### 3.1 Resident Registration

**Important rule:** Resident registration is admin-controlled. Public users can create normal app accounts, but they cannot create their own resident record or enter a private resident portal by signup alone.

**Models:**

- [ ] Add `Resident` model with fields:
  - [ ] `hostelId`
  - [ ] `userId` (optional, linked after activation)
  - [ ] `firstName`
  - [ ] `lastName`
  - [ ] `phone`
  - [ ] `email`
  - [ ] `roomId`
  - [ ] `bedId`
  - [ ] `moveInDate`
  - [ ] `depositAmount`
  - [ ] `status` (pending, active, suspended, moved_out)
  - [ ] `createdBy`
  - [ ] `updatedBy`
  - [ ] `createdAt`
  - [ ] `updatedAt`
  - [ ] Soft delete fields: `isDeleted`, `deletedAt`, `deletedBy`
- [ ] Add `Guardian` model with fields:
  - [ ] `residentId`
  - [ ] `firstName`
  - [ ] `lastName`
  - [ ] `phone`
  - [ ] `email`
  - [ ] `relation`
  - [ ] `isPrimary`
  - [ ] `createdAt`
  - [ ] `updatedAt`
- [ ] Add `EmergencyContact` model with fields:
  - [ ] `residentId`
  - [ ] `name`
  - [ ] `phone`
  - [ ] `relation`
  - [ ] `isPrimary`
  - [ ] `createdAt`
  - [ ] `updatedAt`
- [ ] Add `ResidentDocument` model with fields:
  - [ ] `residentId`
  - [ ] `hostelId`
  - [ ] `documentType`
  - [ ] `fileAssetId`
  - [ ] `uploadedBy`
  - [ ] `uploadedAt`

**Service Layer:**

- [ ] Implement `createResident` service function.
- [ ] Implement `listResidents` service function with hostel tenant filter.
- [ ] Implement `getResidentById` service function with hostel tenant check.
- [ ] Implement `updateResident` service function with hostel tenant check.
- [ ] Implement `updateResidentStatus` service function with hostel tenant check and audit log.
- [ ] Implement `addGuardian` service function.
- [ ] Implement `addEmergencyContact` service function.
- [ ] Implement room/bed assignment validation (check vacancy, hostel match).

**Validation:**

- [ ] Add `residentCreateSchema` with Zod.
- [ ] Add `residentUpdateSchema` with Zod.
- [ ] Add `residentStatusSchema` with Zod.
- [ ] Add `guardianCreateSchema` with Zod.
- [ ] Add `emergencyContactCreateSchema` with Zod.

**APIs:**

- [ ] `POST /api/v1/hostel-admin/residents`
- [ ] `GET /api/v1/hostel-admin/residents`
- [ ] `GET /api/v1/hostel-admin/residents/:id`
- [ ] `PATCH /api/v1/hostel-admin/residents/:id`
- [ ] `PATCH /api/v1/hostel-admin/residents/:id/status`
- [ ] `POST /api/v1/hostel-admin/residents/:id/guardians`
- [ ] `POST /api/v1/hostel-admin/residents/:id/emergency-contacts`

**Permissions:**

- [ ] Enforce hostel admin/warden role for all resident management APIs.
- [ ] Enforce hostel tenant isolation for all resident queries.
- [ ] Audit log for resident creation, status changes.

**Indexes:**

- [ ] Add indexes: `residents: hostelId, userId, phone, status, roomId, bedId`
- [ ] Add indexes: `guardians: residentId, phone`
- [ ] Add indexes: `emergency_contacts: residentId`

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

- [ ] Add `QRActivation` model with fields:
  - [ ] `hostelId`
  - [ ] `residentId`
  - [ ] `codeHash` (hashed activation code)
  - [ ] `code` (plain code - only for generation, not stored)
  - [ ] `expiresAt`
  - [ ] `usedAt`
  - [ ] `usedBy` (userId)
  - [ ] `deviceInfo`
  - [ ] `sessionInfo`
  - [ ] `createdBy`
  - [ ] `createdAt`
  - [ ] `status` (pending, used, expired, cancelled)

**Service Layer:**

- [ ] Implement `generateActivationCode` service function.
- [ ] Implement code hashing before storage.
- [ ] Implement `activateResident` service function:
  - [ ] Verify logged-in user.
  - [ ] Verify code hash match.
  - [ ] Check code not used/expired.
  - [ ] Link `resident.userId` to current user.
  - [ ] Mark QR as used with metadata.
  - [ ] Prevent duplicate active resident profiles per account.
  - [ ] Audit log activation event.
- [ ] Implement `getActivationStatus` service function.
- [ ] Implement `regenerateActivationCode` service function (admin only).

**Validation:**

- [ ] Add `activationCodeSchema` with Zod.
- [ ] Add resident activation input validation.

**APIs:**

- [ ] `POST /api/v1/hostel-admin/residents/:id/activation-code`
- [ ] `POST /api/v1/resident/activate`
- [ ] `GET /api/v1/resident/activation-status`
- [ ] `GET /api/v1/resident/me`

**Permissions:**

- [ ] Admin can generate activation codes for own hostel residents.
- [ ] Logged-in user can activate only once per code.
- [ ] Activated resident can access only own hostel data.

**Indexes:**

- [ ] Add indexes: `qr_activations: hostelId, residentId, codeHash, expiresAt, usedAt, status`

---

### 3.3 Resident Dashboard

**Service Layer:**

- [ ] Implement `getResidentDashboard` service function returning:
  - [ ] Hostel summary
  - [ ] Room/bed assignment
  - [ ] Fee status summary
  - [ ] Recent notices
  - [ ] Food menu summary
  - [ ] Recent complaints
  - [ ] Night status summary
- [ ] Implement `getResidentProfile` service function.
- [ ] Enforce resident can only see own data.

**APIs:**

- [ ] `GET /api/v1/resident/dashboard`
- [ ] `GET /api/v1/resident/profile`

**Permissions:**

- [ ] Resident role required.
- [ ] Returns only current resident's data.

---

### 3.4 Payment Records

**Initial version is manual proof-based.**

**Models:**

- [ ] Add `Payment` model with fields:
  - [ ] `hostelId`
  - [ ] `residentId`
  - [ ] `month` (YYYY-MM format)
  - [ ] `dueAmount`
  - [ ] `paidAmount`
  - [ ] `dueDate`
  - [ ] `paidDate`
  - [ ] `status` (unpaid, paid, partial, overdue, pending_proof)
  - [ ] `paymentMethod` (cash, esewa, khalti, fonepay, bank_transfer, other)
  - [ ] `remarks`
  - [ ] `createdBy`
  - [ ] `updatedBy`
  - [ ] `createdAt`
  - [ ] `updatedAt`
- [ ] Add `PaymentProof` model with fields:
  - [ ] `hostelId`
  - [ ] `residentId`
  - [ ] `paymentId`
  - [ ] `proofImageAssetId`
  - [ ] `transactionCode`
  - [ ] `submittedAt`
  - [ ] `submittedBy`
  - [ ] `reviewedBy`
  - [ ] `reviewedAt`
  - [ ] `status` (pending, approved, rejected)
  - [ ] `rejectionReason`
- [ ] Add `Receipt` model with fields:
  - [ ] `hostelId`
  - [ ] `residentId`
  - [ ] `paymentId`
  - [ ] `receiptNumber`
  - [ ] `issuedAt`
  - [ ] `issuedBy`
  - [ ] `amount`
  - [ ] `month`
- [ ] Add `DepositRecord` model with fields:
  - [ ] `hostelId`
  - [ ] `residentId`
  - [ ] `amount`
  - [ ] `paidDate`
  - [ ] `status` (held, refunded, forfeited)
  - [ ] `refundedDate`
  - [ ] `refundedAmount`
  - [ ] `remarks`

**Service Layer:**

- [ ] Implement `createPaymentRecord` service function (admin only).
- [ ] Implement `listPayments` service function with hostel/resident filters.
- [ ] Implement `updatePaymentRecord` service function (admin only).
- [ ] Implement `submitPaymentProof` service function (resident).
- [ ] Implement `approvePaymentProof` service function (admin).
- [ ] Implement `rejectPaymentProof` service function (admin).
- [ ] Implement `generateReceipt` service function.
- [ ] Auto-update payment status when proof is approved.
- [ ] Audit log payment status changes and proof decisions.

**Validation:**

- [ ] Add `paymentCreateSchema` with Zod.
- [ ] Add `paymentUpdateSchema` with Zod.
- [ ] Add `paymentProofSubmitSchema` with Zod.
- [ ] Add `paymentProofReviewSchema` with Zod.

**APIs:**

- [ ] `POST /api/v1/hostel-admin/payments`
- [ ] `GET /api/v1/hostel-admin/payments`
- [ ] `PATCH /api/v1/hostel-admin/payments/:id`
- [ ] `POST /api/v1/resident/payments/:paymentId/proof`
- [ ] `GET /api/v1/resident/payments`
- [ ] `PATCH /api/v1/hostel-admin/payment-proofs/:id/approve`
- [ ] `PATCH /api/v1/hostel-admin/payment-proofs/:id/reject`
- [ ] `GET /api/v1/resident/receipts/:id`

**Permissions:**

- [ ] Admin can create/update payments for own hostel.
- [ ] Resident can view own payments.
- [ ] Resident can submit proof for own payments.
- [ ] Admin can approve/reject proofs for own hostel.
- [ ] Resident can view own receipts.

**Indexes:**

- [ ] Add indexes: `payments: hostelId, residentId, month, status, dueDate`
- [ ] Add indexes: `payment_proofs: hostelId, residentId, paymentId, status`
- [ ] Add indexes: `receipts: hostelId, residentId, paymentId`

---

### 3.5 Food Transparency

**Models:**

- [ ] Add `FoodMenu` model with fields:
  - [ ] `hostelId`
  - [ ] `date` or `weekStartDate`
  - [ ] `dayOfWeek`
  - [ ] `mealType` (breakfast, lunch, snacks, dinner)
  - [ ] `items` (array of food item names)
  - [ ] `timing`
  - [ ] `specialNotes`
  - [ ] `createdBy`
  - [ ] `updatedBy`
  - [ ] `createdAt`
  - [ ] `updatedAt`
- [ ] Add `FoodPhoto` model with fields:
  - [ ] `hostelId`
  - [ ] `residentId` (optional, if resident uploads)
  - [ ] `mealType`
  - [ ] `date`
  - [ ] `photoAssetId`
  - [ ] `caption`
  - [ ] `uploadedBy`
  - [ ] `uploadedAt`
- [ ] Add `FoodFeedback` model with fields:
  - [ ] `hostelId`
  - [ ] `residentId`
  - [ ] `menuId` (optional)
  - [ ] `date`
  - [ ] `mealType`
  - [ ] `rating` (1-5)
  - [ ] `comment`
  - [ ] `isAnonymous`
  - [ ] `createdAt`

**Service Layer:**

- [ ] Implement `createFoodMenu` service function (admin).
- [ ] Implement `listFoodMenus` service function with hostel/date filters.
- [ ] Implement `updateFoodMenu` service function (admin).
- [ ] Implement `uploadFoodPhoto` service function (admin or resident).
- [ ] Implement `submitFoodFeedback` service function (resident).
- [ ] Implement `listFoodForResident` service function (resident view).

**Validation:**

- [ ] Add `foodMenuCreateSchema` with Zod.
- [ ] Add `foodMenuUpdateSchema` with Zod.
- [ ] Add `foodPhotoUploadSchema` with Zod.
- [ ] Add `foodFeedbackSchema` with Zod.

**APIs:**

- [ ] `POST /api/v1/hostel-admin/food/menu`
- [ ] `GET /api/v1/hostel-admin/food/menu`
- [ ] `PATCH /api/v1/hostel-admin/food/menu/:id`
- [ ] `POST /api/v1/hostel-admin/food/photos`
- [ ] `GET /api/v1/resident/food`
- [ ] `POST /api/v1/resident/food/feedback`

**Permissions:**

- [ ] Admin can manage menu for own hostel.
- [ ] Admin/resident can upload food photos for own hostel.
- [ ] Resident can view food menu/photos for own hostel.
- [ ] Resident can submit feedback for own hostel.

**Indexes:**

- [ ] Add indexes: `food_menus: hostelId, date, weekStartDate, mealType`
- [ ] Add indexes: `food_photos: hostelId, date, mealType`
- [ ] Add indexes: `food_feedback: hostelId, residentId, date`

---

### 3.6 Notice System

**Models:**

- [ ] Add `Notice` model with fields:
  - [ ] `hostelId`
  - [ ] `title`
  - [ ] `content`
  - [ ] `category` (general, urgent, event, rule, maintenance, etc.)
  - [ ] `isUrgent`
  - [ ] `publishedAt`
  - [ ] `expiresAt`
  - [ ] `createdBy`
  - [ ] `updatedBy`
  - [ ] `createdAt`
  - [ ] `updatedAt`
- [ ] Add `NoticeReadStatus` model with fields:
  - [ ] `noticeId`
  - [ ] `userId`
  - [ ] `readAt`

**Service Layer:**

- [ ] Implement `createNotice` service function (admin).
- [ ] Implement `listNotices` service function with hostel filter.
- [ ] Implement `listNoticesForResident` service function with read status.
- [ ] Implement `markNoticeAsRead` service function (resident).

**Validation:**

- [ ] Add `noticeCreateSchema` with Zod.
- [ ] Add `noticeUpdateSchema` with Zod.

**APIs:**

- [ ] `POST /api/v1/hostel-admin/notices`
- [ ] `GET /api/v1/hostel-admin/notices`
- [ ] `GET /api/v1/resident/notices`
- [ ] `PATCH /api/v1/resident/notices/:id/read`

**Permissions:**

- [ ] Admin can create/list notices for own hostel.
- [ ] Resident can view notices for own hostel.
- [ ] Resident can mark notices as read.

**Indexes:**

- [ ] Add indexes: `notices: hostelId, category, publishedAt, expiresAt`
- [ ] Add indexes: `notice_read_status: noticeId, userId, readAt`

---

## 4. Web Frontend Tasks

### 4.1 Hostel Admin Resident Management

- [ ] Add `/hostel-admin/residents` page with list view.
- [ ] Add resident create form.
- [ ] Add resident detail/edit page.
- [ ] Add guardian management UI.
- [ ] Add emergency contact management UI.
- [ ] Add QR/code generation button and display.
- [ ] Connect to resident APIs.
- [ ] Empty/loading/error states.

### 4.2 Hostel Admin Payment Management

- [ ] Add `/hostel-admin/payments` page.
- [ ] Add payment record creation form.
- [ ] Add payment list with filters (resident, month, status).
- [ ] Add payment proof review UI.
- [ ] Add approve/reject actions.
- [ ] Connect to payment APIs.
- [ ] Empty/loading/error states.

### 4.3 Hostel Admin Food Management

- [ ] Add `/hostel-admin/food` page.
- [ ] Add weekly menu creation/edit form.
- [ ] Add food photo upload UI.
- [ ] Connect to food APIs.
- [ ] Empty/loading/error states.

### 4.4 Hostel Admin Notice Management

- [ ] Add `/hostel-admin/notices` page.
- [ ] Add notice creation form.
- [ ] Add notice list view.
- [ ] Connect to notice APIs.
- [ ] Empty/loading/error states.

### 4.5 Resident Dashboard

- [ ] Add `/resident/dashboard` page with summary cards.
- [ ] Connect to resident dashboard API.
- [ ] Display hostel info, room/bed, fee summary, recent notices.
- [ ] Empty/loading/error states.

### 4.6 Resident Payment View

- [ ] Add `/resident/payments` page.
- [ ] Add payment proof upload UI.
- [ ] Add transaction code input.
- [ ] Connect to payment and proof APIs.
- [ ] Empty/loading/error states.

### 4.7 Resident Food View

- [ ] Add `/resident/food` page.
- [ ] Display weekly menu.
- [ ] Display food photos.
- [ ] Add feedback submission form.
- [ ] Connect to food APIs.
- [ ] Empty/loading/error states.

### 4.8 Resident Notice View

- [ ] Add `/resident/notices` page.
- [ ] Display notices with read/unread status.
- [ ] Add mark-as-read action.
- [ ] Connect to notice APIs.
- [ ] Empty/loading/error states.

---

## 5. Mobile Tasks

### 5.1 QR Activation

- [ ] Build QR scan screen using device camera.
- [ ] Build manual code entry screen.
- [ ] Build activation flow after login.
- [ ] Show activation status (pending/success/error).
- [ ] Handle already-activated state.
- [ ] Connect to activation API.

### 5.2 Resident Dashboard

- [ ] Build resident dashboard home screen.
- [ ] Display hostel summary card.
- [ ] Display room/bed info.
- [ ] Display fee status summary.
- [ ] Add quick action buttons (food, payments, notices, complaints, SOS).
- [ ] Connect to resident dashboard API.

### 5.3 Resident Profile

- [ ] Build resident profile screen.
- [ ] Display resident details (read-only or editable basic fields).
- [ ] Connect to resident profile API.

### 5.4 Food View

- [ ] Build food menu screen.
- [ ] Display today's menu and weekly menu.
- [ ] Display food photos.
- [ ] Add feedback submission form.
- [ ] Connect to food APIs.

### 5.5 Payment View

- [ ] Build payment list screen.
- [ ] Display payment status (paid, unpaid, pending proof).
- [ ] Build payment proof upload screen.
- [ ] Add image picker for proof photo.
- [ ] Add transaction code input.
- [ ] Connect to payment APIs.

### 5.6 Notices View

- [ ] Build notices feed screen.
- [ ] Display unread badge.
- [ ] Show notice detail view.
- [ ] Add mark-as-read action.
- [ ] Connect to notice APIs.

---

## 6. QA Tasks

### 6.1 Automated Tests

- [ ] Resident creation API tests.
- [ ] Resident tenant isolation tests (admin cannot see other hostel residents).
- [ ] QR activation tests (code verification, expiry, one-time use).
- [ ] Resident dashboard API tests (only own data returned).
- [ ] Payment creation tests.
- [ ] Payment proof approval/rejection tests.
- [ ] Payment tenant isolation tests.
- [ ] Food menu/feedback tests.
- [ ] Food tenant isolation tests.
- [ ] Notice creation/read status tests.
- [ ] Notice tenant isolation tests.

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

- [ ] `npm --prefix apps/web run format:check`
- [ ] `npm run web:test`
- [ ] `npm run web:lint`
- [ ] `npm run web:build`
- [ ] `npm run mobile:typecheck`

---

## 7. Phase 3 Done Means

- [ ] Hostel admin can register residents.
- [ ] Resident can activate dashboard using QR/code.
- [ ] Payment tracking works.
- [ ] Payment proof upload and admin review works.
- [ ] Food transparency system works.
- [ ] Notices work.
- [ ] Mobile app has resident activation, dashboard, and daily-use basics.
- [ ] Tenant isolation verified for all resident-scoped data.

---

## 8. Completion Log

| Date | Update |
|---|---|
| 2026-06-25 | Phase 3 tracker created from `step_plans.md`. Ready for implementation. |
