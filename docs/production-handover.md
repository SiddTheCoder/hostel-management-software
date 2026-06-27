# Production Handover Checklist

This checklist is the pilot-readiness handover path after automated QA passes and before manual QA signoff.

## Environments

- Copy `.env.development.example`, `.env.staging.example`, or `.env.production.example` into the target deployment secret store.
- Use separate MongoDB databases for development, staging, and production.
- Keep `COOKIE_SECURE=true` for staging and production.
- Replace every JWT, OTP, provider, and seed/recovery secret before deploying.

## Public Form Protection

Public write endpoints are rate-limited by IP/user-agent:

- `/api/v1/public/hostels/:slug/inquiries`
- `/api/v1/public/inquiries/with-referral`
- `/api/v1/public/service-providers/register`

Tune with:

- `PUBLIC_FORM_RATE_LIMIT_MAX`
- `PUBLIC_FORM_RATE_LIMIT_WINDOW_SECONDS`

## Upload Policy

File assets validate MIME type and size before persistence.

- Images default to 5 MB: `UPLOAD_MAX_IMAGE_BYTES`
- Documents default to 10 MB: `UPLOAD_MAX_DOCUMENT_BYTES`
- Image MIME allow-list: `ALLOWED_IMAGE_MIME_TYPES`
- Document MIME allow-list: `ALLOWED_DOCUMENT_MIME_TYPES`

Object storage must keep private documents, payment proofs, resident documents, service-provider documents, complaint attachments, and room-condition photos non-public.

## Seed Data

For local or staging walkthroughs:

```bash
npm run web:seed:demo
```

This creates demo platform, hostel-admin, resident, guardian, hostel, room/bed, service-provider, inquiry, payment, food, and notice records. Never run demo seed in production with the default password.

## Admin Recovery

Use only for controlled account recovery:

```bash
ADMIN_RECOVERY_EMAIL=owner@example.com ADMIN_RECOVERY_PASSWORD="new-long-password" ADMIN_RECOVERY_CONFIRM=YES npm run web:recover:admin
```

The script only resets an existing `PLATFORM_OWNER` account and reactivates it.

## Private Document Check

Run before handover and periodically after migrations:

```bash
npm run web:check:private-documents
```

Set `PRIVATE_DOCUMENT_CHECK_STRICT_MISSING=true` in staging/production to fail if document records point at missing file assets.

## Backups

Use the backup helper from a machine with `mongodump` installed:

```powershell
.\scripts\mongodb-backup.ps1 -MongoUri "$env:MONGODB_URI"
```

Recommended pilot schedule:

- Daily automated MongoDB snapshot.
- Manual dump before migrations or bulk imports.
- Monthly restore test into a staging database.

## Deployment Checks

Run:

```bash
npm run web:deploy:check
npm run mobile:build:test
npm run web:check:private-documents
```

Then complete the manual QA checklist in the phase trackers before marking pilot onboarding ready.
