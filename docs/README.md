# docs/ — AI Project Documentation

This folder contains all project documentation used by AI coding assistants and human developers working on the **Multi-Hostel SaaS Platform**.

## Reading Order

For an AI assistant starting a new session, read in this order:

1. **`PRD.md`** — what we are building and why
2. **`ARCHITECTURE.md`** — how it fits together
3. **`PHASES.md`** — ⭐ what to build right now (and what NOT to build)
4. **`RULES.md`** — how the AI must behave
5. **`MEMORY.md`** — current running state of the project
6. **`API.md`** + **`DATABASE.md`** — current contracts
7. **`DESIGN.md`** — UI/UX guidelines when building screens
8. **`FOLDER_STRUCTURE.md`** + **`CODING_STANDARDS.md`** — where and how to write code
9. **`ENVIRONMENT.md`** — how to run it locally
10. **`TESTING.md`** — how to prove it works
11. **`EMAIL_SYSTEM.md`** — comprehensive email trigger specifications
12. **`CHANGELOG.md`** — historical record

## Golden Rules

1. **Never skip phases.** Work only on the current phase in `PHASES.md`.
2. **Update `MEMORY.md` continuously.**
3. **Multi-tenant isolation and role gates are non-negotiable.**
4. **Update `API.md` and `DATABASE.md` in the same PR that changes them.**
5. **End every phase with a `CHANGELOG.md` entry.**
6. **Every email trigger must follow `EMAIL_SYSTEM.md` specifications.**

## Tech Stack (Locked Decisions)

- **Database**: MongoDB + Mongoose
- **Backend**: Next.js 14+ App Router (full-stack monolith with API routes)
- **Frontend**: Next.js + React + TypeScript
- **UI**: shadcn/ui + Tailwind CSS + lucide-react
- **State Management**: TanStack Query (server state) + Zustand (client state)
- **File Storage**: Cloudflare R2 (S3-compatible)
- **Email**: Resend (transactional email with templates)
- **Maps**: OpenStreetMap/Leaflet (default) with runtime fallback to Google Maps if env configured
- **Auth**: Custom JWT + Google OAuth (unified login gateway)
- **Mobile**: React Native + Expo (Phase 6, post web-launch)
- **Hosting**: Vercel (web), Firebase (mobile push notifications in Phase 6)

## Project Timeline

- **Phases 1-5**: Web platform (5 weeks)
- **Phase 6**: Mobile app (post web-launch, ~2-3 weeks)
- **Total**: ~7-8 weeks for complete web + mobile delivery

---

_The full source-of-truth product doc lives outside this folder; these docs interpret and operationalize it for day-to-day development._
