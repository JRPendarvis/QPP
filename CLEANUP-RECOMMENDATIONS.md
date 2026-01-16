# Code Cleanup Recommendations

## 1. Temporary Script Files (Can Delete)

These are one-time utility scripts in `/backend/`:

```bash
# Delete these after backing up if needed
rm backend/check-db.js
rm backend/create-account.js  
rm backend/reset-password.js
rm backend/test-all-patterns.js
rm backend/test-four-patch.js
rm backend/testPatternRoleAssignments.js
rm backend/validate-instructions.js
```

**Keep**: `backend/scripts/production-safety-check.js` (used in production)

## 2. Unused Private Field in ClaudeService

File: `backend/src/services/ai/claudeService.ts`

```typescript
export class ClaudeService {
  private _fabricImages: string[] = []; // ❌ UNUSED - remove this
```

The `_fabricImages` field is set but never read. The actual fabric images are passed directly to `PatternBuilder.build()`.

**Fix**: Remove the unused private field

## 3. Console.log Statements (Production Cleanup)

Many console.log statements remain for debugging. Consider:

- **Keep**: Server startup logs, error logs, cron job logs
- **Remove or conditionally log**: Pattern generation debug logs (🧵, 🖼️, 🎨 emojis)

Files with heavy debug logging:
- `backend/src/services/pattern/patternBuilder.ts` (lines 85-117)
- `backend/src/services/image/imagePatternBuilder.ts` (lines 17-26)
- `backend/src/services/pattern/blockGenerator.ts` (line 115)

**Recommendation**: Wrap in `if (process.env.DEBUG_PATTERNS)` check

## 4. Commented Code

File: `backend/src/routes/feedbackRoutes.ts`
```typescript
// Public: list feedback (annotated if user is authenticated)
```

This is just a comment (OK to keep), not commented-out code.

## 5. Duplicate Documentation Files

Multiple similar docs in root:
- `MONITORING-SETUP.md`
- `RAILWAY-DEPLOYMENT.md`  
- `RAILWAY-MIGRATION-FIX.md`
- `PATTERN-LIBRARY-CHANGES.md`
- `PATTERN-VALIDATION-COMPLETE.md`
- `PATTERN-VALIDATION-REPORT.md`
- `REFACTOR-FILES-OVER-200-LINES.md`
- `UPLOAD-PAGE-IMPROVEMENTS.md`
- `LEGAL-COMPLIANCE-IMPLEMENTATION.md`

**Recommendation**: Move to `/doc/` or `/docs/` folder and keep only:
- README.md
- TODO.md
- LICENSE

## 6. Frontend Cleanup Needed?

Check for:
- Unused components
- Unused hooks
- Unused utility functions

Run: `npx depcheck` in both backend and frontend to find unused dependencies

## Quick Cleanup Script

```powershell
# Move docs to organized folder
mkdir doc/archive
mv *-SETUP.md doc/archive/
mv *-DEPLOYMENT.md doc/archive/
mv *-CHANGES.md doc/archive/
mv *-REPORT.md doc/archive/
mv *-IMPLEMENTATION.md doc/archive/
mv *-IMPROVEMENTS.md doc/archive/

# Delete temp scripts
rm backend/check-db.js
rm backend/create-account.js
rm backend/reset-password.js
rm backend/test-*.js
rm backend/validate-instructions.js
rm backend/testPatternRoleAssignments.js
```

## Priority Actions

### High Priority (Do Before Deploy)
1. ✅ Remove temp script files
2. ✅ Remove unused `_fabricImages` field
3. ✅ Organize documentation

### Medium Priority
4. Wrap debug logs in environment check
5. Run `npx depcheck` and remove unused deps

### Low Priority  
6. Frontend component audit
7. Consider adding ESLint rule for unused vars
