# CODING_STANDARDS.md — Conventions & Code Style

## 1. TypeScript

- `strict: true` in every `tsconfig.json`. No `any` without a `// @ts-expect-error: <reason>` comment explaining why.
- Prefer explicit return types on exported functions, especially repository/service functions and route handlers.
- Use `type` for object shapes/unions, `interface` only when you need declaration merging (rare here).
- Derive types from Zod schemas (`z.infer<typeof schema>`) instead of hand-writing a parallel type — one source of truth.

## 2. Naming

| Thing | Convention | Example |
|---|---|---|
| React components | PascalCase, one per file, file name matches component | `HostelCard.tsx` |
| Hooks | camelCase, prefixed `use` | `useHostelSearch.ts` |
| Route handler files | Next.js convention | `route.ts` inside the resource folder |
| Zod schemas | camelCase, suffixed `Schema` | `createResidentSchema` |
| Mongoose models | PascalCase singular | `Resident`, not `residents` |
| Mongoose model files | PascalCase with `.ts` | `Resident.ts` exports `ResidentModel` |
| Database fields | camelCase (Mongoose default) | `moveInDate` |
| Enums | SCREAMING_SNAKE for values, PascalCase for the enum name | `enum PaymentStatus { UNPAID, PARTIAL, PAID, OVERDUE }` |
| Folders | kebab-case | `hostel-admin/`, `service-providers/` |
| Env vars | SCREAMING_SNAKE, `NEXT_PUBLIC_` prefix only when it must reach the browser | `DATABASE_URL`, `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY` |
| Test files | co-located, `.test.ts(x)` suffix | `residents.repository.test.ts` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_UPLOAD_SIZE`, `DEFAULT_PAGE_SIZE` |

## 3. File/Folder Structure Per Feature

Keep route handlers thin. Structure:

```
app/api/hostel-admin/residents/route.ts          # thin: parse, call service, return
packages/db/src/repositories/residents.repository.ts  # data access, tenancy-scoped
apps/web/lib/services/residents.service.ts            # business rules (optional layer)
packages/shared/src/schemas/resident.schema.ts         # Zod schema, reused by form
```

A route handler should read like: **validate → authorize → call repository/service → return envelope**. If it's doing more than that, the extra logic belongs in a repository/service function.

## 4. API Route Handler Pattern

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { createResidentSchema } from '@packages/shared/schemas/resident.schema';
import { createResident } from '@packages/db/repositories/residents.repository';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  // 1. Auth check
  const session = await getSession(req);
  if (!session || !['HOSTEL_ADMIN', 'WARDEN'].includes(session.role)) {
    return errorResponse('forbidden', 403);
  }

  // 2. Validate input
  const body = await req.json();
  const parsed = createResidentSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse('validation_error', 400, parsed.error.flatten());
  }

  // 3. Call repository (enforces tenant scoping)
  try {
    const resident = await createResident(session.hostelId, parsed.data);
    return successResponse(resident, 201);
  } catch (error) {
    console.error('[API] Error creating resident:', error);
    return errorResponse('server_error', 500);
  }
}
```

**Key points:**
- `successResponse`/`errorResponse` are shared helpers implementing the envelope from API.md §1.1
- Never build the JSON shape inline per route
- Session-derived `hostelId` is passed to repository, not client-supplied value

## 5. Repository Pattern (Mongoose)

```typescript
// packages/db/src/repositories/residents.repository.ts
import { ResidentModel } from '../models/Resident';
import { IResident } from '../models/Resident';

export async function createResident(
  hostelId: string,
  data: {
    userId: string;
    fullName: string;
    phone: string;
    roomId?: string;
    bedId?: string;
    /* ... */
  }
): Promise<IResident> {
  // hostelId comes from session, not client — enforces tenant isolation
  const resident = await ResidentModel.create({
    ...data,
    hostelId, // always set from parameter
    status: 'PENDING',
  });
  
  return resident.toObject();
}

export async function findResidentsByHostel(
  hostelId: string,
  filters?: { status?: string; search?: string }
): Promise<IResident[]> {
  const query: any = { hostelId }; // tenant filter ALWAYS present
  
  if (filters?.status) {
    query.status = filters.status;
  }
  
  if (filters?.search) {
    query.fullName = { $regex: filters.search, $options: 'i' };
  }
  
  return await ResidentModel.find(query).lean();
}
```

**Key points:**
- Every function takes `hostelId` as first parameter (mandatory, from session)
- Never query without `hostelId` for hostel-scoped models
- Use `.lean()` when returning data to API (faster, plain objects)
- Use `.toObject()` when returning single document

## 6. Error Handling

**Server-side (API routes):**
- Use a small `AppError` class carrying `{ code, httpStatus, message, details? }`
- Catch at route handler boundary
- Convert to standard envelope

```typescript
// lib/errors.ts
export class AppError extends Error {
  constructor(
    public code: string,
    public httpStatus: number,
    public details?: any
  ) {
    super(code);
  }
}

// In repository:
if (!resident) {
  throw new AppError('not_found', 404);
}

// In route handler:
try {
  const resident = await getResident(hostelId, residentId);
  return successResponse(resident);
} catch (error) {
  if (error instanceof AppError) {
    return errorResponse(error.code, error.httpStatus, error.details);
  }
  console.error('[API] Unexpected error:', error);
  return errorResponse('server_error', 500);
}
```

**Client-side:**
- TanStack Query's `onError` feeds a toast + inline error state
- Don't let a failed mutation fail silently
- Show user-friendly error messages

## 7. Forms

Every form uses `react-hook-form` + the matching Zod schema from `packages/shared` via `zodResolver`:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createResidentSchema } from '@packages/shared/schemas/resident.schema';
import { z } from 'zod';

type FormData = z.infer<typeof createResidentSchema>;

function ResidentForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(createResidentSchema),
    defaultValues: {
      email: '',
      fullName: '',
      phone: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    // API call here
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* more fields */}
      </form>
    </Form>
  );
}
```

**Key points:**
- Same schema validates on client (form) and server (API route)
- Client and server never drift apart
- Show inline field errors, not just summary toast

## 8. Git & Commits

**Commit style:**
- **Conventional Commits**: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `perf:`
- Example: `feat(resident): add QR activation endpoint`

**Branch naming:**
- `phase-<n>/<short-description>`, e.g. `phase-3/qr-activation`

**One logical change per commit:**
- Don't bundle an unrelated refactor into a feature commit
- Commit messages explain WHY, not WHAT (code already says what)

**PR/Commit description includes:**
- Which PHASES.md deliverable(s) it completes
- Which acceptance tests it satisfies
- What was updated in MEMORY.md/API.md/DATABASE.md

## 9. Comments & Self-Documentation

**Comment WHY, not WHAT:**
```typescript
// GOOD
// Account upgrade: keep existing credentials to avoid forcing password reset
user.role = 'RESIDENT';

// BAD
// Set role to resident
user.role = 'RESIDENT';
```

**Non-obvious business rules:**
Any deviation from ARCHITECTURE.md/RULES.md/PRD.md needs a comment explaining why:

```typescript
// RULES.md §3 — hostelId must come from session, not params
const rooms = await RoomModel.find({ hostelId: session.hostelId });
```

**TODOs:**
- `// TODO(name): reason` — include your name and reason
- `// FIXME(name): issue` — for bugs that need fixing

## 10. Testing Conventions

See TESTING.md for strategy. Style-wise:

- `describe` blocks per resource/module
- `it` statements written as behavior, not implementation:
  - GOOD: `it('rejects payment proof upload from a different hostel's resident')`
  - BAD: `it('returns 404')`
- Arrange-Act-Assert pattern:
  ```typescript
  it('upgrades PUBLIC account to RESIDENT when admin registers them', async () => {
    // Arrange
    const publicUser = await createUser({ role: 'PUBLIC', email: 'test@example.com' });
    
    // Act
    const resident = await createResident(hostelId, { email: 'test@example.com', ... });
    
    // Assert
    const updatedUser = await UserModel.findById(publicUser._id);
    expect(updatedUser.role).toBe('RESIDENT');
  });
  ```

## 11. Formatting/Linting

**Prettier + ESLint:**
- Run on pre-commit (husky + lint-staged)
- Prettier config: single quotes, semicolons, trailing commas, 100-char line limit
- ESLint config: Next.js default + `@typescript-eslint/recommended`

**Treat ESLint errors as build-blocking:**
- Warnings are tolerable if justified
- No unused imports/vars
- No unreachable code

**Auto-format on save:**
- Configure your editor to format on save (VSCode: `editor.formatOnSave: true`)

## 12. Best Practices

**Functions:**
- Small functions (< 50 lines ideally, < 100 max)
- Pure functions where possible (no side effects)
- Early returns > deep nesting

**Validation:**
- Validate inputs at boundaries (API routes, form submissions)
- Fail fast; don't process invalid data

**Dead code:**
- No commented-out code
- No unused imports/variables
- No console.log in production paths (use proper logger)

**Avoid:**
- `any` types (use `unknown` + narrowing if needed)
- Non-null assertions (`!`) without a comment explaining why it's safe
- `eval()`, `Function()`, or dynamic code execution
- Mutating function parameters (return new objects instead)

## 13. MongoDB/Mongoose Specifics

**Queries:**
- Use `.lean()` for read-only queries (faster, returns plain JS objects)
- Use `.toObject()` when returning single document from repository
- Use `.populate()` sparingly (prefer separate queries for better caching)

**Indexes:**
- Verify all indexes from DATABASE.md are created after first deployment
- Test query performance with `.explain()` if slow

**Transactions:**
- Use sessions for multi-document operations that must be atomic:
  ```typescript
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await UserModel.updateOne({ _id: userId }, { role: 'RESIDENT' }, { session });
    await ResidentModel.create([{ userId, hostelId, ... }], { session });
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
  ```

**Virtuals:**
- Use Mongoose virtuals for computed properties (don't store derived data):
  ```typescript
  ResidentSchema.virtual('fullAddress').get(function() {
    return `Room ${this.roomNumber}, ${this.hostelName}`;
  });
  ```

## 14. Environment Variables

**Naming:**
- Server-only: no prefix (e.g., `DATABASE_URL`, `JWT_SECRET`)
- Client-accessible: `NEXT_PUBLIC_` prefix (e.g., `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY`)

**Usage:**
- Never hardcode secrets
- Always have a fallback or validation:
  ```typescript
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL is required');
  }
  ```

**`.env.example`:**
- Keep updated with all required variables
- Use placeholder values, never real secrets

---

_End of CODING_STANDARDS.md_
