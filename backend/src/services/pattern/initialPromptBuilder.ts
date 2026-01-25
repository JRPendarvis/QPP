// src/services/pattern/initialPromptBuilder.ts

/**
 * Builds initial pattern generation prompts for Claude API
 * Single Responsibility: Initial prompt template assembly only
 */
export class InitialPromptBuilder {
  /**
   * Assemble complete initial generation prompt
   * @param params - All prompt parameters
   * @returns Formatted complete prompt
   */
  static build(params: {
    fabricCount: number;
    patternForSvg: string;
    patternInstruction: string;
    skillDescription: string;
    patternDescription: string;
    patternGuidance: string;
    targetSize: string;
    skillLevel: string;
  }): string {
    const { fabricCount, patternForSvg, patternInstruction, skillDescription, 
            patternDescription, patternGuidance, targetSize, skillLevel } = params;

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
  "difficulty": "${skillLevel.replace(/_/g, ' ')}",
  "estimatedSize": "${targetSize}",
  "instructions": [],
  "fabricColors": [],
  "fabricDescriptions": []
}

**IMPORTANT REQUIREMENTS:**
- Return ONLY valid JSON
- fabricAnalysis / fabricColors / fabricDescriptions MUST each have exactly ${fabricCount} entries
- difficulty MUST be "${skillLevel.replace(/_/g, ' ')}"
- estimatedSize MUST be "${targetSize}" and instructions should be for this size`;
  }
}
