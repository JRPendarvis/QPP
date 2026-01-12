# Files Over 200 Lines - Refactoring Candidates

These files are candidates for refactoring to improve maintainability by breaking them into smaller, more focused modules.

## Priority: High (300+ lines)

### Frontend Components
- [ ] **340 lines** - [QuiltPlannerPro-Branding/qpp-banners-showcase.jsx](QuiltPlannerPro-Branding/qpp-banners-showcase.jsx)
  - Branding showcase component - could split into individual banner components

- [x] **335 lines** - [frontend/app/profile/page.tsx](frontend/app/profile/page.tsx) → **194 lines (47% reduction)**
  - ✅ Extracted UsageStatsSection, AccountInfoSection, SkillLevelSection components

- [ ] **324 lines** - [QuiltPlannerPro-Branding/qpp-final-logo.jsx](QuiltPlannerPro-Branding/qpp-final-logo.jsx)
  - Logo component - could simplify or extract SVG paths

- [x] **318 lines** - [frontend/components/upload/PatternDisplay.tsx](frontend/components/upload/PatternDisplay.tsx) → **172 lines (52% reduction)**
  - ✅ Extracted PatternVisualization, PatternMetadata, PatternInstructions, DownloadSection, ErrorStates components

### Backend Controllers
- [x] **288 lines** - [backend/src/controllers/patternController.ts](backend/src/controllers/patternController.ts) → **146 lines (49% reduction)**
  - ✅ Extracted PatternDownloadService, PatternListService, PatternErrorHandler, PatternControllerUtils

## Priority: Medium (250-299 lines)

- [ ] **298 lines** - [frontend/app/pricing/page.tsx](frontend/app/pricing/page.tsx)
  - Pricing page - extract pricing tiers into separate components

- [x] **264 lines** - [frontend/app/upload/page.tsx](frontend/app/upload/page.tsx) → **248 lines (14% reduction)**
  - ✅ Extracted ErrorDisplay component

- [ ] **260 lines** - [frontend/components/Navigation.tsx](frontend/components/Navigation.tsx)
  - Navigation component - extract mobile/desktop nav into separate components

- [x] **252 lines** - [frontend/components/upload/FabricDropzone.tsx](frontend/components/upload/FabricDropzone.tsx) → **186 lines (31% reduction)**
  - ✅ Extracted imageCompression.ts and fabricValidation.ts utilities

## Priority: Low (200-249 lines)

- [ ] **211 lines** - [backend/src/config/patterns/pinwheel/plan.ts](backend/src/config/patterns/pinwheel/plan.ts)
  - Pattern configuration - review if can simplify or extract common patterns

- [ ] **204 lines** - [backend/src/services/pdfService.ts](backend/src/services/pdfService.ts)
  - PDF generation service - extract PDF sections into separate methods/modules

## Refactoring Strategy

### For Components (Frontend)
1. Extract child components for distinct UI sections
2. Create custom hooks for complex state management
3. Move utility functions to separate files
4. Split large forms into multi-step components

### For Controllers/Services (Backend)
1. Extract business logic into service classes
2. Move validation to dedicated validator files
3. Create separate modules for different responsibilities
4. Use dependency injection for better testability

### Related TODOs
See [TODO.md](TODO.md) for additional refactoring priorities including:
- Split `promptBuilder.ts` into focused modules
- Move utility functions out of main logic files
- Centralize hardcoded values and constants
- Complete pattern-specific prompt files

## Progress Tracking
- Total files: 11
- Completed: 5 ✅
- In Progress: 0
- Remaining: 6

### Completed Refactorings
1. ✅ **PatternController** - 288→146 lines (49% reduction) - 4 new services/helpers
2. ✅ **PatternDisplay** - 355→172 lines (52% reduction) - 5 new components
3. ✅ **Profile page** - 367→194 lines (47% reduction) - 3 new components
4. ✅ **Upload page** - 290→248 lines (14% reduction) - 1 new component
5. ✅ **FabricDropzone** - 269→186 lines (31% reduction) - 2 new utilities

### Impact Summary
- **Total line reduction:** 783 lines → 946 lines across refactored files (net increase due to modularity)
- **New modules created:** 15 focused components/services/utilities
- **Average reduction per file:** 39% smaller main files
- **All refactored files:** Now under 250 lines ✅
