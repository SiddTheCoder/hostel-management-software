# UI Assistant Prompt - Multi-Hostel SaaS Platform

You are a senior UI/UX designer and frontend engineer. Build a complete UI-only prototype for a multi-hostel SaaS platform. The UI must cover the public website, all web portals, and the mobile app screens. Use dummy data only for now; later we will bind every screen to REST APIs.

## Product Context

This is not a simple hostel website. It is one SaaS product with multiple portals:

- Public users browse, compare, and inquire about hostels.
- Platform owner approves hostels, verifies listings, moderates reviews, manages service providers, and sees reports.
- Hostel owner/admin/warden manages profile, rooms, beds, residents, payments, food, notices, complaints, safety, maintenance, and reports.
- Resident uses private dashboard after admin-created QR/code activation.
- Guardian sees limited fee, notice, food, safety, and emergency information.
- Service providers can register publicly and are approved by platform owner.

Build a professional, minimal, production-ready UI using shadcn/ui components. Do not build backend logic. Do not connect APIs yet. Use realistic dummy data and keep the structure API-ready.

## Tech And Style Requirements

- Use Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui.
- Use shadcn components: Button, Card, Table, Tabs, Badge, Alert, Dialog, Sheet, DropdownMenu, Avatar, Input, Textarea, Select, Checkbox, Calendar, Tooltip, Toast, Skeleton, Progress.
- Use lucide-react icons only where useful.
- Keep the UI minimal, clean, practical, and dashboard-friendly.
- Avoid flashy visuals, rainbow/neon styling, heavy gradients, glassmorphism, oversized marketing sections, decorative blobs, or gimmicky animations.
- Design the first screen as the actual usable product experience, not a generic marketing landing page.
- Include desktop and responsive mobile layouts for web portals.
- For the mobile app, design native-app-like screens in a 390px wide mobile frame or app layout.
- Every page must include empty, loading, and error-state design where relevant.
- All forms should have validation-ready labels, helper text, disabled/loading submit states, and success/error toast examples.
- Use dummy data in local arrays or mock files such as `mockHostels`, `mockResidents`, `mockPayments`, etc. Do not hardcode random UI text inside components when a data object makes sense.

## Visual Design System

Use one restrained neutral base with small portal accents.

- Base background: `#F8FAFC`
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
- Service provider states: Neutral with category badges

Typography:

- Use Geist Sans or Inter for all UI text.
- Use Poppins only for public website headings if already available.
- Use Geist Mono for IDs, QR codes, receipt numbers, and API-like references.
- Font sizing should be practical: 12-14px metadata, 14-16px body, 18-24px page titles, 28-36px public headings.

Layout rules:

- Web portals use a persistent left sidebar, top bar, breadcrumbs, search, notification bell, user menu, and role badge.
- Public website uses a simple top nav with Home, Hostels, Compare, Service Providers, Login.
- Mobile app uses bottom tabs for main daily actions and stack navigation for forms/details.
- Tables should include filters, status badges, row actions, pagination, and bulk-action-ready layout.
- Dashboards should show summary cards first, then priority tasks, then recent activity.

## Screen Inventory

Build 49 web screens and 30 mobile app screens, 79 screens total.

Web screens:

- Auth/shared: 5 screens
- Public website: 6 screens
- Platform owner portal: 9 screens
- Hostel admin/warden portal: 13 screens
- Resident portal: 11 screens
- Guardian portal: 5 screens

Mobile app screens:

- Auth: 4 screens
- Public browsing: 5 screens
- Resident activation: 3 screens
- Resident daily use: 13 screens
- Guardian: 5 screens

## Web Screens

### Auth/Shared - 5 Screens

1. Login: email/phone, password, Google login, role-aware redirect note, forgot password link.
2. Signup: phone/email option, password fields, Google signup, public-user explanation.
3. OTP Verification: code input, resend timer, verified contact summary.
4. Forgot/Reset Password: request OTP, verify, reset password.
5. Resident Activation: QR/code entry after login, activation status card, linked resident preview.

### Public Website - 6 Screens

1. Home: hostel search bar, area filter, featured verified hostels, quick filters, how it works, CTA to register service provider.
2. Hostel Listing: search by name/area, price range filter, boys/girls/co-living filter, room type, facilities, food, verification badge, list/grid toggle.
3. Hostel Detail: photo gallery, name, rating, verification badge, location, pricing, room/vacancy summary, facilities, food details, rules, reviews, inquiry CTA.
4. Compare Hostels: compare 2-3 hostels by fee, location text, room type, vacancy, food score, facilities, verification, rating.
5. Inquiry Form: selected hostel summary, student/contact details, preferred room type, move-in date, notes, submit confirmation.
6. Service Provider Registration: provider category, area, phone, availability, experience, optional photo/document upload UI, submitted/pending state.

### Platform Owner Portal - 9 Screens

1. Dashboard: total hostels, pending approvals, active residents, inquiries, service providers, complaints, platform revenue/subscriptions, recent audit activity.
2. Hostel Approvals: applications table, filters, detail drawer, approve/reject actions, publish/unpublish status.
3. Hostel Verification: document checklist, ownership proof, compliance checklist, duplicate/ghost listing warning area.
4. Users: users table, roles, status, contact, linked hostel/resident, role management action placeholder.
5. Service Providers: pending/approved/rejected providers, category filters, approve/reject/hide actions.
6. Payments/Subscriptions: platform subscription overview, invoices/receipts mock table, overdue badges.
7. Reports: platform analytics cards and charts for hostels, residents, inquiries, complaints, providers.
8. Reviews Moderation: review queue, rating categories, hide/unhide actions, public visibility state.
9. Abuse/Flags: duplicate listing flags, abuse reports, resolution status, audit notes.

### Hostel Admin/Warden Portal - 13 Screens

1. Dashboard: residents, vacant beds, dues, payment proofs, complaints, maintenance, food feedback, night status summary, urgent alerts.
2. Hostel Profile: editable profile form, rules, facilities, food details, pricing, contact, photo gallery upload UI.
3. Rooms & Beds: floor/room/bed map, occupancy status, repair status, vacancy filters, add floor/room/bed dialogs.
4. Residents: resident list, room/bed assignment, guardian/emergency info, status badges, add/edit resident drawer.
5. Inquiries: inquiry pipeline, follow-up notes, status changes, convert-to-resident action placeholder.
6. Payments: monthly fee records, paid/unpaid/partial/overdue tabs, proof approval queue, receipt preview.
7. Food: weekly menu editor, daily meal timings, food photos, feedback ratings, complaint link.
8. Notices: create notice form, category filters, published/draft notices, read-status summary.
9. Complaints: complaint table, anonymous badge, SLA timer, status workflow, admin replies, resolution confirmation.
10. Night Status: status summary cards, resident status table, privacy note, manual correction with reason.
11. Move-In/Move-Out: checklist UI for documents, room photos, items provided, deposit, pending fees, damage check, refund decision.
12. Maintenance: provider search, provider profile preview, maintenance request list, status updates, cost notes, service history.
13. Reports: residents, beds, dues, payment proofs, complaints, maintenance, food feedback, safety summary with export buttons.

### Resident Portal - 11 Screens

1. Dashboard: hostel summary, room/bed, fee status, notices, food menu, complaint shortcut, SOS shortcut, night status.
2. My Profile: resident info, guardian contact, emergency contact, documents/status, hostel/room details.
3. Food Menu: weekly menu, today meals, food photos, rating/feedback form, food complaint shortcut.
4. Payments: monthly dues, paid/unpaid/partial/overdue, deposit, receipts, payment methods.
5. Payment Proof Upload: payment summary, method selector, upload proof, notes, submitted/pending approval state.
6. Notices: notice feed, category filter, read/unread badges, detail view.
7. Complaints: list, create complaint form, anonymous option, attachment UI, status timeline.
8. Night Status: own status only, privacy-safe status update, no exact GPS display.
9. SOS: large emergency button, confirmation dialog, emergency contacts, incident submitted state.
10. Reviews: verified resident review form, rating categories, previous review state.
11. Referral: referral code, share link UI, referred inquiries, reward status.

### Guardian Portal - 5 Screens

1. Fee Summary: dues, paid amount, due date, receipt summary, payment status.
2. Notices: guardian-visible notices, categories, read state.
3. Food View: weekly menu and food photos.
4. Safety Summary: limited night safety summary, no location history, emergency status only.
5. Emergency Contact: hostel contact, warden contact, resident emergency contact list, call action placeholders.

## Mobile App Screens

### Auth - 4 Screens

1. Welcome/Login: phone/email login, password, Google login.
2. Signup: phone/email registration, password, Google signup.
3. OTP Verify: code input, resend timer.
4. Forgot/Reset Password: OTP-based reset flow.

### Public Browsing - 5 Screens

1. Browse Home: search, area chips, featured verified hostels.
2. Hostel Search/List: filters, sort, list cards.
3. Hostel Detail: gallery, pricing, facilities, vacancy, inquiry CTA.
4. Compare: compare 2-3 hostels in mobile-friendly columns/cards.
5. Inquiry Form: contact, move-in, room preference, submit state.

### Resident Activation - 3 Screens

1. QR Scan: camera placeholder UI and manual-code fallback.
2. Enter Activation Code: code input, linked-hostel preview.
3. Activation Status: pending, success, expired, already linked states.

### Resident Daily Use - 13 Screens

1. Resident Dashboard: fee, food, notices, room, complaint, SOS.
2. Profile: resident, guardian, emergency, room/bed.
3. Food: today/weekly menu, photos, feedback.
4. Payments: dues, history, receipts.
5. Payment Proof Upload: method, amount, attachment, submit.
6. Notices: list and detail.
7. Complaints List: statuses and filters.
8. Create Complaint: category, anonymous option, attachment.
9. Complaint Detail: timeline, replies, confirm resolution.
10. Night Status: own status update and safety explanation.
11. SOS: emergency button, contacts, confirmation state.
12. Reviews: rating and review form.
13. Referral/Notifications: referral code, reward status, notification feed.

### Guardian Mobile - 5 Screens

1. Guardian Dashboard/Fee Summary.
2. Guardian Notices.
3. Guardian Food View.
4. Guardian Safety Summary.
5. Guardian Emergency Contact.

## Dummy Data Requirements

Use realistic Nepal-focused dummy data:

- Hostels: "Himalayan Scholars Hostel", "Bagmati Boys Hostel", "Lakeside Girls Hostel", "New Baneshwor Co-Living".
- Areas: Kathmandu, Lalitpur, Bhaktapur, Pokhara, Chitwan.
- Payment methods: eSewa, Fonepay, Khalti, Bank Transfer, Cash.
- Roles: PLATFORM_OWNER, HOSTEL_OWNER, HOSTEL_ADMIN, WARDEN, RESIDENT, GUARDIAN, SERVICE_PROVIDER, PUBLIC_USER.
- Statuses: pending, approved, rejected, published, unpublished, paid, unpaid, partial, overdue, inside hostel, outside hostel, not verified, marked safe, SOS triggered.
- Include sample residents, rooms, beds, guardians, complaints, notices, food menus, service providers, maintenance requests, reviews, and reports.

## UX Behavior To Show

- Navigation should feel complete for every portal.
- Use role-specific sidebars and clear page titles.
- Use status badges consistently.
- Use safe privacy copy for guardian and night-status screens.
- Use confirmation dialogs for destructive/sensitive actions.
- Use toast notifications for form submission, approval/rejection, proof upload, SOS confirmation, and activation success/failure.
- Use charts sparingly for dashboards and reports; tables must remain the primary admin UI.
- Keep the design accessible: sufficient contrast, visible focus states, keyboard-friendly controls, clear labels.

## Important Privacy And Product Rules

- Resident cannot self-create a private resident profile by normal signup.
- Resident private portal access requires admin-created QR/code activation.
- Guardian sees only limited summaries, not full private student data or movement history.
- Night status is a status system, not GPS tracking. Do not show exact GPS in dashboards.
- Hostel admins must only see their own hostel data.
- Public hostel pages must not show private owner documents, resident data, payment data, guardian contact, internal notes, or audit logs.

## Final Deliverable

Deliver a complete UI prototype with all listed screens, consistent design system, realistic dummy data, and API-ready component structure. The result should look like a serious SaaS product that can later be connected to `/api/v1` endpoints without redesigning the UI.
