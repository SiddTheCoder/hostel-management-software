# Desktop Web UI Assistant Prompt - Multi-Hostel SaaS Platform

You are a senior UI/UX designer and frontend engineer. Build a complete desktop web UI prototype for a multi-hostel SaaS platform. This prompt is only for the public website and web portals. Do not build the mobile app screens in this task.

Use dummy data only for now. Later, every screen will be connected to REST APIs under `/api/v1`, so keep components, data shapes, filters, forms, tables, and status names API-ready.

## Product Summary

This is one SaaS product with multiple web portals:

- Public website for hostel discovery, comparison, inquiry, and service-provider registration.
- Platform owner portal for approvals, verification, users, service providers, reports, reviews, and abuse flags.
- Hostel admin/warden portal for hostel profile, rooms, beds, residents, inquiries, payments, food, notices, complaints, safety, maintenance, and reports.
- Resident portal for private daily use after admin-created QR/code activation.
- Guardian portal for limited fee, notice, food, safety, and emergency information.

Build a serious, minimal, professional SaaS UI. It should feel practical for hostel owners, wardens, students, guardians, and platform operators in Nepal.

## Tech Requirements

- Use Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui.
- Use lucide-react icons.
- Use shadcn/ui components: Button, Card, Table, Tabs, Badge, Alert, Dialog, Sheet, DropdownMenu, Avatar, Input, Textarea, Select, Checkbox, Calendar, Tooltip, Toast, Skeleton, Progress.
- Keep backend/API calls mocked with local dummy data.
- Do not implement real authentication, database, or API integration.
- Structure mock data in reusable files such as `mockHostels`, `mockResidents`, `mockPayments`, `mockComplaints`, `mockFoodMenus`, `mockServiceProviders`.
- Every form should have realistic labels, helper text, validation-ready fields, loading state, disabled state, success toast, and error toast.
- Every list/table page should include filters, search, status badges, row actions, pagination-ready layout, empty state, loading state, and error state.

## Visual Design System

Use a restrained professional design. Do not use flashy gradients, neon colors, glassmorphism, decorative blobs, cartoon illustrations, or oversized marketing design.

Base colors:

- Background: `#F8FAFC`
- Surface/cards: `#FFFFFF`
- Main text: `#0F172A`
- Muted text: `#64748B`
- Border: `#E2E8F0`
- Success: `#16A34A`
- Warning: `#D97706`
- Danger: `#DC2626`
- Info: `#2563EB`

Portal accents:

- Public website: Teal `#0F766E`
- Platform owner: Blue `#2563EB`
- Hostel admin/warden: Cyan `#0891B2`
- Resident: Green `#16A34A`
- Guardian: Amber `#D97706`

Typography:

- Use Geist Sans or Inter for all UI.
- Use Poppins only for public website headings if available.
- Use Geist Mono for IDs, receipt numbers, QR/activation codes, and system references.
- Use practical sizes: 12-14px metadata, 14-16px body, 18-24px page titles, 28-36px public headings.

Layout:

- Public website uses a simple top navigation: Home, Hostels, Compare, Service Providers, Login.
- Web portals use a persistent left sidebar, top bar, breadcrumbs, search, notification bell, role badge, and user menu.
- Dashboards start with summary cards, then priority tasks, then recent activity.
- Admin pages should be table-first and efficient, not marketing-style.
- Cards should be simple with small radius, clean borders, and useful spacing.
- Make layouts responsive for laptop, desktop, tablet, and mobile browser widths, but this task is primarily desktop web.

## Screen Count

Build 49 desktop web screens:

- Auth/shared: 5 screens
- Public website: 6 screens
- Platform owner portal: 9 screens
- Hostel admin/warden portal: 13 screens
- Resident portal: 11 screens
- Guardian portal: 5 screens

## Auth/Shared Screens - 5

1. Login
   - Email/phone input
   - Password input
   - Google login button
   - Forgot password link
   - Role-aware redirect note
   - Demo role switcher only for prototype preview

2. Signup
   - Phone/email option
   - Password and confirm password
   - Google signup
   - Clear note: signup creates a public account only, not resident access

3. OTP Verification
   - OTP code input
   - Resend timer
   - Contact summary
   - Verified/success state

4. Forgot/Reset Password
   - Request OTP
   - Verify OTP
   - Reset password
   - Success confirmation

5. Resident Activation
   - QR/code entry after login
   - Activation status card
   - Linked resident preview
   - Expired/used/already linked states

## Public Website Screens - 6

1. Home
   - Search bar for hostel name/area
   - Area filter chips
   - Featured verified hostels
   - Quick filters for budget, room type, food, boys/girls/co-living
   - How it works section
   - CTA for service-provider registration

2. Hostel Listing
   - Search by name/area
   - Filters: price range, boys/girls/co-living, room type, facilities, food
   - Sort options
   - List/grid toggle
   - Verification badges
   - Hostel cards with price, vacancy, area, rating, facilities

3. Hostel Detail
   - Photo gallery
   - Name, rating, verification badge
   - Location, pricing, room/vacancy summary
   - Facilities, food details, hostel rules
   - Public reviews summary
   - Inquiry CTA

4. Compare Hostels
   - Compare 2-3 hostels
   - Fee, location text, room type, vacancy, food score, facilities, verification, rating
   - Clear add/remove hostel controls

5. Inquiry Form
   - Selected hostel summary
   - Student/contact details
   - Preferred room type
   - Expected move-in date
   - Notes
   - Submit confirmation state

6. Service Provider Registration
   - Full name, phone, category, area/location
   - Availability
   - Description/experience
   - Optional photo/document upload UI
   - Submitted/pending approval state

## Platform Owner Portal Screens - 9

1. Dashboard
   - Total hostels
   - Pending approvals
   - Active residents
   - Inquiries
   - Service providers
   - Complaints
   - Platform payments/subscriptions
   - Recent audit activity

2. Hostel Approvals
   - Applications table
   - Filters by status, city, hostel type
   - Detail drawer
   - Approve/reject actions
   - Publish/unpublish state

3. Hostel Verification
   - Document checklist
   - Ownership proof
   - Compliance checklist
   - Duplicate/ghost listing warning area
   - Verification status timeline

4. Users
   - Users table
   - Role, status, contact, linked hostel/resident
   - Role management placeholder
   - Account status actions

5. Service Providers
   - Pending/approved/rejected providers
   - Category and area filters
   - Approve/reject/hide actions
   - Provider detail drawer

6. Payments/Subscriptions
   - Platform subscription overview
   - Invoice/receipt mock table
   - Overdue badges
   - Payment status filters

7. Reports
   - Platform analytics cards
   - Charts for hostels, residents, inquiries, complaints, providers
   - Export buttons

8. Reviews Moderation
   - Review queue
   - Rating categories
   - Hide/unhide actions
   - Public visibility state

9. Abuse/Flags
   - Duplicate listing flags
   - Abuse reports
   - Resolution status
   - Audit notes

## Hostel Admin/Warden Portal Screens - 13

1. Dashboard
   - Residents
   - Vacant beds
   - Monthly dues
   - Pending payment proofs
   - Complaints
   - Maintenance requests
   - Food feedback
   - Night status summary
   - Urgent alerts

2. Hostel Profile
   - Editable profile form
   - Rules, facilities, food details, pricing, contact
   - Photo gallery upload UI
   - Preview public listing button

3. Rooms & Beds
   - Floor/room/bed visual map
   - Occupancy status
   - Repair status
   - Vacancy filters
   - Add floor, room, and bed dialogs

4. Residents
   - Resident list
   - Room/bed assignment
   - Guardian and emergency info
   - Status badges
   - Add/edit resident drawer
   - Generate activation code action

5. Inquiries
   - Inquiry pipeline
   - Follow-up notes
   - Status changes
   - Convert-to-resident action placeholder

6. Payments
   - Monthly fee records
   - Paid/unpaid/partial/overdue tabs
   - Payment proof approval queue
   - Receipt preview

7. Food
   - Weekly menu editor
   - Daily meal timings
   - Food photos
   - Feedback ratings
   - Food complaint link

8. Notices
   - Create notice form
   - Category filters
   - Published/draft notices
   - Read-status summary

9. Complaints
   - Complaint table
   - Anonymous badge
   - SLA timer
   - Status workflow
   - Admin replies
   - Resolution confirmation

10. Night Status
   - Status summary cards
   - Resident status table
   - Privacy note
   - Manual correction with reason
   - Do not show exact GPS

11. Move-In/Move-Out
   - Move-in documents checklist
   - Room photos
   - Items provided
   - Deposit record
   - Pending fees
   - Damage check
   - Refund decision

12. Maintenance
   - Provider search
   - Provider profile preview
   - Maintenance request list
   - Status updates
   - Cost notes
   - Service history

13. Reports
   - Residents, beds, dues, payment proofs
   - Complaints, maintenance, food feedback
   - Safety summary
   - Export buttons

## Resident Portal Screens - 11

1. Dashboard
   - Hostel summary
   - Room/bed
   - Fee status
   - Notices
   - Food menu
   - Complaint shortcut
   - SOS shortcut
   - Night status

2. My Profile
   - Resident info
   - Guardian contact
   - Emergency contact
   - Documents/status
   - Hostel/room details

3. Food Menu
   - Weekly menu
   - Today's meals
   - Food photos
   - Rating/feedback form
   - Food complaint shortcut

4. Payments
   - Monthly dues
   - Paid/unpaid/partial/overdue
   - Deposit
   - Receipts
   - Payment methods

5. Payment Proof Upload
   - Payment summary
   - Method selector
   - Upload proof
   - Notes
   - Submitted/pending approval state

6. Notices
   - Notice feed
   - Category filter
   - Read/unread badges
   - Detail view

7. Complaints
   - List
   - Create complaint form
   - Anonymous option
   - Attachment UI
   - Status timeline

8. Night Status
   - Own status only
   - Privacy-safe status update
   - No exact GPS display

9. SOS
   - Large emergency button
   - Confirmation dialog
   - Emergency contacts
   - Incident submitted state

10. Reviews
   - Verified resident review form
   - Rating categories
   - Previous review state

11. Referral
   - Referral code
   - Share link UI
   - Referred inquiries
   - Reward status

## Guardian Portal Screens - 5

1. Fee Summary
   - Dues
   - Paid amount
   - Due date
   - Receipt summary
   - Payment status

2. Notices
   - Guardian-visible notices
   - Categories
   - Read state

3. Food View
   - Weekly menu
   - Food photos

4. Safety Summary
   - Limited night safety summary
   - No location history
   - Emergency status only

5. Emergency Contact
   - Hostel contact
   - Warden contact
   - Resident emergency contacts
   - Call action placeholders

## Dummy Data Requirements

Use realistic Nepal-focused dummy data:

- Hostels: Himalayan Scholars Hostel, Bagmati Boys Hostel, Lakeside Girls Hostel, New Baneshwor Co-Living.
- Areas: Kathmandu, Lalitpur, Bhaktapur, Pokhara, Chitwan.
- Payment methods: eSewa, Fonepay, Khalti, Bank Transfer, Cash.
- Service categories: plumber, electrician, doctor/clinic, internet technician, cleaner, carpenter, painter, water supplier, appliance repair.
- Roles: PLATFORM_OWNER, HOSTEL_OWNER, HOSTEL_ADMIN, WARDEN, RESIDENT, GUARDIAN, SERVICE_PROVIDER, PUBLIC_USER.
- Statuses: pending, approved, rejected, published, unpublished, paid, unpaid, partial, overdue, inside hostel, outside hostel, not verified, marked safe, SOS triggered.

## Product And Privacy Rules

- Normal signup creates a public user only.
- Resident private portal access requires admin-created QR/code activation.
- Guardian sees limited summaries only.
- Night status is not GPS tracking. Do not show exact location history.
- Hostel admins must only see their own hostel data.
- Public hostel pages must never show private owner documents, resident data, payment data, guardian contact, internal notes, or audit logs.

## Final Deliverable

Deliver a complete desktop web UI prototype with 49 screens, role-specific navigation, consistent shadcn/ui styling, realistic dummy data, clean responsive behavior, and API-ready component structure.
