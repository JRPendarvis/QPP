// src/services/pattern/promptTemplateEngine.ts

import { FabricAnalysis, RoleAssignments } from './promptFormatter';

/**
 * Assembles complete prompt templates for Claude API
 * Single Responsibility: Final prompt assembly only
 */
export class PromptTemplateEngine {
  /**
   * Get target quilt size based on user selection or default
   * @param quiltSize - Optional size key (baby, lap, twin, etc.)
   * @returns Formatted size string
   */
  static getTargetSize(quiltSize?: string): string {
    const sizeMap: Record<string, string> = {
      'baby': '36×52 inches baby quilt',
      'lap': '50×65 inches lap/throw quilt',
      'twin': '66×90 inches twin quilt',
      'full': '80×90 inches full/double quilt',
      'queen': '90×95 inches queen quilt',
      'king': '105×95 inches king quilt',
    };
    
    return quiltSize && sizeMap[quiltSize] ? sizeMap[quiltSize] : '60×72 inches throw quilt';
  }

  /**
   * Assemble complete initial generation prompt
   * @param params - All prompt parameters
   * @returns Formatted complete prompt
   */
  static assembleInitialPrompt(params: {
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

  /**
   * Assemble role swap prompt
   * @param params - All role swap parameters
   * @returns Formatted role swap prompt
   */
  static assembleRoleSwapPrompt(params: {
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
