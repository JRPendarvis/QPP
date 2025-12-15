import Anthropic from '@anthropic-ai/sdk';
import { SVG_TEMPLATES } from '../config/quiltTemplates';
import { SKILL_LEVEL_DESCRIPTIONS } from '../config/skillLevels';
import { PATTERNS_BY_SKILL } from '../config/patternsBySkill';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface QuiltPattern {
  patternName: string;
  description: string;
  fabricLayout: string;
  difficulty: string;
  estimatedSize: string;
  instructions: string[];
  visualSvg: string;
}

export class ClaudeService {
  async generateQuiltPattern(
    fabricImages: string[],
    imageTypes: string[] = [],
    skillLevel: string = 'beginner',
    selectedPattern?: string
  ): Promise<QuiltPattern> {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Pattern generation attempt ${attempt}/${maxRetries}`);
        return await this.attemptPatternGeneration(fabricImages, imageTypes, skillLevel, selectedPattern);
      } catch (error: any) {
        lastError = error;
        
        // Check if it's an overloaded error
        const isOverloaded = error?.error?.error?.type === 'overloaded_error' || 
                            error?.message?.includes('Overloaded') ||
                            error?.message?.includes('overloaded');
        
        if (isOverloaded && attempt < maxRetries) {
          // Exponential backoff: 2s, 4s, 8s
          const waitTime = Math.pow(2, attempt) * 1000;
          console.log(`⏳ Claude API overloaded, retrying in ${waitTime/1000}s (attempt ${attempt + 1}/${maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        } else if (attempt === maxRetries) {
          console.error(`❌ Failed after ${maxRetries} attempts`);
          if (isOverloaded) {
            throw new Error('Claude API is currently experiencing high demand. Please try again in a few moments.');
          }
          throw error;
        } else {
          // Non-overload error, throw immediately
          throw error;
        }
      }
    }

    throw lastError || new Error('Failed to generate quilt pattern');
  }

  private async attemptPatternGeneration(
    fabricImages: string[],
    imageTypes: string[] = [],
    skillLevel: string = 'beginner',
    selectedPattern?: string
  ): Promise<QuiltPattern> {
    try {
      const skillDescription = SKILL_LEVEL_DESCRIPTIONS[skillLevel] || SKILL_LEVEL_DESCRIPTIONS['beginner'];
      const availablePatterns = PATTERNS_BY_SKILL[skillLevel] || PATTERNS_BY_SKILL['beginner'];
      
      // Determine pattern to use
      let patternForSvg: string;
      let patternInstruction: string;
      
      if (selectedPattern && selectedPattern !== 'auto') {
        // User selected a specific pattern
        patternForSvg = this.formatPatternName(selectedPattern);
        patternInstruction = `**REQUIRED PATTERN TYPE:** You MUST create a "${patternForSvg}" pattern. This is the user's specific choice.`;
        console.log(`📋 User selected pattern: ${patternForSvg}`);
      } else {
        // Auto mode - pick from skill-appropriate patterns
        patternForSvg = availablePatterns[Math.floor(Math.random() * availablePatterns.length)];
        patternInstruction = `**REQUIRED PATTERN TYPE:** Create a "${patternForSvg}" pattern. This pattern is appropriate for the ${skillLevel} skill level.`;
        console.log(`🎲 Auto-selected pattern: ${patternForSvg} for skill level: ${skillLevel}`);
      }
      
      console.log(`🎯 Final pattern: ${patternForSvg}, Skill level: ${skillLevel}`);
      console.log('═══════════════════════════════════════════════');
      console.log('📤 CLAUDE API REQUEST PARAMETERS:');
      console.log(`  Pattern Type: ${patternForSvg}`);
      console.log(`  Skill Level: ${skillLevel}`);
      console.log(`  Fabric Images: ${fabricImages.length}`);
      console.log(`  Image Types: ${imageTypes.join(', ') || 'auto-detect'}`);
      console.log(`  Selected Pattern: ${selectedPattern || 'auto'}`);
      console.log('═══════════════════════════════════════════════');
      
      const stream = await anthropic.messages.stream({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `You are an expert quilter. I'm providing you with ${fabricImages.length} fabric images.

${patternInstruction}

**CRITICAL: YOU MUST CREATE A "${patternForSvg.toUpperCase()}" PATTERN - NOT ANY OTHER PATTERN TYPE**

For reference, a "${patternForSvg}" pattern has these characteristics:
${this.getPatternDescription(patternForSvg)}

**STEP 1: ANALYZE THE FABRICS**
Identify the dominant hex color from EACH fabric image (e.g., #FF5733, #2E86AB). You MUST identify one color per fabric - so ${fabricImages.length} colors total.

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
- The "fabricColors" array MUST have exactly ${fabricImages.length} hex colors - one for each fabric image
- The patternName MUST include "${patternForSvg}" in it
- The difficulty MUST be "${skillLevel.replace('_', ' ')}"
- Keep instructions clear and specific to this pattern type`,
              },
              ...fabricImages.map((imageBase64, index) => {
                // Detect image type from base64 magic bytes if not provided
                let mimeType = imageTypes[index];
                
                if (!mimeType) {
                  // Auto-detect from base64 magic bytes
                  const header = imageBase64.substring(0, 20);
                  if (header.startsWith('/9j/')) {
                    mimeType = 'image/jpeg';
                  } else if (header.startsWith('iVBOR')) {
                    mimeType = 'image/png';
                  } else if (header.startsWith('R0lGOD')) {
                    mimeType = 'image/gif';
                  } else if (header.startsWith('UklGR')) {
                    mimeType = 'image/webp';
                  } else {
                    console.warn('⚠️  Could not detect image type, defaulting to png');
                    mimeType = 'image/png';
                  }
                  console.log(`🔍 Auto-detected image ${index + 1}: ${mimeType}`);
                }
                
                // Ensure it's a valid Claude-supported format
                const validType = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(mimeType) 
                  ? mimeType 
                  : 'image/png';
                
                console.log(`📸 Image ${index + 1}: ${validType}`);
                
                return {
                  type: 'image' as const,
                  source: {
                    type: 'base64' as const,
                    media_type: validType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                    data: imageBase64,
                  },
                };
              }),
            ],
          },
        ],
      });

      // Collect the full response from stream
      let responseText = '';
      
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          responseText += chunk.delta.text;
        }
      }

      console.log('===== CLAUDE RESPONSE START =====');
      console.log(responseText.substring(0, 1000));
      console.log('===== CLAUDE RESPONSE END =====');

      // Extract JSON from response
      let jsonText = responseText.trim();
      jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      jsonText = jsonText.replace(/=+ CLAUDE RESPONSE (START|END) =+\s*/g, '');

      const firstBrace = jsonText.indexOf('{');
      const lastBrace = jsonText.lastIndexOf('}');

      if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
        console.error('Could not find valid JSON object in response');
        throw new Error('Could not parse pattern from Claude response');
      }

      jsonText = jsonText.substring(firstBrace, lastBrace + 1);

      const parsedResponse = JSON.parse(jsonText);
      
      console.log('═══════════════════════════════════════════════');
      console.log('📥 CLAUDE API RESPONSE:');
      console.log(`  Pattern Name from Claude: ${parsedResponse.patternName}`);
      console.log(`  Fabric Colors: ${parsedResponse.fabricColors?.join(', ') || 'none'}`);
      console.log(`  Description: ${parsedResponse.description?.substring(0, 100)}...`);
      console.log('═══════════════════════════════════════════════');
      
      // Extract colors from response
      const colors = parsedResponse.fabricColors || ['#4A90A4', '#D4A574', '#8B7355', '#6B8E23'];
      console.log(`🎨 Fabric colors identified: ${colors.join(', ')}`);
      
      // Generate SVG using template
      const visualSvg = this.generateSvgFromTemplate(patternForSvg, colors);
      
      // Force the correct difficulty level
      const formattedDifficulty = skillLevel.replace('_', ' ');
      
      // Extract creative prefix from Claude's pattern name if it has one
      // Pattern name format from Claude should be "Creative Name - Pattern Type"
      let displayPatternName = patternForSvg;
      if (parsedResponse.patternName) {
        const nameParts = parsedResponse.patternName.split(' - ');
        if (nameParts.length > 1 && nameParts[0]) {
          // Use creative prefix but ensure it ends with the correct pattern type
          displayPatternName = `${nameParts[0]} - ${patternForSvg}`;
        }
      }
      console.log(`📛 Pattern name: ${displayPatternName} (SVG template: ${patternForSvg})`);
      
      const pattern: QuiltPattern = {
        patternName: displayPatternName,
        description: parsedResponse.description || `A beautiful ${patternForSvg} pattern`,
        fabricLayout: parsedResponse.fabricLayout || 'Arranged in a 4x4 grid',
        difficulty: formattedDifficulty, // Force the correct difficulty
        estimatedSize: parsedResponse.estimatedSize || '60x72 inches',
        instructions: parsedResponse.instructions || [
          'Gather your fabrics and materials',
          'Cut pieces according to pattern requirements',
          'Arrange blocks in desired layout',
          'Sew blocks together',
          'Add borders and binding'
        ],
        visualSvg: visualSvg,
      };

      // Validate instructions
      if (pattern.instructions.length < 4) {
        pattern.instructions = [
          'Gather your fabrics and materials',
          'Cut pieces according to pattern requirements', 
          'Arrange blocks in desired layout',
          'Sew blocks together',
          'Add borders and binding'
        ];
      }
      
      console.log(`✅ Successfully generated pattern: ${pattern.patternName}`);
      console.log(`   Pattern type: ${patternForSvg}`);
      console.log(`   Difficulty: ${pattern.difficulty}`);
      console.log(`   Colors: ${colors.join(', ')}`);
      
      return pattern;

    } catch (error) {
      console.error('Error generating quilt pattern:', error);
      // Re-throw the original error to preserve error details for retry logic
      throw error;
    }
  }

  private generateSvgFromTemplate(patternType: string, colors: string[]): string {
    console.log('═══════════════════════════════════════════════════');
    console.log('🎨 SVG TEMPLATE GENERATION:');
    console.log(`  Requested Pattern: "${patternType}"`);
    console.log(`  Available Templates: ${Object.keys(SVG_TEMPLATES).join(', ')}`);
    
    // Get template - try exact match first, then fallback
    let baseTemplate = SVG_TEMPLATES[patternType];
    let templateUsed = patternType;
    
    if (!baseTemplate) {
      // Try to find a close match
      const templateKeys = Object.keys(SVG_TEMPLATES);
      const closeMatch = templateKeys.find(key => 
        key.toLowerCase().includes(patternType.toLowerCase()) ||
        patternType.toLowerCase().includes(key.toLowerCase())
      );
      
      if (closeMatch) {
        baseTemplate = SVG_TEMPLATES[closeMatch];
        templateUsed = closeMatch;
        console.log(`  ⚠️ No exact match! Using close match: "${closeMatch}"`);
      } else {
        baseTemplate = SVG_TEMPLATES['Simple Squares'];
        templateUsed = 'Simple Squares';
        console.log(`  ❌ No template found! Using fallback: "Simple Squares"`);
      }
    } else {
      console.log(`  ✅ Exact template match found: "${patternType}"`);
    }
    
    console.log(`  Template Being Used: "${templateUsed}"`);
    console.log(`  Template Content Preview: ${baseTemplate.substring(0, 150)}...`);
    console.log('═══════════════════════════════════════════════════');
    
    // Ensure we have at least 2 colors
    if (colors.length < 2) {
      colors = [...colors, '#4A90A4', '#D4A574', '#8B7355'];
    }
    
    // Build 4x4 grid using ALL colors
    let blocks = '';
    let colorIndex = 0;
    
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const x = col * 100;
        const y = row * 100;
        
        // Cycle through all available colors
        const color1 = colors[colorIndex % colors.length];
        const color2 = colors[(colorIndex + 1) % colors.length];
        const color3 = colors[(colorIndex + 2) % colors.length];
        
        // Replace color placeholders in template
        const blockTemplate = baseTemplate
          .replace(/COLOR1/g, color1)
          .replace(/COLOR2/g, color2)
          .replace(/COLOR3/g, color3);
        
        blocks += `  <g transform="translate(${x},${y})">\n    ${blockTemplate.trim()}\n  </g>\n`;
        
        // Move to next color for variety
        colorIndex++;
      }
    }
    
    return `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="#f8f8f8"/>
${blocks}</svg>`;
  }

  private getPatternDescription(patternName: string): string {
    const descriptions: Record<string, string> = {
      'Churn Dash': '- A 9-patch style block with a center square, 4 rectangles on the sides, and 4 half-square triangle units in the corners\n- The corners feature diagonal splits creating a "churning" motion effect\n- NOT a Shoo Fly pattern (which has solid squares in corners)',
      'Shoo Fly': '- A 9-patch block with solid squares in all four corners\n- A center square\n- Four half-square triangles on the sides forming an X pattern',
      'Ohio Star': '- 8-pointed star in the center formed by quarter-square triangles\n- Four corner squares\n- The star points extend from center to the midpoints of each side',
      'Sawtooth Star': '- Similar to Ohio Star but with half-square triangles creating sawtooth edges\n- Large center square\n- Four corner squares with triangular star points between them',
      'Pinwheel': '- Four triangular sections spiraling from center\n- Creates a spinning windmill effect\n- Triangles all point in the same rotational direction',
      'Flying Geese': '- Large triangles pointing in one direction (the "geese")\n- Smaller background triangles on the sides\n- Creates a directional, flowing pattern',
      'Four Patch': '- Simple 2x2 grid of squares\n- Alternating two colors in checkerboard pattern',
      'Nine Patch': '- 3x3 grid of equal-sized squares\n- Often alternates two colors in a checkerboard arrangement',
      'Log Cabin': '- Center square with strips of fabric added around it\n- Strips get progressively longer as you move outward\n- Creates a spiral or concentric square effect',
    };
    return descriptions[patternName] || `- Traditional ${patternName} quilt block pattern`;
  }

  private formatPatternName(patternId: string): string {
    const patternNames: Record<string, string> = {
      'simple-squares': 'Simple Squares',
      'strip-quilt': 'Strip Quilt',
      'checkerboard': 'Checkerboard',
      'rail-fence': 'Rail Fence',
      'four-patch': 'Four Patch',
      'nine-patch': 'Nine Patch',
      'half-square-triangles': 'Half-Square Triangles',
      'hourglass': 'Hourglass',
      'bow-tie': 'Bow Tie',
      'flying-geese': 'Flying Geese',
      'pinwheel': 'Pinwheel',
      'log-cabin': 'Log Cabin',
      'sawtooth-star': 'Sawtooth Star',
      'ohio-star': 'Ohio Star',
      'churn-dash': 'Churn Dash',
      'lone-star': 'Lone Star',
      'mariners-compass': "Mariner's Compass",
      'new-york-beauty': 'New York Beauty',
      'storm-at-sea': 'Storm at Sea',
      'drunkards-path': "Drunkard's Path",
      'feathered-star': 'Feathered Star',
      'grandmothers-flower-garden': "Grandmother's Flower Garden",
      'double-wedding-ring': 'Double Wedding Ring',
      'pickle-dish': 'Pickle Dish',
      'complex-medallion': 'Complex Medallion',
    };
    return patternNames[patternId] || patternId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
}