# Mobile App UI Assistant Prompt - Multi-Hostel SaaS Platform

You are a senior mobile UI/UX designer and frontend engineer. Build a complete mobile app UI prototype for a multi-hostel SaaS platform. This prompt is only for the mobile app screens. Do not build the desktop website or web portals in this task.

Use dummy data only for now. Later, every screen will be connected to REST APIs under `/api/v1`, so keep components, data shapes, filters, forms, and status names API-ready.

## Product Summary

The mobile app supports:

- Public users browsing hostels, comparing options, and sending inquiries.
- Residents activating their private account through an admin-created QR/code after normal login.
- Residents using daily hostel features: dashboard, payments, food, notices, complaints, night status, SOS, reviews, referrals, and notifications.
- Guardians viewing limited fee, notice, food, safety, and emergency information.

Build a serious, minimal, professional mobile UI. The app should feel practical for students, guardians, and hostel users in Nepal. Avoid fancy or playful styling.

## Tech And UI Requirements

- Use React Native / Expo style screens if building an app prototype, or mobile-first React components if building inside a web preview.
- Use TypeScript.
- Use shadcn-style visual language where possible: clean cards, buttons, badges, inputs, sheets, dialogs, tabs, skeletons, toast states.
- Use lucide icons or a consistent mobile icon set.
- Target a 390px wide mobile design first.
- Design with safe areas, thumb-friendly tap targets, bottom navigation, and clear screen headers.
- Use dummy data in reusable mock files such as `mockHostels`, `mockResidentDashboard`, `mockPayments`, `mockFoodMenus`, `mockComplaints`, `mockGuardian`.
- Do not connect real APIs.
- Do not implement real camera, payment gateway, location tracking, push notifications, or file upload. Use realistic placeholders and UI states.

## Visual Design System

Use a restrained professional design. No neon colors, heavy gradients, glassmorphism, decorative blobs, or cartoon visuals.

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

Mobile section accents:

- Public browsing: Teal `#0F766E`
- Resident: Green `#16A34A`
- Guardian: Amber `#D97706`
- Alerts/SOS: Red `#DC2626`

Typography:

- Use Geist Sans, Inter, or system mobile font.
- Use 12-13px for metadata, 14-16px for body, 18-22px for screen titles.
- Use Geist Mono or monospace for activation codes, receipt numbers, and IDs.

Navigation:

- Public mode bottom tabs: Browse, Compare, Inquiry, Account.
- Resident mode bottom tabs: Home, Food, Payments, Notices, More.
- Guardian mode bottom tabs: Summary, Notices, Food, Safety, Contact.
- Forms and details should use stack navigation.
- SOS should be reachable quickly from Resident Home and More.

## Screen Count

Build 30 mobile app screens:

- Auth: 4 screens
- Public browsing: 5 screens
- Resident activation: 3 screens
- Resident daily use: 13 screens
- Guardian: 5 screens

## Auth Screens - 4

1. Welcome/Login
   - Phone/email input
   - Password input
   - Google login
   - Forgot password
   - Signup link
   - Demo role switcher only for prototype preview

2. Signup
   - Phone/email registration
   - Password and confirm password
   - Google signup
   - Clear note: signup creates a public account only, not resident access

3. OTP Verify
   - OTP input
   - Resend timer
   - Contact summary
   - Verified success state

4. Forgot/Reset Password
   - Request OTP
   - Verify OTP
   - New password form
   - Success state

## Public Browsing Screens - 5

1. Browse Home
   - Search by hostel name or area
   - Area chips
   - Featured verified hostels
   - Quick filters for budget, food, room type, boys/girls/co-living

2. Hostel Search/List
   - Filter button opens bottom sheet
   - Sort options
   - Hostel cards with photo, price, area, vacancy, rating, verification badge

3. Hostel Detail
   - Gallery carousel
   - Name, rating, verification badge
   - Pricing and room/vacancy summary
   - Facilities
   - Food details
   - Rules
   - Inquiry CTA sticky at bottom

4. Compare
   - Compare 2-3 hostels in mobile-friendly cards/columns
   - Fee, location, room type, vacancy, food score, facilities, verification, rating
   - Add/remove hostel controls

5. Inquiry Form
   - Selected hostel summary
   - Student/contact details
   - Preferred room type
   - Expected move-in date
   - Notes
   - Submit success state

## Resident Activation Screens - 3

1. QR Scan
   - Camera placeholder UI
   - Scan frame
   - Manual-code fallback
   - Permission/error placeholder

2. Enter Activation Code
   - Code input
   - Activation helper text
   - Linked-hostel preview after code entry
   - Submit loading/error states

3. Activation Status
   - Pending state
   - Success state
   - Expired code state
   - Already linked state
   - CTA to resident dashboard

## Resident Daily Use Screens - 13

1. Resident Dashboard
   - Hostel summary
   - Room/bed card
   - Fee status
   - Today's food
   - Latest notices
   - Complaint shortcut
   - SOS shortcut
   - Night status

2. Profile
   - Resident info
   - Guardian contact
   - Emergency contact
   - Room/bed
   - Documents/status

3. Food
   - Today's meals
   - Weekly menu
   - Food photos
   - Feedback/rating action
   - Food complaint shortcut

4. Payments
   - Current due
   - Payment history
   - Receipts
   - Status badges: paid, unpaid, partial, overdue

5. Payment Proof Upload
   - Selected payment summary
   - Method selector: eSewa, Fonepay, Khalti, Bank Transfer, Cash
   - Amount
   - Attachment placeholder
   - Notes
   - Submit/pending approval state

6. Notices
   - Notice list
   - Category filters
   - Read/unread badges
   - Notice detail state

7. Complaints List
   - Complaint status filters
   - Complaint cards
   - Create complaint CTA

8. Create Complaint
   - Category
   - Title/details
   - Anonymous option
   - Attachment placeholder
   - Submit confirmation

9. Complaint Detail
   - Status timeline
   - Admin replies
   - Attachment preview placeholder
   - Confirm resolution action

10. Night Status
   - Own status only
   - Status options: inside hostel, outside hostel, not verified, marked safe
   - Privacy explanation
   - Do not show exact GPS or movement history

11. SOS
   - Large emergency button
   - Confirmation step to prevent accidental tap
   - Emergency contacts
   - Incident submitted state

12. Reviews
   - Verified resident review form
   - Rating categories
   - Previous review state

13. Referral/Notifications
   - Referral code
   - Share link UI
   - Reward status
   - Notification feed with read/unread states

## Guardian Mobile Screens - 5

1. Guardian Dashboard/Fee Summary
   - Student/hostel summary
   - Dues, paid amount, due date
   - Receipt summary
   - Payment status

2. Guardian Notices
   - Guardian-visible notices only
   - Categories
   - Read state

3. Guardian Food View
   - Today's food
   - Weekly menu
   - Food photos

4. Guardian Safety Summary
   - Limited night safety summary
   - Emergency status
   - No exact location or movement history

5. Guardian Emergency Contact
   - Hostel phone
   - Warden phone
   - Emergency contact list
   - Call action placeholders

## Dummy Data Requirements

Use realistic Nepal-focused dummy data:

- Hostels: Himalayan Scholars Hostel, Bagmati Boys Hostel, Lakeside Girls Hostel, New Baneshwor Co-Living.
- Areas: Kathmandu, Lalitpur, Bhaktapur, Pokhara, Chitwan.
- Payment methods: eSewa, Fonepay, Khalti, Bank Transfer, Cash.
- Example resident: Aarav Sharma, Room B-204, Bed 2, due amount NPR 8,500.
- Example guardian: Maya Sharma.
- Statuses: pending, approved, paid, unpaid, partial, overdue, inside hostel, outside hostel, not verified, marked safe, SOS triggered.

## UX States To Include

- Loading skeletons for lists and dashboard cards.
- Empty states for no payments, no notices, no complaints, no hostels found.
- Error states for failed activation, failed upload, expired QR/code, network error.
- Toasts for successful inquiry, activation, proof upload, complaint submit, SOS confirmation, status update.
- Bottom sheets for filters, payment method selection, and confirmation actions.
- Confirmation dialog for SOS and complaint resolution.

## Product And Privacy Rules

- Normal signup creates a public user only.
- Resident private access requires admin-created QR/code activation.
- Guardian sees limited summaries only.
- Night status is not GPS tracking. Do not show exact location history.
- SOS should be easy to access but protected with a confirmation step.
- Public hostel screens must never show private owner documents, resident data, payment data, guardian contact, internal notes, or audit logs.

## Final Deliverable

Deliver a complete mobile app UI prototype with 30 screens, clean mobile navigation, realistic dummy data, professional styling, privacy-safe flows, and API-ready component structure.
