# Multi-Hostel SaaS Platform — Phase-Wise Development Plan

**Version:** 1.0  
**Stack Decision:** Next.js server + MongoDB  
**Timeline Target:** 5 weeks  
**Development Mode:** Large-team parallel execution  
**Purpose:** Developer execution roadmap for website, admin panels, mobile app APIs, resident portal, guardian dashboard, and maintenance/service-provider network.

---

## 1. Final Technical Direction

We will use **Next.js as the main full-stack server**.

That means:

- Public website runs in Next.js.
- Admin dashboards run in Next.js.
- Server APIs run inside Next.js Route Handlers.
- Mobile app consumes the same `/api/v1` endpoints.
- MongoDB is the primary database.
- File uploads use cloud object storage, not MongoDB.
- Notifications use Firebase Cloud Messaging later in the flow.

### 1.1 Recommended Project Structure

```txt
hostel-saas/
  apps/
    web/                         # Next.js website + admin + API server
    mobile/                      # React Native / Expo app
  packages/
    shared/                      # shared types, constants, validation schemas
    database/                    # MongoDB connection, models, indexes
    ui/                          # optional shared UI components
  docs/
    phase-plan.md
    api-contracts.md
    db-schema.md
```

Inside `apps/web`:

```txt
src/
  app/
    (public)/                    # public hostel browsing website
    (platform-admin)/            # platform owner portal
    (hostel-admin)/              # hostel owner / warden portal
    (resident)/                  # resident web dashboard
    (guardian)/                  # guardian limited dashboard
    api/
      v1/                        # REST API for web + mobile
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

## 2. Backend Best Practices For This Project

### 2.1 API Pattern

Use clean REST APIs:

```txt
/api/v1/auth/login
/api/v1/auth/refresh
/api/v1/platform/hostels
/api/v1/hostels/:hostelId
/api/v1/hostel-admin/residents
/api/v1/resident/me
/api/v1/payments
/api/v1/complaints
/api/v1/maintenance/requests
```

Rules:

- Use `Route Handlers` for APIs.
- Use `Server Actions` only for simple web/admin form submission.
- Mobile app must never depend on Server Actions.
- Keep business logic inside `modules/*/*.service.ts`, not directly inside route files.

Bad:

```txt
app/api/v1/residents/route.ts     # 300 lines of business logic
```

Good:

```txt
app/api/v1/residents/route.ts     # calls resident.service.ts
modules/residents/resident.service.ts
modules/residents/resident.validation.ts
modules/residents/resident.permissions.ts
```

### 2.2 Multi-Tenant Rule

Every hostel-scoped document must have:

```txt
hostelId
createdBy
updatedBy
createdAt
updatedAt
status
```

Examples:

- Room belongs to one hostel.
- Bed belongs to one hostel.
- Resident belongs to one hostel.
- Payment belongs to one hostel and one resident.
- Complaint belongs to one hostel and one resident.
- Maintenance request belongs to one hostel.

No hostel admin should ever access another hostel's data.

### 2.3 Role-Based Access Control

Minimum roles:

```txt
PLATFORM_OWNER
HOSTEL_OWNER
HOSTEL_ADMIN
WARDEN
RESIDENT
GUARDIAN
SERVICE_PROVIDER
PUBLIC_USER
```

Permission check must happen on every protected endpoint.

Example:

```txt
Can hostel admin view resident?
1. Is user authenticated?
2. Is user role HOSTEL_OWNER / HOSTEL_ADMIN / WARDEN?
3. Does user.hostelId match resident.hostelId?
4. If yes, allow. Else reject.
```

### 2.4 Authentication Direction

Use custom auth because web and mobile both need clean support.

Recommended:

- Everyone can create a normal app account.
- Signup methods:
  - Phone number + OTP verification + password.
  - Email + email OTP verification + password.
  - Google sign-in/signup.
- Login methods:
  - Phone number + password.
  - Email + password.
  - Google sign-in.
- A newly registered public account starts as `PUBLIC_USER` unless an admin has assigned another role or the account activates a resident profile.
- Resident private portal access is not granted by normal signup alone. The resident must first log in with a normal account, then scan or enter the admin-issued resident activation QR/code.
- JWT access token.
- Refresh token.
- Web stores refresh token in secure HTTP-only cookie.
- Mobile stores refresh token in secure storage.
- Passwords hashed using bcrypt or Argon2.
- Device/session table for logout and token rotation.
- OTP challenges must be short-lived, single-purpose, rate-limited, and stored hashed.
- Google accounts should be linked by provider ID and verified email, not by trusting client-provided profile data alone.

### 2.5 File Upload Rule

Do not store images or PDFs inside MongoDB.

Use object storage:

- Hostel photos
- Food photos
- Room photos
- Payment proofs
- Owner documents
- Service provider optional documents
- Complaint attachments

Store only metadata in MongoDB:

```txt
fileUrl
fileKey
mimeType
size
uploadedBy
linkedEntityType
linkedEntityId
```

### 2.6 API Response Standard

All APIs should return the same structure.

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

### 2.7 Audit Log Rule

Create audit logs for important actions:

- Hostel approved/rejected
- Resident created
- Room assigned
- Payment marked paid
- Payment proof approved/rejected
- Complaint status changed
- Maintenance request updated
- Night status manually changed
- Service provider approved/rejected

---

## 3. Team Work Lanes

Because the team is large, work should run in parallel lanes.

| Lane | Main Responsibility |
|---|---|
| Product/PM | Requirements, flow confirmation, acceptance criteria, phase control |
| UI/UX | Wireframes, dashboard layouts, mobile screens, design system |
| Backend/API | Mongo models, services, APIs, auth, RBAC, multi-tenancy |
| Web Frontend | Public website, platform admin, hostel admin, resident web, guardian web |
| Mobile App | Public browsing, resident dashboard, QR activation, notifications |
| QA | Test cases, regression, role testing, security edge cases |
| DevOps | Hosting, environment variables, CI/CD, database backup, logs |
| Data/Security | Privacy rules, tenant isolation, audit logs, document access control |

---

## 4. Phase Overview

The phases below are ordered by dependency, not by ego. Some work can happen in parallel, but no team should skip the foundation.

| Phase | Name | Main Output |
|---|---|---|
| Phase 0 | Planning + Architecture Lock | Contracts, schema, UI map, repo structure |
| Phase 1 | Foundation + Auth + Tenant Core | Working app shell, auth, roles, Mongo models, admin base |
| Phase 2 | Public Portal + Hostel Core | Hostel listing, hostel profile, inquiries, hostel admin core |
| Phase 3 | Resident System + Payments + Food | Resident registration, QR activation, dashboard, fee records, food/menu |
| Phase 4 | Daily Operations + Trust + Safety | Complaints, notices, night status, SOS, guardian dashboard, move-in/out |
| Phase 5 | Maintenance Network + Growth + Reports + Polish | Service providers, maintenance requests, comparison, referrals, reports, production hardening |

---

# Phase 0 — Planning + Architecture Lock

**Target:** Day 1 to Day 2  
**Goal:** Remove confusion before coding starts.

## 0.1 Outputs

- Final module list
- Final role list
- Final database entity list
- API naming convention
- UI sitemap
- Mobile screen list
- Environment setup plan
- Git branching strategy
- Definition of done for every phase

## 0.2 Required Decisions

| Decision | Final Direction |
|---|---|
| Backend | Next.js Route Handlers |
| Database | MongoDB |
| API Style | REST `/api/v1` |
| Mobile API | Same API as web |
| Auth | Custom JWT + refresh token |
| Uploads | Object storage |
| Notifications | FCM after core system |
| Payments | Manual proof first, gateway later |
| Location | Basic maps first, advanced distance later |

## 0.3 UI Sitemap

```txt
Public Website
  Home
  Hostel Listing
  Hostel Detail
  Compare Hostels
  Inquiry Form
  Service Provider Registration

Platform Owner Portal
  Dashboard
  Hostel Approvals
  Hostel Verification
  Users
  Service Providers
  Payments/Subscriptions
  Reports
  Reviews Moderation
  Abuse/Flags

Hostel Admin/Warden Portal
  Dashboard
  Hostel Profile
  Rooms & Beds
  Residents
  Inquiries
  Payments
  Food
  Notices
  Complaints
  Night Status
  Move-In/Move-Out
  Maintenance
  Reports

Resident Portal
  Dashboard
  My Profile
  Food Menu
  Payments
  Payment Proof Upload
  Notices
  Complaints
  Night Status
  SOS
  Reviews
  Referral

Guardian Portal
  Fee Summary
  Notices
  Food View
  Safety Summary
  Emergency Contact
```

## 0.4 Phase 0 Done Means

- Every team knows what they own.
- API and model naming is fixed.
- UI routes are fixed.
- No one starts random disconnected modules.

---

# Phase 1 — Foundation + Auth + Tenant Core

**Target:** Week 1  
**Goal:** Build the system backbone.

## 1.1 Backend Tasks

### Project Setup

- Setup Next.js App Router project.
- Setup TypeScript strict mode.
- Setup Tailwind CSS.
- Setup ESLint + Prettier.
- Setup environment variables.
- Setup MongoDB connection.
- Setup base API response helper.
- Setup global error handler pattern.
- Setup Zod validation.

### Auth Module

Build:

- Register platform owner seed account.
- Public account registration with phone OTP + password.
- Public account registration with email OTP + password.
- Google sign-in/signup.
- Login by phone + password.
- Login by email + password.
- Refresh token.
- Logout.
- OTP request, verification, expiry, resend, and rate-limit rules.
- Password hashing.
- Current user endpoint.
- Session/device storage.
- Provider account linking for Google.

APIs:

```txt
POST /api/v1/auth/otp/request
POST /api/v1/auth/otp/verify
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/google
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

Auth model additions:

```txt
User
Session
OtpChallenge
OAuthAccount
```

Rules:

- Registration does not automatically create a resident profile.
- Unlinked public users can browse, inquire, compare hostels, and register as service providers.
- Admin, warden, guardian, and service-provider roles still require admin/platform approval or controlled linking.
- Resident dashboard access requires a successful QR/code activation against an admin-created resident record.

### Role + Permission Module

Build:

- Role enum.
- Permission helper.
- Tenant access helper.
- Protected route middleware.
- Platform-only guard.
- Hostel-scoped guard.
- Resident-only guard.
- Guardian-only guard.

### Core Models

Create first models:

```txt
User
Hostel
HostelMember
RolePermission
AuditLog
FileAsset
Notification
```

### Platform Owner Base

Build:

- Platform owner dashboard shell.
- Hostel registration list placeholder.
- User management placeholder.
- Service provider placeholder.

## 1.2 Web Frontend Tasks

Build layouts:

- Public layout.
- Auth layout.
- Platform owner layout.
- Hostel admin layout.
- Resident layout.
- Guardian layout.

Build pages:

```txt
/login
/platform/dashboard
/hostel-admin/dashboard
/resident/dashboard
/guardian/dashboard
```

At this phase, dashboards can show placeholder cards, but route protection must work.

## 1.3 Mobile Tasks

Build:

- Expo app setup.
- Navigation structure.
- Login screen.
- Signup screen with phone OTP, email OTP, password, and Google options.
- OTP verification screen.
- Token storage.
- API client.
- Public mode shell.
- Resident mode shell.

## 1.4 QA Tasks

Test:

- Login works.
- Phone OTP registration works.
- Email OTP registration works.
- Google sign-in/signup works.
- Wrong password rejected.
- Unverified phone/email cannot complete account registration.
- Unauthorized user blocked.
- Platform route blocks hostel admin.
- Hostel route blocks resident.
- Token refresh works.
- Logout removes session.

## 1.5 Phase 1 Done Means

- The app has real auth.
- Role-based route access works.
- MongoDB is connected.
- Base layouts exist.
- API structure is clean.
- Future modules can plug into the same pattern.

---

# Phase 2 — Public Portal + Hostel Core

**Target:** Week 2  
**Goal:** Build hostel discovery and hostel admin core.

## 2.1 Platform Owner Hostel Approval

Build:

- Hostel owner registration/application.
- Hostel application review.
- Approve hostel.
- Reject hostel.
- Publish/unpublish listing.
- Basic verification status.

Models:

```txt
Hostel
HostelDocument
HostelVerification
HostelApplication
```

APIs:

```txt
POST /api/v1/platform/hostels
GET  /api/v1/platform/hostels
GET  /api/v1/platform/hostels/:id
PATCH /api/v1/platform/hostels/:id/approve
PATCH /api/v1/platform/hostels/:id/reject
PATCH /api/v1/platform/hostels/:id/publish
PATCH /api/v1/platform/hostels/:id/unpublish
```

## 2.2 Public Hostel Listing

Build:

- Public hostel listing page.
- Hostel detail page.
- Search by area/name.
- Filter by price range.
- Filter by boys/girls/co-living.
- Filter by room type.
- Filter by food/facility.
- Basic map/location field.
- Verification badge display.

APIs:

```txt
GET /api/v1/public/hostels
GET /api/v1/public/hostels/:slug
```

## 2.3 Inquiry Flow

Build:

- Public inquiry form.
- Inquiry appears in hostel admin dashboard.
- Hostel admin can mark inquiry status.
- Hostel admin can add follow-up note.

Models:

```txt
Inquiry
InquiryNote
```

APIs:

```txt
POST  /api/v1/public/hostels/:hostelId/inquiries
GET   /api/v1/hostel-admin/inquiries
PATCH /api/v1/hostel-admin/inquiries/:id/status
POST  /api/v1/hostel-admin/inquiries/:id/notes
```

## 2.4 Hostel Profile Management

Build admin form for:

- Hostel name.
- Hostel type.
- Location.
- Contact details.
- Rules.
- Facilities.
- Food details.
- Pricing/rent details.
- Photo gallery.
- Room/bed capacity summary.

APIs:

```txt
GET   /api/v1/hostel-admin/profile
PATCH /api/v1/hostel-admin/profile
POST  /api/v1/hostel-admin/profile/photos
DELETE /api/v1/hostel-admin/profile/photos/:photoId
```

## 2.5 Room + Bed Management

Build:

- Floor creation.
- Room creation.
- Bed creation.
- Assign bed status.
- Vacancy status.
- Room facilities.
- Repair status.
- Bed availability.

Models:

```txt
Floor
Room
Bed
```

APIs:

```txt
POST  /api/v1/hostel-admin/floors
GET   /api/v1/hostel-admin/floors
POST  /api/v1/hostel-admin/rooms
GET   /api/v1/hostel-admin/rooms
PATCH /api/v1/hostel-admin/rooms/:id
POST  /api/v1/hostel-admin/beds
PATCH /api/v1/hostel-admin/beds/:id
GET   /api/v1/hostel-admin/room-map
```

## 2.6 QA Tasks

Test:

- Only approved hostels appear publicly.
- Unpublished hostel is hidden.
- Inquiry goes to correct hostel only.
- Hostel admin cannot see another hostel's inquiry.
- Room/bed belongs to correct hostel.
- Public filters work.

## 2.7 Phase 2 Done Means

- Public can browse hostels.
- Hostel profile pages exist.
- Inquiry flow works.
- Hostel admin can manage profile.
- Room/bed system works.
- Multi-tenant separation is verified.

---

# Phase 3 — Resident System + Payments + Food

**Target:** Week 3  
**Goal:** Build the resident daily-use foundation.

## 3.1 Resident Registration

Important rule: resident registration is admin-controlled.

This means public users can create normal app accounts, but they cannot create their own resident record or enter a private resident portal by signup alone.

Build:

- Add resident manually.
- Add guardian contact.
- Add emergency contact.
- Assign room/bed.
- Move-in date.
- Deposit amount.
- Resident status.
- Resident private profile.

Models:

```txt
Resident
Guardian
EmergencyContact
ResidentDocument
```

APIs:

```txt
POST  /api/v1/hostel-admin/residents
GET   /api/v1/hostel-admin/residents
GET   /api/v1/hostel-admin/residents/:id
PATCH /api/v1/hostel-admin/residents/:id
PATCH /api/v1/hostel-admin/residents/:id/status
```

## 3.2 QR Activation

Private resident portal access happens through activation, not through normal login alone.

Build:

- Generate one-time QR/code after resident registration.
- Resident first logs in with any normal account created by phone OTP, email OTP, password, or Google.
- Logged-in resident scans QR or enters code from the admin.
- Current user account gets linked to the hostel and resident profile.
- Linked account receives resident access for that hostel.
- QR expires after use or timeout.
- Admin can regenerate activation code.
- Used QR stores `usedBy`, `usedAt`, device/session context, and audit metadata.
- Prevent one active resident profile from being claimed by multiple accounts unless admin explicitly resets activation.
- Prevent one account from claiming multiple active resident profiles unless a future multi-resident-account rule is deliberately added.

Models:

```txt
QRActivation
Resident
User
```

APIs:

```txt
POST /api/v1/hostel-admin/residents/:id/activation-code
POST /api/v1/resident/activate
GET  /api/v1/resident/activation-status
GET  /api/v1/resident/me
```

## 3.3 Resident Dashboard

Build web + mobile resident dashboard:

- My hostel summary.
- My room/bed.
- Fee status.
- Notices.
- Food menu.
- Complaint shortcut.
- SOS shortcut.
- Night status summary.

APIs:

```txt
GET /api/v1/resident/dashboard
GET /api/v1/resident/profile
```

## 3.4 Payment Records

Initial version is manual proof-based.

Build:

- Monthly fee record.
- Paid/unpaid/partial/overdue status.
- Due amount.
- Security deposit.
- Cash record.
- Manual method record: eSewa, Fonepay, Khalti, bank, cash.
- Receipt generation data.
- Payment proof upload.
- Admin proof approval/rejection.

Models:

```txt
Payment
PaymentProof
Receipt
DepositRecord
```

APIs:

```txt
POST  /api/v1/hostel-admin/payments
GET   /api/v1/hostel-admin/payments
PATCH /api/v1/hostel-admin/payments/:id
POST  /api/v1/resident/payments/:paymentId/proof
GET   /api/v1/resident/payments
PATCH /api/v1/hostel-admin/payment-proofs/:id/approve
PATCH /api/v1/hostel-admin/payment-proofs/:id/reject
GET   /api/v1/resident/receipts/:id
```

## 3.5 Food Transparency

Build:

- Weekly menu.
- Daily menu.
- Breakfast/lunch/snacks/dinner timing.
- Food photo upload.
- Food feedback/rating.
- Food complaint link.

Models:

```txt
FoodMenu
FoodPhoto
FoodFeedback
```

APIs:

```txt
POST  /api/v1/hostel-admin/food/menu
GET   /api/v1/hostel-admin/food/menu
PATCH /api/v1/hostel-admin/food/menu/:id
POST  /api/v1/hostel-admin/food/photos
GET   /api/v1/resident/food
POST  /api/v1/resident/food/feedback
```

## 3.6 Notice System

Build:

- Hostel notice creation.
- Notice categories.
- Resident notice feed.
- Guardian notice feed later.
- Read/unread status.

Models:

```txt
Notice
NoticeReadStatus
```

APIs:

```txt
POST /api/v1/hostel-admin/notices
GET  /api/v1/hostel-admin/notices
GET  /api/v1/resident/notices
PATCH /api/v1/resident/notices/:id/read
```

## 3.7 Mobile Tasks

Build:

- QR scan screen.
- Resident activation flow after normal account login.
- Activation status / already linked state.
- Resident dashboard.
- Food view.
- Payment view.
- Payment proof upload.
- Notices list.

## 3.8 QA Tasks

Test:

- Resident cannot self-register directly.
- Public account signup does not create resident access.
- QR activation requires a logged-in account.
- Activation code works once only.
- Used/expired activation code is rejected.
- Resident sees only own profile.
- Resident cannot see another resident payment.
- Payment proof goes to correct hostel.
- Admin can approve/reject payment proof.
- Food menu visible to correct residents.

## 3.9 Phase 3 Done Means

- Hostel admin can register residents.
- Resident can activate dashboard.
- Payment tracking works.
- Payment proof upload works.
- Food transparency works.
- Notices work.
- Mobile app has daily-use basics.

---

# Phase 4 — Daily Operations + Trust + Safety

**Target:** Week 4  
**Goal:** Build operational modules that make the platform useful every day.

## 4.1 Complaint System

Build:

- Complaint categories.
- Optional image attachment.
- Anonymous option for sensitive complaints.
- Status: pending, in progress, resolved, rejected.
- Admin response.
- Resident confirmation after resolution.
- SLA timer.
- Complaint report summary.

Models:

```txt
Complaint
ComplaintUpdate
ComplaintAttachment
```

APIs:

```txt
POST  /api/v1/resident/complaints
GET   /api/v1/resident/complaints
GET   /api/v1/hostel-admin/complaints
PATCH /api/v1/hostel-admin/complaints/:id/status
POST  /api/v1/hostel-admin/complaints/:id/reply
PATCH /api/v1/resident/complaints/:id/confirm-resolution
```

## 4.2 Night Safety Status

This must be privacy-first, not prisoner tracking.

Build status only:

```txt
INSIDE_HOSTEL
OUTSIDE_HOSTEL
NOT_VERIFIED
MARKED_SAFE
SOS_TRIGGERED
```

Rules:

- No public visibility.
- Resident sees own status.
- Hostel admin sees status summary for residents of own hostel.
- Guardian sees only limited summary if enabled.
- Exact GPS should not be shown in dashboard.
- Warden can manually correct false status with reason.

Models:

```txt
NightStatus
NightStatusLog
ManualStatusOverride
```

APIs:

```txt
POST  /api/v1/resident/night-status
GET   /api/v1/resident/night-status
GET   /api/v1/hostel-admin/night-status
PATCH /api/v1/hostel-admin/night-status/:residentId/override
```

## 4.3 SOS / Emergency

Build:

- Resident SOS button.
- Alert to hostel admin/warden.
- Optional guardian alert.
- Emergency contact list.
- Incident log.
- Nearby hospital/clinic/police/ambulance info can be added manually first.

Models:

```txt
SOSAlert
EmergencyContact
IncidentLog
```

APIs:

```txt
POST /api/v1/resident/sos
GET  /api/v1/hostel-admin/sos-alerts
PATCH /api/v1/hostel-admin/sos-alerts/:id/status
GET  /api/v1/resident/emergency-contacts
```

## 4.4 Guardian Dashboard

Build limited view:

- Fee summary.
- Paid/unpaid/due status.
- Receipts summary.
- Hostel notices.
- Food menu/photos.
- Emergency contact button.
- Night safety summary only.
- Complaint status only if student allows.

Models:

```txt
GuardianAccess
GuardianPermission
```

APIs:

```txt
POST /api/v1/hostel-admin/residents/:id/guardian-access
POST /api/v1/guardian/login
GET  /api/v1/guardian/dashboard
GET  /api/v1/guardian/payments
GET  /api/v1/guardian/notices
GET  /api/v1/guardian/food
GET  /api/v1/guardian/safety-summary
```

## 4.5 Move-In / Move-Out Checklist

Build:

- Move-in documents collected.
- Room photos.
- Bed/table/cupboard condition.
- Items provided.
- Deposit record.
- Rules accepted.
- Move-out pending fee check.
- Damage check.
- Item return check.
- Deposit refund decision.
- Final receipt.

Models:

```txt
MoveInChecklist
MoveOutChecklist
RoomConditionPhoto
ProvidedItem
DepositRefund
```

APIs:

```txt
POST /api/v1/hostel-admin/residents/:id/move-in
GET  /api/v1/hostel-admin/residents/:id/move-in
POST /api/v1/hostel-admin/residents/:id/move-out
GET  /api/v1/hostel-admin/residents/:id/move-out
```

## 4.6 Ratings and Reviews

Build:

- Only verified current/past residents can review.
- One review per resident per hostel.
- Rating categories.
- Platform owner moderation.
- Public rating summary.

Models:

```txt
RatingReview
ReviewModerationLog
```

APIs:

```txt
POST  /api/v1/resident/reviews
GET   /api/v1/public/hostels/:id/reviews
GET   /api/v1/platform/reviews
PATCH /api/v1/platform/reviews/:id/hide
PATCH /api/v1/platform/reviews/:id/unhide
```

## 4.7 Notifications Foundation

Build:

- In-app notification table.
- Notification bell.
- User notification feed.
- Event-based notification creation.
- FCM token save from mobile.

Models:

```txt
Notification
DeviceToken
```

APIs:

```txt
GET  /api/v1/notifications
PATCH /api/v1/notifications/:id/read
POST /api/v1/mobile/device-token
```

## 4.8 QA Tasks

Test:

- Complaint privacy.
- Anonymous complaint rules.
- Night status does not leak GPS.
- Guardian cannot see full movement history.
- SOS creates alert correctly.
- Move-out checklist updates resident status.
- Only verified residents can review.

## 4.9 Phase 4 Done Means

- Daily hostel operations work.
- Residents can report issues.
- Admin can manage complaints.
- Safety status exists without privacy abuse.
- Guardian dashboard is limited and trust-focused.
- Emergency/SOS flow exists.
- Reviews are verified.

---

# Phase 5 — Maintenance Network + Growth + Reports + Production Polish

**Target:** Week 5  
**Goal:** Complete unique modules, growth features, reports, and production hardening.

## 5.1 Service Provider Registration

Build public side-hustle page for:

- Plumber
- Electrician
- Doctor/clinic/health contact
- Internet/network technician
- Cleaner
- Carpenter
- Painter
- Water supplier
- Appliance repair
- Room repair worker
- Other local workers

Fields:

- Full name.
- Phone number.
- Service category.
- Area/location.
- Availability.
- Description/experience.
- Optional photo.
- Optional document.
- Active/inactive status.

Models:

```txt
ServiceProvider
ServiceProviderApplication
ServiceProviderDocument
```

APIs:

```txt
POST  /api/v1/public/service-providers/register
GET   /api/v1/platform/service-providers
PATCH /api/v1/platform/service-providers/:id/approve
PATCH /api/v1/platform/service-providers/:id/reject
PATCH /api/v1/platform/service-providers/:id/hide
```

## 5.2 Hostel Maintenance Module

Build:

- Search providers by category/location/availability.
- View approved provider profile.
- Create maintenance request.
- Link request to room/bed if needed.
- Contact provider manually.
- Track request status.
- Add cost note.
- Add remarks.
- Maintain service history.

Status:

```txt
PENDING
CONTACTED
SCHEDULED
COMPLETED
CANCELLED
```

Models:

```txt
MaintenanceRequest
MaintenanceHistory
MaintenanceComment
```

APIs:

```txt
GET   /api/v1/hostel-admin/service-providers
GET   /api/v1/hostel-admin/service-providers/:id
POST  /api/v1/hostel-admin/maintenance/requests
GET   /api/v1/hostel-admin/maintenance/requests
PATCH /api/v1/hostel-admin/maintenance/requests/:id/status
POST  /api/v1/hostel-admin/maintenance/requests/:id/comment
```

## 5.3 Hostel Comparison

Build:

- Compare 2-3 hostels.
- Compare monthly fee.
- Compare distance/location text.
- Compare room type/vacancy.
- Compare food score.
- Compare facilities.
- Compare verification badge.
- Compare rating summary.

APIs:

```txt
GET /api/v1/public/hostels/compare?ids=id1,id2,id3
```

## 5.4 Referral System

Build:

- Resident referral code.
- Referral link.
- Inquiry with referral code.
- Admin confirms referred resident joined.
- Reward status tracking.

Models:

```txt
ReferralCode
Referral
ReferralReward
```

APIs:

```txt
GET  /api/v1/resident/referral
POST /api/v1/public/inquiries/with-referral
GET  /api/v1/hostel-admin/referrals
PATCH /api/v1/hostel-admin/referrals/:id/confirm
```

## 5.5 Duplicate / Ghost Listing Detection

Build manual-flag first.

Signals:

- Same address.
- Same phone.
- Same owner document.
- Similar hostel name in same area.
- Same photo hash later.

Models:

```txt
ListingFlag
DuplicateCheckResult
```

APIs:

```txt
GET   /api/v1/platform/listing-flags
POST  /api/v1/platform/hostels/:id/run-duplicate-check
PATCH /api/v1/platform/listing-flags/:id/resolve
```

## 5.6 Reports

Build basic reports:

Platform owner:

- Total hostels.
- Pending approvals.
- Active residents.
- Inquiries.
- Service providers.
- Complaints.
- Platform payments/subscriptions.

Hostel admin:

- Residents.
- Vacant beds.
- Monthly dues.
- Pending payment proofs.
- Complaints.
- Maintenance requests.
- Food feedback.
- Night status summary.

APIs:

```txt
GET /api/v1/platform/reports/dashboard
GET /api/v1/hostel-admin/reports/dashboard
GET /api/v1/hostel-admin/reports/payments
GET /api/v1/hostel-admin/reports/complaints
GET /api/v1/hostel-admin/reports/maintenance
```

## 5.7 Production Hardening

Must complete before client handover:

- Environment variables separated by dev/staging/prod.
- MongoDB indexes created.
- API rate limit for public forms.
- Upload size limits.
- Image validation.
- Error logging.
- Audit logs.
- Role-based tests.
- Tenant isolation tests.
- Seed data script.
- Backup plan.
- Admin account recovery flow.
- Security check for private documents.
- Remove debug logs.
- Mobile app build test.
- Web deployment test.

## 5.8 QA Tasks

Test:

- Service provider approval flow.
- Hostel admin sees only approved providers.
- Maintenance request links to correct hostel.
- Referral cannot be abused repeatedly.
- Comparison only shows public data.
- Reports do not leak other hostel data.
- Public forms are rate-limited.

## 5.9 Phase 5 Done Means

- Maintenance and service-provider network works.
- Growth features work.
- Reports work.
- System is ready for pilot hostel onboarding.
- Client can see a connected production-ready flow.

---

# 6. Suggested 5-Week Calendar

This is a large-team delivery plan. Some tasks overlap, but backend contracts must be respected.

| Week | Backend/API | Web/Admin | Mobile | QA/DevOps |
|---|---|---|---|---|
| Week 1 | Auth, roles, Mongo, tenant guards, base models | Layouts, dashboards shell, login | App shell, login, API client | Env setup, test plan, CI basics |
| Week 2 | Hostel, room, bed, inquiry APIs | Public listing, hostel profile, hostel admin core | Public browse screens | Tenant tests, listing tests |
| Week 3 | Resident, QR, payments, food, notices APIs | Resident admin, payment admin, food admin | QR activation, resident dashboard, payments, food | Resident privacy tests |
| Week 4 | Complaints, night status, SOS, guardian, reviews | Complaint dashboard, guardian dashboard, safety screens | Complaints, SOS, notices | Privacy/security regression |
| Week 5 | Maintenance, service providers, reports, referral, comparison | Maintenance UI, reports, polish | Notifications, final app flows | Production hardening, deployment, handover |

---

# 7. Module Dependency Map

Do not build modules randomly. Follow dependencies.

```txt
Auth + Roles + Tenant Guard
  -> Hostel Approval
    -> Public Listing
    -> Hostel Admin Profile
      -> Rooms + Beds
        -> Resident Registration
          -> QR Activation
            -> Resident Dashboard
              -> Payments
              -> Food
              -> Notices
              -> Complaints
              -> Night Status
              -> SOS
              -> Guardian Dashboard
              -> Reviews
      -> Maintenance Requests
        -> Service Provider Network
  -> Reports
  -> Notifications
```

---

# 8. Core MongoDB Collections

Minimum collections:

```txt
users
sessions
hostels
hostel_members
hostel_documents
hostel_verifications
floors
rooms
beds
residents
guardians
guardian_access
inquiries
qr_activations
payments
payment_proofs
receipts
food_menus
food_photos
food_feedback
notices
notice_read_status
complaints
complaint_updates
night_statuses
night_status_logs
sos_alerts
move_in_checklists
move_out_checklists
rating_reviews
service_providers
service_provider_applications
maintenance_requests
maintenance_histories
referral_codes
referrals
notifications
device_tokens
platform_payments
audit_logs
file_assets
listing_flags
```

---

# 9. Critical Data Privacy Rules

These rules are not optional.

| Rule | Implementation |
|---|---|
| Resident data is private | Resident endpoints return only own data |
| Hostel admin data is scoped | Every query filters by `hostelId` |
| Guardian has limited access | Guardian sees summary, not full private profile |
| Night status is not tracking | Show status only, not full live movement history |
| Service provider cannot access resident data | Service provider is only a listed contact/profile |
| Documents are private | Owner docs/payment proofs are protected files |
| Platform owner has support access | Every sensitive access should be audit-logged |

---

# 10. Definition of Done For Any Module

A module is not complete just because UI is visible.

A module is complete only when:

- Database model exists.
- Validation exists.
- API endpoints exist.
- Permissions are enforced.
- Tenant isolation is enforced.
- UI is connected to real API.
- Empty/loading/error states exist.
- Basic tests are done.
- Audit log exists for sensitive actions.
- Mobile API compatibility is considered.
- QA has tested role-based access.

---

# 11. First Production Pilot Scope

For first real hostel pilot, these must work fully:

- Platform owner login.
- Hostel creation and approval.
- Public hostel listing.
- Hostel profile page.
- Inquiry flow.
- Room/bed management.
- Resident manual registration.
- QR activation.
- Resident dashboard.
- Payment record.
- Payment proof upload.
- Food menu/photos.
- Notices.
- Complaints.
- Night status summary.
- SOS contact.
- Maintenance request.
- Service provider search.
- Basic reports.

These can be polished after pilot:

- Advanced duplicate photo detection.
- Automated payment gateway.
- Advanced map distance calculation.
- WhatsApp/SMS automation.
- Advanced analytics.
- Reward automation.
- Government-level compliance claims.

---

# 12. Development Rules For The Team

## 12.1 Do Not Break API Contracts

Once mobile app starts consuming an endpoint, do not casually rename fields.

Use versioning:

```txt
/api/v1
/api/v2 later if required
```

## 12.2 Every Collection Must Have Indexes

Examples:

```txt
hostels: slug, status, location.area
residents: hostelId, phone, status
payments: hostelId, residentId, month, status
complaints: hostelId, residentId, status
maintenance_requests: hostelId, status, category
service_providers: category, area, status
```

## 12.3 Use Soft Delete For Important Records

Do not hard delete sensitive records like:

- Residents
- Payments
- Complaints
- Maintenance history
- Hostel documents
- Service provider applications

Use:

```txt
isDeleted
deletedAt
deletedBy
```

## 12.4 Keep Public Data Separate From Private Data

Public hostel response should not include:

- Owner citizenship document
- Resident data
- Payment data
- Guardian contact
- Internal notes
- Private audit logs

## 12.5 Build For Nepal Reality

The product should handle:

- Manual payments.
- Phone-based communication.
- Warden-managed registration.
- Local service providers.
- Hostel-specific rules.
- Mixed technical skill level of hostel owners.
- Privacy concerns from students.

---

# 13. Handover Checklist

Before giving to client/team:

- `.env.example` created.
- Setup guide written.
- Admin seed command added.
- Database indexes command added.
- Demo data seed added.
- API documentation added.
- Role permission matrix added.
- Deployment guide added.
- Backup/restore guide added.
- Known limitations documented.
- First 3-month maintenance/support terms documented separately.

---

# 14. Final Recommendation

Build this as a **Next.js + MongoDB modular SaaS**.

Do not treat it as a simple website.

The correct development mindset is:

```txt
One product.
Multiple portals.
One clean API layer.
One tenant-safe database.
One shared permission system.
Many modules built phase by phase.
```

This roadmap keeps the project steady, connected, and production-focused while allowing a large team to work in parallel.
