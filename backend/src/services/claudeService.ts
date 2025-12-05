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
      
      // Use streaming for large token requests
      const stream = await anthropic.messages.stream({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 16000,
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
6. Step-by-Step Instructions - Provide EXACTLY 5-6 clear, concise steps appropriate for a ${skillLevel.replace('_', ' ')} quilter
7. Visual SVG - Create a SIMPLE grid visualization (see requirements below)

**Pattern Complexity Guidelines for ${skillLevel}:**
${this.getComplexityGuidelines(skillLevel)}

**SVG REQUIREMENTS (STRICT - KEEP UNDER 500 CHARACTERS):**
- Create a 3x4 grid of rectangles (12 total shapes)
- Use ONLY <rect> elements - NO polygons, NO paths, NO complex shapes
- Each rectangle represents a quilt block with appropriate fabric color
- viewBox must be "0 0 300 400"
- Each rect should be 100x100 pixels
- Use hex colors from the fabric images
- Total SVG must be under 500 characters
- Example format: <svg viewBox="0 0 300 400"><rect x="0" y="0" width="100" height="100" fill="#abc123"/><rect x="100" y="0" width="100" height="100" fill="#def456"/>...</svg>

**IMPORTANT: Return ONLY valid JSON, no additional text before or after. Keep instructions to 5-6 steps maximum.**

JSON format (copy this structure exactly):
{
  "patternName": "Creative Pattern Name",
  "description": "Brief 2-3 sentence description of the quilt design.",
  "fabricLayout": "Describe how fabrics are arranged in 1-2 sentences.",
  "difficulty": "${skillLevel.replace('_', ' ')}",
  "estimatedSize": "60x80 inches throw quilt",
  "instructions": [
    "Step 1 - concise instruction",
    "Step 2 - concise instruction",
    "Step 3 - concise instruction",
    "Step 4 - concise instruction",
    "Step 5 - concise instruction"
  ],
  "visualSvg": "<svg viewBox='0 0 300 400'><rect x='0' y='0' width='100' height='100' fill='#color1'/></svg>"
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
        
        // ✅ Patch incomplete instructions
        if (pattern.instructions && Array.isArray(pattern.instructions)) {
          // Fix any truncated last instruction (if it's suspiciously short)
          const lastInstruction = pattern.instructions[pattern.instructions.length - 1];
          if (lastInstruction && lastInstruction.length < 30) {
            console.warn('⚠️ Last instruction seems truncated, removing it');
            pattern.instructions = pattern.instructions.slice(0, -1);
          }
          
          // Ensure we have at least 4 complete instructions
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
          pattern.visualSvg = '<svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="400" fill="#f3f4f6"/><text x="150" y="200" text-anchor="middle" fill="#9ca3af" font-size="18">Pattern Visualization</text></svg>';
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
      beginner: '- Use simple squares or rectangles\n- Straight seams only\n- No more than 2-3 fabrics in the main design\n- Simple grid or strip layouts',
      advanced_beginner: '- Simple pieced blocks (4-patch, 9-patch)\n- Basic triangles (HSTs)\n- Up to 4 fabrics\n- Simple repetitive patterns',
      intermediate: '- Multiple block types\n- Flying geese, pinwheels\n- Points that need matching\n- 4-6 fabrics with intentional color placement',
      advanced: '- Complex piecing with many seams\n- Paper piecing acceptable\n- Curved piecing or Y-seams\n- Intricate color gradients or medallion centers',
      expert: '- Any technique is acceptable\n- Complex curved piecing\n- Intricate appliqué if desired\n- Sophisticated color theory and design',
    };

    return guidelines[skillLevel] || guidelines['beginner'];
  }
}