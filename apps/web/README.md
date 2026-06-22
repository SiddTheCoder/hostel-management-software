# HostelHub Web

Next.js App Router app for the public website, portal shells, and `/api/v1`
route handlers.

## Getting Started

From the repository root:

```bash
npm run web:dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## First Platform Owner

Set `MONGODB_URI` and the `SEED_PLATFORM_OWNER_*` values, then run:

```bash
npm run web:seed:platform-owner
```

The development default login is documented in `.env.example`; never use that
default password in production.

## Mobile Auth Contract

Mobile clients identify themselves with:

```txt
x-hostelhub-client: mobile
```

When that header is present, `POST /api/v1/auth/login` returns `refreshToken`
in the JSON response for secure device storage. Mobile refresh/logout calls send:

```json
{
  "refreshToken": "stored-refresh-token"
}
```

Web sessions continue using HTTP-only cookies.

## Checks

```bash
npm --prefix apps/web run format:check
npm run web:test
npm run web:lint
npm run web:build
```
