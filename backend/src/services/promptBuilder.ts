import { SKILL_LEVEL_DESCRIPTIONS } from '../config/skillLevels';
import { PatternFormatter } from '../utils/patternFormatter';
import { ImageTypeDetector } from '../utils/imageTypeDetector';
import { getPatternsForSkillLevel } from '../utils/skillLevelHelper';

export interface PatternSelectionResult {
  patternForSvg: string;
  patternInstruction: string;
}

/**
 * AI prompt construction for pattern generation
 */
export class PromptBuilder {
  /**
   * Select pattern based on skill level and user preference
   */
  static selectPattern(skillLevel: string, selectedPattern?: string): PatternSelectionResult {
    // Get all patterns available for this skill level (includes current and lower levels)
    const availablePatterns = getPatternsForSkillLevel(skillLevel);
    
    let patternForSvg: string;
    let patternInstruction: string;
    
    if (selectedPattern && selectedPattern !== 'auto') {
      // User selected a specific pattern
      patternForSvg = PatternFormatter.formatPatternName(selectedPattern);
      patternInstruction = `**REQUIRED PATTERN TYPE:** You MUST create a "${patternForSvg}" pattern. This is the user's specific choice.`;
      console.log(`📋 User selected pattern: ${patternForSvg}`);
    } else {
      // Auto mode - pick from all patterns available at this skill level
      patternForSvg = availablePatterns[Math.floor(Math.random() * availablePatterns.length)];
      patternInstruction = `**REQUIRED PATTERN TYPE:** Create a "${patternForSvg}" pattern. This pattern is appropriate for the ${skillLevel} skill level.`;
      console.log(`🎲 Auto-selected pattern: ${patternForSvg} for skill level: ${skillLevel} (${availablePatterns.length} patterns available)`);
    }
    
    return { patternForSvg, patternInstruction };
  }

  /**
   * Build complete prompt for Claude API
   */
  static buildPrompt(
    fabricCount: number,
    patternForSvg: string,
    patternInstruction: string,
    skillLevel: string
  ): string {
    const skillDescription = SKILL_LEVEL_DESCRIPTIONS[skillLevel] || SKILL_LEVEL_DESCRIPTIONS['beginner'];
    const patternDescription = PatternFormatter.getPatternDescription(patternForSvg);
    
    return `You are an expert quilter. I'm providing you with ${fabricCount} fabric images.

${patternInstruction}

**CRITICAL: YOU MUST CREATE A "${patternForSvg.toUpperCase()}" PATTERN - NOT ANY OTHER PATTERN TYPE**

For reference, a "${patternForSvg}" pattern has these characteristics:
${patternDescription}

**STEP 1: ANALYZE EACH FABRIC**
For EACH fabric image, identify:
1. Is it a PRINTED fabric (has patterns/designs/characters) or a SOLID fabric (single color)?
2. If PRINTED: Describe the print (e.g., "Winnie the Pooh characters on tan background", "rubber duckies and baby toys", "floral print with roses")
3. If SOLID: Identify the hex color (e.g., #FF5733)
4. Identify the dominant/background color as a hex code for the SVG visualization

**STEP 2: CREATE THE PATTERN**
Create a "${patternForSvg}" quilt pattern that incorporates ALL ${fabricCount} fabrics:
- For PRINTED fabrics: Reference them by their print description in the instructions (e.g., "Use the Winnie the Pooh fabric for the center squares")
- For SOLID fabrics: Reference them by color (e.g., "Use the coral solid for the borders")
- The pattern name should reflect the theme of the printed fabrics if present
- Instructions should specify which fabric goes where in the pattern

Skill level: ${skillDescription}

Provide this JSON response:

{
  "patternName": "Creative Name - ${patternForSvg}",
  "description": "2-3 sentences describing the pattern, mentioning the specific fabrics (their prints or colors)",
  "fabricLayout": "Describe how each specific fabric (by print or color) is used in the pattern",
  "difficulty": "${skillLevel.replace('_', ' ')}",
  "estimatedSize": "60x72 inches throw quilt",
  "instructions": [
    "1) Gather materials - list each fabric by its print or color...",
    "2) Cut fabric pieces - specify which fabric (by print or color) and dimensions...",
    "3) Arrange blocks - describe placement using fabric descriptions...",
    "4) Sew blocks together...",
    "5) Add borders and finish..."
  ],
  "fabricColors": ["#hex1", "#hex2", "#hex3", "...one hex per fabric for SVG visualization"],
  "fabricDescriptions": ["description of fabric 1", "description of fabric 2", "...one description per fabric"]
}

**IMPORTANT:** 
- Return ONLY valid JSON
- The "fabricColors" array MUST have exactly ${fabricCount} hex colors (dominant/background colors for SVG)
- The "fabricDescriptions" array MUST have exactly ${fabricCount} descriptions (e.g., "Winnie the Pooh print on tan" or "Solid coral")
- The patternName should reference the prints if present (e.g., "Nursery Dreams - ${patternForSvg}" for baby fabrics)
- Instructions MUST reference fabrics by their descriptions, not just "Fabric 1" or generic terms
- The difficulty MUST be "${skillLevel.replace('_', ' ')}"
- Keep instructions clear and specific to this pattern type`;
  }

  /**
   * Build image content array for Claude API
   */
  static buildImageContent(
    fabricImages: string[],
    imageTypes: string[] = []
  ): Array<{ type: 'image'; source: { type: 'base64'; media_type: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'; data: string } }> {
    return fabricImages.map((imageBase64, index) => {
      const mimeType = ImageTypeDetector.detectOrValidate(imageBase64, imageTypes[index], index) as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
      
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
