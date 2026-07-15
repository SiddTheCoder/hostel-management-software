# Multi-Hostel SaaS Platform - Final Source of Truth

**Version:** 1.0  
**Project Start Date:** 22 June 2026  
**Timeline Target:** 5 weeks  
**Prepared for:** Development planning and implementation  

This document is the single source of truth for the Multi-Hostel SaaS Platform. It explains the product, portals, roles, features, flows, privacy rules, and implementation scope.

---

## 1. Product Summary

The platform is a Multi-Hostel SaaS system for Nepal-focused hostel discovery and hostel management.

It helps:

- Students find, compare, and join hostels.
- Hostel owners/admins manage residents, rooms, fees, food, notices, complaints, attendance/night status, and maintenance.
- Platform owner manage all hostels, approvals, subscriptions, reports, and verification.
- Residents use a private dashboard after joining a hostel.
- Guardians get limited trust/safety/payment visibility where enabled.
- Local service providers register for side-hustle/service opportunities such as plumber, electrician, doctor/clinic, cleaner, internet technician, repair worker, etc.

The platform will be delivered as:

| Product | Purpose |
|---|---|
| Website | Public hostel discovery, full web access, admin panels, and dashboards |
| Mobile App | Resident/public app with QR activation, notifications, and mobile-first daily use |
| Backend/API | Auth, database, multi-tenant logic, payments, notifications, uploads, reports |
| Database | Hostels, users, rooms, residents, fees, attendance, complaints, service providers, etc. |
| File Storage | Hostel images, food photos, documents, payment proofs, room photos, etc. |

---

## 2. Core Product Principle

This is not just a listing website.

It is a complete SaaS platform with:

- Public hostel discovery
- Multi-hostel management
- Role-wise dashboards
- Private resident data
- Payment/fee records
- Room and bed management
- Food transparency
- Attendance/night safety status
- Complaint and issue handling
- Maintenance & Local Service Provider Network inside Hostel Admin/Warden portal
- Verification and anti-fake-listing controls
- Ratings and trust-building tools

---

## 3. Main Portals

| Portal | Main Users | Purpose |
|---|---|---|
| Public Portal | Students, guardians, public visitors | Browse hostels, compare, view hostel details, submit inquiry |
| Platform Owner Portal | Platform owner / super admin | Control whole platform, approve hostels, manage reports, verification, subscriptions, service providers |
| Hostel Admin / Warden Portal | Hostel owner, admin, warden | Manage one hostel: residents, rooms, payments, food, notices, attendance, complaints, maintenance |
| Resident Portal | Registered student/resident | View own hostel dashboard, fees, food, notices, complaints, attendance/night status |
| Guardian Access / Dashboard | Parent/guardian | Limited safety, fee, notice, and contact visibility where enabled |
| Service Provider / Side-Hustle Page | Plumbers, electricians, doctors/clinics, technicians, cleaners, local workers | Register service category, phone number, area, availability, and basic details for hostel maintenance requests |

---

## 4. User Roles

### 4.1 Platform Owner / Super Admin

Can manage the whole platform.

Key responsibilities:

- Approve or reject hostel registrations
- Verify hostel owner identity and documents
- Control hostel listings
- Manage platform users
- View platform-wide reports
- Manage subscriptions/setup payments from hostel owners
- Moderate ratings/reviews
- Manage service provider listings
- Review duplicate or suspicious hostel listings
- Send platform-wide announcements

---

### 4.2 Hostel Owner / Hostel Admin

Can manage only their own hostel.

Key responsibilities:

- Manage hostel profile
- Manage rooms and beds
- Register residents manually
- Generate resident QR activation
- Track fees, deposits, dues, receipts, and payment proofs
- Manage food schedule and food photos
- View attendance/night status
- Handle complaints
- Send notices
- Manage move-in/move-out records
- Search service providers for maintenance work
- Create and track maintenance requests

---

### 4.3 Warden / Staff

Works under a hostel admin.

Possible permissions:

- Register residents
- Assign rooms/beds
- Update attendance/night status if needed
- Upload food photos/menu updates
- Send hostel notices
- Handle inquiries
- Update complaint status
- Create maintenance requests
- Contact approved service providers

Permission level can be controlled by the hostel admin.

---

### 4.4 Resident / Student

A registered student inside one hostel.

Can access:

- Own profile
- Own hostel details
- Fee status and receipts
- Food schedule and photos
- Notices
- Complaint system
- Attendance/night status summary
- SOS/emergency contacts
- Rating/review system
- Referral code/link if enabled

Residents cannot see other residents' private details.

---

### 4.5 Public Visitor

A user who has not joined any hostel.

Can:

- Browse hostel listings
- Filter and search hostels
- Compare hostels
- View hostel profile pages
- Submit inquiry/interest form
- Call/contact hostel where allowed

Public visitors cannot access resident dashboards.

---

### 4.6 Guardian

Guardian access is limited and privacy-first.

Can see where enabled:

- Fee status summary
- Paid/unpaid/due status
- Receipt/payment summary
- Hostel notices
- Food menu/photos
- Emergency contact button
- Night safety summary only
- Complaint status only if student chooses to share

Guardian must not see full live movement history.

---

### 4.7 Service Provider / Side-Hustle Worker

Local worker or professional who registers to provide service to hostels.

Examples:

- Plumber
- Electrician
- Doctor/clinic/health contact
- Internet/network technician
- Cleaner
- Carpenter
- Painter
- Water supplier
- Room repair worker
- Appliance repair technician
- Other local maintenance worker

Can register:

- Name
- Phone number
- Service category
- Area/location
- Availability/time preference
- Experience/description
- Optional photo/document

Service providers do not get access to resident private data.

---

## 5. Public Portal Features

| Feature | Description |
|---|---|
| Hostel listing | Public users can browse all active hostels |
| Hostel profile page | Photos, facilities, rooms, food, rules, location, ratings, and basic details |
| Search/filter | Search by area, price, room type, gender type, food, facilities, college/institute nearby |
| College/institute nearby matching | Search hostel by college, institute, exam center, area, or daily travel distance |
| Map/location view | Hostel location, nearby area, approximate direction/travel time |
| Hostel comparison | Compare up to 2-3 hostels side by side |
| Inquiry form | Submit interest/inquiry to specific hostel |
| Public rating display | Show resident-based ratings where available |
| Verification badge/status | Show platform verification or document-upload status where applicable |
| Service provider registration page | Local service providers can register their details for hostel maintenance network |

---

## 6. Platform Owner Portal Features

| Module | Features |
|---|---|
| Dashboard | Total hostels, total residents, inquiries, payments, reports |
| Hostel approval | Approve/reject hostel registrations |
| Owner verification | Review citizenship, ownership/rental proof, phone OTP status |
| Listing control | Publish, unpublish, edit, disable hostel listings |
| Duplicate/ghost listing detection | Flag same address, same phone, same photos, same owner document, similar listing |
| Subscription/billing | Track hostel setup/subscription/payment status |
| Review moderation | Hide abusive or fake reviews |
| Reports | Platform-wide hostel, payment, inquiry, resident, and complaint reports |
| Announcement | Send platform-level updates |
| Service provider management | Approve/reject/hide service provider registrations |
| Abuse/spam control | Block suspicious hostel owners, service providers, or fake submissions |

---

## 7. Hostel Admin / Warden Portal Features


### Hostel Feature Index - Admin/Warden Scope

| Hostel Feature | What Hostel Admin/Warden Gets |
|---|---|
| Hostel profile | Manage hostel details, facilities, photos, rules, location, and pricing |
| Room + bed map | Manage floors, rooms, beds, vacancy, assignments, room condition, and repair status |
| Resident management | Register residents manually, assign rooms, manage guardian/emergency/contact details |
| QR activation | Generate one-time QR/code activation for resident app/web dashboard |
| Payments | Track fees, deposits, due amounts, receipts, payment proofs, and reminders |
| Food transparency | Upload food menu, timings, photos, and view food feedback |
| Notices | Send general, fee, food, rule, and emergency notices |
| Complaints | Receive, update, resolve, and report resident complaints/issues |
| Attendance/night safety | View Inside Hostel / Outside Hostel / Not Verified status with privacy-first rules |
| Move-in/move-out | Record joining condition, provided items, deposit, damage, exit, and refund details |
| **Maintenance & Local Service Provider Network** | **Find plumbers, electricians, doctors/clinics, cleaners, internet technicians, repair workers, and other local providers; create maintenance requests; contact provider; track status and basic service history.** |

### 7.1 Hostel Profile Management

- Hostel name
- Hostel type
- Boys/girls/co-living type if applicable
- Location and map pin
- Contact details
- Photos/gallery
- Rules
- Facilities
- Parking/garden/water/Wi-Fi details
- Room and bed capacity
- Food details
- Pricing/rent details

---

### 7.2 Room + Bed Digital Map

Purpose: show rooms and beds visually/structurally instead of only writing total rooms.

Features:

- Floor-wise room list
- Room type: 1-seater, 2-seater, 3-seater, 4-seater
- Bed assignment
- Vacancy status: available, full, reserved, under repair
- Rent per bed/room type
- Facilities per room
- Attached bathroom/cupboard/table/balcony status
- Roommate list visible after joining
- Maintenance status per room/bed

---

### 7.3 Resident Management

- Manual resident registration by admin/warden
- Full legal name
- Phone number
- Guardian contact
- Education/study information
- Emergency contact
- Room/bed assignment
- Move-in date
- Deposit amount
- Status: active, moved out, pending, inactive
- Resident profile is hostel-locked

Important rule: resident registration is admin-controlled, not open self-signup.

---

### 7.4 QR Activation

Flow:

1. Hostel admin/warden registers resident.
2. System generates unique QR/code.
3. Resident scans QR in mobile app or enters activation code on web.
4. Resident account becomes connected to that hostel only.
5. App/web dashboard switches from public mode to resident dashboard.

QR is one-time activation unless resident logs out or resets device.

---

### 7.5 Payments & Records

Features:

- Monthly fee tracking
- Paid/unpaid/partial/overdue status
- Due amount
- Security deposit tracking
- Deposit deduction/refund status
- Payment proof upload
- Admin verification of uploaded proof
- Digital/PDF receipt
- Payment reminders
- Payment history
- Optional late fee rule

Payment method:

- Initial version: manual payment proof for eSewa, Fonepay, Khalti, bank transfer, cash record
- Later version: automated gateway after merchant account/API approval

---

### 7.6 Food Quality Proof System

Features:

- Weekly food menu
- Daily food menu
- Food timing: breakfast, lunch, snacks, dinner
- Daily food photo upload
- Food quality rating by residents
- Food complaint options
- Veg/non-veg/special day/festival menu notes
- Monthly food score/trend

Purpose:

- Students and guardians can trust food transparency.
- Hostel can prove good food quality.
- Food complaints can be fixed before public bad reviews.

---

### 7.7 Notices and Updates

Features:

- Hostel notices
- Fee notices
- Holiday notices
- Food menu updates
- Emergency notices
- Rule updates
- Push notifications in app
- In-app notification bell on website

---

### 7.8 Complaint & Issue Resolution System

Features:

- Complaint categories: food, water, room, Wi-Fi, payment, cleanliness, security, maintenance, other
- Optional photo attachment
- Anonymous option for sensitive complaints
- Status: pending, in progress, resolved, rejected
- Warden/admin response
- Student confirmation after resolution
- SLA timer such as 24-48 hours
- Monthly issue reports

---

### 7.9 Attendance / Night Safety Status

This platform must not feel like a jail or prisoner tracking system.

Privacy-first rule:

| Item | Rule |
|---|---|
| Night status | Inside Hostel / Outside Hostel / Not Verified |
| Continuous tracking | Avoid showing full live movement history |
| Guardian view | Limited safety summary only |
| Exact GPS | Not shown except emergency/technical verification |
| Manual override | Warden can correct false GPS/status issues with reason |

Possible status:

- Inside Hostel
- Outside Hostel
- Not Verified
- Safe / marked safe
- SOS emergency triggered

---

### 7.10 Emergency/SOS

Features:

- SOS button for resident
- Alert to warden/owner/guardian where enabled
- Emergency contacts
- Nearby hospital/clinic/police/ambulance contact info
- Fire/earthquake safety guide
- Emergency notice to all residents
- Incident log for serious issues

---

### 7.11 Move-in / Move-out Checklist

Move-in:

- Student documents collected
- Guardian contact collected
- Room photos
- Bed/table/cupboard condition
- Items provided: mattress, pillow, blanket, key, etc.
- Security deposit recorded
- Hostel rules accepted digitally

Move-out:

- Pending fee check
- Damage check
- Item return check
- Deposit refund decision
- Final receipt
- Exit date

---

### 7.12 Maintenance & Local Service Provider Network

This is a major hostel-side feature.

Purpose:

Hostels often need quick access to workers like plumber, electrician, doctor/clinic contact, cleaner, carpenter, repair worker, internet technician, etc. The platform will include a service provider network so hostel admins can find required help faster.

#### Service Provider / Side-Hustle Registration Page

A public form/page where local workers can register themselves.

Fields:

- Full name
- Phone number
- Service category
- Area/location
- Availability/time preference
- Short description/experience
- Optional profile photo
- Optional document/proof if needed
- Active/inactive status

Service categories:

- Plumber
- Electrician
- Doctor/clinic/health contact
- Internet/network technician
- Cleaner
- Carpenter
- Painter
- Room repair worker
- Water supplier
- Appliance repair
- Other

#### Hostel Admin Maintenance Features

| Feature | Description |
|---|---|
| Search provider | Search by service type, area, contact number, availability |
| Provider profile | View name, phone, category, area, notes, approval status |
| Create maintenance request | Plumbing, electricity, health contact, Wi-Fi, room repair, water, cleaning, etc. |
| Contact provider | Hostel calls provider and schedules work directly |
| Request status | Pending, contacted, scheduled, completed, cancelled |
| Maintenance history | Date, issue, provider, cost note, status, remarks |
| Room/bed issue link | Link maintenance issue to specific room/bed if needed |

#### Platform Owner Controls

- Approve/reject service provider applications
- Hide spam/fake provider listings
- Edit provider category/status
- Mark provider as verified/unverified where applicable
- View provider count and categories

#### Responsibility Rule

The platform connects hostels with listed service providers. Final price, work quality, timing, licensing, and conduct are between the hostel and the service provider. The platform does not guarantee medical treatment, repair quality, or emergency response.

---

## 8. Resident Portal Features

| Feature | Description |
|---|---|
| Private dashboard | Resident sees only their own hostel data |
| My profile | Name, phone, guardian contact, room/bed, hostel details |
| Food menu | Daily/weekly menu and food photos |
| Payment view | Fee status, receipts, due amount, payment history |
| Payment proof upload | Upload screenshot or proof for manual verification |
| Notices | Hostel notices and updates |
| Complaint system | Submit complaint with category and optional photo |
| Night safety status | View own safety/status summary |
| SOS | Emergency alert/contact feature |
| Rating/review | Rate hostel after joining |
| Referral | Share code/link to invite friend where enabled |
| Onboarding pack | Rules, Wi-Fi info, food timing, emergency contacts, nearby places, what to bring |

---

## 9. Guardian Trust Dashboard

Purpose: give parents/guardians useful information without spying on students.

Features:

- Guardian login or OTP access
- Monthly fee status
- Paid/unpaid/due summary
- Receipts
- Hostel notices
- Food menu and food photos
- Emergency contact button
- Night safety summary only
- Complaint status only if student allows

Privacy rule:

Guardian must not receive full movement tracking or exact live location unless emergency rules require it.

---

## 10. Rating and Review System

Rules:

- Only verified current/past residents can review
- One review per resident per hostel
- Public users can see rating summary
- Platform owner can hide abusive/inappropriate reviews

Rating categories:

- Overall
- Food
- Cleanliness
- Security
- Room
- Location
- Management

---

## 11. Hostel Verification and Trust Features

### 11.1 Owner Identity & Ownership Proof

Before hostel listing goes live:

- Owner uploads citizenship document
- Owner uploads ownership proof OR rental/lease agreement
- Owner phone number verified by OTP
- Platform owner reviews documents
- Documents are not public
- Public can see platform verification/status badge only

---

### 11.2 Verified Hostel Badge / Compliance Checklist

Status: Optional / can be added as later phase if needed.

Possible checklist:

- Verified hostel profile
- Registration document uploaded
- Warden/contact person listed
- Food transparency active
- Safety checklist maintained
- Room capacity declared
- Payment record enabled

Important: do not claim government verification unless officially approved.

---

### 11.3 Duplicate / Ghost Listing Detection

System should flag suspicious hostel listings.

Signals:

| Signal | Risk |
|---|---|
| Same address + different hostel name | High |
| Same phone + different hostel name | High |
| Same photos used on another listing | High |
| Same owner document used again | Medium |
| Similar hostel name in same area | Low, review only |

Flagged listings should go to manual platform admin review.

---

## 12. Hostel Comparison Mode

Public users can compare 2-3 hostels side by side.

Compare by:

- Monthly fee
- Distance to college/institute
- Room type/vacancy
- Food rating/menu
- Owner verification status
- Facilities
- Resident rating
- Location
- Rules

---

## 13. Referral Loop

Purpose: turn word-of-mouth into trackable growth.

Flow:

1. Existing resident gets referral code/link.
2. Friend uses code during inquiry/registration.
3. Hostel admin confirms new resident joined.
4. Reward is applied after first fee/payment confirmation.

Reward can be:

- Fee discount
- Hostel credit
- Other reward decided by hostel owner

---

## 14. User Joining Flow

Public visitor to resident:

1. User browses hostels on website/app.
2. User filters by location, price, food, room type, gender type, college/institute nearby.
3. User opens hostel profile.
4. User submits inquiry or contacts hostel.
5. Inquiry appears in hostel admin/warden dashboard.
6. Warden contacts user.
7. Warden manually registers student as resident.
8. System creates QR/code.
9. Resident scans QR or enters code.
10. Resident dashboard activates for that hostel only.

Important:

- Public users cannot directly become residents without hostel approval.
- Resident account is linked to one hostel.
- Resident private data is hostel-locked.

---

## 15. Service Provider Joining Flow

1. Service provider opens side-hustle/service provider registration page.
2. Provider fills name, phone, service category, area, availability, and details.
3. Platform owner reviews provider.
4. Provider is approved/rejected/hidden.
5. Approved provider appears in hostel admin maintenance search.
6. Hostel admin contacts provider when needed.
7. Hostel records service request status/history.

---

## 16. Privacy and Data Access Rules

| Data | Public | Resident | Guardian | Hostel Admin/Warden | Platform Owner |
|---|---:|---:|---:|---:|---:|
| Hostel profile | Yes | Yes | Yes | Own hostel | All |
| Hostel photos/facilities | Yes | Yes | Yes | Own hostel | All |
| Resident name/contact | No | Own only | Limited if linked | Own hostel only | All for support |
| Guardian contact | No | Own only | Own relation only | Own hostel only | All for support |
| Fee status | No | Own only | Limited summary | Own hostel only | All for support |
| Payment proof | No | Own only | If permitted | Own hostel only | All for support |
| Attendance/night status | No | Own only | Summary only | Own hostel only | All for support |
| Complaint | No | Own complaint | If shared | Own hostel only | All for support |
| Service provider profile | Public/limited approved info | No need | No need | Search/view approved providers | Manage all |
| Service provider private docs | No | No | No | No/limited | Platform owner only |

---

## 17. Payment Scope

Two payment flows:

### 17.1 Hostel to Platform

- Setup/subscription payment
- Renewal tracking
- Expiry alerts
- Platform owner dashboard records

### 17.2 Resident to Hostel

- Monthly hostel fee
- Due amount
- Payment history
- Receipts
- Payment proof upload
- Admin verification

Initial payment implementation:

- Manual payment proof upload for eSewa, Fonepay, Khalti, bank transfer, and cash record

Later automation:

- Automated eSewa/Khalti/connectIPS/payment gateway after merchant/API approval

---

## 18. Notifications

Notification examples:

- Inquiry received
- Inquiry reply/update
- QR activation success
- Payment due
- Payment proof uploaded
- Payment verified/rejected
- New notice
- Food menu/photo update
- Complaint status update
- Attendance/night status update
- SOS/emergency alert
- Maintenance request status update
- Provider approval/rejection

Channels:

- Push notification in app
- In-app notification bell on website
- Future optional: SMS/WhatsApp/email

---

## 19. Technical Stack

Preferred stack:

| Layer | Technology |
|---|---|
| Website/Admin | Next.js, TypeScript, Tailwind CSS |
| Mobile App | React Native / Expo Dev Build |
| Backend | NestJS or Next.js backend, final decision by developer |
| Database | PostgreSQL or MongoDB, final decision by developer |
| Auth | JWT/session-based auth with secure refresh flow |
| File Storage | Cloud/S3-compatible storage |
| Push Notification | Firebase Cloud Messaging |
| Maps/Location | Google Maps or equivalent where needed |
| Payments | Manual first; automated later after merchant approval |

Final stack may change if required for delivery speed, cost, stability, or production readiness.

---

## 20. Suggested Core Database Entities

Minimum entities:

- User
- Role
- Hostel
- HostelOwner
- HostelDocument
- Room
- Bed
- Resident
- Guardian
- Inquiry
- QRActivation
- Payment
- PaymentProof
- Receipt
- AttendanceStatus
- NightStatus
- FoodMenu
- FoodPhoto
- Notice
- Complaint
- ComplaintComment/Update
- RatingReview
- MoveInChecklist
- MoveOutChecklist
- ServiceProvider
- ServiceProviderApplication
- MaintenanceRequest
- MaintenanceHistory
- Referral
- Notification
- Subscription/PlatformPayment
- AuditLog

---

## 21. Important Non-Functional Requirements

The platform must be:

- Multi-tenant: each hostel data is separated
- Secure: private resident/payment data protected
- Role-based: every user sees only allowed data
- Mobile-friendly
- Clean admin UX
- Simple for wardens to use
- Scalable for many hostels
- Production-ready, not just a demo
- Built with clear API and database structure
- Able to support future modules without full rebuild

---

## 22. What Is Not Included by Default

Unless separately agreed:

- Domain purchase
- Hosting/server bills
- SMS/WhatsApp/email provider costs
- Payment gateway charges
- Play Store/App Store account charges
- Paid map/location API costs
- Service provider labor cost
- Repair material cost
- Doctor/clinic/emergency service fees
- Legal compliance certification
- Government verification
- Long-term maintenance after free support period
- Major future features outside this scope

---

## 23. Recommended Development Order 

### Phase 1 - Foundation

- Project setup
- Auth and role system
- Database schema
- Platform owner dashboard base
- Hostel onboarding
- Hostel approval

### Phase 2 - Public + Hostel Core

- Public hostel listing
- Hostel profile page
- Search/filter
- Inquiry flow
- Hostel admin dashboard
- Room/bed management
- Resident registration

### Phase 3 - Resident System

- QR activation
- Resident dashboard
- Profile view
- Food menu
- Notices
- Fee/payment records
- Payment proof upload

### Phase 4 - Trust, Safety, and Daily Use

- Complaint system
- Night safety status
- SOS/emergency contacts
- Ratings/reviews
- Move-in/move-out checklist
- Guardian limited dashboard

### Phase 5 - Growth and Maintenance

- Hostel comparison
- Referral system
- Service provider registration page
- Provider approval
- Hostel maintenance request/search
- Reports and final polish

---

## 24. Final Scope Summary

The final product is a Multi-Hostel SaaS Platform with:

- Public hostel discovery
- Website and mobile app
- Platform owner portal
- Hostel admin/warden portal
- Resident portal
- Guardian trust dashboard
- Service provider/side-hustle registration page
- Hostel listing and comparison
- Hostel verification and anti-ghost-listing controls
- Manual resident registration
- QR activation
- Room/bed digital map
- Fee/payment tracking
- Manual payment proof first, automated gateway later
- Food transparency
- Notices and notifications
- Complaint resolution
- Privacy-first night safety status
- SOS/emergency contact support
- Move-in/move-out checklist
- Ratings and reviews
- Referral loop
- Maintenance and local service provider network
- Multi-tenant backend and secure data separation

This document should be treated as the main implementation reference for developers.