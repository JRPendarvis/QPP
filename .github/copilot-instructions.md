# QuiltPlannerPro Agent Instructions

Use this file for project-specific behavior only. Prefer links to detailed docs instead of duplicating them.

## Project Shape

- Monorepo:
  - `backend/`: Express + TypeScript + Prisma + PostgreSQL
  - `frontend/`: Next.js App Router (React 19)
- Product: AI quilt-pattern generation from uploaded fabric images.

## First Commands To Run

Run commands in the package directory you are editing.

### Backend (`backend/`)

```powershell
npm install
npx prisma generate
npm run dev
```

Useful checks:

```powershell
npm run build
npm test
npx prisma migrate status
```

### Frontend (`frontend/`)

```powershell
npm install
npm run dev
```

Useful checks:

```powershell
npm run build
npm test
npm run lint
```

## High-Value Architecture Notes

- Auth is dual-path and intentional:
  - Backend issues httpOnly `token` cookie.
  - Frontend also reads token from localStorage for axios auth header.
  - Backend auth middleware accepts both bearer header and cookie.
  - When changing auth, keep both paths working.
- Pattern generation flow crosses layers:
  - Controller validates request + subscription constraints.
  - Pattern service selects pattern and enforces limits.
  - AI service (Claude) generates output.
  - Frontend workflow service orchestrates callbacks/state.
- Pattern registry contract lives in `backend/src/config/patterns/`:
  - Pattern definitions expose metadata, prompt, and `getColors()` mapping.
  - Normalize pattern IDs before lookup.
- Fabric role assignment is domain-critical:
  - Canonical roles: `background`, `primary`, `secondary`, `accent`.
  - Priority is user role assignments first, then AI recommendation, then fallback.

## Conventions For Edits

- Keep backend services domain-organized (`services/pattern`, `services/ai`, etc.).
- Maintain API response envelope shape: `{ success, message?, data?, debug? }`.
- Preserve production-only safety behavior in backend start script.
- Do not bypass security middleware ordering in `backend/src/serverSetup.ts`.

## Common Pitfalls

1. After schema changes, run `npx prisma generate` before build/tests.
2. Stripe webhook route must use raw body handling before json body parsing.
3. CORS origin updates belong in backend config constants, not ad-hoc middleware edits.
4. Tests around fabric library hooks should use dependency injection (mock gateway), not fragile module-level mocks.
5. Pattern-selection tests must use IDs present in mocked skill registries or candidate selection can be empty.

## Key Docs (Link, Don't Copy)

- Root setup and versioning: [README.md](../README.md)
- Backend details: [backend/README.md](../backend/README.md)
- Frontend details: [frontend/README.md](../frontend/README.md)
- Testing setup: [UNIT-TESTING-SETUP.md](../UNIT-TESTING-SETUP.md), [AUTOMATED-TESTING-SETUP.md](../AUTOMATED-TESTING-SETUP.md)
- Production safety: [backend/PRODUCTION-DATABASE-SAFETY.md](../backend/PRODUCTION-DATABASE-SAFETY.md), [PRODUCTION-CHECKLIST.md](../PRODUCTION-CHECKLIST.md)
- Pattern work backlog: [TODO.md](../TODO.md)

## If You Add More Customizations

- Use `.github/instructions/*.instructions.md` for area-specific rules (for example: `backend/**/*.ts`, `frontend/**/*`).
- Keep this file short and stable; move specialized workflows into skills.
