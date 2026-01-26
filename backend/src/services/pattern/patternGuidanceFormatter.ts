// src/services/pattern/patternGuidanceFormatter.ts

/**
 * Formats pattern-specific guidance sections for AI prompts
 * Single Responsibility: Pattern guidance section formatting only
 */
export class PatternGuidanceFormatter {
  /**
   * Build detailed pattern-specific guidance for initial generation
   * @param patternForSvg - Pattern name
   * @param patternPrompt - Optional detailed pattern prompt config
   * @returns Formatted guidance section or empty string
   */
  static buildFullGuidance(patternForSvg: string, patternPrompt: any): string {
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
   * Build simplified pattern guidance for role swap prompts
   * @param patternPrompt - Optional detailed pattern prompt config
   * @returns Formatted guidance section or empty string
   */
  static buildRoleSwapGuidance(patternPrompt: any): string {
    if (!patternPrompt) return '';

    return `
**PATTERN-SPECIFIC GUIDANCE:**
${patternPrompt.fabricRoleGuidance}
${patternPrompt.assemblyNotes}
`;
  }
}
