# CHANGELOG.md

Format follows [Keep a Changelog](https://keepachangelog.com/) — sections per release: `Added`, `Changed`, `Fixed`, `Removed`. Newest at the top. Update this alongside `MEMORY.md` whenever a phase or notable milestone completes.

---

## [Unreleased]

### Planned
- Phase 1: Turborepo monorepo scaffold, MongoDB connection, Mongoose models, unified auth system, hostel onboarding/approval
- Phase 2: Public discovery site, hostel profile pages, room/bed management
- Phase 3: Resident system, QR activation, payments, food menu, **Cook Portal**, **residentType tracking**
- Phase 4: Complaints, night safety, ratings, guardian dashboard, **Location Tracking & Auto-Attendance**, **Community Feature**
- Phase 5: Referrals, service providers, maintenance, **QuestionCall Integration**, **Advanced Notifications**, **Configuration System**, final polish
- Phase 6: React Native mobile app with QR scanning, push notifications, **background location service**, **cook mobile app**, **community mobile**

---

## [0.2.0] - 2026-07-14 (Late)

### Added

**Major Features (Documentation Only - Implementation in Phases 3-6):**

- **Cook Portal** (Phase 3):
  - Dedicated mobile app for cooks with "Food Ready" button
  - Push notifications to all residents when meal is ready
  - Device fingerprint tracking for multiple cooks
  - Food timing analytics for admin dashboard
  - Cook credentials auto-generated during hostel registration

- **Community Feature** (Phase 4):
  - Resident social feed with PUBLIC/HOSTEL_ONLY visibility
  - Posts, comments, reactions (6 types: like, love, care, haha, sad, angry)
  - Anonymous posting option
  - Admin moderation tools, profanity filter, reporting system
  - Push notifications for engagement

- **Location Tracking & Auto-Attendance** (Phase 4):
  - Privacy-first: NEVER stores exact GPS coordinates, only zone status
  - Background service pings 3x daily (morning, evening, night - configurable)
  - Zones: INSIDE (0-50m), NEARBY (51-200m), OUTSIDE (201m+), UNKNOWN
  - Attendance dashboard with real-time view and patterns
  - Attendance alerts if resident absent X consecutive days (default: 14)
  - Auto-delete location data after 600 days (configurable)
  - Resident can request location history deletion

- **QuestionCall Integration** (Phase 5):
  - Study platform button for STUDENT residents only
  - Click tracking and conversion analytics
  - Superadmin dashboard with CSV export
  - Single sign-on with signed JWT

- **Advanced Notifications** (Phase 5):
  - Priority levels: INFO, NORMAL, URGENT
  - Categories: FOOD_READY, PAYMENT, ATTENDANCE, SOS, COMMUNITY, etc.
  - Target: all residents, specific residents, specific floor/room, platform-wide
  - Scheduled notifications with delivery stats
  - Read receipts (who read, who didn't)

- **Configuration System** (Phase 5):
  - Two-level hierarchy: Platform defaults + Hostel overrides
  - Hostel admin configurable: geofence radius, tracking times, data retention, cook portal, community
  - Superadmin can override any hostel setting
  - Platform enforces min/max limits

- **Privacy & Compliance**:
  - Consent logging for terms, privacy policy, location tracking
  - Account deletion with 60-day grace period
  - Data retention policies with auto-cleanup
  - GDPR-style user rights (access, erasure, portability)
  - **PRIVACY_POLICY.md** created with location tracking transparency

**Database Changes:**
- Added **COOK** role to User model
- Added **residentType** field to Resident (STUDENT/WORKING_PROFESSIONAL/OTHER)
- Added **facilityDetails** to Hostel (totalToilets, parkingCapacity, hasGarden, hasCCTV, etc.)
- **14 new models**: Notification, NotificationReceipt, FoodReadyLog, AttendanceLog, AttendanceAlert, CommunityPost, CommunityComment, CommunityReaction, QuestionCallClick, HostelSettings, PlatformConfig, ConsentLog, AccountDeletionRequest
- **5 new enums**: NotificationPriority, NotificationCategory, LocationZone, CommunityPostVisibility, ResidentType

**API Changes:**
- **60+ new endpoints** across Cook Portal, Community, Location Tracking, Notifications, QuestionCall, Configuration, Privacy
- Enhanced hostel profile PATCH with facilityDetails
- Enhanced resident registration POST with residentType

**Architecture Changes:**
- Push Notification Architecture (FCM + APNS)
- Location Tracking Architecture (privacy-first zone calculation)
- Community Feature Architecture (moderation system)
- Cook Portal Architecture (device fingerprint tracking)
- Configuration System Architecture (two-level hierarchy)
- Account Deletion Architecture (60-day grace period)

**Documentation Updates:**
- DATABASE.md: 14 new models, enhanced Resident and Hostel models
- API.md: 60+ new endpoints
- PHASES.md: Features integrated into Phases 3-6
- ARCHITECTURE.md: 7 new major sections
- RULES.md: 6 new rule sections
- PRIVACY_POLICY.md: Created (321 lines)
- MEMORY.md: New features documented
- CHANGELOG.md: This entry

---

## [0.1.0] - 2026-07-14

### Added
- Complete `docs/` documentation set (13 files):
  - `README.md` — documentation index + tech stack summary
  - `PRD.md` — full product requirements with personas, goals, auth model
  - `ARCHITECTURE.md` — system architecture with MongoDB, smart maps fallback, PlatformConfig pattern
  - `DATABASE.md` — complete Mongoose schemas for 30+ collections with TypeScript interfaces
  - `EMAIL_SYSTEM.md` — comprehensive email trigger specifications (30+ scenarios)
  - `API.md` — API endpoint contracts (to be created in next phase)
  - `PHASES.md` — 6-phase development roadmap (to be created)
  - `RULES.md` — AI coding rules & constraints (to be created)
  - `DESIGN.md` — UI/UX guidelines (to be created)
  - `FOLDER_STRUCTURE.md` — monorepo organization (to be created)
  - `CODING_STANDARDS.md` — code conventions (to be created)
  - `ENVIRONMENT.md` — env vars & setup (to be created)
  - `TESTING.md` — testing strategy (to be created)
  - `MEMORY.md` — running project state tracker
  - `CHANGELOG.md` — this file

### Tech Stack Finalized
- **Database:** MongoDB + Mongoose (instead of PostgreSQL + Prisma from v2 docs)
- **Backend:** Next.js 14+ App Router (full-stack)
- **UI:** shadcn/ui + Tailwind CSS + lucide-react
- **State:** TanStack Query + Zustand
- **Auth:** Custom JWT + Google OAuth with unified login + account upgrade mechanism
- **Email:** Resend with template system (30+ scenarios documented)
- **File Storage:** Cloudflare R2
- **Maps:** OpenStreetMap + Leaflet (default) with runtime fallback to Google Maps Platform
- **Mobile:** React Native + Expo (Phase 6)
- **Hosting:** Vercel

### Key Architecture Decisions
- **Multi-tenancy:** Application-layer isolation via `hostelId` filtering on all hostel-scoped queries
- **Account upgrade:** Existing PUBLIC accounts are upgraded in place (not duplicated) when admin-registered
- **Email verification:** Required for all PUBLIC signups
- **PlatformConfig:** Runtime-configurable values cached for performance
- **Smart maps fallback:** Auto-detect Google Maps availability at runtime, fall back to OSM if unavailable/unconfigured
- **Timeline:** 5 weeks for web (Phases 1-5) + 2-3 weeks for mobile (Phase 6) = ~7-8 weeks total

### No Code Changes Yet
This release is documentation-only. No application code has been written. Next step is Phase 1 implementation kickoff.

---

## Template for Phase Completions

Copy this for each phase completion:

```markdown
## [Phase X] - YYYY-MM-DD

### Added
- (list new features)

### Changed
- (list modifications)

### Fixed
- (list bug fixes)

### Tested
- (list test coverage added)

### Notes
- (any decisions, risks, or context for next phase)
```

---

_End of CHANGELOG.md_
