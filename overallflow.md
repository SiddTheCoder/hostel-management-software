# Overall Flow

## Reference Reviewed

Reference project: `D:\Jiwan-Mijhar\app` and `D:\Jiwan-Mijhar\web`.

The useful patterns from that project are:

- Web auth uses email/password credentials, Google OAuth, role-aware redirects, and a server-side session/JWT bridge.
- Email verification is sent through Resend with a clean OTP email template.
- Mobile auth stores access/refresh tokens securely and sends a mobile client header when it needs refresh tokens.
- Notifications are created as in-app records first, then optionally fanned out through realtime and push channels.
- Mobile push registration asks OS permission, stores a device token, and the app can route notification taps/deep links.

## HostelHub Auth Target

Public student auth should be simple:

- Login: email + password, or Google.
- Signup: email OTP + password, or Google.
- No SMS OTP for public auth.
- Phone number is still collected where it belongs: hostel admin resident registration, guardian/emergency contact, public inquiry/contact workflows.
- A student public account remains separate from private resident access until the hostel admin creates a resident record and issues an activation code/QR.

## HostelHub Auth Flow

1. Student enters email, name, and password on `/signup`.
2. Web/mobile calls `POST /api/v1/auth/otp/request` with `channel: "email"`.
3. Backend creates an `OtpChallenge`, hashes the code, applies resend/rate limits, and sends the OTP through Resend when configured.
4. Student enters the OTP.
5. Client calls `POST /api/v1/auth/otp/verify`.
6. Client calls `POST /api/v1/auth/register` with email, password, name, and verified challenge id.
7. Backend creates a `PUBLIC_USER`, marks the email verified, consumes the OTP challenge, creates a refresh session, signs access/refresh JWTs, and sets web cookies.
8. Mobile clients receive refresh tokens in the JSON response through the `x-hostelhub-client: mobile` header path.
9. Existing users call `POST /api/v1/auth/login` with email/password.
10. Google sign-in posts a Google ID token to `POST /api/v1/auth/google`; backend verifies the token, creates or links the account by verified email, and issues the same session shape.

## HostelHub Notification Flow

Current working foundation:

- `createInAppNotification()` writes a notification record.
- `GET /api/v1/notifications` lists the authenticated user's notifications.
- `PATCH /api/v1/notifications/:id/read` marks one notification read.
- `POST /api/v1/mobile/device-token` stores a mobile/web device token.
- Mobile has a resident notification screen that lists in-app notifications, marks read, and can save a device token.

Target completion based on the Jiwan reference:

- Keep notification creation non-blocking for the business action that triggered it.
- Add one `notifyUser` orchestration service that creates the in-app notification first.
- Fan out from that service to push providers using saved `DeviceToken` records.
- Keep push failures logged but non-fatal.
- Add app-side permission/token registration so users do not manually paste tokens.
- Add notification categories and deep-link data for resident notices, payments, complaints, SOS, and maintenance.

## Completed In This Pass

- Mounted the real web login/signup forms on `/login` and `/signup`.
- Removed public phone/SMS auth from backend validation and service logic.
- Made login email-only.
- Made signup email OTP + password only.
- Kept Google sign-in active through the existing Google ID token route.
- Replaced the Resend OTP body with a simple HTML/text email template.
- Added resend email OTP in the signup verification step.
- Updated mobile login/signup/register API types and screens to email-only public auth.
- Added explicit demo metadata fields: `isDemoData` and `demoDataLabel`.
- Locked seeded demo auth to fixed email/password accounts.
- Updated demo seed data to mark seeded users, hostels, residents, and related records as `Seed data: demo/test_data`.
- Seeded three demo hostels for platform-owner review and public listing flows.
- Linked `hosteladmin1@gmail.com` to the first seeded hostel so the hostel-admin portal loads correctly.
- Added clean `Mock/Test data` badges in the platform Users table, platform Hostels table, hostel admin profile, and hostel admin resident list.
- Made the auth screen viewport-locked and compact so login/signup stay on one screen.
- Made the portal sidebar viewport-locked with internal scrolling for long admin menus.

## Demo Seed Accounts

Default seeded demo password is `admin` unless `DEMO_SEED_PASSWORD` overrides it:

- Super admin: `superadmin@gmail.com` / `admin`
- Hostel admin: `hosteladmin1@gmail.com` / `admin`
- Student 1: `student1@gmail.com` / `admin`
- Student 2: `student2@gmail.com` / `admin`
- Student 3: `student3@gmail.com` / `admin`

Seeded demo hostels:

- `demo-green-view-hostel`
- `demo-city-light-hostel`
- `demo-himalayan-stay-hostel`

## Remaining Work

- Add automated mobile push-token registration instead of manual token entry.
- Add backend push fan-out from saved `DeviceToken` records.
- Add web notification bell/dropdown for portal shells.
- Add forgot-password email OTP flow if reset-password should move beyond the current placeholder page.
