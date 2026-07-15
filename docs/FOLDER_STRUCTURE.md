# FOLDER_STRUCTURE.md — Folder Organization

Monorepo, managed with **Turborepo** + **pnpm workspaces**.

```text
multi-hostel-platform/
├── apps/
│   ├── web/                          # Next.js app (App Router) — web + API
│   │   ├── app/
│   │   │   ├── (public)/             # No auth required
│   │   │   │   ├── page.tsx          # Home / hostel search
│   │   │   │   ├── hostels/
│   │   │   │   │   ├── page.tsx      # Hostel listing
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx  # Hostel detail
│   │   │   │   ├── compare/
│   │   │   │   │   └── page.tsx      # Hostel comparison
│   │   │   │   └── service-providers/
│   │   │   │       └── register/
│   │   │   │           └── page.tsx
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── signup/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── verify-email/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── forgot-password/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── reset-password/
│   │   │   │       └── page.tsx
│   │   │   ├── (superadmin)/
│   │   │   │   └── superadmin/
│   │   │   │       ├── layout.tsx     # Requires SUPERADMIN role
│   │   │   │       ├── dashboard/
│   │   │   │       ├── hostels/
│   │   │   │       ├── subscriptions/
│   │   │   │       ├── reports/
│   │   │   │       ├── reviews/
│   │   │   │       ├── providers/
│   │   │   │       ├── announcements/
│   │   │   │       ├── config/
│   │   │   │       └── moderators/
│   │   │   ├── (moderator)/
│   │   │   │   └── moderator/
│   │   │   │       ├── layout.tsx     # Requires PLATFORM_MODERATOR role
│   │   │   │       ├── dashboard/
│   │   │   │       ├── hostels/
│   │   │   │       ├── reviews/
│   │   │   │       ├── providers/
│   │   │   │       └── reports/
│   │   │   ├── (hostel-admin)/
│   │   │   │   └── hostel-admin/
│   │   │   │       ├── layout.tsx     # Requires HOSTEL_ADMIN or WARDEN role
│   │   │   │       ├── dashboard/
│   │   │   │       ├── profile/
│   │   │   │       ├── rooms/
│   │   │   │       ├── residents/
│   │   │   │       ├── payments/
│   │   │   │       ├── food/
│   │   │   │       ├── notices/
│   │   │   │       ├── complaints/
│   │   │   │       ├── night-status/
│   │   │   │       ├── maintenance/
│   │   │   │       ├── staff/
│   │   │   │       └── inquiries/
│   │   │   ├── (resident)/
│   │   │   │   └── resident/
│   │   │   │       ├── layout.tsx     # Requires RESIDENT role
│   │   │   │       ├── dashboard/
│   │   │   │       ├── payments/
│   │   │   │       ├── food/
│   │   │   │       ├── notices/
│   │   │   │       ├── complaints/
│   │   │   │       ├── profile/
│   │   │   │       └── referral/
│   │   │   ├── (guardian)/
│   │   │   │   └── guardian/
│   │   │   │       ├── layout.tsx     # Requires GUARDIAN role
│   │   │   │       └── dashboard/
│   │   │   ├── activate/
│   │   │   │   └── page.tsx           # QR activation (public/resident)
│   │   │   └── api/
│   │   │       ├── auth/
│   │   │       │   ├── signup/route.ts
│   │   │       │   ├── verify-email/route.ts
│   │   │       │   ├── login/route.ts
│   │   │       │   ├── google/route.ts
│   │   │       │   ├── google/callback/route.ts
│   │   │       │   ├── refresh/route.ts
│   │   │       │   ├── logout/route.ts
│   │   │       │   ├── me/route.ts
│   │   │       │   ├── change-password/route.ts
│   │   │       │   ├── forgot-password/route.ts
│   │   │       │   └── reset-password/route.ts
│   │   │       ├── public/
│   │   │       │   ├── hostels/route.ts
│   │   │       │   ├── hostels/[id]/route.ts
│   │   │       │   ├── hostels/[id]/nearby/route.ts
│   │   │       │   ├── hostels/compare/route.ts
│   │   │       │   ├── inquiries/route.ts
│   │   │       │   ├── service-providers/route.ts
│   │   │       │   └── colleges/route.ts
│   │   │       ├── superadmin/
│   │   │       │   ├── dashboard/route.ts
│   │   │       │   ├── hostels/route.ts
│   │   │       │   ├── hostels/[id]/approve/route.ts
│   │   │       │   ├── hostels/[id]/reject/route.ts
│   │   │       │   ├── hostels/[id]/suspend/route.ts
│   │   │       │   ├── hostels/[id]/documents/route.ts
│   │   │       │   ├── documents/[id]/review/route.ts
│   │   │       │   ├── duplicates/route.ts
│   │   │       │   ├── subscriptions/route.ts
│   │   │       │   ├── subscriptions/[id]/verify/route.ts
│   │   │       │   ├── reports/route.ts
│   │   │       │   ├── announcements/route.ts
│   │   │       │   ├── reviews/[id]/hide/route.ts
│   │   │       │   ├── service-providers/route.ts
│   │   │       │   ├── service-providers/[id]/route.ts
│   │   │       │   ├── platform-config/route.ts
│   │   │       │   └── moderators/route.ts
│   │   │       ├── moderator/
│   │   │       │   ├── hostels/route.ts
│   │   │       │   ├── hostels/[id]/approve/route.ts
│   │   │       │   ├── hostels/[id]/reject/route.ts
│   │   │       │   ├── service-providers/route.ts
│   │   │       │   ├── service-providers/[id]/route.ts
│   │   │       │   ├── reviews/[id]/hide/route.ts
│   │   │       │   └── reports/route.ts
│   │   │       ├── hostel-admin/
│   │   │       │   ├── profile/route.ts
│   │   │       │   ├── staff/route.ts
│   │   │       │   ├── staff/[id]/permissions/route.ts
│   │   │       │   ├── rooms/route.ts
│   │   │       │   ├── rooms/[roomId]/beds/route.ts
│   │   │       │   ├── beds/[id]/route.ts
│   │   │       │   ├── residents/route.ts
│   │   │       │   ├── residents/[id]/route.ts
│   │   │       │   ├── residents/[id]/qr/route.ts
│   │   │       │   ├── residents/[id]/move-in/route.ts
│   │   │       │   ├── residents/[id]/move-out/route.ts
│   │   │       │   ├── payments/route.ts
│   │   │       │   ├── payments/[id]/proofs/route.ts
│   │   │       │   ├── payments/[id]/proofs/[proofId]/verify/route.ts
│   │   │       │   ├── food-menu/route.ts
│   │   │       │   ├── food-photos/route.ts
│   │   │       │   ├── notices/route.ts
│   │   │       │   ├── complaints/route.ts
│   │   │       │   ├── complaints/[id]/route.ts
│   │   │       │   ├── night-status/route.ts
│   │   │       │   ├── maintenance-requests/route.ts
│   │   │       │   ├── maintenance-requests/[id]/route.ts
│   │   │       │   ├── service-providers/search/route.ts
│   │   │       │   └── inquiries/route.ts
│   │   │       ├── resident/
│   │   │       │   ├── dashboard/route.ts
│   │   │       │   ├── profile/route.ts
│   │   │       │   ├── payments/route.ts
│   │   │       │   ├── payments/[id]/proof/route.ts
│   │   │       │   ├── notices/route.ts
│   │   │       │   ├── complaints/route.ts
│   │   │       │   ├── night-status/route.ts
│   │   │       │   ├── sos/route.ts
│   │   │       │   ├── ratings/route.ts
│   │   │       │   ├── referral/route.ts
│   │   │       │   ├── guardian-invite/route.ts
│   │   │       │   ├── guardian/[id]/permissions/route.ts
│   │   │       │   ├── food-menu/route.ts
│   │   │       │   └── hostel/route.ts
│   │   │       ├── guardian/
│   │   │       │   ├── dashboard/route.ts
│   │   │       │   ├── payments-summary/route.ts
│   │   │       │   ├── notices/route.ts
│   │   │       │   └── night-status-summary/route.ts
│   │   │       ├── notifications/route.ts
│   │   │       ├── notifications/[id]/read/route.ts
│   │   │       ├── notifications/read-all/route.ts
│   │   │       ├── uploads/sign/route.ts
│   │   │       ├── qr-activation/
│   │   │       │   ├── verify/route.ts
│   │   │       │   └── activate/route.ts
│   │   │       ├── platform/
│   │   │       │   └── config/route.ts
│   │   │       └── cron/
│   │   │           ├── payment-reminders/route.ts
│   │   │           ├── subscription-expiry/route.ts
│   │   │           ├── complaint-sla-check/route.ts
│   │   │           └── nearby-places-refresh/route.ts
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui generated components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── form.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── toast.tsx
│   │   │   │   └── skeleton.tsx
│   │   │   └── shared/               # Custom components per DESIGN.md §4
│   │   │       ├── HostelCard.tsx
│   │   │       ├── VerificationBadge.tsx
│   │   │       ├── StatusBadge.tsx
│   │   │       ├── RoomBedMap.tsx
│   │   │       ├── PaymentSummaryCard.tsx
│   │   │       ├── NightStatusIndicator.tsx
│   │   │       ├── ComplaintThread.tsx
│   │   │       ├── InquiryForm.tsx
│   │   │       ├── NoticeFeed.tsx
│   │   │       ├── MaintenanceRequestCard.tsx
│   │   │       ├── LeafletMap.tsx
│   │   │       ├── GoogleMap.tsx
│   │   │       └── MapProvider.tsx
│   │   ├── lib/
│   │   │   ├── auth/
│   │   │   │   ├── session.ts        # getSession(), requireRole(), requireHostelAccess()
│   │   │   │   ├── jwt.ts            # sign/verify tokens
│   │   │   │   └── google.ts         # Google OAuth helpers
│   │   │   ├── api-client.ts         # Axios instance with interceptors
│   │   │   ├── maps/
│   │   │   │   ├── provider.ts       # Map provider detection
│   │   │   │   ├── geocode.ts        # Address → lat/lng
│   │   │   │   └── nearby.ts         # Nearby places search
│   │   │   ├── upload.ts             # R2 upload helpers
│   │   │   └── utils.ts              # General utilities
│   │   ├── hooks/                    # TanStack Query hooks
│   │   │   ├── useHostels.ts
│   │   │   ├── useRooms.ts
│   │   │   ├── useResidents.ts
│   │   │   ├── usePayments.ts
│   │   │   ├── useNotifications.ts
│   │   │   └── usePlatformConfig.ts
│   │   ├── store/                    # Zustand stores
│   │   │   ├── filters.ts            # Hostel search filters
│   │   │   ├── comparison.ts         # Comparison tray
│   │   │   └── ui.ts                 # Modal state, etc.
│   │   ├── styles/
│   │   │   └── globals.css           # Tailwind + custom tokens
│   │   ├── public/
│   │   │   ├── favicon.ico
│   │   │   └── images/
│   │   ├── middleware.ts             # Route-level auth guard
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── mobile/                       # React Native/Expo app — Phase 6
│       ├── app/
│       │   ├── (tabs)/
│       │   │   ├── _layout.tsx       # Bottom tab nav
│       │   │   ├── index.tsx         # Home
│       │   │   ├── payments.tsx
│       │   │   ├── food.tsx
│       │   │   ├── notices.tsx
│       │   │   └── more.tsx
│       │   ├── (auth)/
│       │   │   ├── login.tsx
│       │   │   └── activate.tsx      # QR scan
│       │   ├── complaints/
│       │   ├── profile/
│       │   └── _layout.tsx
│       ├── components/
│       ├── lib/
│       │   ├── api-client.ts         # Same as web, token in SecureStore
│       │   └── notifications.ts      # FCM setup
│       ├── assets/
│       ├── app.json
│       ├── eas.json
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   ├── db/
│   │   ├── src/
│   │   │   ├── connection.ts         # Mongoose connection
│   │   │   ├── models/               # All Mongoose models from DATABASE.md
│   │   │   │   ├── User.ts
│   │   │   │   ├── Hostel.ts
│   │   │   │   ├── HostelDocument.ts
│   │   │   │   ├── HostelStaff.ts
│   │   │   │   ├── Room.ts
│   │   │   │   ├── Bed.ts
│   │   │   │   ├── Resident.ts
│   │   │   │   ├── Guardian.ts
│   │   │   │   ├── QRActivation.ts
│   │   │   │   ├── Payment.ts
│   │   │   │   ├── PaymentProof.ts
│   │   │   │   ├── Receipt.ts
│   │   │   │   ├── NightStatusLog.ts
│   │   │   │   ├── FoodMenu.ts
│   │   │   │   ├── FoodPhoto.ts
│   │   │   │   ├── Notice.ts
│   │   │   │   ├── Complaint.ts
│   │   │   │   ├── ComplaintUpdate.ts
│   │   │   │   ├── RatingReview.ts
│   │   │   │   ├── MoveInChecklist.ts
│   │   │   │   ├── MoveOutChecklist.ts
│   │   │   │   ├── ServiceProvider.ts
│   │   │   │   ├── MaintenanceRequest.ts
│   │   │   │   ├── Inquiry.ts
│   │   │   │   ├── Referral.ts
│   │   │   │   ├── Notification.ts
│   │   │   │   ├── Subscription.ts
│   │   │   │   ├── PlatformConfig.ts
│   │   │   │   └── AuditLog.ts
│   │   │   ├── repositories/         # Tenant-scoped query functions
│   │   │   │   ├── hostels.repository.ts
│   │   │   │   ├── rooms.repository.ts
│   │   │   │   ├── residents.repository.ts
│   │   │   │   ├── payments.repository.ts
│   │   │   │   ├── complaints.repository.ts
│   │   │   │   └── platformConfig.repository.ts
│   │   │   └── seed.ts               # Creates initial SUPERADMIN
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── shared/
│       ├── src/
│       │   ├── schemas/              # Zod schemas (shared by API + forms)
│       │   │   ├── auth.schema.ts
│       │   │   ├── hostel.schema.ts
│       │   │   ├── resident.schema.ts
│       │   │   ├── payment.schema.ts
│       │   │   ├── complaint.schema.ts
│       │   │   └── notice.schema.ts
│       │   ├── types/                # Shared TS types
│       │   │   ├── enums.ts          # All enums from DATABASE.md
│       │   │   ├── roles.ts
│       │   │   └── api.ts            # API request/response types
│       │   ├── email/
│       │   │   ├── sender.ts         # sendEmail() helper
│       │   │   └── templates/        # Email templates per EMAIL_SYSTEM.md
│       │   │       ├── auth/
│       │   │       │   ├── verification.tsx
│       │   │       │   ├── credentials-issued.tsx
│       │   │       │   ├── password-reset.tsx
│       │   │       │   └── account-upgraded.tsx
│       │   │       ├── hostel/
│       │   │       │   ├── submission-received.tsx
│       │   │       │   ├── hostel-approved.tsx
│       │   │       │   ├── hostel-rejected.tsx
│       │   │       │   └── inquiry-received.tsx
│       │   │       ├── payment/
│       │   │       │   ├── payment-due-reminder.tsx
│       │   │       │   ├── payment-overdue.tsx
│       │   │       │   ├── proof-uploaded.tsx
│       │   │       │   ├── payment-verified.tsx
│       │   │       │   └── payment-rejected.tsx
│       │   │       ├── resident/
│       │   │       │   ├── qr-activation.tsx
│       │   │       │   ├── new-notice.tsx
│       │   │       │   ├── complaint-status-updated.tsx
│       │   │       │   └── complaint-resolved.tsx
│       │   │       ├── guardian/
│       │   │       │   ├── invitation.tsx
│       │   │       │   └── sos-alert.tsx
│       │   │       └── service-provider/
│       │   │           ├── registration-received.tsx
│       │   │           ├── provider-approved.tsx
│       │   │           └── provider-rejected.tsx
│       │   ├── constants/
│       │   │   ├── service-categories.ts
│       │   │   ├── complaint-categories.ts
│       │   │   └── notice-categories.ts
│       │   └── utils/
│       │       ├── format.ts         # Date/currency formatters
│       │       └── validation.ts     # Custom validators
│       ├── tsconfig.json
│       └── package.json
│
├── docs/                             # This documentation set
│   ├── README.md
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── API.md
│   ├── EMAIL_SYSTEM.md
│   ├── PHASES.md
│   ├── RULES.md
│   ├── DESIGN.md
│   ├── FOLDER_STRUCTURE.md
│   ├── CODING_STANDARDS.md
│   ├── ENVIRONMENT.md
│   ├── TESTING.md
│   ├── MEMORY.md
│   └── CHANGELOG.md
│
├── .gitignore
├── .env.example
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.json
└── README.md
```

---

## Notes

- **Route groups** `(public)`, `(auth)`, `(superadmin)`, etc. map 1:1 to the portals in PRD.md §7 — each gets its own `layout.tsx` enforcing the correct role via `middleware.ts`.
- **`packages/db/src/repositories/`** is where the multi-tenancy rule (RULES.md §3) actually gets enforced in code — route handlers should call these, not Mongoose models directly, for any hostel-scoped operations.
- **`packages/shared`** is what Phase 6's `apps/mobile` will import for types/schemas — keep it framework-agnostic (no Next.js or React Native imports inside it).
- **`apps/mobile`** stays an empty placeholder folder (or absent entirely) until Phase 6 — don't scaffold it early just because it's in the diagram.

---

## Ownership Rule

- **Every folder has a purpose.** If a new file doesn't fit, propose a new folder in this doc first.
- No `misc/`, no `utils/utils/`, no `helpers/helpers/`.
- Colocate related files (e.g., `HostelCard.tsx` + `HostelCard.test.tsx` in same folder).

---

_End of FOLDER_STRUCTURE.md_
