# Files Over 200 Lines - Refactoring Candidates

These files are candidates for refactoring to improve maintainability by breaking them into smaller, more focused modules.

## Priority: High (300+ lines)

### Frontend Components
- [ ] **340 lines** - [QuiltPlannerPro-Branding/qpp-banners-showcase.jsx](QuiltPlannerPro-Branding/qpp-banners-showcase.jsx)
  - Branding showcase component - could split into individual banner components

- [ ] **335 lines** - [frontend/app/profile/page.tsx](frontend/app/profile/page.tsx)
  - Profile page with multiple sections - extract sections into separate components

- [ ] **324 lines** - [QuiltPlannerPro-Branding/qpp-final-logo.jsx](QuiltPlannerPro-Branding/qpp-final-logo.jsx)
  - Logo component - could simplify or extract SVG paths

- [ ] **318 lines** - [frontend/components/upload/PatternDisplay.tsx](frontend/components/upload/PatternDisplay.tsx)
  - Pattern display component - split into smaller display components

### Backend Controllers
- [ ] **288 lines** - [backend/src/controllers/patternController.ts](backend/src/controllers/patternController.ts)
  - Pattern controller with multiple actions - extract service methods

## Priority: Medium (250-299 lines)

- [ ] **298 lines** - [frontend/app/pricing/page.tsx](frontend/app/pricing/page.tsx)
  - Pricing page - extract pricing tiers into separate components

- [ ] **264 lines** - [frontend/app/upload/page.tsx](frontend/app/upload/page.tsx)
  - Upload page - extract wizard steps/sections into components

- [ ] **260 lines** - [frontend/components/Navigation.tsx](frontend/components/Navigation.tsx)
  - Navigation component - extract mobile/desktop nav into separate components

- [ ] **252 lines** - [frontend/components/upload/FabricDropzone.tsx](frontend/components/upload/FabricDropzone.tsx)
  - Fabric uploader - extract image compression and validation logic

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
- Completed: 0
- In Progress: 0
- Remaining: 11
