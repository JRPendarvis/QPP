import Anthropic from '@anthropic-ai/sdk';
import { RetryHandler } from '../utils/retryHandler';
import { SvgGenerator } from '../utils/svgGenerator';
import { PatternFormatter } from '../utils/patternFormatter';
import { PromptBuilder } from './promptBuilder';
import { OpenAiService } from './openAiService';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const openAiService = new OpenAiService();

interface QuiltPattern {
  patternName: string;
  description: string;
  fabricLayout: string;
  difficulty: string;
  estimatedSize: string;
  instructions: string[];
  visualSvg: string;
  imageUrl?: string;
}

export class ClaudeService {
  async generateQuiltPattern(
    fabricImages: string[],
    imageTypes: string[] = [],
    skillLevel: string = 'beginner',
    selectedPattern?: string
  ): Promise<QuiltPattern> {
    return RetryHandler.withRetry(
      () => this.attemptPatternGeneration(fabricImages, imageTypes, skillLevel, selectedPattern),
      3,
      'Pattern generation'
    );
  }

  private async attemptPatternGeneration(
    fabricImages: string[],
    imageTypes: string[] = [],
    skillLevel: string = 'beginner',
    selectedPattern?: string
  ): Promise<QuiltPattern> {
    try {
      // Select pattern type
      const { patternForSvg, patternInstruction } = PromptBuilder.selectPattern(skillLevel, selectedPattern);
      
      console.log(`🎯 Final pattern: ${patternForSvg}, Skill level: ${skillLevel}`);
      console.log('═══════════════════════════════════════════════');
      console.log('📤 CLAUDE API REQUEST PARAMETERS:');
      console.log(`  Pattern Type: ${patternForSvg}`);
      console.log(`  Skill Level: ${skillLevel}`);
      console.log(`  Fabric Images: ${fabricImages.length}`);
      console.log(`  Image Types: ${imageTypes.join(', ') || 'auto-detect'}`);
      console.log(`  Selected Pattern: ${selectedPattern || 'auto'}`);
      console.log('═══════════════════════════════════════════════');
      
      // Build prompt and images
      const promptText = PromptBuilder.buildPrompt(
        fabricImages.length,
        patternForSvg,
        patternInstruction,
        skillLevel
      );
      const imageContent = PromptBuilder.buildImageContent(fabricImages, imageTypes);
      
      // Call Claude API
      const stream = await anthropic.messages.stream({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: promptText },
              ...imageContent,
            ],
          },
        ],
      });

      // Collect response
      const responseText = await this.collectStreamResponse(stream);
      
      console.log('===== CLAUDE RESPONSE START =====');
      console.log(responseText.substring(0, 1000));
      console.log('===== CLAUDE RESPONSE END =====');

      // Parse and build pattern
      const parsedResponse = this.parseJsonResponse(responseText);
      const pattern = this.buildPattern(parsedResponse, patternForSvg, skillLevel);
      
      console.log(`✅ Successfully generated pattern: ${pattern.patternName}`);
      console.log(`   Pattern type: ${patternForSvg}`);
      console.log(`   Difficulty: ${pattern.difficulty}`);
      console.log(`   Colors: ${parsedResponse.fabricColors?.join(', ') || 'none'}`);
      
      // Generate realistic image with DALL-E using GPT-4V fabric analysis
      console.log('🎨 Attempting DALL-E image generation with GPT-4V fabric analysis...');
      try {
        const imageUrl = await openAiService.generateQuiltImage(
          pattern.patternName,
          pattern.description,
          fabricImages, // Pass actual fabric images for GPT-4V analysis
          patternForSvg
        );
        if (imageUrl) {
          pattern.imageUrl = imageUrl;
          console.log('✅ DALL-E image added to pattern');
        } else {
          console.log('⚠️  DALL-E returned empty string (likely API error)');
        }
      } catch (error) {
        console.error('❌ DALL-E image generation failed:', error);
        console.log('⚠️  Using SVG only');
      }
      
      return pattern;

    } catch (error) {
      console.error('Error generating quilt pattern:', error);
      throw error;
    }
  }

  /**
   * Collect streaming response from Claude API
   */
  private async collectStreamResponse(stream: any): Promise<string> {
    let responseText = '';
    
    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        responseText += chunk.delta.text;
      }
    }
    
    return responseText;
  }

  /**
   * Parse JSON from Claude response text
   */
  private parseJsonResponse(responseText: string): any {
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
    
    return parsedResponse;
  }

  /**
   * Build QuiltPattern object from parsed response
   */
  private buildPattern(parsedResponse: any, patternForSvg: string, skillLevel: string): QuiltPattern {
    // Extract colors from response
    const colors = parsedResponse.fabricColors || ['#4A90A4', '#D4A574', '#8B7355', '#6B8E23'];
    console.log(`🎨 Fabric colors identified: ${colors.join(', ')}`);
    
    // Generate SVG using template
    const visualSvg = SvgGenerator.generateFromTemplate(patternForSvg, colors);
    
    // Format pattern name
    const displayPatternName = PatternFormatter.extractDisplayName(parsedResponse.patternName, patternForSvg);
    console.log(`📛 Pattern name: ${displayPatternName} (SVG template: ${patternForSvg})`);
    
    // Force the correct difficulty level
    const formattedDifficulty = skillLevel.replace('_', ' ');
    
    const pattern: QuiltPattern = {
      patternName: displayPatternName,
      description: parsedResponse.description || `A beautiful ${patternForSvg} pattern`,
      fabricLayout: parsedResponse.fabricLayout || 'Arranged in a 4x4 grid',
      difficulty: formattedDifficulty,
      estimatedSize: parsedResponse.estimatedSize || '60x72 inches',
      instructions: this.validateInstructions(parsedResponse.instructions),
      visualSvg: visualSvg,
    };

    return pattern;
  }

  /**
   * Validate and provide fallback instructions if needed
   */
  private validateInstructions(instructions?: string[]): string[] {
    if (!instructions || instructions.length < 4) {
      return [
        'Gather your fabrics and materials',
        'Cut pieces according to pattern requirements', 
        'Arrange blocks in desired layout',
        'Sew blocks together',
        'Add borders and binding'
      ];
    }
    return instructions;
  }
}