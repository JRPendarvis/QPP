import { SKILL_LEVEL_DESCRIPTIONS } from '../../config/skill-levels';
import { PatternFormatter } from '../../utils/patternFormatter';
import { getPatternPrompt } from '../../config/prompts';
import { ProductionQuiltSpec, ProductionSpecHandler } from './ProductionSpecHandler';
import { FabricAnalysis, RoleAssignments, RoleValidationService } from './RoleValidationService';

/**
 * Service responsible for building AI prompt templates.
 * 
 * Single Responsibility: Prompt text generation and formatting
 */
export class PromptTemplateBuilder {
  /**
   * Build complete prompt for Claude API for initial pattern generation
   */
  static buildMainPrompt(
    fabricCount: number,
    patternForSvg: string,
    patternInstruction: string,
    skillLevel: string,
    patternId?: string,
    productionSpec?: ProductionQuiltSpec
  ): string {
    const skillDescription = SKILL_LEVEL_DESCRIPTIONS[skillLevel] || SKILL_LEVEL_DESCRIPTIONS['beginner'];
    const patternPrompt = this.getPatternPrompt(patternId);
    const patternDescription = this.getPatternDescription(patternPrompt, patternForSvg);
    const patternGuidance = this.buildPatternGuidance(patternPrompt, patternForSvg);

    const previewContract = ProductionSpecHandler.generatePreviewContract();
    const productionBlock = ProductionSpecHandler.generateProductionBlock(productionSpec);

    return `You are an expert quilter with deep knowledge of fabric selection and color theory. I'm providing you with ${fabricCount} fabric images.

${patternInstruction}

**CRITICAL: YOU MUST CREATE A "${patternForSvg.toUpperCase()}" PATTERN - NOT ANY OTHER PATTERN TYPE**

For reference, a "${patternForSvg}" pattern has these characteristics:
${patternDescription}

${patternGuidance}

${previewContract}
${productionBlock}

**STEP 1: ANALYZE EACH FABRIC**
For EACH fabric image, identify:
1. Is it a PRINTED fabric (has patterns/designs/characters) or a SOLID fabric (single color)?
2. If PRINTED: Describe the print
3. If SOLID: Identify the hex color (e.g., #FF5733)
4. Identify the dominant/background color as a hex code for the SVG visualization
5. **VALUE ASSESSMENT:** Is this fabric LIGHT, MEDIUM, or DARK?
6. **PRINT SCALE:** Classify as SOLID | SMALL | MEDIUM | LARGE

**STEP 2: ASSIGN FABRIC ROLES**
Recommend which role each fabric should play: BACKGROUND | PRIMARY | SECONDARY | ACCENT (optional)

**STEP 3: CREATE THE PATTERN**
Create a "${patternForSvg}" quilt pattern that incorporates ALL ${fabricCount} fabrics:
- Reference fabrics by ROLE first, then description in instructions

Skill level: ${skillDescription}

${this.buildJsonResponseTemplate(fabricCount, patternForSvg, skillLevel, productionSpec)}

**IMPORTANT REQUIREMENTS:**
- Return ONLY valid JSON - no markdown, no explanations outside the JSON
- The "fabricAnalysis" array MUST have exactly ${fabricCount} entries
- The "fabricColors" array MUST have exactly ${fabricCount} hex colors
- The "fabricDescriptions" array MUST have exactly ${fabricCount} descriptions
- roleAssignments values should be null if that role is not used
- Instructions MUST reference fabrics by ROLE first, then description
- The difficulty MUST be "${skillLevel.replace('_', ' ')}"
- Ensure VALUE CONTRAST between background and primary fabrics`;
  }

  /**
   * Build prompt for re-analyzing with swapped roles
   */
  static buildRoleSwapPrompt(
    fabricAnalysis: FabricAnalysis[],
    newRoleAssignments: RoleAssignments,
    patternForSvg: string,
    skillLevel: string,
    patternId?: string,
    productionSpec?: ProductionQuiltSpec
  ): string {
    const skillDescription = SKILL_LEVEL_DESCRIPTIONS[skillLevel] || SKILL_LEVEL_DESCRIPTIONS['beginner'];
    const patternPrompt = this.getPatternPrompt(patternId);
    const patternDescription = this.getPatternDescription(patternPrompt, patternForSvg);

    const fabricSummary = this.buildFabricSummary(fabricAnalysis);
    const rolesSummary = this.buildRolesSummary(newRoleAssignments);
    const warnings = RoleValidationService.generateRoleWarnings(fabricAnalysis, newRoleAssignments);

    const previewContract = ProductionSpecHandler.generatePreviewContract();
    const productionBlock = ProductionSpecHandler.generateProductionBlock(productionSpec);

    const patternGuidance = this.buildPatternGuidanceForRoleSwap(patternPrompt);

    return `You are an expert quilter. The user has selected custom fabric role assignments for a "${patternForSvg}" pattern.

**FABRICS:**
${fabricSummary}

**USER'S ROLE ASSIGNMENTS:**
${rolesSummary}

**PATTERN:** ${patternForSvg}
${patternDescription}

${patternGuidance}

${previewContract}
${productionBlock}

**SKILL LEVEL:** ${skillDescription}

Generate updated instructions that use these specific role assignments. Reference each fabric by its ROLE and description.

${warnings}

${this.buildRoleSwapJsonTemplate(productionSpec)}

Return ONLY valid JSON.`;
  }

  /**
   * Get pattern prompt if available
   */
  private static getPatternPrompt(patternId?: string): any {
    if (!patternId) return null;
    
    const { normalizePatternId } = require('../../controllers/patternController');
    return getPatternPrompt(normalizePatternId(patternId));
  }

  /**
   * Get pattern description from prompt or formatter
   */
  private static getPatternDescription(patternPrompt: any, patternForSvg: string): string {
    return patternPrompt
      ? patternPrompt.characteristics
      : PatternFormatter.getPatternDescription(patternForSvg);
  }

  /**
   * Build pattern-specific guidance section
   */
  private static buildPatternGuidance(patternPrompt: any, patternForSvg: string): string {
    if (!patternPrompt) return '';

    return `
**PATTERN-SPECIFIC GUIDANCE FOR ${patternForSvg.toUpperCase()}:**

${patternPrompt.fabricRoleGuidance}

**Cutting Guidance:**
${patternPrompt.cuttingInstructions}

**Assembly Guidance:**
${patternPrompt.assemblyNotes}

**Common Mistakes to Avoid:**
${patternPrompt.commonMistakes}
`;
  }

  /**
   * Build pattern guidance for role swap prompts
   */
  private static buildPatternGuidanceForRoleSwap(patternPrompt: any): string {
    if (!patternPrompt) return '';

    return `
**PATTERN-SPECIFIC GUIDANCE:**
${patternPrompt.fabricRoleGuidance}
${patternPrompt.assemblyNotes}
`;
  }

  /**
   * Build fabric summary for role swap prompts
   */
  private static buildFabricSummary(fabricAnalysis: FabricAnalysis[]): string {
    return fabricAnalysis
      .map(f => `- Fabric ${f.fabricIndex}: ${f.description} (${f.value} value, ${f.printScale} print)`)
      .join('\n');
  }

  /**
   * Build roles summary for role swap prompts
   */
  private static buildRolesSummary(roleAssignments: RoleAssignments): string {
    return Object.entries(roleAssignments)
      .filter(([_, assignment]) => assignment !== null)
      .map(([role, assignment]) => `- ${role.toUpperCase()}: Fabric ${assignment!.fabricIndex} (${assignment!.description})`)
      .join('\n');
  }

  /**
   * Build JSON response template for main prompt
   */
  private static buildJsonResponseTemplate(
    fabricCount: number,
    patternForSvg: string,
    skillLevel: string,
    productionSpec?: ProductionQuiltSpec
  ): string {
    const estimatedSize = ProductionSpecHandler.calculateEstimatedSize(productionSpec);
    const productionGrid = ProductionSpecHandler.getProductionGrid(productionSpec);
    const serializedSpec = ProductionSpecHandler.serializeProductionSpec(productionSpec);

    return `Provide this JSON response (RETURN ONLY VALID JSON):

{
  "patternName": "Creative Name - ${patternForSvg}",
  "description": "2-3 sentences describing the pattern and how the fabrics work together",
  "fabricAnalysis": [
    {
      "fabricIndex": 1,
      "description": "Example description",
      "type": "printed",
      "value": "medium",
      "printScale": "large",
      "dominantColor": "#D2B48C",
      "recommendedRole": "primary",
      "roleReason": "Reason"
    }
  ],
  "roleAssignments": {
    "background": { "fabricIndex": 2, "description": "Example" },
    "primary": { "fabricIndex": 1, "description": "Example" },
    "secondary": null,
    "accent": null
  },
  "fabricLayout": "Describe the 3x4 PREVIEW fabric placement. If productionSpec is provided, describe both preview look and how it repeats in production.",
  "difficulty": "${skillLevel.replace('_', ' ')}",

  "isPreviewOnly": ${productionSpec ? 'false' : 'true'},
  "previewGrid": "3x4",
  "productionGrid": ${productionGrid},
  "productionSpec": ${serializedSpec},

  "estimatedSize": ${estimatedSize},
  "instructions": [
    "1) PREVIEW NOTE: This screen shows a 3x4 preview grid.",
    "2) Block construction steps for the pattern (no full-quilt totals unless productionSpec is provided).",
    "3) How the 3x4 preview is arranged.",
    "4) If productionSpec is provided, include cutting quantities and assembly steps that match productionGrid exactly."
  ],
  "fabricColors": ["#D2B48C"],
  "fabricDescriptions": ["Example description"]
}`;
  }

  /**
   * Build JSON template for role swap response
   */
  private static buildRoleSwapJsonTemplate(productionSpec?: ProductionQuiltSpec): string {
    const estimatedSize = ProductionSpecHandler.calculateEstimatedSize(productionSpec);
    const productionGrid = ProductionSpecHandler.getProductionGrid(productionSpec);
    const serializedSpec = ProductionSpecHandler.serializeProductionSpec(productionSpec);

    return `Provide this JSON response (RETURN ONLY VALID JSON):

{
  "fabricLayout": "Describe the 3x4 PREVIEW fabric placement. If productionSpec is provided, describe how it repeats in production.",
  "instructions": [
    "1) PREVIEW NOTE: This screen shows a 3x4 preview grid.",
    "2) Block construction steps only (unless productionSpec is provided)."
  ],
  "warnings": ["Any concerns about the role assignments, e.g., low contrast between background and primary"],

  "isPreviewOnly": ${productionSpec ? 'false' : 'true'},
  "previewGrid": "3x4",
  "productionGrid": ${productionGrid},
  "productionSpec": ${serializedSpec},
  "estimatedSize": ${estimatedSize}
}`;
  }
}
