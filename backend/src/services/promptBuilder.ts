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

**STEP 1: ANALYZE THE FABRICS**
Identify the dominant hex color from EACH fabric image (e.g., #FF5733, #2E86AB). You MUST identify one color per fabric - so ${fabricCount} colors total.

**STEP 2: CREATE THE PATTERN**
Create a "${patternForSvg}" quilt pattern using ALL the colors from the fabrics. DO NOT create a different pattern type.

Skill level: ${skillDescription}

Provide this JSON response:

{
  "patternName": "Creative Name - ${patternForSvg}",
  "description": "2-3 sentences describing the pattern and colors",
  "fabricLayout": "How fabrics are arranged",
  "difficulty": "${skillLevel.replace('_', ' ')}",
  "estimatedSize": "60x72 inches throw quilt",
  "instructions": [
    "Step 1: Gather materials...",
    "Step 2: Cut fabric pieces...",
    "Step 3: Arrange blocks...",
    "Step 4: Sew blocks together...",
    "Step 5: Add borders and finish..."
  ],
  "fabricColors": ["#hex1", "#hex2", "#hex3", "...one color per fabric"]
}

**IMPORTANT:** 
- Return ONLY valid JSON
- The "fabricColors" array MUST have exactly ${fabricCount} hex colors - one for each fabric image
- The patternName MUST include "${patternForSvg}" in it
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
