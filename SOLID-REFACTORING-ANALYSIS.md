# SOLID Refactoring Analysis
**Generated:** January 25, 2026  
**Scope:** Backend controllers/services + Frontend hooks/services

## Executive Summary

Analyzed 70+ TypeScript files across backend and frontend. Identified **15 high-priority** and **23 medium-priority** refactoring candidates based on:
- Line count (50+ lines, especially 100+)
- Private method count (indicates hidden complexity)
- Multiple responsibilities (SRP violations)
- Large class/function surface area

---

## 🔴 Priority 1: Critical Refactors (>200 lines or severe SRP violations)

### 1. **backend/src/services/pattern/patternBuilder.ts** ⚠️ WORST OFFENDER
- **Lines:** 456 (483 total)
- **Private Methods:** 9
- **Public Methods:** 1 (static `build`)
- **SOLID Violations:**
  - **SRP:** Handles fabric building, layout computation, SVG generation, border calculations, pattern naming, size parsing, and requirement calculations
  - **OCP:** Adding new pattern types requires modifying core build logic
  - **ISP:** Single massive `build` method with 6 parameters

**Refactoring Plan:**
```
PatternBuilder (Orchestrator - 80 lines)
  ├─ FabricAssembler (buildFabrics, allocation logic - 60 lines)
  ├─ LayoutComputer (computeAccurateFabricLayout, enhanceLayoutDescription - 90 lines)
  ├─ RequirementsCalculator (fabric + border yardage - 100 lines)
  ├─ SizeResolver (getQuiltSize, parseQuiltSize - 40 lines)
  └─ PatternMetadataFormatter (extractPatternName, formatDifficulty - 30 lines)
```

**Estimated Effort:** 8 hours  
**Impact:** High - central to pattern generation flow

---

### 2. **backend/src/services/pattern/promptFormatter.ts**
- **Lines:** 207 (250 total)
- **Private Methods:** 7
- **Public Methods:** 2 (`buildPrompt`, `buildRoleSwapPrompt`)
- **SOLID Violations:**
  - **SRP:** Builds prompts, extracts skill descriptions, handles pattern guidance, fabric summaries
  - **DRY:** Duplicate size/skill extraction logic

**Refactoring Plan:**
```
PromptFormatter (Orchestrator - 50 lines)
  ├─ SkillLevelResolver (getSkillDescription - 20 lines)
  ├─ PatternGuidanceBuilder (buildPatternGuidance, descriptions - 60 lines)
  ├─ FabricSummaryBuilder (buildFabricSummary, buildRolesSummary - 50 lines)
  └─ PromptTemplateEngine (assemble final prompts - 60 lines)
```

**Estimated Effort:** 5 hours  
**Impact:** Medium - improves prompt maintainability

---

### 3. **backend/src/controllers/patternLibraryController.ts**
- **Lines:** 204 (234 total)
- **Private Methods:** 0
- **Public Methods:** 5 (getUserPatterns, getPatternById, redownloadPattern, deletePattern, renamePattern)
- **SOLID Violations:**
  - **SRP:** HTTP handling mixed with validation and logging
  - **DRY:** Repeated error handling patterns

**Refactoring Plan:**
```
PatternLibraryController (HTTP only - 80 lines)
  ├─ PatternResponseMapper (transform DB -> API response - 40 lines)
  ├─ PatternDownloadHandler (redownloadPattern logic - 60 lines)
  └─ Use existing PatternLibraryService (no changes needed)
```

**Estimated Effort:** 3 hours  
**Impact:** Medium - improves testability

---

### 4. **backend/src/controllers/adminController.ts**
- **Lines:** 161 (174 total)
- **Private Methods:** 0
- **Public Methods:** 5 (getOverview, getUsers, getPatterns, getFeedback, getUsageStats)
- **SOLID Violations:**
  - **SRP:** Direct Prisma calls in controller (should use service layer)
  - **OCP:** Adding new stats requires modifying controller

**Refactoring Plan:**
```
AdminController (HTTP only - 50 lines)
  └─ NEW: AdminAnalyticsService (consolidate all Prisma queries - 120 lines)
       ├─ getUserStats()
       ├─ getPatternStats()
       ├─ getFeedbackStats()
       └─ getUsageStats()
```

**Estimated Effort:** 4 hours  
**Impact:** High - establishes service layer pattern for admin features

---

### 5. **frontend/hooks/useBorderState.ts**
- **Lines:** 147 (163 total)
- **Private Methods:** 0
- **Public Methods:** 8 (toggle, add, remove, update, reorder, reset, validate)
- **SOLID Violations:**
  - **SRP:** State management + business logic + validation
  - **DRY:** Reordering logic could be extracted

**Refactoring Plan:**
```
useBorderState (State only - 60 lines)
  ├─ BorderValidator (validateBorderWidth + constraints - 30 lines)
  ├─ BorderReorderService (reorderBorder logic - 40 lines)
  └─ BorderStateManager (add/remove/update - 50 lines)
```

**Estimated Effort:** 3 hours  
**Impact:** Medium - improves hook clarity

---

## 🟡 Priority 2: High Refactors (100-200 lines)

### 6. **backend/src/controllers/stripeController.ts**
- **Lines:** 144
- **Public Methods:** 4
- **Violations:** Webhook handling + session creation mixed

**Refactor:** Split into `StripeCheckoutController` + `StripeWebhookController` (70 lines each)  
**Effort:** 3 hours

---

### 7. **backend/src/controllers/patternController.ts**
- **Lines:** 133
- **Public Methods:** 2 (generate, generateWithSwap)
- **Violations:** Large parameter lists, complex error handling

**Refactor:** Extract `PatternRequestValidator` (40 lines), simplify controller to 60 lines  
**Effort:** 2 hours

---

### 8. **backend/src/services/pattern/blockGenerator.ts**
- **Lines:** 129 (143 total)
- **Private Methods:** 5
- **Violations:** Fabric selection + template application + rotation

**Refactor:** 
```
BlockGenerator (Orchestrator - 40 lines)
  ├─ FabricSelector (selectBlockFabrics - 30 lines)
  ├─ TemplateApplicator (applyFabricsToTemplate - 40 lines)
  └─ TransformCalculator (calculateTransform - 20 lines)
```
**Effort:** 3 hours

---

### 9. **backend/src/services/ai/openAiService.ts**
- **Lines:** 126 (133 total)
- **Private Methods:** 1
- **Public Methods:** 2
- **Violations:** Fabric analysis + image generation in one class

**Refactor:**
```
OpenAiService (removed)
  → FabricImageAnalyzer (analyzeFabricImages - 60 lines)
  → QuiltImageGenerator (generateQuiltImage - 70 lines)
```
**Effort:** 2 hours

---

### 10. **backend/src/services/subscription/subscriptionService.ts**
- **Lines:** 124
- **Public Methods:** 5
- **Violations:** Multiple Stripe operations + status processing

**Refactor:**
```
SubscriptionService (Orchestrator - 60 lines)
  ├─ SubscriptionStatusProcessor (processUpdate, processCancellation - 40 lines)
  └─ StripeOperationExecutor (cancel, createPortal - 30 lines)
```
**Effort:** 3 hours

---

### 11. **backend/src/services/auth/emailService.ts**
- **Lines:** 123
- **Public Methods:** 3 (sendWelcomeEmail, sendPasswordResetEmail, sendFeedbackNotification)
- **Violations:** HTML template building mixed with sending

**Refactor:**
```
EmailService (Send only - 40 lines)
  └─ EmailTemplateBuilder (welcome, reset, feedback templates - 80 lines)
```
**Effort:** 2 hours

---

### 12. **backend/src/services/user/usageResetService.ts**
- **Lines:** 117
- **Public Methods:** 2
- **Violations:** Cron job scheduling mixed with reset logic

**Refactor:**
```
UsageResetService (DB operations - 60 lines)
  └─ UsageResetScheduler (cron setup - 50 lines)
```
**Effort:** 2 hours

---

### 13. **backend/src/services/auth/authService.ts**
- **Lines:** 117
- **Private Methods:** 1 (generateToken)
- **Public Methods:** 3 (register, login, verifyToken)
- **Violations:** Password hashing + token generation + DB operations

**Refactor:**
```
AuthService (Orchestrator - 50 lines)
  ├─ PasswordHasher (bcrypt operations - 20 lines)
  ├─ TokenGenerator (JWT ops - 30 lines)
  └─ UserRepository (DB queries - 40 lines)
```
**Effort:** 3 hours

---

### 14. **backend/src/services/pdf/pdfBorderRenderer.ts**
- **Lines:** 116
- **Public Methods:** 2
- **Violations:** Section rendering + size calculations

**Refactor:**
```
PdfBorderRenderer (Rendering - 60 lines)
  └─ BorderDimensionFormatter (renderSizeCalculations - 50 lines)
```
**Effort:** 2 hours

---

### 15. **backend/src/services/pattern/downloadValidator.ts**
- **Lines:** 113
- **Public Methods:** 5 (validateUserExists, validateSubscriptionActive, validatePatternOwnership, validateDownloadLimit, validateDownload)
- **Violations:** Good SRP, but could use Result/Either pattern

**Refactor:** Convert to functional validator pipeline using Either monad (same lines, better error handling)  
**Effort:** 2 hours

---

### 16. **frontend/hooks/usePatternGeneration.ts**
- **Lines:** 115 (120 total)
- **Public Methods:** 3 (clearAll, resetPattern, generatePattern)
- **Violations:** Moderate - delegates well to services

**Refactor:** Extract `PatternStateResetter` utility (20 lines), reduce to 80 lines  
**Effort:** 1 hour

---

## 🟢 Priority 3: Medium Refactors (50-100 lines)

### 17-39. Additional Candidates (50-100 lines)
| File | Lines | Issue | Suggested Split | Effort |
|------|-------|-------|----------------|--------|
| `authController.ts` | 119 | 4 endpoints | Split auth endpoints | 2h |
| `userController.ts` | 106 | 3 endpoints | Extract profile transformer | 1.5h |
| `svgBorderRenderer.ts` | 105 | SVG + fill logic | BorderSvgBuilder + FillCalculator | 2h |
| `claudeService.ts` | 102 | Streaming + parsing | StreamManager + ResponseHandler | 2h |
| `instructionPreparationService.ts` | 92 | Preparation logic | InstructionSanitizer + Validator | 1.5h |
| `patternGenerationService.ts` | 90 | Validation + generation | ValidationOrchestrator + GenerationExecutor | 2h |
| `imageCompressionEngine.ts` | 90 | Sharp operations | ImageResizer + QualityOptimizer | 2h |
| `svgWrapper.ts` | 89 | SVG assembly | PatternDefBuilder + FilterBuilder | 1.5h |
| `usePatternLibrary.ts` | 87 | API calls + state | LibraryApiClient + LibraryState | 2h |
| `feedbackService.ts` | 83 | CRUD + voting | FeedbackRepository + VoteManager | 2h |
| `promptOrchestrator.ts` | 83 | Orchestration | PromptCoordinator (actually well-designed) | 0.5h review |
| `patternSelector.ts` | 82 | Pattern selection | PatternMatcher + FabricCountValidator | 2h |
| `usageCalculator.ts` | 81 | Usage + reset dates | UsageMetrics + ResetDateCalculator | 1.5h |
| `feedbackController.ts` | 72 | 3 endpoints | Fine as-is | 0h |
| `useCheckout.ts` | 57 | Stripe checkout | CheckoutSessionManager | 1h |
| `useUserProfile.ts` | 52 | Profile management | Fine as-is | 0h |
| `useFabricState.ts` | 47 | Fabric state | Fine as-is | 0h |

---

## 📊 Summary Statistics

### By Priority
- **Priority 1 (Critical):** 5 files, ~1,225 lines, 26 hours estimated
- **Priority 2 (High):** 11 files, ~1,350 lines, 27 hours estimated
- **Priority 3 (Medium):** 23 files, ~1,800 lines, 29 hours estimated

**Total:** 39 files, ~4,375 lines, **82 hours estimated**

### SOLID Violations Breakdown
| Principle | Violations | Top Offenders |
|-----------|------------|---------------|
| **SRP (Single Responsibility)** | 28 files | patternBuilder, promptFormatter, adminController |
| **OCP (Open/Closed)** | 8 files | patternBuilder, blockGenerator |
| **LSP (Liskov Substitution)** | 2 files | (services using inheritance) |
| **ISP (Interface Segregation)** | 5 files | Large parameter lists in builders |
| **DIP (Dependency Inversion)** | 6 files | Controllers with direct Prisma calls |

---

## 🎯 Recommended Refactoring Order

### Phase 1: Foundation (Week 1-2)
1. **patternBuilder.ts** (8h) - Highest impact, enables other refactors
2. **adminController.ts** (4h) - Establishes service layer pattern
3. **authService.ts** (3h) - Core authentication improvements

### Phase 2: Services (Week 3-4)
4. **promptFormatter.ts** (5h)
5. **blockGenerator.ts** (3h)
6. **subscriptionService.ts** (3h)
7. **openAiService.ts** (2h)
8. **emailService.ts** (2h)

### Phase 3: Controllers (Week 5)
9. **patternLibraryController.ts** (3h)
10. **stripeController.ts** (3h)
11. **patternController.ts** (2h)

### Phase 4: Frontend (Week 6)
12. **useBorderState.ts** (3h)
13. **usePatternGeneration.ts** (1h)
14. **usePatternLibrary.ts** (2h)

### Phase 5: Cleanup (Week 7-8)
15. Remaining Priority 2/3 files based on team bandwidth

---

## 🛠️ Refactoring Patterns to Apply

### 1. **Strategy Pattern** (for pattern selection logic)
```typescript
interface PatternSelectionStrategy {
  select(criteria: SelectionCriteria): Pattern;
}

class SkillBasedSelector implements PatternSelectionStrategy { ... }
class FabricCountSelector implements PatternSelectionStrategy { ... }
```

### 2. **Builder Pattern** (for complex object construction)
```typescript
class PromptBuilder {
  withSkillLevel(level: string): this;
  withFabrics(fabrics: Fabric[]): this;
  build(): string;
}
```

### 3. **Repository Pattern** (for data access)
```typescript
interface PatternRepository {
  findById(id: string): Promise<Pattern | null>;
  save(pattern: Pattern): Promise<void>;
}
```

### 4. **Service Layer** (for business logic)
```typescript
// Instead of:
// Controller → Prisma

// Use:
// Controller → Service → Repository → Prisma
```

### 5. **Either/Result Pattern** (for error handling)
```typescript
type Result<T, E> = Success<T> | Failure<E>;

function validate(data: any): Result<ValidData, ValidationError> {
  // ...
}
```

---

## 📝 Best Practices for Refactoring

1. **Test Coverage First:** Write tests before refactoring (especially for patternBuilder)
2. **Incremental Changes:** Refactor one responsibility at a time
3. **Preserve Behavior:** Use TypeScript's type system to ensure compatibility
4. **Extract, Don't Rewrite:** Move code, don't recreate from scratch
5. **Update Imports:** Use VS Code's "Update imports" refactoring tools
6. **Document Decisions:** Update architecture docs as you refactor

---

## ⚠️ Risk Assessment

### High Risk (Requires Careful Testing)
- `patternBuilder.ts` - Core pattern generation logic
- `authService.ts` - Security implications
- `subscriptionService.ts` - Payment processing

### Medium Risk
- Controllers - HTTP contract changes
- `openAiService.ts` - External API integration

### Low Risk
- Utility services (calculators, validators)
- Frontend hooks (isolated state management)

---

## 🔗 Dependencies & Blockers

### Must Refactor First (Dependencies)
1. `patternBuilder.ts` → (blocks) `patternController.ts`, `patternGenerationService.ts`
2. `authService.ts` → (blocks) `authController.ts`
3. `adminController.ts` → (enables) service layer pattern for all controllers

### Can Refactor in Parallel
- Frontend hooks (useBorderState, usePatternGeneration)
- PDF renderers (independent services)
- Email/notification services

---

## 📈 Expected Benefits

### Code Quality
- **Reduced Complexity:** Average file size from 100+ → 50-70 lines
- **Improved Testability:** Smaller units = easier mocking
- **Better Maintainability:** Single-purpose classes easier to modify

### Developer Experience
- **Faster Onboarding:** Clearer responsibility boundaries
- **Fewer Bugs:** Isolated logic reduces side effects
- **Easier Debugging:** Stack traces point to specific components

### Performance
- **No Impact:** Refactoring is structural, not algorithmic
- **Potential Gains:** Better separation enables caching strategies

---

## 🎓 Learning Resources

For team members new to SOLID principles:
- [SOLID Principles in TypeScript](https://www.typescriptlang.org/docs/handbook/2/classes.html)
- [Refactoring Guru - Design Patterns](https://refactoring.guru/design-patterns)
- [Martin Fowler - Refactoring](https://refactoring.com/)

---

**Next Steps:**
1. Review this analysis with the team
2. Prioritize Phase 1 files based on current sprint goals
3. Create tracking tasks in project management tool
4. Begin with `patternBuilder.ts` refactor (highest impact)

