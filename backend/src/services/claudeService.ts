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
  visualSvg: string; // NEW: SVG visualization
}

export class ClaudeService {
  // Analyze fabric images and generate quilt pattern
  async generateQuiltPattern(fabricImages: string[]): Promise<QuiltPattern> {
    try {
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 3000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `You are an expert quilter and fabric designer. I'm providing you with ${fabricImages.length} fabric images. 

Please analyze these fabrics and create a custom quilt pattern design. Provide:

1. Pattern Name - A creative, descriptive name for this quilt pattern
2. Description - A brief overview of the quilt design (2-3 sentences)
3. Fabric Layout - Describe how the fabrics should be arranged (which fabrics go where)
4. Difficulty Level - Beginner, Intermediate, or Advanced
5. Estimated Size - Approximate finished quilt dimensions (e.g., "60x80 inches throw quilt")
6. Step-by-Step Instructions - 5-8 clear steps to construct this quilt
7. Visual SVG - Create an SVG visualization of the quilt pattern showing how the fabrics are arranged

For the SVG visualization:
- Create a viewBox of "0 0 400 500" (representing the quilt dimensions)
- Use different colors to represent each fabric (fabric 1, fabric 2, etc.)
- Show the geometric pattern layout (squares, strips, blocks, etc.)
- Add subtle borders between pieces
- Make it visually appealing and representative of the actual pattern
- Keep it simple but informative

Please format your response as JSON with this structure:
{
  "patternName": "...",
  "description": "...",
  "fabricLayout": "...",
  "difficulty": "...",
  "estimatedSize": "...",
  "instructions": ["step 1", "step 2", ...],
  "visualSvg": "<svg>...</svg>"
}`,
              },
              // Add fabric images
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

      // Extract JSON from response (Claude might wrap it in markdown)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not parse pattern from Claude response');
      }

      const pattern: QuiltPattern = JSON.parse(jsonMatch[0]);
      return pattern;

    } catch (error) {
      console.error('Error generating quilt pattern:', error);
      throw new Error('Failed to generate quilt pattern');
    }
  }
}