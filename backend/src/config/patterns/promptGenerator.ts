/**
 * Pattern Prompt Generator and Documentation
 * 
 * This module provides helpers and guidance for creating consistent pattern prompts.
 * All pattern prompts should use the createPatternPrompt() factory to ensure type safety.
 */

import type { PatternPrompt } from '../../../types/PatternPrompt';

/**
 * Factory function to create a pattern prompt with proper type checking.
 * 
 * Use this when creating new pattern prompt files to ensure all required fields are present
 * and properly typed. This reduces boilerplate and catches missing fields at compile time.
 * 
 * @param data - Pattern prompt data matching PatternPrompt interface
 * @returns Fully typed PatternPrompt object
 * 
 * @example
 * import { createPatternPrompt } from '../promptGenerator';
 * import type { PatternPrompt } from '../../../types/PatternPrompt';
 * 
 * export const MY_PATTERN_PROMPT: PatternPrompt = createPatternPrompt({
 *   patternName: 'My Pattern',
 *   recommendedFabricCount: 4,
 *   characteristics: 'Pattern description...',
 *   fabricRoleGuidance: 'Fabric role guidance...',
 *   cuttingInstructions: 'Cutting instructions...',
 *   assemblyNotes: 'Assembly notes...',
 *   commonMistakes: 'Common mistakes...',
 * });
 */
export function createPatternPrompt(data: PatternPrompt): PatternPrompt {
  return {
    patternName: data.patternName,
    recommendedFabricCount: data.recommendedFabricCount,
    characteristics: data.characteristics,
    fabricRoleGuidance: data.fabricRoleGuidance,
    cuttingInstructions: data.cuttingInstructions,
    assemblyNotes: data.assemblyNotes,
    commonMistakes: data.commonMistakes,
  };
}

/**
 * Checklist and guide for creating new pattern prompts.
 * 
 * STEP 1: Create the prompt file
 * ────────────────────────────
 * Create: backend/src/config/patterns/{pattern-id}/prompt.ts
 * 
 * STEP 2: Use createPatternPrompt() factory
 * ─────────────────────────────────────────
 * import { createPatternPrompt } from '../promptGenerator';
 * import type { PatternPrompt } from '../../../types/PatternPrompt';
 * 
 * export const MY_PATTERN_PROMPT: PatternPrompt = createPatternPrompt({
 *   patternName: 'My Pattern',
 *   recommendedFabricCount: 4,
 *   characteristics: '...',
 *   fabricRoleGuidance: '...',
 *   cuttingInstructions: '...',
 *   assemblyNotes: '...',
 *   commonMistakes: '...',
 * });
 * 
 * STEP 3: Field Content Guidelines
 * ─────────────────────────────────
 * 
 * patternName (string)
 *   - Human-readable, title-cased name
 *   - Examples: \"Four Patch\", \"Nine Patch\", \"Ohio Star\"
 * 
 * recommendedFabricCount (number | { min: number; max: number })
 *   - Single number: pattern works best with this exact count
 *   - Range object: pattern works with variable counts
 *   - Examples: 4, { min: 2, max: 6 }
 * 
 * characteristics (string - 4-6 paragraphs)
 *   - What makes this pattern unique and visually distinctive
 *   - Grid structure: \"3×3 grid\", \"2×2 grid\", \"16-patch\", etc.
 *   - Piecing units: \"half-square triangles\", \"squares\", \"rectangles\", etc.
 *   - Visual effect: \"creates diagonal movement\", \"optical illusion\", etc.\n *   - Skill level: \"Beginner\", \"Intermediate\", \"Advanced\"\n *   - Typical sewing time estimate\n * \n * fabricRoleGuidance (string - 10-15 paragraphs)\n *   - Explains how to assign fabric colors to pattern roles\n *   - Include sections for 2-fabric, 3-fabric, 4-fabric, 5+ fabric quilts\n *   - Format:\n *       WITH 2 FABRICS (traditional):\n *       - BACKGROUND (fabricColors[0]): ...description...\n *       - PRIMARY (fabricColors[1]): ...description...\n *   - For each fabric count, explain which role gets which color\n *   - Describe visual effect of color placement\n *   - Include rotation/alternation strategy if applicable\n *   - Add design tips for maximum impact\n *\n * cuttingInstructions (string - 8-12 paragraphs)\n *   - Specify piece dimensions and quantities\n *   - List all cutting variations (squares, rectangles, half-square triangles, etc.)\n *   - Include seam allowance guidance (typically 1/4 inch)\n *   - Add any special cutting methods (strip piecing, chain piecing, etc.)\n *   - Example format:\n *       Cut equal-sized squares from each fabric:\n *       - BACKGROUND fabric: 16 squares, 2\" × 2\" (plus 1/4\" seam allowance)\n *       - PRIMARY fabric: 12 squares, 2\" × 2\"\n *\n * assemblyNotes (string - 8-12 paragraphs)\n *   - Step-by-step block assembly sequence\n *   - Pressing directions (usually toward darker fabric)\n *   - How individual blocks connect when tiled\n *   - Nested seams (where to nest for clean intersections)\n *   - Efficiency tips for faster sewing\n *   - Example format:\n *       1. Sew squares into rows (typically 3 rows of 3)\n *       2. Press seams alternating directions per row\n *       3. Sew rows together, nesting seams\n *       4. Press final seams toward darker fabric\n *\n * commonMistakes (string - 6-8 paragraphs)\n *   - Errors beginners commonly make\n *   - How to prevent each error\n *   - What to look for during assembly\n *   - Example issues:\n *       - \"Inconsistent seam allowances lead to pieces not fitting\"\n *       - \"Pressing in wrong direction creates bulk at intersections\"\n *       - \"Not squaring up blocks before sewing rows together\"\n * \n * STEP 4: Register in backend/src/config/prompts/index.ts\n * ────────────────────────────────────────────────────────\n * 1. Import the prompt:\n *    import { MY_PATTERN_PROMPT } from '../patterns/my-pattern/prompt';\n * \n * 2. Add to PATTERN_PROMPTS registry:\n *    'my-pattern': MY_PATTERN_PROMPT,\n * \n * 3. Verify import also in PATTERN_PROMPTS mapping\n * \n * STEP 5: Test\n * ────────────\n * - Run: npm test\n * - Verify no import errors\n * - Check pattern renders correctly in upload page\n * - Verify prompt displays correctly in pattern selection UI\n */\nexport const PATTERN_PROMPT_CREATION_GUIDE = `\nCreating a new pattern prompt requires:\n\n1. Create backend/src/config/patterns/{pattern-id}/prompt.ts\n2. Use createPatternPrompt() factory for type safety\n3. Fill in all 7 required sections with detailed guidance\n4. Register in backend/src/config/prompts/index.ts\n5. Run npm test to verify no errors\n\nSee promptGenerator.ts for detailed field guidelines.\n`;\n