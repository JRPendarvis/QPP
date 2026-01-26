// src/services/pattern/roleSwapPromptBuilder.ts

/**
 * Builds role swap prompts for Claude API
 * Single Responsibility: Role swap prompt template assembly only
 */
export class RoleSwapPromptBuilder {
  /**
   * Assemble role swap prompt
   * @param params - All role swap parameters
   * @returns Formatted role swap prompt
   */
  static build(params: {
    patternForSvg: string;
    fabricSummary: string;
    rolesSummary: string;
    patternDescription: string;
    patternGuidance: string;
    skillDescription: string;
    targetSize: string;
  }): string {
    const { patternForSvg, fabricSummary, rolesSummary, patternDescription, 
            patternGuidance, skillDescription, targetSize } = params;

    return `You are an expert quilter. The user has selected custom fabric role assignments for a "${patternForSvg}" pattern.

**FABRICS:**
${fabricSummary}

**USER'S ROLE ASSIGNMENTS:**
${rolesSummary}

**PATTERN:** ${patternForSvg}
${patternDescription}

${patternGuidance}

**SKILL LEVEL:** ${skillDescription}

**TARGET SIZE:** ${targetSize}

Generate updated instructions that use these specific role assignments for a ${targetSize} quilt.

Provide this JSON response:

{
  "fabricLayout": "",
  "instructions": [],
  "warnings": []
}

Return ONLY valid JSON.`;
  }
}
