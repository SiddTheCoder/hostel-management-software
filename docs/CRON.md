# CRON.md — Scheduled Jobs

This project runs scheduled maintenance via **[cron-job.org](https://cron-job.org)** (external
scheduler), not Vercel Cron. Each cron endpoint is a normal API route protected by a shared secret.

## Authentication

Cron endpoints authorize with the `CRON_SECRET` env var, sent in a **header only** — never a
`?key=` query param (a secret in a URL leaks into access logs, CDN/proxy logs, browser history, and
the `Referer` header of outbound navigations). Comparison is timing-safe. Helper:
[`apps/web/src/lib/cron-auth.ts`](../apps/web/src/lib/cron-auth.ts) → `validateCronRequest(request)`.

Send the secret as either:

- `x-cron-secret: <CRON_SECRET>`  ← use this on cron-job.org
- `Authorization: Bearer <CRON_SECRET>`

Set `CRON_SECRET` in the deployed environment (a long random string; rotate before production —
the dev value in `.env` is a placeholder).

## Endpoints

### Purge expired OTP challenges

`POST /api/v1/cron/purge-expired-otps`

Deletes `OtpChallenge` documents whose `expiresAt` has passed. The collection also has a TTL index,
so this is an explicit backup sweep (MongoDB's TTL monitor runs on its own ~60s cadence and can lag
under load). Idempotent. Returns `{ deleted: <count> }`.

- Recommended schedule: daily (e.g. `0 3 * * *`).

> Future phases add more cron jobs here (payment reminders, complaint SLA checks, soft-deleted
> account purge). Each one reuses `validateCronRequest` and is added to this list.

## cron-job.org setup (per job)

- **Method:** `POST`
- **URL:** the deployed endpoint, e.g. `https://your-domain.com/api/v1/cron/purge-expired-otps`
  (no query parameters)
- **Headers:** add `x-cron-secret` with the value of the deployed `CRON_SECRET`
  (cron-job.org: job → *Advanced* → *Headers*)
- **Body:** none
- **Schedule:** as listed per endpoint above

## Troubleshooting `Unauthorized` / `500`

1. `500 CRON_NOT_CONFIGURED` → `CRON_SECRET` is not set in the deployed environment.
2. `401 UNAUTHORIZED` → the header value doesn't match the deployed `CRON_SECRET`, or you're calling
   the wrong domain, or the job still uses a retired `?key=` query param instead of the header.
3. Confirm the method is `POST`.
