# Graph Report - hostel-management-software  (2026-06-22)

## Corpus Check
- 85 files · ~97,059 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 686 nodes · 928 edges · 58 communities (43 shown, 15 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `88991583`
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
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 84 edges
2. `Multi-Hostel SaaS Platform - Final Source of Truth` - 25 edges
3. `Step 1 - Planning + Architecture Lock` - 25 edges
4. `7. Hostel Admin / Warden Portal Features` - 14 edges
5. `Desktop Web UI Assistant Prompt - Multi-Hostel SaaS Platform` - 14 edges
6. `Mobile App UI Assistant Prompt - Multi-Hostel SaaS Platform` - 14 edges
7. `successResponse()` - 11 edges
8. `UI Assistant Prompt - Multi-Hostel SaaS Platform` - 11 edges
9. `handleRouteError()` - 10 edges
10. `Phase 3 — Resident System + Payments + Food` - 10 edges

## Surprising Connections (you probably didn't know these)
- `AlertTitle()` --calls--> `cn()`  [EXTRACTED]
  apps/web/src/components/ui/alert.tsx → apps/web/src/lib/utils.ts
- `AlertDescription()` --calls--> `cn()`  [EXTRACTED]
  apps/web/src/components/ui/alert.tsx → apps/web/src/lib/utils.ts
- `AlertAction()` --calls--> `cn()`  [EXTRACTED]
  apps/web/src/components/ui/alert.tsx → apps/web/src/lib/utils.ts
- `Checkbox()` --calls--> `cn()`  [EXTRACTED]
  apps/web/src/components/ui/checkbox.tsx → apps/web/src/lib/utils.ts
- `DialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  apps/web/src/components/ui/dialog.tsx → apps/web/src/lib/utils.ts

## Communities (58 total, 15 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (44): AuthServiceError, getCurrentUser(), login(), logout(), publicUser(), refreshAccessToken(), LoginInput, loginSchema (+36 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (40): assertAllowedRole(), AUTHENTICATED_ROLES, hasAllowedRole(), HOSTEL_STAFF_ROLES, PermissionError, Principal, Role, ROLE_VALUES (+32 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (47): 0.1 Outputs, 0.2 Required Decisions, 0.3 UI Sitemap, 0.4 Phase 0 Done Means, 10. Definition of Done For Any Module, 11. First Production Pilot Scope, 12.1 Do Not Break API Contracts, 12.2 Every Collection Must Have Indexes (+39 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (41): 10. Rating and Review System, 11.1 Owner Identity & Ownership Proof, 11.2 Verified Hostel Badge / Compliance Checklist, 11.3 Duplicate / Ghost Listing Detection, 11. Hostel Verification and Trust Features, 12. Hostel Comparison Mode, 13. Referral Loop, 14. User Joining Flow (+33 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (31): 1.1 Backend Tasks, 1.2 Web Frontend Tasks, 1.3 Mobile Tasks, 1.4 QA Tasks, 1.5 Phase 1 Done Means, 2.1 Platform Owner Hostel Approval, 2.2 Public Hostel Listing, 2.3 Inquiry Flow (+23 more)

### Community 5 - "Community 5"
Cohesion: 0.15
Nodes (22): cn(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), Card() (+14 more)

### Community 6 - "Community 6"
Cohesion: 0.1
Nodes (25): 4.1 Complaint System, 4.2 Night Safety Status, 4.3 SOS / Emergency, 4.4 Guardian Dashboard, 4.5 Move-In / Move-Out Checklist, 4.6 Ratings and Reviews, 4.7 Notifications Foundation, 4.8 QA Tasks (+17 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (23): 1. Phase Goal, 2. Current Progress Summary, 3.1 Project Setup, 3.2 Auth Module, 3.3 Auth APIs, 3.4 Auth Models, 3.5 Auth Rules, 3.6 Role + Permission Module (+15 more)

### Community 8 - "Community 8"
Cohesion: 0.08
Nodes (24): 1.1 Recommended Project Structure, 1. Final Technical Direction, 2.1 API Pattern, 2.2 Multi-Tenant Rule, 2.3 Role-Based Access Control, 2.4 Authentication Direction, 2.5 File Upload Rule, 2.6 API Response Standard (+16 more)

### Community 9 - "Community 9"
Cohesion: 0.09
Nodes (22): Auth - 4 Screens, Auth/Shared - 5 Screens, Dummy Data Requirements, Final Deliverable, Guardian Mobile - 5 Screens, Guardian Portal - 5 Screens, Hostel Admin/Warden Portal - 13 Screens, Important Privacy And Product Rules (+14 more)

### Community 10 - "Community 10"
Cohesion: 0.12
Nodes (21): 3.1 Resident Registration, 3.2 QR Activation, 3.3 Resident Dashboard, 3.4 Payment Records, 3.5 Food Transparency, 3.6 Notice System, 3.7 Mobile Tasks, 3.8 QA Tasks (+13 more)

### Community 11 - "Community 11"
Cohesion: 0.11
Nodes (18): 7.10 Emergency/SOS, 7.11 Move-in / Move-out Checklist, 7.12 Maintenance & Local Service Provider Network, 7.1 Hostel Profile Management, 7.2 Room + Bed Digital Map, 7.3 Resident Management, 7.4 QR Activation, 7.5 Payments & Records (+10 more)

### Community 12 - "Community 12"
Cohesion: 0.23
Nodes (6): DashboardCard(), DashboardCardProps, StatusBadge(), StatusBadgeProps, toneClassName, stats

### Community 13 - "Community 13"
Cohesion: 0.16
Nodes (7): NavItem, PortalShell(), PortalShellProps, navItems, navItems, navItems, navItems

### Community 14 - "Community 14"
Cohesion: 0.12
Nodes (9): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+1 more)

### Community 15 - "Community 15"
Cohesion: 0.13
Nodes (8): Badge(), badgeVariants, Checkbox(), Input(), Label(), Separator(), Skeleton(), Textarea()

### Community 16 - "Community 16"
Cohesion: 0.12
Nodes (15): 15. Privacy And Security Lock, 16. Audit Log Lock, 17. Definition Of Done For Any Module, 18. Phase 1 Handoff Checklist, 19. External Decisions Still Needed, 19. User Action Needed Later, 20. Current Phase 0 Result, 21. Current Phase 1 Local Foundation Result (+7 more)

### Community 17 - "Community 17"
Cohesion: 0.13
Nodes (14): Auth/Shared Screens - 5, Desktop Web UI Assistant Prompt - Multi-Hostel SaaS Platform, Dummy Data Requirements, Final Deliverable, Guardian Portal Screens - 5, Hostel Admin/Warden Portal Screens - 13, Platform Owner Portal Screens - 9, Product And Privacy Rules (+6 more)

### Community 18 - "Community 18"
Cohesion: 0.13
Nodes (14): Auth Screens - 4, Dummy Data Requirements, Final Deliverable, Guardian Mobile Screens - 5, Mobile App UI Assistant Prompt - Multi-Hostel SaaS Platform, Product And Privacy Rules, Product Summary, Public Browsing Screens - 5 (+6 more)

### Community 19 - "Community 19"
Cohesion: 0.16
Nodes (8): Button(), buttonVariants, SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 20 - "Community 20"
Cohesion: 0.17
Nodes (12): Checks, code:bash (npm run web:dev), code:bash (npm run web:seed:platform-owner), code:txt (x-hostelhub-client: mobile), code:json ({), code:bash (npm --prefix apps/web run format:check), Deploy on Vercel, First Platform Owner (+4 more)

### Community 21 - "Community 21"
Cohesion: 0.18
Nodes (8): SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator(), SelectTrigger()

### Community 22 - "Community 22"
Cohesion: 0.18
Nodes (6): DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogOverlay(), DialogTitle()

### Community 23 - "Community 23"
Cohesion: 0.18
Nodes (11): 10.1 Base Rules, 10.2 Response Shape, 10.3 Route Groups, 10.4 Core Phase 1 API Contracts, 10.5 Core Phase 2 API Contracts, 10. API Naming Convention, code:txt (POST /api/v1/auth/login), code:txt (POST  /api/v1/platform/hostels) (+3 more)

### Community 24 - "Community 24"
Cohesion: 0.18
Nodes (11): 11.1 Public Website, 11.2 Platform Owner Portal, 11.3 Hostel Admin/Warden Portal, 11.4 Resident Portal, 11.5 Guardian Portal, 11. UI Sitemap Lock, code:txt (/), code:txt (/platform/dashboard) (+3 more)

### Community 25 - "Community 25"
Cohesion: 0.25
Nodes (8): 7.1 Foundation Modules, 7.2 Platform Owner Modules, 7.3 Public Modules, 7.4 Hostel Admin/Warden Modules, 7.5 Resident Modules, 7.6 Guardian Modules, 7.7 Service Provider/Maintenance Modules, 7. Locked Module List

### Community 26 - "Community 26"
Cohesion: 0.29
Nodes (5): chelseaMarket, geistMono, geistSans, metadata, poppins

### Community 27 - "Community 27"
Cohesion: 0.33
Nodes (5): email, name, phone, update, userSchema

### Community 28 - "Community 28"
Cohesion: 0.4
Nodes (5): Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

### Community 29 - "Community 29"
Cohesion: 0.4
Nodes (5): Alert(), AlertAction(), AlertDescription(), AlertTitle(), alertVariants

### Community 30 - "Community 30"
Cohesion: 0.33
Nodes (6): 13.1 Required Tooling, 13.2 Required Environment Variables, 13.3 Environment Files, 13. Environment Setup Plan, code:txt (NODE_ENV=), code:txt (.env.example)

### Community 31 - "Community 31"
Cohesion: 0.33
Nodes (6): 12.1 Phase 1 Mobile, 12.2 Phase 2 Mobile, 12.3 Phase 3 Mobile, 12.4 Phase 4 Mobile, 12.5 Phase 5 Mobile, 12. Mobile Screen List Lock

### Community 32 - "Community 32"
Cohesion: 0.4
Nodes (3): objectIdSchema, paginationSchema, phoneSchema

### Community 33 - "Community 33"
Cohesion: 0.4
Nodes (4): graphify - READ THIS FIRST, Keeping the graph fresh, What you MUST do at the start of every session, What you MUST NOT do

### Community 34 - "Community 34"
Cohesion: 0.4
Nodes (4): graphify - READ THIS FIRST, Keeping the graph fresh, What you MUST do at the start of every session, What you MUST NOT do

### Community 37 - "Community 37"
Cohesion: 0.5
Nodes (4): 8. Locked Database Entity List, code:txt (users), code:txt (hostelId), code:txt (isDeleted)

### Community 38 - "Community 38"
Cohesion: 0.5
Nodes (4): 1.1 Required Phase 0 Outputs, 1.2 Phase 0 Done Gate, 1.3 Step 1 Completion Boundary, 1. Completion Tracker

### Community 40 - "Community 40"
Cohesion: 0.67
Nodes (3): 4. Recommended Repo Structure, code:txt (hostel-saas/), code:txt (src/)

## Knowledge Gaps
- **312 isolated node(s):** `eslintConfig`, `nextConfig`, `config`, `dirname`, `email` (+307 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 5` to `Community 14`, `Community 15`, `Community 19`, `Community 21`, `Community 22`, `Community 28`, `Community 29`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `Phase 4 — Daily Operations + Trust + Safety` connect `Community 6` to `Community 2`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `Multi-Hostel SaaS Platform — Phase-Wise Development Plan` connect `Community 8` to `Community 2`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `config` to the rest of the system?**
  _312 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._