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
      
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,  // ✅ INCREASED from 3000
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `You are an expert quilter and fabric designer. I'm providing you with ${fabricImages.length} fabric images. 

**CRITICAL REQUIREMENT: The pattern MUST be appropriate for this skill level:**
${skillDescription}

Please analyze these fabrics and create a custom quilt pattern design that matches the specified skill level. Provide:

1. Pattern Name - A creative, descriptive name for this quilt pattern
2. Description - A brief overview of the quilt design (2-3 sentences)
3. Fabric Layout - Describe how the fabrics should be arranged (which fabrics go where)
4. Difficulty Level - MUST be: ${skillLevel.replace('_', ' ')}
5. Estimated Size - Approximate finished quilt dimensions (e.g., "60x80 inches throw quilt")
6. Step-by-Step Instructions - Provide 5-8 clear steps appropriate for a ${skillLevel.replace('_', ' ')} quilter
7. Visual SVG - Create a SIMPLE SVG visualization (keep the SVG concise - use basic shapes only)

**Pattern Complexity Guidelines for ${skillLevel}:**
${this.getComplexityGuidelines(skillLevel)}

For the SVG visualization:
- Create a viewBox of "0 0 400 500" (representing the quilt dimensions)
- Use different colors to represent each fabric
- Show the geometric pattern layout - KEEP IT SIMPLE (don't create hundreds of polygons)
- Use rectangles and simple polygons only
- Make it visually representative but not overly detailed

**IMPORTANT: Return ONLY valid JSON, no additional text before or after.**

JSON format:
{
  "patternName": "...",
  "description": "...",
  "fabricLayout": "...",
  "difficulty": "${skillLevel.replace('_', ' ')}",
  "estimatedSize": "...",
  "instructions": ["step 1", "step 2", ...],
  "visualSvg": "<svg>...</svg>"
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

      // Parse Claude's response
      const responseText = message.content[0].type === 'text' 
        ? message.content[0].text 
        : '';

      console.log('===== CLAUDE RESPONSE START =====');
      console.log(responseText.substring(0, 1000)); // Only log first 1000 chars
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
        
        // Validate required fields
        if (!pattern.patternName || !pattern.instructions || !pattern.visualSvg) {
          throw new Error('Response missing required fields');
        }
        
        console.log(`✅ Successfully generated pattern: ${pattern.patternName}`);
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
      beginner: '- Use simple squares or rectangles\n- Straight seams only\n- No more than 2-3 fabrics in the main design\n- Simple grid or strip layouts',
      advanced_beginner: '- Simple pieced blocks (4-patch, 9-patch)\n- Basic triangles (HSTs)\n- Up to 4 fabrics\n- Simple repetitive patterns',
      intermediate: '- Multiple block types\n- Flying geese, pinwheels\n- Points that need matching\n- 4-6 fabrics with intentional color placement',
      advanced: '- Complex piecing with many seams\n- Paper piecing acceptable\n- Curved piecing or Y-seams\n- Intricate color gradients or medallion centers',
      expert: '- Any technique is acceptable\n- Complex curved piecing\n- Intricate appliqué if desired\n- Sophisticated color theory and design',
    };

    return guidelines[skillLevel] || guidelines['beginner'];
  }
}