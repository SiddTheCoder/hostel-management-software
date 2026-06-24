# Graph Report - hostel-management-software  (2026-06-24)

## Corpus Check
- 186 files · ~1,325,027 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1359 nodes · 2647 edges · 101 communities (90 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0c44ed6b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 90|Community 90]]
- [[_COMMUNITY_Community 91|Community 91]]
- [[_COMMUNITY_Community 92|Community 92]]
- [[_COMMUNITY_Community 93|Community 93]]
- [[_COMMUNITY_Community 96|Community 96]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 110 edges
2. `successResponse()` - 64 edges
3. `handleRouteError()` - 63 edges
4. `connectToDatabase()` - 36 edges
5. `requireHostelStaffPrincipal()` - 29 edges
6. `Multi-Hostel SaaS Platform - Final Source of Truth` - 25 edges
7. `Step 1 - Planning + Architecture Lock` - 25 edges
8. `Phase 0 - Planning + Architecture Lock` - 24 edges
9. `requirePlatformPrincipal()` - 17 edges
10. `errorResponse()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `InquiryPage()` --calls--> `cn()`  [INFERRED]
  src/app/inquiry/page.tsx → apps/web/src/lib/utils.ts
- `GET()` --calls--> `requirePlatformPrincipal()`  [INFERRED]
  apps/web/src/app/api/v1/public/hostels/route.ts → apps/web/src/lib/api-auth.ts
- `AlertTitle()` --calls--> `cn()`  [EXTRACTED]
  apps/web/src/components/ui/alert.tsx → apps/web/src/lib/utils.ts
- `AlertDescription()` --calls--> `cn()`  [EXTRACTED]
  apps/web/src/components/ui/alert.tsx → apps/web/src/lib/utils.ts
- `AlertAction()` --calls--> `cn()`  [EXTRACTED]
  apps/web/src/components/ui/alert.tsx → apps/web/src/lib/utils.ts

## Communities (101 total, 11 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.16
Nodes (41): GenericPortalScreen(), portalRows(), portalTitle(), PublicHostelDetailPage(), PublicInquiryPage(), AnimatedPage(), AuthMode, Breadcrumbs() (+33 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (46): assertHostelScopedApiAccess(), authMocks, request, assertAllowedRole(), AUTHENTICATED_ROLES, hasAllowedRole(), HOSTEL_STAFF_ROLES, PermissionError (+38 more)

### Community 2 - "Community 2"
Cohesion: 0.04
Nodes (43): BedCreateInput, BedRecord, BedUpdateInput, FloorCreateInput, FloorRecord, HostelAdminInquiryListQuery, HostelAdminInquiryStatusInput, HostelAdminProfileQuery (+35 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (52): 1.1 Backend Tasks, 1.2 Web Frontend Tasks, 1.3 Mobile Tasks, 1.4 QA Tasks, 1.5 Phase 1 Done Means, 2.1 Platform Owner Hostel Approval, 2.2 Public Hostel Listing, 2.3 Inquiry Flow (+44 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (36): POST(), GET(), listHostelAdminInquiries(), listHostelAdminRooms(), bedCreateSchema, bedUpdateSchema, hostelAdminInquiryListQuerySchema, hostelAdminProfileQuerySchema (+28 more)

### Community 5 - "Community 5"
Cohesion: 0.1
Nodes (33): ApiFailure, apiRequest(), ApiSuccess, AuthSession, AuthUser, createPublicInquiry(), getPublicHostel(), listPublicHostels() (+25 more)

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (21): CurrentUser, MeResponse, PortalAccount(), readableRole(), iconMap, IconName, NavItem, PortalShell() (+13 more)

### Community 7 - "Community 7"
Cohesion: 0.12
Nodes (21): PublicHostelListingPage(), cn(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+13 more)

### Community 8 - "Community 8"
Cohesion: 0.12
Nodes (24): authenticateWithGoogle(), dispatchOtpChallenge(), findVerifiedRegistrationChallenge(), generateOtpCode(), GOOGLE_JWKS, normalizeEmail(), normalizeOtpIdentifier(), normalizePhone() (+16 more)

### Community 9 - "Community 9"
Cohesion: 0.13
Nodes (22): PATCH(), RouteContext, publishPlatformHostel(), unpublishPlatformHostel(), hostelRejectSchema, ApiAuthError, ApiPrincipal, assertApiRoles() (+14 more)

### Community 10 - "Community 10"
Cohesion: 0.1
Nodes (14): createPublicHostelInquiry(), getPublicHostelBySlug(), serializePublicHostel(), inquiryId, serviceMocks, staffPrincipal, publicInquiryCreateSchema, POST() (+6 more)

### Community 11 - "Community 11"
Cohesion: 0.19
Nodes (27): addHostelAdminProfilePhoto(), approvePlatformHostel(), auditHostelAction(), createHostelAdminBed(), createHostelAdminRoom(), definedUpdate(), deleteHostelAdminProfilePhoto(), findFloorInHostel() (+19 more)

### Community 13 - "Community 13"
Cohesion: 0.08
Nodes (23): 1. Phase Goal, 2. Current Progress Summary, 3.1 Project Setup, 3.2 Auth Module, 3.3 Auth APIs, 3.4 Auth Models, 3.5 Auth Rules, 3.6 Role + Permission Module (+15 more)

### Community 14 - "Community 14"
Cohesion: 0.08
Nodes (24): 1.1 Recommended Project Structure, 1. Final Technical Direction, 2.1 API Pattern, 2.2 Multi-Tenant Rule, 2.3 Role-Based Access Control, 2.4 Authentication Direction, 2.5 File Upload Rule, 2.6 API Response Standard (+16 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (23): 1. Phase Goal, 2. Current Progress Summary, 3.1 Project Setup, 3.2 Auth Module, 3.3 Auth APIs, 3.4 Auth Models, 3.5 Auth Rules, 3.6 Role + Permission Module (+15 more)

### Community 16 - "Community 16"
Cohesion: 0.1
Nodes (12): ComparePage(), hostels, rows, navItems, PublicHeader(), PublicHeaderProps, emptyFilters, Filters (+4 more)

### Community 17 - "Community 17"
Cohesion: 0.09
Nodes (22): Auth - 4 Screens, Auth/Shared - 5 Screens, Dummy Data Requirements, Final Deliverable, Guardian Mobile - 5 Screens, Guardian Portal - 5 Screens, Hostel Admin/Warden Portal - 13 Screens, Important Privacy And Product Rules (+14 more)

### Community 18 - "Community 18"
Cohesion: 0.15
Nodes (10): DashboardCard(), DashboardCardProps, StatusBadge(), StatusBadgeProps, toneClassName, InquiriesData, Inquiry, InquiryStatus (+2 more)

### Community 19 - "Community 19"
Cohesion: 0.26
Nodes (15): AuthServiceError, POST(), errorResponse(), accessTokenTtlSeconds(), parseDurationSeconds(), refreshTokenTtlSeconds(), isMobileAuthClient(), readBodyRefreshToken() (+7 more)

### Community 20 - "Community 20"
Cohesion: 0.2
Nodes (19): getCurrentUser(), issueSessionForUser(), login(), publicUser(), refreshAccessToken(), AuthTokenPayload, getBearerToken(), hashToken() (+11 more)

### Community 21 - "Community 21"
Cohesion: 0.1
Nodes (20): 10. Rating and Review System, 12. Hostel Comparison Mode, 13. Referral Loop, 14. User Joining Flow, 15. Service Provider Joining Flow, 16. Privacy and Data Access Rules, 18. Notifications, 19. Technical Stack (+12 more)

### Community 22 - "Community 22"
Cohesion: 0.1
Nodes (20): 1. Phase Goal, 2. Current Progress Summary, 3.1 Platform Owner Hostel Approval, 3.2 Public Hostel Listing, 3.3 Inquiry Flow, 3.4 Hostel Profile Management, 3.5 Room + Bed Management, 3. Backend Tasks (+12 more)

### Community 23 - "Community 23"
Cohesion: 0.1
Nodes (19): 14. Git Branching Strategy, 15. Privacy And Security Lock, 16. Audit Log Lock, 17. Definition Of Done For Any Module, 18. Phase 1 Handoff Checklist, 19. External Decisions Still Needed, 19. User Action Needed Later, 20. Current Phase 0 Result (+11 more)

### Community 24 - "Community 24"
Cohesion: 0.11
Nodes (18): 14. Git Branching Strategy, 15. Privacy And Security Lock, 16. Audit Log Lock, 17. Definition Of Done For Any Module, 18. Phase 1 Handoff Checklist, 19. User Action Needed Later, 20. Current Phase 0 Result, 21. Current Phase 1 Local Foundation Result (+10 more)

### Community 25 - "Community 25"
Cohesion: 0.13
Nodes (19): 5.1 Service Provider Registration, 5.2 Hostel Maintenance Module, 5.3 Hostel Comparison, 5.4 Referral System, 5.5 Duplicate / Ghost Listing Detection, 5.7 Production Hardening, 5.8 QA Tasks, 5.9 Phase 5 Done Means (+11 more)

### Community 26 - "Community 26"
Cohesion: 0.12
Nodes (9): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+1 more)

### Community 27 - "Community 27"
Cohesion: 0.14
Nodes (13): GoogleAuthInput, googleAuthSchema, LoginInput, loginSchema, otpChannelSchema, otpPurposeSchema, OtpRequestInput, OtpVerifyInput (+5 more)

### Community 28 - "Community 28"
Cohesion: 0.15
Nodes (16): 4.1 Complaint System, 4.2 Night Safety Status, 4.3 SOS / Emergency, 4.4 Guardian Dashboard, 4.8 QA Tasks, 4.9 Phase 4 Done Means, code:txt (Complaint), code:txt (POST  /api/v1/resident/complaints) (+8 more)

### Community 29 - "Community 29"
Cohesion: 0.16
Nodes (10): pendingHostels, PlatformHostel, PlatformHostelsData, PlatformApplication, PlatformHostel, PlatformHostelDetailData, PlatformHostelReviewPage(), rentRange() (+2 more)

### Community 30 - "Community 30"
Cohesion: 0.13
Nodes (14): Auth/Shared Screens - 5, Desktop Web UI Assistant Prompt - Multi-Hostel SaaS Platform, Dummy Data Requirements, Final Deliverable, Guardian Portal Screens - 5, Hostel Admin/Warden Portal Screens - 13, Platform Owner Portal Screens - 9, Product And Privacy Rules (+6 more)

### Community 31 - "Community 31"
Cohesion: 0.13
Nodes (14): Auth Screens - 4, Dummy Data Requirements, Final Deliverable, Guardian Mobile Screens - 5, Mobile App UI Assistant Prompt - Multi-Hostel SaaS Platform, Product And Privacy Rules, Product Summary, Public Browsing Screens - 5 (+6 more)

### Community 32 - "Community 32"
Cohesion: 0.16
Nodes (8): Button(), buttonVariants, DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogOverlay(), DialogTitle()

### Community 33 - "Community 33"
Cohesion: 0.15
Nodes (13): 7.10 Emergency/SOS, 7.11 Move-in / Move-out Checklist, 7.1 Hostel Profile Management, 7.2 Room + Bed Digital Map, 7.3 Resident Management, 7.4 QR Activation, 7.5 Payments & Records, 7.6 Food Quality Proof System (+5 more)

### Community 34 - "Community 34"
Cohesion: 0.17
Nodes (12): Checks, code:bash (npm run web:dev), code:bash (npm run web:seed:platform-owner), code:txt (x-hostelhub-client: mobile), code:json ({), code:bash (npm --prefix apps/web run format:check), Deploy on Vercel, First Platform Owner (+4 more)

### Community 35 - "Community 35"
Cohesion: 0.17
Nodes (11): FACILITIES, Hostel, HostelType, InquiryStatus, KATHMANDU_AREAS, mockHostels, mockServiceProviders, NEPAL_CITIES (+3 more)

### Community 36 - "Community 36"
Cohesion: 0.23
Nodes (10): createPlatformHostelApplication(), findHostelByIdOrThrow(), getPlatformHostel(), listPlatformHostels(), serializeApplication(), platformHostelCreateSchema, platformHostelListQuerySchema, GET() (+2 more)

### Community 37 - "Community 37"
Cohesion: 0.2
Nodes (10): addHostelAdminInquiryNote(), serializeInquiry(), serializeInquiryNote(), updateHostelAdminInquiryStatus(), hostelAdminInquiryStatusSchema, inquiryNoteCreateSchema, POST(), RouteContext (+2 more)

### Community 38 - "Community 38"
Cohesion: 0.2
Nodes (12): 12.1 Do Not Break API Contracts, 12.2 Every Collection Must Have Indexes, 12.3 Use Soft Delete For Important Records, 12.4 Keep Public Data Separate From Private Data, 12.5 Build For Nepal Reality, 12. Development Rules For The Team, 14. Final Recommendation, code:txt (users) (+4 more)

### Community 39 - "Community 39"
Cohesion: 0.22
Nodes (7): chelseaMarket, geistMono, geistSans, metadata, poppins, SmoothScrollProvider(), ThemeProvider()

### Community 40 - "Community 40"
Cohesion: 0.18
Nodes (6): SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 41 - "Community 41"
Cohesion: 0.18
Nodes (8): SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator(), SelectTrigger()

### Community 42 - "Community 42"
Cohesion: 0.18
Nodes (11): 11.1 Public Website, 11.2 Platform Owner Portal, 11.3 Hostel Admin/Warden Portal, 11.4 Resident Portal, 11.5 Guardian Portal, 11. UI Sitemap Lock, code:txt (/), code:txt (/platform/dashboard) (+3 more)

### Community 43 - "Community 43"
Cohesion: 0.18
Nodes (11): 10.1 Base Rules, 10.2 Response Shape, 10.3 Route Groups, 10.4 Core Phase 1 API Contracts, 10.5 Core Phase 2 API Contracts, 10. API Naming Convention, code:txt (POST /api/v1/auth/login), code:txt (POST  /api/v1/platform/hostels) (+3 more)

### Community 44 - "Community 44"
Cohesion: 0.2
Nodes (10): 10. Definition of Done For Any Module, 11. First Production Pilot Scope, 13. Handover Checklist, 5.6 Reports, 6. Suggested 5-Week Calendar, 7. Module Dependency Map, 8. Core MongoDB Collections, 9. Critical Data Privacy Rules (+2 more)

### Community 45 - "Community 45"
Cohesion: 0.18
Nodes (11): 11.1 Public Website, 11.2 Platform Owner Portal, 11.3 Hostel Admin/Warden Portal, 11.4 Resident Portal, 11.5 Guardian Portal, 11. UI Sitemap Lock, code:txt (/), code:txt (/platform/dashboard) (+3 more)

### Community 46 - "Community 46"
Cohesion: 0.18
Nodes (11): 10.1 Base Rules, 10.2 Response Shape, 10.3 Route Groups, 10.4 Core Phase 1 API Contracts, 10.5 Core Phase 2 API Contracts, 10. API Naming Convention, code:txt (POST /api/v1/auth/login), code:txt (POST  /api/v1/platform/hostels) (+3 more)

### Community 47 - "Community 47"
Cohesion: 0.2
Nodes (7): Bed, Floor, FloorsData, Room, RoomMapData, RoomMapFloor, RoomsData

### Community 48 - "Community 48"
Cohesion: 0.28
Nodes (5): approvals, Metric, metrics, paymentProofs, stats

### Community 49 - "Community 49"
Cohesion: 0.22
Nodes (4): emptyForm, HostelProfile, ProfileData, ProfileForm

### Community 50 - "Community 50"
Cohesion: 0.22
Nodes (8): Table(), TableBody(), TableCaption(), TableCell(), TableFooter(), TableHead(), TableHeader(), TableRow()

### Community 51 - "Community 51"
Cohesion: 0.25
Nodes (5): logout(), serviceMocks, session, user, POST()

### Community 52 - "Community 52"
Cohesion: 0.25
Nodes (5): routeMocks, hashOtpCode(), verifyOtpChallenge(), otpVerifySchema, POST()

### Community 53 - "Community 53"
Cohesion: 0.22
Nodes (9): 4.5 Move-In / Move-Out Checklist, 4.6 Ratings and Reviews, 4.7 Notifications Foundation, code:txt (MoveInChecklist), code:txt (POST /api/v1/hostel-admin/residents/:id/move-in), code:txt (RatingReview), code:txt (POST  /api/v1/resident/reviews), code:txt (Notification) (+1 more)

### Community 54 - "Community 54"
Cohesion: 0.25
Nodes (7): dirname, email, name, phone, repoRoot, update, userSchema

### Community 55 - "Community 55"
Cohesion: 0.25
Nodes (8): 4.1 Platform Owner / Super Admin, 4.2 Hostel Owner / Hostel Admin, 4.3 Warden / Staff, 4.4 Resident / Student, 4.5 Public Visitor, 4.6 Guardian, 4.7 Service Provider / Side-Hustle Worker, 4. User Roles

### Community 56 - "Community 56"
Cohesion: 0.25
Nodes (8): 7.1 Foundation Modules, 7.2 Platform Owner Modules, 7.3 Public Modules, 7.4 Hostel Admin/Warden Modules, 7.5 Resident Modules, 7.6 Guardian Modules, 7.7 Service Provider/Maintenance Modules, 7. Locked Module List

### Community 57 - "Community 57"
Cohesion: 0.25
Nodes (7): Brand & Style, Colors, Components, Elevation & Depth, Layout & Spacing, Shapes, Typography

### Community 58 - "Community 58"
Cohesion: 0.25
Nodes (7): Brand & Style, Colors, Components, Elevation & Depth, Layout & Spacing, Shapes, Typography

### Community 59 - "Community 59"
Cohesion: 0.25
Nodes (8): 7.1 Foundation Modules, 7.2 Platform Owner Modules, 7.3 Public Modules, 7.4 Hostel Admin/Warden Modules, 7.5 Resident Modules, 7.6 Guardian Modules, 7.7 Service Provider/Maintenance Modules, 7. Locked Module List

### Community 60 - "Community 60"
Cohesion: 0.29
Nodes (4): AuthResponse, OtpRequestData, RegisterData, SignupStep

### Community 61 - "Community 61"
Cohesion: 0.29
Nodes (5): CachedConnection, globalForMongoose, candidateRoots, { loadEnvConfig }, require

### Community 62 - "Community 62"
Cohesion: 0.38
Nodes (6): GET(), POST(), createHostelAdminFloor(), listHostelAdminFloors(), serializeFloor(), floorCreateSchema

### Community 63 - "Community 63"
Cohesion: 0.29
Nodes (6): code:bash (npm --prefix apps/mobile install), code:bash (EXPO_PUBLIC_API_BASE_URL=http://localhost:3000), HostelHub Mobile, Mobile App, Phase 1 Auth Contract, Setup

### Community 64 - "Community 64"
Cohesion: 0.33
Nodes (5): dirname, { loadEnvConfig }, nextConfig, repoRoot, require

### Community 65 - "Community 65"
Cohesion: 0.47
Nodes (5): HostelDetailData, HostelDetailPage(), primaryPhoto(), PublicHostel, rentRange()

### Community 66 - "Community 66"
Cohesion: 0.4
Nodes (5): Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

### Community 67 - "Community 67"
Cohesion: 0.4
Nodes (5): Alert(), AlertAction(), AlertDescription(), AlertTitle(), alertVariants

### Community 68 - "Community 68"
Cohesion: 0.33
Nodes (6): 23. Recommended Development Order, Phase 1 - Foundation, Phase 2 - Public + Hostel Core, Phase 3 - Resident System, Phase 4 - Trust, Safety, and Daily Use, Phase 5 - Growth and Maintenance

### Community 69 - "Community 69"
Cohesion: 0.33
Nodes (6): 12.1 Phase 1 Mobile, 12.2 Phase 2 Mobile, 12.3 Phase 3 Mobile, 12.4 Phase 4 Mobile, 12.5 Phase 5 Mobile, 12. Mobile Screen List Lock

### Community 70 - "Community 70"
Cohesion: 0.33
Nodes (6): 13.1 Required Tooling, 13.2 Required Environment Variables, 13.3 Environment Files, 13. Environment Setup Plan, code:txt (NODE_ENV=), code:txt (.env.example)

### Community 71 - "Community 71"
Cohesion: 0.33
Nodes (6): 0.1 Outputs, 0.2 Required Decisions, 0.3 UI Sitemap, 0.4 Phase 0 Done Means, code:txt (Public Website), Phase 0 — Planning + Architecture Lock

### Community 72 - "Community 72"
Cohesion: 0.33
Nodes (6): 13.1 Required Tooling, 13.2 Required Environment Variables, 13.3 Environment Files, 13. Environment Setup Plan, code:txt (NODE_ENV=), code:txt (.env.example)

### Community 73 - "Community 73"
Cohesion: 0.33
Nodes (6): 12.1 Phase 1 Mobile, 12.2 Phase 2 Mobile, 12.3 Phase 3 Mobile, 12.4 Phase 4 Mobile, 12.5 Phase 5 Mobile, 12. Mobile Screen List Lock

### Community 74 - "Community 74"
Cohesion: 0.4
Nodes (4): graphify - READ THIS FIRST, Keeping the graph fresh, What you MUST do at the start of every session, What you MUST NOT do

### Community 75 - "Community 75"
Cohesion: 0.4
Nodes (4): graphify - READ THIS FIRST, Keeping the graph fresh, What you MUST do at the start of every session, What you MUST NOT do

### Community 76 - "Community 76"
Cohesion: 0.4
Nodes (5): 7.12 Maintenance & Local Service Provider Network, Hostel Admin Maintenance Features, Platform Owner Controls, Responsibility Rule, Service Provider / Side-Hustle Registration Page

### Community 79 - "Community 79"
Cohesion: 0.5
Nodes (4): 11.1 Owner Identity & Ownership Proof, 11.2 Verified Hostel Badge / Compliance Checklist, 11.3 Duplicate / Ghost Listing Detection, 11. Hostel Verification and Trust Features

### Community 80 - "Community 80"
Cohesion: 0.5
Nodes (4): 1.1 Required Phase 0 Outputs, 1.2 Phase 0 Done Gate, 1.3 Phase 0 Completion Boundary, 1. Completion Tracker

### Community 81 - "Community 81"
Cohesion: 0.5
Nodes (4): 8. Locked Database Entity List, code:txt (users), code:txt (hostelId), code:txt (isDeleted)

### Community 82 - "Community 82"
Cohesion: 0.5
Nodes (4): 8. Locked Database Entity List, code:txt (users), code:txt (hostelId), code:txt (isDeleted)

### Community 83 - "Community 83"
Cohesion: 0.5
Nodes (4): 1.1 Required Phase 0 Outputs, 1.2 Phase 0 Done Gate, 1.3 Step 1 Completion Boundary, 1. Completion Tracker

### Community 85 - "Community 85"
Cohesion: 0.67
Nodes (3): 17.1 Hostel to Platform, 17.2 Resident to Hostel, 17. Payment Scope

### Community 86 - "Community 86"
Cohesion: 0.67
Nodes (3): 4. Recommended Repo Structure, code:txt (hostel-saas/), code:txt (src/)

### Community 88 - "Community 88"
Cohesion: 0.67
Nodes (3): 4. Recommended Repo Structure, code:txt (hostel-saas/), code:txt (src/)

## Knowledge Gaps
- **567 isolated node(s):** `AuthUser`, `ApiSuccess`, `ApiFailure`, `Stack`, `Props` (+562 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 7` to `Community 0`, `Community 32`, `Community 66`, `Community 67`, `Community 6`, `Community 40`, `Community 41`, `Community 12`, `Community 16`, `Community 18`, `Community 50`, `Community 84`, `Community 26`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `Role` connect `Community 1` to `Community 8`, `Community 9`, `Community 10`, `Community 51`, `Community 52`, `Community 20`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Why does `ThemeToggle()` connect `Community 6` to `Community 16`, `Community 7`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **What connects `AuthUser`, `ApiSuccess`, `ApiFailure` to the rest of the system?**
  _567 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.04 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._