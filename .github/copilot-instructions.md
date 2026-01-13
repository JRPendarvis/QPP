# QuiltPlannerPro - AI Coding Assistant Instructions

## Project Overview

QuiltPlannerPro is an AI-powered SaaS that generates custom quilt patterns from user-uploaded fabric images. The app uses Claude AI (Anthropic) for pattern generation and OpenAI for supplementary features.

**Architecture:** Monorepo with separate backend (Express + Prisma + PostgreSQL) and frontend (Next.js 16 App Router)

## Development Commands

### Backend (`backend/`)

```powershell
npm install              # Install dependencies
npx prisma generate      # Generate Prisma client (required after schema changes)
npx prisma migrate dev   # Apply migrations to dev database
npm run dev              # Start dev server (nodemon + tsx)
npm run build            # Build for production (runs prisma generate + tsc)
npm start                # Production server (migrates DB + runs dist/index.js)
```

### Frontend (`frontend/`)

```powershell
npm install              # Install dependencies
npm run dev              # Start Next.js dev server (localhost:3000)
npm run build            # Build for production
npm start                # Production server
```

## Critical Architecture Patterns

### 1. Authentication Flow

- **Backend:** Issues httpOnly cookie named `token` on login/register ([authController.ts](backend/src/controllers/authController.ts))
- **Frontend:** Uses dual auth storage:
  - `localStorage.getItem('token')` for API calls via axios interceptor ([lib/api.ts](frontend/lib/api.ts))
  - httpOnly cookies for server-side authentication
- **Middleware:** [authMiddleware.ts](backend/src/middleware/authMiddleware.ts) checks both `Authorization: Bearer <token>` header AND cookies
- **Type Extension:** `req.user` is typed via global Express namespace extension

### 2. Pattern Generation Workflow

Core flow orchestrated across multiple services:

1. **Controller:** [patternController.ts](backend/src/controllers/patternController.ts) validates request, enforces subscription limits
2. **Service:** [patternGenerationService.ts](backend/src/services/pattern/patternGenerationService.ts) coordinates:
   - User validation (subscription status, usage limits from [stripe.config.ts](backend/src/config/stripe.config.ts))
   - Skill level determination (supports `challengeMe` mode for next-level patterns)
   - Pattern selection from [patterns/](backend/src/config/patterns/) registry
3. **AI Integration:** [claudeService.ts](backend/src/services/ai/claudeService.ts) streams responses from Anthropic
4. **Frontend:** [patternGenerationWorkflow.ts](frontend/services/patternGenerationWorkflow.ts) executes client-side flow with callbacks

**Pattern Registry:** Each pattern in [backend/src/config/patterns/](backend/src/config/patterns/) exports:

- `PatternDefinition` with metadata (skillLevels, blockSize, rotationStrategy, status)
- `PatternPrompt` for AI instruction generation
- `getColors()` function for fabric-to-role mapping

### 3. Subscription & Usage Tracking

- **Tiers:** Defined in [stripe.config.ts](backend/src/config/stripe.config.ts) (free: 3 gen/month, basic: 5, intermediate: 15, advanced: 50)
- **Tracking:** `generationsThisMonth` field in User model reset monthly by cron job ([jobs/cronJobs.ts](backend/src/jobs/cronJobs.ts))
- **Enforcement:** [patternGenerationService.ts](backend/src/services/pattern/patternGenerationService.ts) validates limits before generation
- **Webhooks:** [stripeController.ts](backend/src/controllers/stripeController.ts) handles subscription updates

### 4. Fabric Role Assignment

Critical domain logic in [utils/fabricMapping.ts](backend/src/utils/fabricMapping.ts):

- Normalizes user fabric selections to semantic roles: `background`, `primary`, `secondary`, `accent`
- Converts `FabricsByRole` ↔ `FabricAssignments` for different services
- Priority: frontend `roleAssignments` > Claude `fabricAnalysis.recommendedRole` > safe fallbacks

## Database Schema ([prisma/schema.prisma](backend/prisma/schema.prisma))

Key models:

- **User:** Auth + subscription (Stripe IDs, tier, status, usage counters, reset tokens)
- **Pattern:** Stores generated patterns as JSON with download tracking
- **Feedback/FeedbackVote:** Feature request voting system

**Critical fields:**

- `User.generationsThisMonth` / `downloadsThisMonth` - usage counters reset monthly
- `User.currentPeriodEnd` - subscription validity check
- `Pattern.patternData` - JSON field storing complete AI-generated pattern

## Environment Variables

**Backend requires** (see [.env.example](backend/.env.example)):

```
DATABASE_URL          # PostgreSQL connection string
JWT_SECRET            # For token signing
STRIPE_SECRET_KEY     # Stripe API key
STRIPE_WEBHOOK_SECRET # For webhook signature verification
ANTHROPIC_API_KEY     # Claude AI (primary pattern generation)
OPENAI_API_KEY        # OpenAI (supplementary features)
FRONTEND_URL          # CORS origin (localhost:3000 or production)
ADMIN_API_KEY         # For /api/admin/* routes
```

**Frontend requires:**

```
NEXT_PUBLIC_API_URL   # Backend URL (defaults to localhost:3001)
```

## Backend Service Organization

Services are organized into domain-specific folders for improved maintainability:

- **`services/pattern/`** - Pattern generation, selection, building, downloading (15 files)
- **`services/ai/`** - Claude/OpenAI integration, fabric analysis (5 files)
- **`services/subscription/`** - Stripe checkout, webhooks, validation (4 files)
- **`services/user/`** - Profile, usage tracking, skill level, feedback (5 files)
- **`services/image/`** - Compression, validation, preparation (6 files)
- **`services/auth/`** - Authentication, password reset, email (3 files)
- **`services/pdf/`** - PDF generation with specialized renderers (6 files)
- **`services/sanitization/`** - Input sanitization utilities (3 files)

## Conventions & Patterns

### TypeScript Patterns

- **Service Classes:** Instantiated in controllers, single responsibility (organized by domain in `services/pattern/`, `services/ai/`, `services/subscription/`, etc.)
- **Static Utilities:** Pure functions in `/utils` (no state)
- **Type Definitions:** Exported from `/types` (e.g., [QuiltPattern.ts](backend/src/types/QuiltPattern.ts), [PatternDefinition.ts](backend/src/types/PatternDefinition.ts))
- **Validators:** Return `ValidationError | null` pattern ([patternValidators.ts](backend/src/validators/patternValidators.ts))

### Frontend State Management

- **Auth:** Context + localStorage ([AuthContext.tsx](frontend/contexts/AuthContext.tsx))
- **Local State:** Zustand for complex UI state (fabric upload, pattern generation)
- **Server State:** Direct API calls via axios, no caching layer

### API Response Format

All endpoints return:

```typescript
{ success: boolean, message?: string, data?: T, debug?: any }
```

Debug field included only in `process.env.NODE_ENV !== 'production'` ([patternController.ts](backend/src/controllers/patternController.ts#L18))

### Security Middleware Stack

Applied in [serverSetup.ts](backend/src/serverSetup.ts):

1. CORS with origin whitelist ([constants.ts](backend/src/config/constants.ts) `CORS_ORIGINS`)
2. `requestLogger` - audit trail middleware
3. `sanitizeInput` - XSS protection via recursive sanitization ([sanitization.ts](backend/src/middleware/sanitization.ts))
4. Rate limiters per route ([rateLimiters.ts](backend/src/middleware/rateLimiters.ts))
5. Admin routes protected by `requireAdmin` (checks `X-Admin-Key` header or `ADMIN_EMAIL`)

## Common Gotchas

1. **Prisma Client:** Run `npx prisma generate` after schema changes or `npm install` failures
2. **Pattern IDs:** Always normalize via [patternNormalization.ts](backend/src/utils/patternNormalization.ts) before lookups
3. **Stripe Webhook:** Must use `express.raw()` middleware BEFORE `express.json()` ([serverSetup.ts](backend/src/serverSetup.ts#L67))
4. **CORS:** Add new production URLs to `CORS_ORIGINS` in [constants.ts](backend/src/config/constants.ts)
5. **Proxy Trust:** Set `TRUST_PROXY=1` in production for Railway/Heroku (affects rate limiting)

## Testing & Debugging

- **Backend Health Check:** `GET /health` returns `{ status: "ok", time: ISO timestamp }`
- **Debug Routes:** [debugRoutes.ts](backend/src/routes/debugRoutes.ts) gated by `X-Debug-Key` header
- **Test Data:** [testPatternRoleAssignments.js](backend/testPatternRoleAssignments.js) for fabric mapping scenarios
- **Dev Mode Features:** Extra debug fields in responses, verbose logging

## Adding New Patterns

1. Create directory in [backend/src/config/patterns/<pattern-name>/](backend/src/config/patterns/)
2. Export `PatternDefinition` with metadata (skillLevels, blockSize, etc.)
3. Implement `getColors(fabrics)` for role assignment logic
4. Add to registry in [patterns/index.ts](backend/src/config/patterns/index.ts)
5. Create prompt template if needed in [config/prompts/](backend/src/config/prompts/)

See [TODO.md](TODO.md) for incomplete pattern files and refactoring priorities.

## Migration & Deployment

- **Database:** Prisma migrations in [prisma/migrations/](backend/prisma/migrations/)
- **Production Deploy:** Backend runs `prisma migrate deploy` before starting ([package.json](backend/package.json) start script)
- **Monitoring:** See [MONITORING-SETUP.md](MONITORING-SETUP.md) for Sentry/Uptime config
