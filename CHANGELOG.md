# Changelog

All notable changes to QuiltPlannerPro will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2026-01-31 - Visual Improvements & UI Cleanup

### Added (2026-01-31)
- **Password Strength Indicator**: Real-time password validation with visual feedback
  - 7-point scoring system (length 8/12/16, lowercase, uppercase, numbers, special characters)
  - 4 strength levels: weak (red), fair (orange), good (green), strong (dark green)
  - Color-coded progress bar with specific improvement suggestions
  - Implemented on registration page and password reset page
  - Uses `useMemo` for optimized performance

### Changed (2026-01-31)
- **Brand-Consistent Background**: Replaced solid red (#B91C1C) with QuiltPlannerProBackGround.png across entire application
  - Applied to 14+ page headers (upload, library, profile, home, pricing, feedback, legal, FAQ, dashboard, about, admin, terms, privacy)
  - CSS: `backgroundSize: 'cover', backgroundPosition: 'center'` for responsive scaling
  - Added Navigation component to Terms and Privacy pages for consistent layout
  - Gradient backgrounds on page bodies: `linear-gradient(135deg, #FEF2F2 0%, #F0FDFA 50%, #FFFBEB 100%)`
- **Pattern Preview Size**: Increased pattern card preview area from 192px (h-48) to 320px (h-80) for better visibility in pattern library

### Fixed (2026-01-31)
- **UI Cleanup - Duplicate Information Removal**:
  - Removed duplicate fabric count display from pattern selector (shown in both upload section and info badge)
  - Removed duplicate pattern name from selection badge (already visible in dropdown)
  - Removed "Requires X-Y fabrics" text from info badge (requirements shown in dropdown)
  - Pattern selection badge now only shows when fabrics are uploaded: "You have X fabric(s)" with color-coded validation
  - Cleaner, less redundant user interface based on user feedback

### Technical Notes (2026-01-31)
- QuiltPlannerProBackGround.png: 2.2MB brand asset
- Session commits: 7 commits covering visual improvements and UI cleanup
- Branch workflow: Panel branch created for visual improvements, merged to main 3 times, currently on hold
- Backend deployed to Railway successfully (port 3001, 6 migrations, cron jobs initialized)

## [1.1.0] - 2026-01-25 - SOLID Refactoring Release

### Major Refactoring (2026-01-25) - SOLID Principles Implementation
This release represents a comprehensive refactoring of the entire backend codebase following SOLID principles, with focus on Single Responsibility Principle (SRP). All implementation files are now under 200 lines, highly testable, and maintainable.

#### Test Coverage Achievements
- **456 total tests** (up from 277, +65% growth)
- **45 test suites** with 100% pass rate
- **Zero regressions** maintained throughout refactoring
- **Zero breaking changes** to public APIs

#### Backend Services Extracted (18 New Services)

**Authentication Services:**
- `PasswordHasher` - Bcrypt password hashing operations (27 lines, 8 tests)
- `JwtTokenManager` - JWT token generation and verification (51 lines, 11 tests)
- `UserRegistrationProcessor` - User creation logic with badge assignment (68 lines, 16 tests)
- `EmailTemplateBuilder` - HTML email template generation (88 lines, 19 tests)
- `ResendEmailSender` - Email sending via Resend API (59 lines, 17 tests)

**Subscription Services:**
- `SubscriptionDataProcessor` - Stripe data transformation (57 lines, 20 tests)
- `StripeApiExecutor` - Stripe API operations wrapper (52 lines, 17 tests)
- `StripeWebhookEventHandler` - Webhook event processing (53 lines, 13 tests)

**User Management Services:**
- `UsageResetCalculator` - 30-day reset date calculations (47 lines, 19 tests)
- `UserUsageRepository` - User usage queries and updates (79 lines, 13 tests)

**Pattern Generation Services:**
- `FabricSelector` - Fabric selection logic (43 lines, 14 tests)
- `TemplateApplicator` - SVG template application (69 lines, 11 tests)
- `TransformCalculator` - Geometric transformations (24 lines, 7 tests)
- `FabricAssembler` - Fabric allocation and building (90 lines)
- `LayoutComputer` - Accurate fabric layout calculations (150 lines)
- `RequirementsCalculator` - Fabric yardage requirements (110 lines)
- `SizeResolver` - Quilt size resolution (47 lines)
- `PatternMetadataFormatter` - Pattern metadata formatting (49 lines)

**AI Services:**
- `FabricImageAnalyzer` - OpenAI vision analysis (67 lines, 6 tests)
- `QuiltImageGenerator` - OpenAI image generation (66 lines, 6 tests)

**Admin Services:**
- `AdminAnalyticsService` - Admin dashboard analytics (129 lines, 363 tests)

**Prompt Formatting Services:**
- `SkillLevelResolver` - Skill level descriptions (18 lines)
- `PatternGuidanceFormatter` - Pattern guidance building (47 lines)
- `FabricSummaryBuilder` - Fabric analysis summaries (34 lines)
- `InitialPromptBuilder` - Initial prompt construction (75 lines)
- `RoleSwapPromptBuilder` - Role swap prompt building (54 lines)
- `QuiltSizeMapper` - Size mapping and formatting (25 lines)
- `PatternDescriptionResolver` - Pattern description resolution (21 lines)

**Supporting Services:**
- `PatternRequestValidator` - Request validation (42 lines, 14 tests)
- `PatternListMapper` - Pattern list transformation (20 lines)
- `PatternDataNormalizer` - Pattern data normalization (17 lines)
- `PatternFileNameGenerator` - PDF filename generation (15 lines)
- `BorderCountCalculator` - Border count calculations (17 lines)

#### Frontend Utilities Extracted
- `BorderValidator` - Border configuration validation (38 lines, 78 tests)
- `BorderReorderService` - Border reordering logic (54 lines, 181 tests)

#### Controller Improvements
- **patternBuilder.ts**: 456 → 138 lines (70% reduction)
- **promptFormatter.ts**: 207 → 105 lines (49% reduction)
- **authService.ts**: 141 → 111 lines (21% reduction)
- **emailService.ts**: 129 → 26 lines (80% reduction)
- **subscriptionService.ts**: 142 → 122 lines (14% reduction)
- **usageResetService.ts**: 132 → 96 lines (27% reduction)
- **blockGenerator.ts**: 143 → 47 lines (67% reduction)
- **openAiService.ts**: 133 → 50 lines (62% reduction)
- **adminController.ts**: Extracted analytics service (107 → 75 lines)
- **stripeController**: Split into `stripeCheckoutController` and `stripeWebhookController`

#### Architecture Patterns Established
- **Static Utility Classes** for pure functions (no state, no dependencies)
- **Instance-based API Wrappers** for external services (Stripe, Resend, OpenAI)
- **Repository Pattern** for database access abstraction
- **Data Processors** for business logic coordination
- **Consistent Mock Strategies** for testing (resolved Jest hoisting issues)

#### Code Quality Metrics
- **Before:** 5 files >200 lines (critical priority)
- **After:** 0 implementation files >200 lines ✅
- **Test-to-Code Ratio:** Significantly improved with comprehensive coverage
- **Maintainability:** Each class has single, clear responsibility

#### Technical Challenges Resolved
- Fixed Stripe SDK mock hoisting issues with instance-based pattern
- Corrected date calculation logic in usage reset service
- Implemented proper JWT secret validation at startup
- Separated HTML template generation from email sending
- Established reliable mock patterns for complex SDKs

#### Documentation Added
- `SOLID-REFACTORING-ANALYSIS.md` - Complete refactoring plan and analysis
- `SOLID-REFACTORING-COMPLETE.md` - Detailed completion report
- `PATTERN-BUILDER-REFACTORING.md` - Pattern builder specific docs
- `PROMPT-FORMATTER-REFACTORING.md` - Prompt formatter specific docs

### Fixed (2026-01-25)
- **Critical:** Fixed TypeScript compilation error in `patternLibraryController` where `patternType` could be null
- **Critical:** Fixed race conditions in admin dashboard by adding `useCallback` wrappers for async functions
- **Critical:** Implemented `isMounted` pattern in admin page and `useUserProfile` hook to prevent memory leaks
- **Critical:** Fixed feedback page infinite loop risk by wrapping `loadFeedback` in `useCallback`
- **Medium:** Corrected all `useEffect` dependency arrays to prevent stale closures
- **Medium:** Added proper cleanup functions to all components with async operations
- **Minor:** Removed unused error variables from admin page catch blocks
- **Minor:** Fixed ESLint errors: `flex-grow` → `grow`, `flex-shrink-0` → `shrink-0`

### Changed (2026-01-25)
- Reorganized navigation with account dropdown to reduce clutter
- Moved Dashboard to main navigation level
- Moved Admin link inside account dropdown (staff only)
- Removed duplicate code fragments in NavigationLinks and feedback page

## [1.0.0] - 2025-2026 Initial Release

### Added

#### Admin Features (2025-12)
- Staff role system with unlimited pattern generation and downloads
- Admin dashboard with 4 tabs: Overview, Users, Patterns, Feedback
- Analytics endpoints:
  - `/api/admin/overview` - User counts, subscription stats, platform metrics
  - `/api/admin/users` - User list with subscription tiers and usage stats
  - `/api/admin/patterns` - Pattern library with download counts
  - `/api/admin/feedback` - Feature request management
- Role-based access control for admin routes
- Red header banner on admin dashboard for brand consistency
- Navigation and Footer to admin page for consistent layout

#### Feedback & Voting System (2025-12)
- Public feedback page for feature requests
- Voting system with thumbs-up buttons and vote counts
- Real-time vote updates
- `/api/feedback/vote` endpoint for managing votes
- Database models: `Feedback` and `FeedbackVote`

#### Border Features (2025-11)
- Complete border support infrastructure with `Border`, `BorderFabric`, `BorderSize` types
- Dynamic border naming based on total count
- Border configuration in Step 2 (Quilt Size)
- Visual border rendering in SVG preview
- Separate fabric uploads for borders (up to 4 additional fabrics)
- Border size calculator for accurate yardage
- Wire border configuration through entire pattern generation stack

#### Unit Testing Infrastructure (2025-11)
- Jest configuration for both backend and frontend
- Comprehensive unit tests for utility functions:
  - `fabricMapping.test.ts` - Fabric role assignment logic
  - `fabricNormalization.test.ts` - Fabric data normalization
  - `patternNormalization.test.ts` - Pattern ID normalization
  - `BorderSizeCalculator.test.ts` - Border yardage calculations
- Test documentation in `UNIT-TESTING-SETUP.md`

#### Pattern Library
- 15+ quilt patterns with varying skill levels:
  - Beginner: Nine Patch, Rail Fence, Four Patch
  - Intermediate: Churn Dash, Pinwheel, Ohio Star, Sawtooth Star
  - Advanced: Flying Geese, Log Cabin, Storm at Sea, Mosaic Star
- Pattern validation system with status flags (active/disabled)
- Pattern-specific fabric role assignments
- Centralized pattern registry in `backend/src/config/patterns/`
- Manual instructions for each pattern

#### Fabric Management
- Fabric upload with drag-and-drop support
- Image compression (max 5MB, optimized quality)
- Fabric role assignment (background, primary, secondary, accent)
- Fabric analysis via Claude AI
- Total fabric size validation (max 10MB combined)
- Minimum fabric requirements (3-4 fabrics depending on pattern)
- Ability to rearrange and remove selected fabrics
- Fabric yardage calculations with accurate binding

#### Pattern Generation
- AI-powered pattern generation using Claude AI (Anthropic)
- Streaming responses for real-time feedback
- "Challenge Me" mode for next skill level patterns
- User-defined quilt sizes (custom dimensions)
- Pattern preview with SVG rendering
- Skill level enforcement and validation
- Pattern instructions with step-by-step guidance
- Fabric recommendations and color suggestions

#### PDF Generation & Downloads
- PDF pattern downloads with comprehensive instructions
- Specialized PDF renderers:
  - `BlockRenderer` - Block diagrams and cutting instructions
  - `AssemblyRenderer` - Assembly diagrams and steps
  - `FabricRenderer` - Fabric requirements and yardage
  - `SupplyRenderer` - Supply lists
  - `LayoutRenderer` - Final quilt layout visualization
- Download tracking per pattern
- Empty block support in PDF downloads
- Authenticated download endpoints

#### Subscription & Payment System
- Stripe integration for payment processing
- 4 subscription tiers:
  - Free: 3 generations/month
  - Basic: 5 generations/month
  - Intermediate: 15 generations/month
  - Advanced: 50 generations/month
- Usage tracking with monthly reset (automated cron job)
- Promo code support
- Subscription management (upgrade, cancel)
- Webhook handling for subscription updates
- Billing toggle (monthly/annual)
- Pricing page with feature comparison

#### User Management
- User registration and login
- JWT authentication with httpOnly cookies
- Password reset functionality via email
- User profile page with skill level and subscription status
- Badge system showing subscription tier
- Usage statistics (generations and downloads)
- Profile picture support
- Account deletion

#### Legal & Compliance
- Terms of Service page
- Privacy Policy page
- Refund Policy page
- Cookie consent banner with camera icon
- Legal document rendering from markdown

#### UI/UX Features
- Responsive design for mobile and desktop
- Navigation with account dropdown
- Footer with legal links
- Toast notifications for user feedback
- Progress indicators during pattern generation
- FAQ page with common questions
- About page
- Success page after checkout
- Feedback form for user suggestions
- Pinterest verification

#### Email Services
- Welcome emails
- Password reset emails
- Feedback submission emails
- Support email system

#### Developer Experience
- Backend service organization into domain folders:
  - `services/pattern/` - Pattern generation and management (15 files)
  - `services/ai/` - Claude/OpenAI integration (5 files)
  - `services/subscription/` - Stripe integration (4 files)
  - `services/user/` - User management (5 files)
  - `services/image/` - Image processing (6 files)
  - `services/auth/` - Authentication (3 files)
  - `services/pdf/` - PDF generation (6 files)
  - `services/sanitization/` - Input sanitization (3 files)
- Frontend component extraction for maintainability
- Debug routes with API key protection
- Health check endpoint at `/health`
- Comprehensive error handling
- Request logging middleware
- Rate limiting per route
- XSS protection with sanitization
- CORS configuration
- Railway deployment configuration

#### SEO & Analytics
- Google Analytics integration
- Sitemap generation
- Robots.txt configuration
- Meta tags for social sharing

### Changed

#### Refactoring (2025-10 to 2025-12)
- Extracted `PricingCard`, `useCheckout`, `BillingToggle` from Pricing page (-75% lines)
- Extracted `LogoIcon`, `useUserProfile`, `NavigationLinks`, `MobileMenu` from Navigation (-72% lines)
- Extracted 5 renderer services from PDFService (-67% lines)
- Extracted `DownloadRepository` and `DownloadValidator` from PatternDownloadService (-53% lines)
- Extracted `UserRepository`, `UsageCalculator`, `ProfileTransformer` from UserController (-29% lines)
- Extracted services from `PromptBuilder`, `StripeController`, `PatternGenerationService` (SOLID principles)
- Extracted image compression and validation from `FabricDropzone`
- Extracted error display from Upload page
- Extracted Profile page into 3 focused components
- Extracted PatternDisplay into 5 focused components
- PatternController refactored from 288 lines to 146 lines
- Backend services organized into domain-specific folders

#### Pattern Improvements
- Updated Ohio Star to use all 4 colors
- Corrected Churn Dash pattern structure
- Fixed Pinwheel color assignments
- Removed duplicate numbering in pattern instructions
- Replaced random pattern selection with deterministic logic
- Updated pattern templates for better AI prompting

#### Security Enhancements
- Added request sanitization middleware
- Implemented DOMPurify for client-side XSS protection
- Trust proxy settings for Railway deployment
- Secure cookie settings (SameSite=None in production)
- Admin API key protection
- CORS origin validation

#### Database & Data Management
- Prisma ORM integration with PostgreSQL
- Migration system for schema changes
- Production database safety checks
- Soft delete patterns (exclude from dropdown when disabled)
- Usage counter reset automation

#### Build & Deployment
- Next.js 16 with Turbopack
- Railway deployment configuration
- Production safety scripts
- Environment variable validation
- Proper package.json engine specifications

### Fixed

#### Authentication & Security
- Login/register responses now include user role
- CORS preflight origin validation
- Cookie header inspection for debugging
- SameSite cookie issues in production
- JWT token passing to frontend
- Server-side authentication flow

#### Pattern Generation
- Fabric role assignment edge cases
- Pattern ID normalization
- Skill level display accuracy
- "Challenge Me" button alignment
- Pattern instruction formatting
- SVG parsing errors
- Color recommendation accuracy

#### UI/UX Issues
- Duplicate footer removed
- Duplicate code fragments cleaned up
- Navigation alignment and spacing
- Header information alignment
- Mobile responsiveness improvements
- Toast message positioning
- Button visibility issues
- Form validation on pattern selection

#### PDF & Downloads
- Footer writing loop placement
- Auth token passing to PDF download
- Empty block rendering
- Margin accuracy

#### Database & API
- Admin feedback endpoint nested user include bug
- Current period end date handling
- Stripe webhook secret validation
- Migration file execution order

#### Build & Compilation
- TypeScript `any` type in admin page
- ESLint errors across multiple files
- Frontend build errors with react-markdown
- Missing type declarations (JSX, DOMPurify)
- Backend compilation errors
- Package lock file conflicts

### Removed
- Duplicate code at end of files (NavigationLinks, feedback page)
- Disabled patterns from selection dropdown
- DALL-E integration (reverted to SVG-only)
- Random block generation
- Palette lines from UI
- Feathered Star pattern (replaced with Mosaic Star)
- Stripe webhook in early development
- Unused node_modules committed to repo
- Test stash entries

### Documentation
- Added `BORDERS-IMPLEMENTATION.md` - Border feature documentation
- Added `CLEANUP-RECOMMENDATIONS.md` - Code cleanup guide
- Added `MVP-TODO-LIST.md` - MVP feature tracking
- Added `UNIT-TESTING-SETUP.md` - Testing infrastructure guide
- Added `.github/copilot-instructions.md` - AI coding assistant guide
- Added `TODO.md` - Development task tracking
- Added `doc/pricing-structure.md` - Subscription tier details
- Added `QuiltPlannerPro-Branding/` - Logo and banner assets
- Archived completed documentation in `doc/archive/`:
  - Legal compliance implementation
  - Monitoring setup
  - Pattern library changes
  - Pattern validation reports
  - Railway deployment guides
  - Refactoring documentation
  - Upload page improvements

## [Alpha-v0.0.1] - 2025-09

### Added
- Initial project setup
- Basic authentication system (registration, login, JWT)
- Database schema with Prisma
- Frontend with Next.js App Router
- Backend with Express.js
- Fabric upload functionality
- Basic pattern generation with Claude AI
- Landing page
- User dashboard

---

## Git Branch History

- **main** - Production-ready code
- **Bug-Fixes** - Current: Critical bug fixes with React hooks best practices
- **Feedback** - Merged: Voting system for feature requests
- **AdminFeatures** - Merged: Staff role and admin dashboard
- **unit-tests** - Testing infrastructure
- **borders** - Border rendering and configuration
- **fabric-amounts** - Fabric yardage calculations
- **complete-mvp** - Legal compliance and MVP preparation
- **refactor/improve-maintainability** - Service folder reorganization
- **Mobile** - Mobile support improvements
- **VerifyPatternInstructions** - Manual pattern instruction verification
- **Pattern-Validation** - Pattern validation system
- **feature/image-role-assignment** - Fabric role assignment logic
- **Refactoring** - Code cleanup and SOLID principles
- **SRP** - Single Responsibility Principle refactoring
- **Maintainablity** - Code maintainability improvements
- **Verify-instructions** - Pattern instruction verification

---

## Development Milestones

1. **Alpha Release** (2025-09) - Core functionality complete
2. **MVP Release** (2025-11) - Legal compliance, borders, testing
3. **Refactoring Phase** (2025-12) - Code organization and maintainability
4. **Admin & Feedback** (2025-12) - Staff tools and user voting
5. **Bug Fixing Phase** (2026-01) - React hooks best practices, stability improvements

---

## Contributors

- Development Team
- AI Coding Assistant (GitHub Copilot with Claude Sonnet 4.5)

---

## Notes

This changelog represents the complete development history of QuiltPlannerPro from initial commit to current state. The project evolved from a basic authentication system to a full-featured SaaS platform with AI-powered quilt pattern generation, subscription management, and comprehensive admin tools.

For detailed commit messages and technical changes, see the git history with `git log --oneline --all`.
