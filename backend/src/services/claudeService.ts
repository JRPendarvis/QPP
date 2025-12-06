import Anthropic from '@anthropic-ai/sdk';

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

const SKILL_LEVEL_DESCRIPTIONS: Record<string, string> = {
  beginner: 'Beginner - simple straight seams, basic blocks, limited piecing',
  advanced_beginner: 'Advanced Beginner - accurate 1/4" seams, simple piecing patterns, basic color coordination',
  intermediate: 'Intermediate - points matching, Y-seams and set-in seams, multiple block patterns',
  advanced: 'Advanced - intricate piecing, foundation paper piecing, curved seams, complex designs',
  expert: 'Expert - all techniques mastered, complex medallions, competition-level work',
};

export class ClaudeService {
  async generateQuiltPattern(
    fabricImages: string[], 
    skillLevel: string = 'beginner'
  ): Promise<QuiltPattern> {
    try {
      const skillDescription = SKILL_LEVEL_DESCRIPTIONS[skillLevel] || SKILL_LEVEL_DESCRIPTIONS['beginner'];
      
      const stream = await anthropic.messages.stream({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 28000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `You are an expert quilter and fabric designer. I'm providing you with ${fabricImages.length} fabric images. 

**STEP 1: ANALYZE THE FABRICS**
Carefully examine each fabric image and identify the dominant hex color (e.g., #FF5733) from each one.

**STEP 2: CREATE THE PATTERN**
Create a custom quilt pattern using the ACTUAL colors from the fabrics.

**CRITICAL REQUIREMENT: The pattern MUST be appropriate for this skill level:**
${skillDescription}

Please provide:

1. Pattern Name - A creative name referencing the actual fabric colors
2. Description - Brief overview (2-3 sentences) mentioning specific colors
3. Fabric Layout - How the actual fabric colors should be arranged
4. Difficulty Level - MUST be: ${skillLevel.replace('_', ' ')}
5. Estimated Size - Approximate dimensions (e.g., "60x80 inches throw quilt")
6. Step-by-Step Instructions - EXACTLY 5-6 clear steps
7. Visual SVG - A quilt preview with proper grid alignment

**Pattern Complexity Guidelines for ${skillLevel}:**
${this.getComplexityGuidelines(skillLevel)}

**SVG REQUIREMENTS - STRICT GRID STRUCTURE:**
- Create EXACTLY a 4x4 grid of quilt blocks (16 blocks total)
- viewBox: "0 0 400 400" (perfect square)
- Each block is 100x100 pixels
- Position blocks using this EXACT formula:
  * Block at row R, column C → x=(C*100), y=(R*100)
  * Row 0, Col 0 → x=0, y=0
  * Row 0, Col 1 → x=100, y=0
  * Row 0, Col 2 → x=200, y=0
  * Row 0, Col 3 → x=300, y=0
  * Row 1, Col 0 → x=0, y=100
  * Row 1, Col 1 → x=100, y=100
  * And so on...
- Use <g> groups with translate(x,y) for each block
- Inside each <g>, create block pattern using coordinates from 0,0 to 100,100
- Use ACTUAL hex colors from the fabric images
- Add stroke="#ccc" stroke-width="0.5" to shapes for definition

**BLOCK PATTERNS BY SKILL LEVEL:**
- Beginner: Solid squares
- Advanced Beginner: Four-patch (2x2 grid of 50x50 squares per block)
- Intermediate: Nine-patch, simple pinwheel (4 triangles), or HSTs
- Advanced/Expert: More complex arrangements

**STRICT SVG STRUCTURE - COPY THIS PATTERN:**

<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Row 0 -->
  <g transform="translate(0,0)">
    <rect x="0" y="0" width="100" height="100" fill="#actualcolor1" stroke="#ccc" stroke-width="0.5"/>
  </g>
  <g transform="translate(100,0)">
    <rect x="0" y="0" width="100" height="100" fill="#actualcolor2" stroke="#ccc" stroke-width="0.5"/>
  </g>
  <g transform="translate(200,0)">
    <rect x="0" y="0" width="100" height="100" fill="#actualcolor3" stroke="#ccc" stroke-width="0.5"/>
  </g>
  <g transform="translate(300,0)">
    <rect x="0" y="0" width="100" height="100" fill="#actualcolor4" stroke="#ccc" stroke-width="0.5"/>
  </g>
  <!-- Row 1 -->
  <g transform="translate(0,100)">
    <rect x="0" y="0" width="100" height="100" fill="#actualcolor2" stroke="#ccc" stroke-width="0.5"/>
  </g>
  <!-- Continue for all 16 blocks... -->
</svg>

**For four-patch blocks, use this inside a <g>:**
<rect x="0" y="0" width="50" height="50" fill="#color1" stroke="#ccc" stroke-width="0.5"/>
<rect x="50" y="0" width="50" height="50" fill="#color2" stroke="#ccc" stroke-width="0.5"/>
<rect x="0" y="50" width="50" height="50" fill="#color2" stroke="#ccc" stroke-width="0.5"/>
<rect x="50" y="50" width="50" height="50" fill="#color1" stroke="#ccc" stroke-width="0.5"/>

**For pinwheel blocks, use triangles like this:**
<polygon points="0,0 50,50 0,100" fill="#color1" stroke="#ccc" stroke-width="0.5"/>
<polygon points="0,0 100,0 50,50" fill="#color2" stroke="#ccc" stroke-width="0.5"/>
<polygon points="100,0 100,100 50,50" fill="#color1" stroke="#ccc" stroke-width="0.5"/>
<polygon points="0,100 100,100 50,50" fill="#color2" stroke="#ccc" stroke-width="0.5"/>

**CRITICAL RULES:**
1. ALWAYS use translate(x,y) for block positioning
2. ALL shapes inside a <g> use coordinates relative to 0,0
3. Use ACTUAL fabric colors (identify the hex codes)
4. Keep under 3000 characters total

**IMPORTANT: Return ONLY valid JSON, no extra text!**

JSON format:
{
  "patternName": "Name with actual colors (e.g., 'Golden Sunset Pinwheels')",
  "description": "Description mentioning the specific colors you identified",
  "fabricLayout": "Layout description using actual color names",
  "difficulty": "${skillLevel.replace('_', ' ')}",
  "estimatedSize": "60x80 inches throw quilt",
  "instructions": [
    "Step 1 - mention actual fabric colors",
    "Step 2 - clear instruction",
    "Step 3 - clear instruction",
    "Step 4 - clear instruction",
    "Step 5 - clear instruction"
  ],
  "visualSvg": "<svg viewBox='0 0 400 400'><!-- 16 blocks in 4x4 grid using translate --></svg>"
}`,
              },
              ...fabricImages.map((imageBase64) => ({
                type: 'image' as const,
                source: {
                  type: 'base64' as const,
                  media_type: 'image/jpeg' as const,
                  data: imageBase64,
                },
              })),
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

      // Remove markdown code blocks if present
      jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');

      // Remove any debug markers
      jsonText = jsonText.replace(/=+ CLAUDE RESPONSE (START|END) =+\s*/g, '');

      // Try to find JSON object - match from first { to last }
      const firstBrace = jsonText.indexOf('{');
      const lastBrace = jsonText.lastIndexOf('}');

      if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
        console.error('Could not find valid JSON object in response');
        console.error('Response preview:', responseText.substring(0, 500));
        throw new Error('Could not parse pattern from Claude response');
      }

      jsonText = jsonText.substring(firstBrace, lastBrace + 1);

      try {
        const pattern: QuiltPattern = JSON.parse(jsonText);
        
        // Patch incomplete instructions
        if (pattern.instructions && Array.isArray(pattern.instructions)) {
          const lastInstruction = pattern.instructions[pattern.instructions.length - 1];
          if (lastInstruction && lastInstruction.length < 30) {
            console.warn('⚠️ Last instruction seems truncated, removing it');
            pattern.instructions = pattern.instructions.slice(0, -1);
          }
          
          if (pattern.instructions.length < 4) {
            throw new Error('Response missing sufficient instructions (need at least 4)');
          }
        }
        
        // Validate required fields
        if (!pattern.patternName || !pattern.instructions) {
          throw new Error('Response missing required fields');
        }
        
        // Make SVG optional - use placeholder if missing or truncated
        if (!pattern.visualSvg || pattern.visualSvg.trim() === '' || !pattern.visualSvg.includes('</svg>')) {
          console.warn('⚠️ SVG missing or incomplete, using placeholder');
          pattern.visualSvg = '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" fill="#f3f4f6"/><text x="200" y="200" text-anchor="middle" fill="#9ca3af" font-size="18">Pattern Visualization</text></svg>';
        }
        
        console.log(`✅ Successfully generated pattern: ${pattern.patternName}`);
        console.log(`   Instructions: ${pattern.instructions.length} steps`);
        console.log(`   SVG length: ${pattern.visualSvg.length} characters`);
        
        return pattern;
        
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Attempted to parse:', jsonText.substring(0, 500));
        throw new Error('Failed to parse Claude response as JSON');
      }

    } catch (error) {
      console.error('Error generating quilt pattern:', error);
      throw new Error('Failed to generate quilt pattern');
    }
  }

  private getComplexityGuidelines(skillLevel: string): string {
    const guidelines: Record<string, string> = {
      beginner: '- Use simple solid squares\n- Straight seams only\n- 2-3 fabrics\n- Simple grid layout',
      advanced_beginner: '- Four-patch or nine-patch blocks\n- Basic half-square triangles\n- Up to 4 fabrics\n- Repetitive patterns',
      intermediate: '- Multiple block types\n- Flying geese or pinwheels\n- Points matching required\n- 4-6 fabrics with intentional placement',
      advanced: '- Complex piecing\n- Paper piecing acceptable\n- Y-seams or curves\n- Intricate color gradients',
      expert: '- Any technique\n- Complex curves\n- Sophisticated design\n- Advanced color theory',
    };

    return guidelines[skillLevel] || guidelines['beginner'];
  }
}