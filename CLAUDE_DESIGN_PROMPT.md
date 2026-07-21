# UI Design Prompt for Multi-Hostel SaaS Platform

**Project:** Hostel Management Software - Multi-tenant SaaS Platform  
**Target:** Claude Design Tool / UI Mockup Generator  
**Version:** 1.0  
**Date:** July 18, 2026  

---

## Project Overview

This is a comprehensive multi-tenant SaaS platform for hostel management in Nepal. It serves multiple user types through different portals:

- **Public Website** - For students/visitors to discover and compare hostels
- **Platform Owner Portal** - For super admin to manage the entire platform
- **Hostel Admin/Warden Portal** - For hostel owners to manage their hostel operations
- **Resident Portal** - For students living in hostels to access their information
- **Guardian Dashboard** - For parents to monitor their children's safety and payments

---

## Design System & Color Theme

### Color Palette

**Primary Colors:**
- Primary Blue: `hsl(221.2, 83.2%, 53.3%)` - Used for primary actions, links, active states
- Primary Foreground: `hsl(210, 40%, 98%)` - Text on primary color

**Neutral Colors:**
- Background: `hsl(0, 0%, 100%)` - White background
- Foreground: `hsl(222.2, 84%, 4.9%)` - Main text color
- Muted: `hsl(210, 40%, 96.1%)` - Subtle backgrounds
- Muted Foreground: `hsl(215.4, 16.3%, 46.9%)` - Secondary text
- Border: `hsl(214.3, 31.8%, 91.4%)` - Borders and dividers

**Semantic Colors:**
- Success/Green: `hsl(142.1, 76.2%, 36.3%)` - Approved, Paid, Verified, Inside Hostel
- Warning/Yellow: `hsl(47.9, 95.8%, 53.1%)` - Pending, Partial Payment, Due Soon
- Destructive/Red: `hsl(0, 84.2%, 60.2%)` - Rejected, Overdue, SOS, Critical
- Info/Blue: `hsl(199.9, 89.1%, 48.4%)` - Information messages

**Portal-Specific Accent Colors:**
- Platform Portal: Blue tones (authority, control)
- Hostel Admin Portal: Indigo/Purple tones (management, organization)
- Resident Portal: Teal/Cyan tones (fresh, student-friendly)
- Guardian Portal: Green tones (safety, trust, reassurance)

### Typography

- **Font Family:** Inter or Geist Sans (single variable sans-serif for everything)
- **Base Font Size:** 14px (text-sm in Tailwind)
- **Heading Scales:**
  - H1: 30px-48px (text-3xl to text-5xl) - Only on public homepage hero
  - H2: 24px-30px (text-2xl to text-3xl) - Section headers
  - H3: 20px (text-xl) - Subsection headers
  - H4: 18px (text-lg) - Card titles
  - Body: 14px (text-sm) - Default text
  - Small: 12px (text-xs) - Labels, captions

- **Font Weight:**
  - Regular (400) - Body text
  - Medium (500) - Emphasis
  - Semibold (600) - Subheadings
  - Bold (700) - Headings
  
- **Numbers:** Use tabular figures (`font-variant-numeric: tabular-nums`) for prices, fees, counts in tables

### Design Principles

1. **Trustworthy, Not Flashy** - Design should feel credible and calm like a professional booking/listing platform
2. **Not Surveillance** - Night status and safety features should be reassuring, never invasive. No live tracking maps.
3. **Boring Where It Matters** - Payments, receipts, status displays should be clear and unambiguous like banking UIs
4. **Mobile-First** - Every page must work cleanly at 375px width
5. **Consistent Status Colors** - Use the semantic color system consistently across all status badges

### Spacing & Layout

- **Grid System:** 12-column grid for desktop, single column for mobile
- **Container Max Width:** 1280px for main content areas
- **Card Padding:** 16px (p-4) mobile, 24px (p-6) desktop
- **Section Gaps:** 24px-32px (gap-6 to gap-8)
- **Base Spacing Unit:** 4px (Tailwind's default scale)

### Component Style

- **Buttons:**
  - Primary: Solid primary color with white text
  - Secondary: Subtle background with foreground text
  - Destructive: Red solid for dangerous actions
  - Ghost: Transparent with hover effect
  - Border Radius: 8px (rounded-lg)
  - Padding: 12px 24px for default size

- **Cards:**
  - Background: White with subtle shadow
  - Border: 1px solid border color
  - Border Radius: 12px (rounded-xl)
  - Shadow: Subtle elevation (`shadow-sm`)
  - Hover: Increase shadow slightly (`shadow-md`)

- **Badges/Status Pills:**
  - Border Radius: 6px (rounded-md)
  - Padding: 4px 12px
  - Font Size: 12px (text-xs)
  - Font Weight: Medium (500)
  - Color-coded by status type (see Status Color Mapping below)

- **Form Inputs:**
  - Border: 1px solid border color
  - Border Radius: 8px (rounded-lg)
  - Height: 40px for default
  - Focus: Ring effect with primary color
  - Disabled: Muted background

### Status Color Mapping

Use these colors consistently across the entire platform:

| Category | Green (Success) | Yellow (Warning) | Red (Destructive) | Gray (Muted) |
|---|---|---|---|---|
| **Payment** | Paid | Partial / Due Soon | Overdue / Unpaid | — |
| **Complaint** | Resolved | In Progress | Rejected | Pending |
| **Hostel Status** | Verified/Approved | Pending Review | Rejected | Unverified |
| **Night Status** | Inside Hostel | Not Verified | SOS | Outside Hostel* |
| **Bed/Room** | Available | Reserved | Under Repair | Occupied |
| **Maintenance** | Completed | Scheduled | Cancelled | Pending |
| **Service Provider** | Approved | Pending | Rejected/Hidden | — |

**Important Note:** "Outside Hostel" is NEUTRAL (gray), not alarming. Students leaving hostels is normal. Only "SOS" is urgent red.

### Icons

Use **Lucide React** icon library consistently:
- MapPin (location)
- Utensils (food)
- ShieldCheck (verification)
- AlertTriangle (SOS/emergency)
- Wrench (maintenance)
- Users (residents)
- Receipt (payments)
- Bell (notifications)
- QrCode (QR activation)
- Home (hostel/room)
- Bed (bed status)
- Calendar (dates)
- Clock (time)
- Phone (contact)
- Mail (email)

---

## Portal Navigation Structures

### Public Portal
- **Layout:** Top navigation bar + full-width content + footer
- **Nav Items:** Home, Browse Hostels, About, Contact, Register Hostel, Login
- **Mobile:** Hamburger menu

### Platform Owner Portal
- **Layout:** Sidebar navigation + top bar + main content area
- **Sidebar Sections:**
  - Dashboard
  - Hostels (with pending badge)
  - Hostel Details/Review
  - Reviews & Ratings
  - Service Providers
  - Reports
  - Users
  - Abuse Flags
- **Top Bar:** Search, notifications, profile menu

### Hostel Admin/Warden Portal
- **Layout:** Sidebar navigation + top bar + main content area
- **Sidebar Sections:**
  - Dashboard
  - Profile (hostel settings)
  - Rooms & Beds
  - Residents
  - Payments
  - Food Menu
  - Notices
  - Complaints
  - Night Status
  - SOS Alerts
  - Move In/Out Checklist
  - Maintenance
  - Service Providers
  - Inquiries
  - Referrals
  - Reports
- **Top Bar:** Hostel name, notifications, profile menu
- **Warden Variation:** Limited sidebar items (permission-gated)

### Resident Portal
- **Layout:** Top navigation with tabs (desktop) or bottom tab navigation (mobile)
- **Nav Items:**
  - Dashboard/Home
  - Payments
  - Food
  - Notices
  - Complaints
  - Night Status
  - Notifications
  - Profile
  - Referral
  - Reviews
  - SOS (emergency action)

### Guardian Dashboard
- **Layout:** Single-page simplified view, minimal navigation
- **Content:** Summary cards only - no complex navigation needed
- **Sections:** Child Info, Payment Status, Recent Notices, Food Menu, Emergency Contact

---
