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

const PATTERNS_BY_SKILL: Record<string, string[]> = {
  beginner: ['Simple Squares', 'Strip Quilt', 'Checkerboard', 'Rail Fence'],
  advanced_beginner: ['Four Patch', 'Nine Patch', 'Half-Square Triangles', 'Hourglass'],
  intermediate: ['Flying Geese', 'Pinwheel', 'Log Cabin', 'Bow Tie'],
  advanced: ['Sawtooth Star', 'Ohio Star', 'Churn Dash', 'Lone Star'],
  expert: ['Mariner\'s Compass', 'New York Beauty', 'Storm at Sea', 'Double Wedding Ring'],
};

const SVG_TEMPLATES: Record<string, string> = {
  'Simple Squares': `
    <rect x="0" y="0" width="100" height="100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>`,
  'Checkerboard': `
    <rect x="0" y="0" width="50" height="50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="50" y="0" width="50" height="50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="50" width="50" height="50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="50" y="50" width="50" height="50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>`,
  'Four Patch': `
    <rect x="0" y="0" width="50" height="50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="50" y="0" width="50" height="50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="50" width="50" height="50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="50" y="50" width="50" height="50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>`,
  'Nine Patch': `
    <rect x="0" y="0" width="33.33" height="33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="33.33" y="0" width="33.33" height="33.33" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="66.66" y="0" width="33.33" height="33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="33.33" width="33.33" height="33.33" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="33.33" y="33.33" width="33.33" height="33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="66.66" y="33.33" width="33.33" height="33.33" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="66.66" width="33.33" height="33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="33.33" y="66.66" width="33.33" height="33.33" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="66.66" y="66.66" width="33.33" height="33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>`,
  'Pinwheel': `
    <polygon points="0,0 50,50 0,100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,0 100,0 50,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,0 100,100 50,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,100 100,100 50,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>`,
  'Half-Square Triangles': `
    <polygon points="0,0 100,0 0,100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,0 100,100 0,100" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>`,
  'Flying Geese': `
    <polygon points="50,0 100,100 0,100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,0 50,0 0,100" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,0 100,0 100,100" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>`,
  'Hourglass': `
    <polygon points="50,0 100,50 50,100 0,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,0 50,0 0,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,0 100,0 100,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,50 0,100 50,100" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,50 100,100 50,100" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>`,
  'Rail Fence': `
    <rect x="0" y="0" width="100" height="33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="33.33" width="100" height="33.33" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="66.66" width="100" height="33.33" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>`,
  'Strip Quilt': `
    <rect x="0" y="0" width="33.33" height="100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="33.33" y="0" width="33.33" height="100" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="66.66" y="0" width="33.33" height="100" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>`,
  'Log Cabin': `
    <rect x="40" y="40" width="20" height="20" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="60" y="40" width="20" height="20" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="60" y="60" width="20" height="40" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="20" y="60" width="40" height="20" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="20" y="20" width="20" height="40" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="40" y="20" width="40" height="20" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="80" y="20" width="20" height="60" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="20" y="80" width="80" height="20" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="0" width="20" height="100" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="0" width="100" height="20" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>`,
  'Bow Tie': `
    <rect x="0" y="0" width="50" height="50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="50" y="50" width="50" height="50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,0 100,0 50,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,50 0,100 50,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="35" y="35" width="30" height="30" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>`,
  'Ohio Star': `
    <rect x="0" y="0" width="33.33" height="33.33" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="66.66" y="0" width="33.33" height="33.33" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="66.66" width="33.33" height="33.33" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="66.66" y="66.66" width="33.33" height="33.33" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="33.33" y="33.33" width="33.33" height="33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="33.33,0 66.66,0 50,33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="33.33,0 33.33,33.33 50,33.33" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="66.66,0 66.66,33.33 50,33.33" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="66.66,33.33 100,33.33 66.66,66.66" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,33.33 100,66.66 66.66,66.66" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="33.33,66.66 66.66,66.66 50,100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="33.33,66.66 33.33,100 50,100" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="66.66,66.66 66.66,100 50,100" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,33.33 33.33,33.33 33.33,66.66" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,33.33 0,66.66 33.33,66.66" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>`,
  'Sawtooth Star': `
    <rect x="0" y="0" width="25" height="25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="75" y="0" width="25" height="25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="75" width="25" height="25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="75" y="75" width="25" height="25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="25" y="25" width="50" height="50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,0 75,0 50,25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,0 25,25 50,25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,0 75,25 50,25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,25 100,25 75,75" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,25 100,75 75,75" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,75 75,75 50,100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,75 25,100 50,100" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,75 75,100 50,100" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,25 25,25 25,75" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,25 0,75 25,75" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>`,
  'Churn Dash': `
    <rect x="33.33" y="0" width="33.33" height="33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="33.33" width="33.33" height="33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="66.66" y="33.33" width="33.33" height="33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="33.33" y="66.66" width="33.33" height="33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="33.33" y="33.33" width="33.33" height="33.33" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,0 33.33,0 0,33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="33.33,0 33.33,33.33 0,33.33" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="66.66,0 100,0 100,33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="66.66,0 66.66,33.33 100,33.33" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,66.66 0,100 33.33,100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,66.66 33.33,66.66 33.33,100" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,66.66 100,100 66.66,100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="66.66,66.66 100,66.66 66.66,100" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>`,
  'Lone Star': `
    <polygon points="50,0 60,40 100,50 60,60 50,100 40,60 0,50 40,40" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,20 55,40 50,40" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,20 45,40 50,40" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="80,50 60,55 60,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="80,50 60,45 60,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,80 55,60 50,60" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,80 45,60 50,60" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="20,50 40,55 40,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="20,50 40,45 40,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="0" width="20" height="20" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="80" y="0" width="20" height="20" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="80" width="20" height="20" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="80" y="80" width="20" height="20" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>`,
  // Expert patterns - simplified representations
  'New York Beauty': `
    <rect x="0" y="0" width="100" height="100" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <path d="M0,100 Q50,50 100,100 Z" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="10,100 20,70 30,100" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="30,100 40,75 50,100" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,100 60,75 70,100" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="70,100 80,70 90,100" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <circle cx="50" cy="85" r="10" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>`,
  "Mariner's Compass": `
    <rect x="0" y="0" width="100" height="100" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <circle cx="50" cy="50" r="45" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,5 55,35 50,50 45,35" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="95,50 65,55 50,50 65,45" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,95 45,65 50,50 55,65" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="5,50 35,45 50,50 35,55" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="82,18 60,40 50,50 60,38" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="82,82 60,60 50,50 62,60" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="18,82 40,60 50,50 38,60" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="18,18 40,40 50,50 38,40" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <circle cx="50" cy="50" r="10" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>`,
  'Storm at Sea': `
    <rect x="0" y="0" width="100" height="100" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="25" y="25" width="50" height="50" fill="COLOR1" stroke="#ccc" stroke-width="0.5" transform="rotate(45 50 50)"/>
    <polygon points="0,0 25,0 0,25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,0 100,0 100,25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,75 0,100 25,100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,75 100,100 75,100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,0 62,25 38,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,50 75,62 75,38" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,100 38,75 62,75" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,50 25,38 25,62" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>`,
  'Double Wedding Ring': `
    <rect x="0" y="0" width="100" height="100" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <ellipse cx="25" cy="50" rx="20" ry="35" fill="none" stroke="COLOR1" stroke-width="8"/>
    <ellipse cx="75" cy="50" rx="20" ry="35" fill="none" stroke="COLOR1" stroke-width="8"/>
    <ellipse cx="50" cy="25" rx="35" ry="20" fill="none" stroke="COLOR3" stroke-width="8"/>
    <ellipse cx="50" cy="75" rx="35" ry="20" fill="none" stroke="COLOR3" stroke-width="8"/>
    <circle cx="50" cy="50" r="8" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>`,
};

export class ClaudeService {
  async generateQuiltPattern(
    fabricImages: string[], 
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

**STEP 1: ANALYZE THE FABRICS**
Identify the dominant hex color from EACH fabric image (e.g., #FF5733, #2E86AB). You MUST identify one color per fabric - so ${fabricImages.length} colors total.

**STEP 2: CREATE THE PATTERN**
Create a "${patternForSvg}" quilt pattern using ALL the colors from the fabrics.

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
      
      // Extract colors from response
      const colors = parsedResponse.fabricColors || ['#4A90A4', '#D4A574', '#8B7355', '#6B8E23'];
      console.log(`🎨 Fabric colors identified: ${colors.join(', ')}`);
      
      // Generate SVG using template
      const visualSvg = this.generateSvgFromTemplate(patternForSvg, colors);
      
      // Force the correct difficulty level
      const formattedDifficulty = skillLevel.replace('_', ' ');
      
      const pattern: QuiltPattern = {
        patternName: parsedResponse.patternName || `${patternForSvg} Quilt`,
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
      throw new Error('Failed to generate quilt pattern');
    }
  }

  private generateSvgFromTemplate(patternType: string, colors: string[]): string {
    // Get template - try exact match first, then fallback
    let baseTemplate = SVG_TEMPLATES[patternType];
    
    if (!baseTemplate) {
      // Try to find a close match
      const templateKeys = Object.keys(SVG_TEMPLATES);
      const closeMatch = templateKeys.find(key => 
        key.toLowerCase().includes(patternType.toLowerCase()) ||
        patternType.toLowerCase().includes(key.toLowerCase())
      );
      
      if (closeMatch) {
        baseTemplate = SVG_TEMPLATES[closeMatch];
        console.log(`📐 Using close match template: ${closeMatch} for ${patternType}`);
      } else {
        baseTemplate = SVG_TEMPLATES['Simple Squares'];
        console.log(`📐 No template for ${patternType}, using Simple Squares fallback`);
      }
    }
    
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