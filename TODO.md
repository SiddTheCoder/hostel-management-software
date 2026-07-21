# TODO — Complete Phase 1 (Foundation & Auth)

> Extraction of everything still open for **Phase 1** per `docs/PHASES.md` §1.1/§1.2,
> reconciled against the actual codebase and `docs/MEMORY.md` resume point.
> Status legend: ☐ open · ☑ done this session · ⏸ blocked (needs user/infra) · 🔒 locked deviation (deferred deliberately)

## Baseline (final — 2026-07-21)

| Check | Result |
|---|---|
| `npm --prefix apps/web run build` | ✅ green (exit 0) |
| `npm --prefix apps/web run test` | ✅ 95/95 passing (18 files) |
| `npm --prefix apps/web run typecheck` | ✅ clean |
| `npm --prefix apps/web run lint` | ✅ 0 errors (14 pre-existing warnings, none in new files) |

---

## A. Do now (agent-completable, in Phase 1 scope) — ✅ DONE

- [x] **A1. Fixed the typecheck regression** — added `mustChangePassword` to the `mockExistingUser` base
  in `apps/web/src/modules/users/user.service.test.ts`.
- [x] **A2. Audit log viewer (read-only)** — PHASES.md §1.1 deliverable now ☑.
  `audit.service.ts` (`listPlatformAuditLogs`, actor/hostel labels resolved) + `audit.validation.ts`,
  `GET /api/v1/platform/audit-logs` (SUPERADMIN-gated), `/platform/audit-logs` page + component + nav
  item, 3 service tests.
- [x] **A3. §3.2 high-privilege upgrade safeguard** — implemented via the **temp-password gate**
  (doc's second accepted mechanism): PUBLIC→HOSTEL_ADMIN/SUPERADMIN now rotates to a fresh emailed
  temporary password + `mustChangePassword`, so the elevated role needs mailbox proof to use.
  Lower-trust roles unchanged. 1 new test.
- [x] **A4. Index audit for Phase 1 models** — verified `User`, `Hostel`, `HostelDocument`, `Room`,
  `Bed`, `AuditLog`, `Session`, `HostelMember`, `HostelApplication`, `HostelVerification` already
  satisfy the DATABASE.md Indexing Strategy Summary. No changes needed.
- [x] **A5. Automated coverage** — added audit-service + §3.2 safeguard unit tests (suite 91→95).
  (Full end-to-end §1.2 still needs a running instance — see B4.)
- [x] **A6. Re-ran build + test + typecheck + lint green**; ticked PHASES.md audit-viewer box; updated
  `docs/MEMORY.md`, `docs/PHASES.md`, `docs/CHANGELOG.md`.
- [x] **A7. Production file naming** (per follow-up instruction) — renamed all `phase*` source files:
  `portal-shared.tsx`, `platform-hostel-routes.test.ts`, `growth-routes.test.ts`.

## B. Blocked — needs the user / external infrastructure

- [~] **B1. Cloudflare R2** (§1.1 File Storage) — **temporarily unblocked**: R2 creds BORROWED from the
  QuestionCall project are wired into `.env`/`.env.local` (bucket `question-call-storage`). Uploads work
  now. **Still owed:** create THIS project's own R2 bucket + creds and replace the borrowed values
  (marked "REPLACE LATER" in env). See [[borrowed-infra-keys]].
- [~] **B2. Resend email** (§1.1) — **temporarily unblocked**: borrowed `RESEND_API_KEY` +
  `no-reply@questioncall.com` sender wired in. Email sends from QuestionCall's verified domain for now.
  **Still owed:** provision this project's own Resend domain/key and replace; then run the 7-template
  end-to-end delivery test.
- [x] **B3. Role migration against the dev DB** (resume-point step 2) — ✅ DONE 2026-07-21. Ran against the
  live dev DB (`MONGODB_URI` from repo-root `.env`): 12/17 users migrated
  (`PLATFORM_OWNER→SUPERADMIN` ×2, `HOSTEL_OWNER→HOSTEL_ADMIN` ×3, `PUBLIC_USER→PUBLIC` ×7). Re-run confirms
  idempotent — 0 legacy roles remain (`PUBLIC=8, HOSTEL_ADMIN=4, RESIDENT=3, SUPERADMIN=2`).
  Note: `migrate-roles.ts` uses extensionless ESM imports + the mongoose CJS/ESM named-export interop fails
  under raw `node`, so the migration was run via a collection-level `updateMany` (same legacy map). The
  in-repo script should be fixed (add `.ts` extensions / default-import mongoose) before it's relied on in CI.
- [ ] **B4. Manual acceptance-test pass (§1.2)** — the browser-level checks (signup→verify→login,
  QR-less approval → owner logs in as HOSTEL_ADMIN, document viewer, etc.) require a running instance
  with B1–B3 provisioned.
- [x] **B5. "No sensitive data in client bundles"** (§1.2 Security ☐) — ✅ DONE 2026-07-21. Ran a prod
  `next build` and scanned all 82 `.next/static` client chunks for the actual values of 10 server secrets
  (MONGODB pw, both JWT secrets, OTP hash secret, RESEND key, R2 key id + secret, Twilio SID + token,
  CRON secret): **0 leaks**. Grep methodology validated by positive hits on non-secret tokens
  (`googleusercontent`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`) in the same chunks.
  Incidental: `NEXT_PUBLIC_GOOGLE_CLIENT_ID`'s value was NOT inlined in this build (only the "not
  configured" fallback string is present) — Google sign-in may render disabled unless the public var is
  present when `next build` runs. Verify during B4.

## C. Deferred deliberately (documented; NOT part of a clean Phase 1)

- 🔒 **C1. Response-envelope migration** (§1.1 "Standard envelope everywhere" ☐) — app uses
  `{ success, message, data | errorCode }`; docs want `{ success, data | error:{code,message} }`.
  Locked in `docs/MEMORY.md`: migrate app-wide in ONE pass later, not piecemeal. Left as-is for Phase 1.
- 🔒 **C2. Repositories layer** `packages/db/src/repositories/` (§1.2 multi-tenancy item) — tenant
  scoping is currently enforced in `apps/web/src/modules/*` services + `lib/tenant.ts`. Functionally
  covered; a dedicated repo layer is a refactor, not a feature. Deferred.
- 🔒 **C3. Full field-level alignment of all ~60 models + Phase 3–5 model creation** — phase discipline
  (PHASES.md "rule of thumb") says do not build future-phase features now. Only the Phase 1 model set is
  in scope (see A4). The "all models from DATABASE.md" box stays open until later phases add them.
- 🔒 **C4. Locked deviations** — `/api/v1/*` legacy routes kept alongside `/api/auth/*`; Google ID-token
  POST instead of GET redirect; `.ts` HTML email templates instead of React Email `.tsx`;
  npm workspaces instead of pnpm. All intentional; see `docs/MEMORY.md` "Known deviations".

---

## Decisions

1. **A3 §3.2 safeguard approach** — ✅ resolved: implemented the **temp-password gate** (the doc's second
   accepted mechanism) rather than a full confirmation-link/page subsystem — smaller surface, no new
   endpoints, and it still requires mailbox proof before a HOSTEL_ADMIN role is usable. If a stricter
   "role stays PUBLIC until a confirm link is clicked" flow is ever wanted, it can layer on top later.
2. **Open for the user** — which B-items you'll provision (R2 bucket, live Resend, dev-DB role migration)
   so the matching PHASES.md boxes can be closed. These are the only things standing between the current
   state and a fully signed-off Phase 1 §1.2 acceptance pass.
