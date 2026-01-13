// src/services/promptFormatter.ts

import { SKILL_LEVEL_DESCRIPTIONS } from '../config/skill-levels';
import { PatternFormatter } from '../utils/patternFormatter';
import { getPatternPrompt } from '../config/prompts';
import { normalizePatternId } from '../utils/patternNormalization';

export interface FabricAnalysis {
  fabricIndex: number;
  description: string;
  type: 'printed' | 'solid';
  value: 'light' | 'medium' | 'dark';
  printScale: 'solid' | 'small' | 'medium' | 'large';
  dominantColor: string;
  recommendedRole?: 'background' | 'primary' | 'secondary' | 'accent';
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

/**
 * Formats AI prompts for Claude pattern generation
 * Single Responsibility: Prompt text construction only
 */
export class PromptFormatter {
  /**
   * Build complete prompt for Claude API pattern generation
   * @param fabricCount - Number of fabrics
   * @param patternForSvg - Pattern name for SVG
   * @param patternInstruction - Pattern-specific instruction text
   * @param skillLevel - User's skill level
   * @param patternId - Optional pattern ID for detailed prompts
   * @returns Complete formatted prompt
   */
  buildPrompt(
    fabricCount: number,
    patternForSvg: string,
    patternInstruction: string,
    skillLevel: string,
    patternId?: string
  ): string {
    const skillDescription = this.getSkillDescription(skillLevel);
    const patternPrompt = patternId ? getPatternPrompt(normalizePatternId(patternId)) : null;
    const patternDescription = this.getPatternDescription(patternForSvg, patternPrompt);
    const patternGuidance = this.buildPatternGuidance(patternForSvg, patternPrompt);

    return `You are an expert quilter with deep knowledge of fabric selection and color theory. I'm providing you with ${fabricCount} fabric images.

${patternInstruction}

**CRITICAL: YOU MUST CREATE A "${patternForSvg.toUpperCase()}" PATTERN - NOT ANY OTHER PATTERN TYPE**

For reference, a "${patternForSvg}" pattern has these characteristics:
${patternDescription}

${patternGuidance}

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
   * Build prompt for re-analyzing with swapped fabric roles
   * @param fabricAnalysis - Analysis of all fabrics
   * @param newRoleAssignments - User's custom role assignments
   * @param patternForSvg - Pattern name
   * @param skillLevel - Skill level
   * @param patternId - Optional pattern ID
   * @returns Formatted role swap prompt
   */
  buildRoleSwapPrompt(
    fabricAnalysis: FabricAnalysis[],
    newRoleAssignments: RoleAssignments,
    patternForSvg: string,
    skillLevel: string,
    patternId?: string
  ): string {
    const skillDescription = this.getSkillDescription(skillLevel);
    const patternPrompt = patternId ? getPatternPrompt(normalizePatternId(patternId)) : null;
    const patternDescription = this.getPatternDescription(patternForSvg, patternPrompt);
    const fabricSummary = this.buildFabricSummary(fabricAnalysis);
    const rolesSummary = this.buildRolesSummary(newRoleAssignments);
    const patternGuidance = this.buildRoleSwapGuidance(patternPrompt);

    return `You are an expert quilter. The user has selected custom fabric role assignments for a "${patternForSvg}" pattern.

**FABRICS:**
${fabricSummary}

**USER'S ROLE ASSIGNMENTS:**
${rolesSummary}

**PATTERN:** ${patternForSvg}
${patternDescription}

${patternGuidance}

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
   * Get skill level description
   */
  private getSkillDescription(skillLevel: string): string {
    return SKILL_LEVEL_DESCRIPTIONS[skillLevel] || SKILL_LEVEL_DESCRIPTIONS['beginner'];
  }

  /**
   * Get pattern description from prompt or formatter
   */
  private getPatternDescription(patternForSvg: string, patternPrompt: any): string {
    return patternPrompt ? patternPrompt.characteristics : PatternFormatter.getPatternDescription(patternForSvg);
  }

  /**
   * Build pattern-specific guidance section
   */
  private buildPatternGuidance(patternForSvg: string, patternPrompt: any): string {
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
   * Build fabric summary for role swap prompt
   */
  private buildFabricSummary(fabricAnalysis: FabricAnalysis[]): string {
    return fabricAnalysis
      .map((f) => `- Fabric ${f.fabricIndex}: ${f.description} (${f.value} value, ${f.printScale} print)`)
      .join('\n');
  }

  /**
   * Build roles summary for role swap prompt
   */
  private buildRolesSummary(roleAssignments: RoleAssignments): string {
    return Object.entries(roleAssignments)
      .filter(([_, assignment]) => assignment !== null)
      .map(([role, assignment]) => `- ${role.toUpperCase()}: Fabric ${assignment!.fabricIndex} (${assignment!.description})`)
      .join('\n');
  }

  /**
   * Build pattern guidance for role swap
   */
  private buildRoleSwapGuidance(patternPrompt: any): string {
    if (!patternPrompt) return '';

    return `
**PATTERN-SPECIFIC GUIDANCE:**
${patternPrompt.fabricRoleGuidance}
${patternPrompt.assemblyNotes}
`;
  }
}
