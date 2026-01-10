// src/services/promptBuilder.ts

import { SKILL_LEVEL_DESCRIPTIONS } from '../config/skill-levels';
import { PatternFormatter } from '../utils/patternFormatter';
import { ImageTypeDetector } from '../utils/imageTypeDetector';
import { getPatternsForSkillLevel } from '../utils/skillLevelHelper';
import { getPatternPrompt } from '../config/prompts';
import { getPatternById, calculateFabricCountScore } from '../config/quiltPatterns';
import { normalizePatternId } from '../utils/patternNormalization';

export interface PatternSelectionResult {
  patternForSvg: string;
  patternInstruction: string;
  patternId?: string;
}

export type FabricValue = 'light' | 'medium' | 'dark';
export type PrintScale = 'solid' | 'small' | 'medium' | 'large';
export type FabricRole = 'background' | 'primary' | 'secondary' | 'accent';

export interface FabricAnalysis {
  fabricIndex: number;
  description: string;
  type: 'printed' | 'solid';
  value: FabricValue;
  printScale: PrintScale;
  dominantColor: string;
  recommendedRole?: FabricRole;
  roleReason?: string;
}

export interface RoleAssignment {
  fabricIndex: number;
  description: string;
}

export interface RoleAssignments {
  background: RoleAssignment | null;
  primary: RoleAssignment | null;
  secondary: RoleAssignment | null;
  accent: RoleAssignment | null;
}

export interface PatternResponse {
  patternName: string;
  description: string;
  fabricAnalysis: FabricAnalysis[];
  roleAssignments: RoleAssignments;
  fabricLayout: string;
  difficulty: string;
  estimatedSize: string;
  instructions: string[];
  fabricColors: string[];
  fabricDescriptions: string[];
}

/**
 * AI prompt construction for pattern generation
 */
export class PromptBuilder {
  /**
   * Select pattern based on skill level, user preference, and fabric count
   */
  static selectPattern(skillLevel: string, selectedPattern?: string, fabricCount?: number): PatternSelectionResult {
    const availablePatternIds = getPatternsForSkillLevel(skillLevel);

    let patternForSvg: string;
    let patternInstruction: string;
    let patternId: string | undefined;

    if (selectedPattern && selectedPattern !== 'auto') {
      patternId = normalizePatternId(selectedPattern);
      patternForSvg = PatternFormatter.formatPatternName(patternId);
      patternInstruction = `**REQUIRED PATTERN TYPE:** You MUST create a "${patternForSvg}" pattern. This is the user's specific choice.`;
    } else {
      let filteredPatterns = availablePatternIds
        .map((id) => getPatternById(id))
        .filter((p): p is any => !!p && typeof p.minColors === 'number' && typeof p.maxFabrics === 'number');

      if (typeof fabricCount === 'number') {
        filteredPatterns = filteredPatterns.filter((pattern) => fabricCount >= pattern.minColors && fabricCount <= pattern.maxFabrics);
      }

      if (filteredPatterns.length > 0) {
        const scoredPatterns = filteredPatterns
          .map((pattern) => ({
            pattern,
            score: calculateFabricCountScore(pattern, fabricCount ?? pattern.recommendedFabricCount),
          }))
          .sort((a, b) => b.score - a.score);

        const topPatterns = scoredPatterns.slice(0, Math.min(3, scoredPatterns.length));
        const selected = topPatterns[Math.floor(Math.random() * topPatterns.length)];

        patternId = selected.pattern.id;
        patternForSvg = selected.pattern.name;
      } else {
        patternId = undefined;
        patternForSvg = '';
      }

      patternInstruction = patternForSvg
        ? `**REQUIRED PATTERN TYPE:** Create a "${patternForSvg}" pattern. This pattern is appropriate for the ${skillLevel} skill level.`
        : `**ERROR:** No valid pattern found for your skill level and number of fabrics.`;
    }

    return { patternForSvg, patternInstruction, patternId };
  }

  /**
   * Build complete prompt for Claude API
   */
  static buildPrompt(
    fabricCount: number,
    patternForSvg: string,
    patternInstruction: string,
    skillLevel: string,
    patternId?: string
  ): string {
    const skillDescription = SKILL_LEVEL_DESCRIPTIONS[skillLevel] || SKILL_LEVEL_DESCRIPTIONS['beginner'];

    let patternPrompt = null;
    if (patternId) {
      patternPrompt = getPatternPrompt(normalizePatternId(patternId));
    }

    const patternDescription = patternPrompt ? patternPrompt.characteristics : PatternFormatter.getPatternDescription(patternForSvg);

    return `You are an expert quilter with deep knowledge of fabric selection and color theory. I'm providing you with ${fabricCount} fabric images.

${patternInstruction}

**CRITICAL: YOU MUST CREATE A "${patternForSvg.toUpperCase()}" PATTERN - NOT ANY OTHER PATTERN TYPE**

For reference, a "${patternForSvg}" pattern has these characteristics:
${patternDescription}

${patternPrompt ? `
**PATTERN-SPECIFIC GUIDANCE FOR ${patternForSvg.toUpperCase()}:**

${patternPrompt.fabricRoleGuidance}

**Cutting Guidance:**
${patternPrompt.cuttingInstructions}

**Assembly Guidance:**
${patternPrompt.assemblyNotes}

**Common Mistakes to Avoid:**
${patternPrompt.commonMistakes}
` : ''}

**STEP 1: ANALYZE EACH FABRIC**
For EACH fabric image, identify:
1. Is it a PRINTED fabric (has patterns/designs/characters) or a SOLID fabric (single color)?
2. If PRINTED: Describe the print
3. If SOLID: Identify the hex color
4. Identify the dominant/background color as a hex code for the SVG visualization
5. VALUE: LIGHT / MEDIUM / DARK
6. PRINT SCALE: SOLID / SMALL / MEDIUM / LARGE

**STEP 2: ASSIGN FABRIC ROLES**
- BACKGROUND / PRIMARY / SECONDARY / ACCENT

**STEP 3: CREATE THE PATTERN**
Create a "${patternForSvg}" quilt pattern that incorporates ALL ${fabricCount} fabrics.

Skill level: ${skillDescription}

Provide this JSON response:

{
  "patternName": "Creative Name - ${patternForSvg}",
  "description": "2-3 sentences describing the pattern and how the fabrics work together",
  "fabricAnalysis": [],
  "roleAssignments": { "background": null, "primary": null, "secondary": null, "accent": null },
  "fabricLayout": "",
  "difficulty": "${skillLevel.replace('_', ' ')}",
  "estimatedSize": "60x72 inches throw quilt",
  "instructions": [],
  "fabricColors": [],
  "fabricDescriptions": []
}

**IMPORTANT REQUIREMENTS:**
- Return ONLY valid JSON
- fabricAnalysis / fabricColors / fabricDescriptions MUST each have exactly ${fabricCount} entries
- difficulty MUST be "${skillLevel.replace('_', ' ')}"`;
  }

  /**
   * Build prompt for re-analyzing with swapped roles
   */
  static buildRoleSwapPrompt(
    fabricAnalysis: FabricAnalysis[],
    newRoleAssignments: RoleAssignments,
    patternForSvg: string,
    skillLevel: string,
    patternId?: string
  ): string {
    const skillDescription = SKILL_LEVEL_DESCRIPTIONS[skillLevel] || SKILL_LEVEL_DESCRIPTIONS['beginner'];

    let patternPrompt = null;
    if (patternId) {
      patternPrompt = getPatternPrompt(normalizePatternId(patternId));
    }

    const patternDescription = patternPrompt ? patternPrompt.characteristics : PatternFormatter.getPatternDescription(patternForSvg);

    const fabricSummary = fabricAnalysis
      .map((f) => `- Fabric ${f.fabricIndex}: ${f.description} (${f.value} value, ${f.printScale} print)`)
      .join('\n');

    const rolesSummary = Object.entries(newRoleAssignments)
      .filter(([_, assignment]) => assignment !== null)
      .map(([role, assignment]) => `- ${role.toUpperCase()}: Fabric ${assignment!.fabricIndex} (${assignment!.description})`)
      .join('\n');

    return `You are an expert quilter. The user has selected custom fabric role assignments for a "${patternForSvg}" pattern.

**FABRICS:**
${fabricSummary}

**USER'S ROLE ASSIGNMENTS:**
${rolesSummary}

**PATTERN:** ${patternForSvg}
${patternDescription}

${patternPrompt ? `
**PATTERN-SPECIFIC GUIDANCE:**
${patternPrompt.fabricRoleGuidance}
${patternPrompt.assemblyNotes}
` : ''}

**SKILL LEVEL:** ${skillDescription}

Generate updated instructions that use these specific role assignments.

Provide this JSON response:

{
  "fabricLayout": "",
  "instructions": [],
  "warnings": []
}

Return ONLY valid JSON.`;
  }

  /**
   * Build image content array for Claude API
   */
  static buildImageContent(
    fabricImages: string[],
    imageTypes: string[] = []
  ): Array<{
    type: 'image';
    source: { type: 'base64'; media_type: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'; data: string };
  }> {
    return fabricImages.map((imageBase64, index) => {
      const mimeType = ImageTypeDetector.detectOrValidate(imageBase64, imageTypes[index], index) as
        | 'image/jpeg'
        | 'image/png'
        | 'image/gif'
        | 'image/webp';

      return {
        type: 'image' as const,
        source: {
          type: 'base64' as const,
          media_type: mimeType,
          data: imageBase64,
        },
      };
    });
  }
}
