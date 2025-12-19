import { SKILL_LEVEL_DESCRIPTIONS } from '../config/skillLevels';
import { PatternFormatter } from '../utils/patternFormatter';
import { ImageTypeDetector } from '../utils/imageTypeDetector';
import { getPatternsForSkillLevel } from '../utils/skillLevelHelper';

export interface PatternSelectionResult {
  patternForSvg: string;
  patternInstruction: string;
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
  recommendedRole: FabricRole;
  roleReason: string;
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
    
    return `You are an expert quilter with deep knowledge of fabric selection and color theory. I'm providing you with ${fabricCount} fabric images.

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
5. **VALUE ASSESSMENT:** Is this fabric LIGHT, MEDIUM, or DARK? 
   - Use the "squint test" - how much visual weight does it carry?
   - Light fabrics appear to recede, dark fabrics come forward
   - This is MORE IMPORTANT than the actual color for pattern success
6. **PRINT SCALE:** Classify as:
   - SOLID: Single color, no pattern
   - SMALL: Tiny prints that read almost as texture
   - MEDIUM: Clearly visible print elements
   - LARGE: Bold, statement prints (often "focus fabrics")

**STEP 2: ASSIGN FABRIC ROLES**
Based on your analysis, recommend which role each fabric should play. Traditional quilt design uses these roles:

- **BACKGROUND:** The "negative space" that makes shapes visible
  - Best for: Light-value fabrics, solids, or small prints that recede visually
  - In the pattern: Corners, setting triangles, sashing
  
- **PRIMARY:** The star of the show - what the eye sees first
  - Best for: Medium-to-dark fabrics with strong contrast to background
  - In the pattern: Main shapes (star points, diamonds, featured blocks)
  
- **SECONDARY:** Supports the primary, adds visual depth
  - Best for: Medium value, coordinates with primary
  - In the pattern: Secondary shapes, inner elements
  
- **ACCENT (optional):** Small pops of contrast or unexpected color
  - Best for: Bold color, can break the rules
  - In the pattern: Centers, small details, zingers

**ROLE ASSIGNMENT RULES:**
- VALUE CONTRAST is essential - background and primary MUST differ by at least one value level
- If a large/focus print exists, consider building the palette around it
- With only 2 fabrics: Assign background and primary only
- With 3 fabrics: Background, primary, and secondary OR accent
- With 4+ fabrics: Can use all roles

**STEP 3: CREATE THE PATTERN**
Create a "${patternForSvg}" quilt pattern that incorporates ALL ${fabricCount} fabrics:
- Assign fabrics to pattern elements based on their recommended roles
- For PRINTED fabrics: Reference them by their print description in the instructions
- For SOLID fabrics: Reference them by color name
- The pattern name should reflect the theme of the printed fabrics if present
- Instructions should specify which fabric goes where by ROLE and description

Skill level: ${skillDescription}

Provide this JSON response:

{
  "patternName": "Creative Name - ${patternForSvg}",
  "description": "2-3 sentences describing the pattern and how the fabrics work together",
  "fabricAnalysis": [
    {
      "fabricIndex": 1,
      "description": "Winnie the Pooh characters on tan background",
      "type": "printed",
      "value": "medium",
      "printScale": "large",
      "dominantColor": "#D2B48C",
      "recommendedRole": "primary",
      "roleReason": "Large-scale novelty print works as the focus fabric - build the quilt around this"
    },
    {
      "fabricIndex": 2,
      "description": "Solid cream",
      "type": "solid",
      "value": "light",
      "printScale": "solid",
      "dominantColor": "#FFF8DC",
      "recommendedRole": "background",
      "roleReason": "Light solid provides excellent contrast and lets the Pooh print shine"
    }
  ],
  "roleAssignments": {
    "background": { "fabricIndex": 2, "description": "Solid cream" },
    "primary": { "fabricIndex": 1, "description": "Winnie the Pooh print" },
    "secondary": null,
    "accent": null
  },
  "fabricLayout": "The Winnie the Pooh print (PRIMARY) forms the star points, creating a playful focal point. The cream solid (BACKGROUND) fills the corners and negative space, providing crisp contrast that makes the characters pop.",
  "difficulty": "${skillLevel.replace('_', ' ')}",
  "estimatedSize": "60x72 inches throw quilt",
  "instructions": [
    "1) Gather materials: You'll need your BACKGROUND fabric (cream solid) and PRIMARY fabric (Winnie the Pooh print)...",
    "2) Cut BACKGROUND fabric (cream solid): Cut [X] squares at [size]...",
    "3) Cut PRIMARY fabric (Pooh print): Cut [X] squares at [size], being mindful of fussy-cutting favorite characters...",
    "4) Arrange blocks: Place PRIMARY triangles pointing outward to form star points, with BACKGROUND in corners...",
    "5) Sew blocks together using 1/4 inch seam allowance...",
    "6) Add borders and finish..."
  ],
  "fabricColors": ["#D2B48C", "#FFF8DC"],
  "fabricDescriptions": ["Winnie the Pooh characters on tan background", "Solid cream"]
}

**IMPORTANT REQUIREMENTS:**
- Return ONLY valid JSON - no markdown, no explanations outside the JSON
- The "fabricAnalysis" array MUST have exactly ${fabricCount} entries (one per uploaded fabric)
- The "fabricColors" array MUST have exactly ${fabricCount} hex colors
- The "fabricDescriptions" array MUST have exactly ${fabricCount} descriptions
- Assign roles based on VALUE and PRINT SCALE, not just personal color preference
- roleAssignments values should be null if that role is not used (e.g., no accent with only 2 fabrics)
- Instructions MUST reference fabrics by ROLE first, then description: "BACKGROUND fabric (cream solid)"
- The difficulty MUST be "${skillLevel.replace('_', ' ')}"
- Ensure VALUE CONTRAST between background and primary fabrics`;
  }

  /**
   * Build prompt for re-analyzing with swapped roles
   * Used when user manually reassigns fabric roles
   */
  static buildRoleSwapPrompt(
    fabricAnalysis: FabricAnalysis[],
    newRoleAssignments: RoleAssignments,
    patternForSvg: string,
    skillLevel: string
  ): string {
    const skillDescription = SKILL_LEVEL_DESCRIPTIONS[skillLevel] || SKILL_LEVEL_DESCRIPTIONS['beginner'];
    const patternDescription = PatternFormatter.getPatternDescription(patternForSvg);

    const fabricSummary = fabricAnalysis
      .map(f => `- Fabric ${f.fabricIndex}: ${f.description} (${f.value} value, ${f.printScale} print)`)
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

**SKILL LEVEL:** ${skillDescription}

Generate updated instructions that use these specific role assignments. Reference each fabric by its ROLE and description.

${this.getRoleSwapWarnings(fabricAnalysis, newRoleAssignments)}

Provide this JSON response:

{
  "fabricLayout": "Describe how each fabric role is used in the pattern with the user's assignments",
  "instructions": [
    "1) Gather materials: List each fabric by ROLE and description...",
    "2) Cut pieces for each role...",
    "3) Arrange and sew...",
    "..."
  ],
  "warnings": ["Any concerns about the role assignments, e.g., low contrast between background and primary"]
}

Return ONLY valid JSON.`;
  }

  /**
   * Generate warnings for potentially problematic role assignments
   */
  private static getRoleSwapWarnings(
    fabricAnalysis: FabricAnalysis[],
    roleAssignments: RoleAssignments
  ): string {
    const warnings: string[] = [];

    const backgroundFabric = roleAssignments.background 
      ? fabricAnalysis.find(f => f.fabricIndex === roleAssignments.background!.fabricIndex)
      : null;
    const primaryFabric = roleAssignments.primary
      ? fabricAnalysis.find(f => f.fabricIndex === roleAssignments.primary!.fabricIndex)
      : null;

    // Check value contrast between background and primary
    if (backgroundFabric && primaryFabric) {
      const valueOrder: FabricValue[] = ['light', 'medium', 'dark'];
      const bgIndex = valueOrder.indexOf(backgroundFabric.value);
      const primaryIndex = valueOrder.indexOf(primaryFabric.value);
      
      if (Math.abs(bgIndex - primaryIndex) === 0) {
        warnings.push(`NOTE: The background (${backgroundFabric.description}) and primary (${primaryFabric.description}) have the SAME value (${backgroundFabric.value}). This may result in low contrast. If the user is happy with this, proceed but mention it may create a subtle, blended look.`);
      }
    }

    // Check if dark fabric is used as background
    if (backgroundFabric && backgroundFabric.value === 'dark') {
      warnings.push(`NOTE: A dark fabric (${backgroundFabric.description}) is assigned as background. This creates a dramatic, inverted look - which can be stunning but unconventional.`);
    }

    // Check if large print is used as background
    if (backgroundFabric && backgroundFabric.printScale === 'large') {
      warnings.push(`NOTE: A large-scale print (${backgroundFabric.description}) is assigned as background. Large prints can be busy as backgrounds - the design may compete with the pattern shapes.`);
    }

    if (warnings.length === 0) {
      return '';
    }

    return `**ROLE ASSIGNMENT NOTES:**\n${warnings.join('\n')}\n\nProceed with the user's choices but include relevant warnings in your response.`;
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
