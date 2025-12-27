# TODO: Maintainability Improvements

## 1. Split Large, Multi-Responsibility Files
- Refactor `frontend/app/upload/page.tsx` into smaller components and custom hooks.
- Split `backend/src/services/promptBuilder.ts` into focused modules (role assignment, warnings, prompt formatting).
- Refactor `backend/src/services/claudeService.ts` into service classes and utility files.

## 2. Complete TODOs and Incomplete Content
- Fill in missing pattern prompt files in `backend/src/config/prompts/`.
- Complete migration phases in `backend/src/config/prompts/README.md`.

## 3. Move Utility Functions Out of Main Logic
- Move image compression logic from `frontend/components/upload/FabricDropzone.tsx` to a utility file.
- Ensure `backend/src/utils/imageCompressor.ts` is single-responsibility.

## 4. Centralize Hardcoded Values and Duplicated Constants
- Move skill levels, pattern options, and constants from `frontend/app/upload/page.tsx` to config/constants files.
- Ensure all constants are reused from `frontend/lib/constants.ts` and `backend/src/config/constants.ts`.

## 5. Improve Documentation and Comments
- Add comments and documentation to complex logic in `promptBuilder`, `claudeService`, and `pdfService`.

## 6. Backend Routes and Controllers
- Ensure controllers and middleware in `backend/src/serverSetup.ts` are modular and not overloaded.

## 7. Pattern-Specific Prompt Files
- Complete content for all files in `backend/src/config/prompts/*.prompt.ts`.

## 8. Review and Deduplicate Functions
- Audit and refactor `getColors` logic in `backend/src/config/patterns/*/index.ts` (many patterns repeat similar color assignment logic).
- Remove unnecessary template/prompt alias exports in pattern modules if not needed.
- Centralize and synchronize constants between `frontend/lib/constants.ts` and `backend/src/config/constants.ts`.
- Ensure formatting logic (e.g., pattern name formatting, PDF generation) is not duplicated between `backend/src/services/pdfService.ts` and `backend/src/utils/patternFormatter.ts`.
- Check for repeated response helper logic in backend controllers and `backend/src/utils/responseHelper.ts`.
- Move instruction validation/disclaimer logic in `backend/src/services/claudeService.ts` to a shared utility if used elsewhere.
- Consider a generator/schema for pattern prompt files to avoid copy-paste blocks.

---
Prioritize refactoring large files, completing TODOs, moving utility logic, centralizing constants, and improving documentation for better maintainability.
