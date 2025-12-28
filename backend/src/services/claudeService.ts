import Anthropic from '@anthropic-ai/sdk';
import { RetryHandler } from '../utils/retryHandler';
import { SvgGenerator } from '../utils/svgGenerator';
import { PatternFormatter } from '../utils/patternFormatter';
import { PromptBuilder } from './promptBuilder';
import { compressImages } from '../utils/imageCompressor';

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
  imageUrl?: string;
}

export class ClaudeService {

  async generateQuiltPattern(
    fabricImages: string[],
    imageTypes: string[] = [],
    skillLevel: string = 'beginner',
    selectedPattern?: string,
    roleAssignments?: any // Accept roleAssignments from controller
  ): Promise<QuiltPattern> {
    return RetryHandler.withRetry(
      () => this.attemptPatternGeneration(fabricImages, imageTypes, skillLevel, selectedPattern, roleAssignments),
      3,
      'Pattern generation'
    );
  }

  private async attemptPatternGeneration(
    fabricImages: string[],
    imageTypes: string[] = [],
    skillLevel: string = 'beginner',
    selectedPattern?: string,
    roleAssignments?: any
  ): Promise<QuiltPattern> {
    try {
      // Select pattern type (with fabric count for intelligent auto-selection)
      const { patternForSvg, patternInstruction, patternId } = PromptBuilder.selectPattern(
        skillLevel, 
        selectedPattern,
        fabricImages.length
      );
      
      console.log(`🎯 Final pattern: ${patternForSvg}, Skill level: ${skillLevel}`);
      console.log('═══════════════════════════════════════════════');
      console.log('📤 CLAUDE API REQUEST PARAMETERS:');
      console.log(`  Pattern Type: ${patternForSvg}`);
      console.log(`  Pattern ID: ${patternId || 'N/A'}`);
      console.log(`  Skill Level: ${skillLevel}`);
      console.log(`  Fabric Images: ${fabricImages.length}`);
      console.log(`  Image Types: ${imageTypes.join(', ') || 'auto-detect'}`);
      console.log(`  Selected Pattern: ${selectedPattern || 'auto (fabric-count optimized)'}`);
      console.log('═══════════════════════════════════════════════');
      
      // Compress images if needed (Claude has 5MB per image limit)
      console.log('🖼️ Checking image sizes...');
      const compressedImages = await compressImages(fabricImages, imageTypes);
      
      const compressedBase64s = compressedImages.map(img => img.base64);
      const compressedMimeTypes = compressedImages.map(img => img.mimeType);
      
      // Log compression results
      const totalOriginal = compressedImages.reduce((sum, img) => sum + img.originalSize, 0);
      const totalCompressed = compressedImages.reduce((sum, img) => sum + img.compressedSize, 0);
      const compressedCount = compressedImages.filter(img => img.wasCompressed).length;
      
      if (compressedCount > 0) {
        console.log(`📦 Compressed ${compressedCount}/${fabricImages.length} images`);
        console.log(`   Total: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB → ${(totalCompressed / 1024 / 1024).toFixed(2)}MB`);
      } else {
        console.log(`✅ All images within size limits (${(totalOriginal / 1024 / 1024).toFixed(2)}MB total)`);
      }
      

      // Build prompt and images
      let promptText: string;
      const imageContent = PromptBuilder.buildImageContent(compressedBase64s, compressedMimeTypes);

      // If user provided role assignments, we need to run a two-step process:
      // 1. Run fabric analysis prompt to get fabricAnalysis array
      // 2. Use buildRoleSwapPrompt with user assignments and fabricAnalysis
      if (roleAssignments) {
        // Step 1: Get fabric analysis by running a special prompt (STEP 1 only)
        const analysisPrompt = `You are an expert quilter. For each uploaded fabric image, provide a JSON array with objects containing: fabricIndex, description, type (printed|solid), value (light|medium|dark), printScale (solid|small|medium|large), dominantColor (hex code). Do NOT assign roles. Example: [{"fabricIndex":1, ...}, ...]`;
        const analysisStream = await anthropic.messages.stream({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: analysisPrompt },
                ...imageContent,
              ],
            },
          ],
        });
        const analysisResponse = await this.collectStreamResponse(analysisStream);
        let fabricAnalysis: any[] = [];
        try {
          const firstBracket = analysisResponse.indexOf('[');
          const lastBracket = analysisResponse.lastIndexOf(']');
          if (firstBracket !== -1 && lastBracket !== -1) {
            fabricAnalysis = JSON.parse(analysisResponse.substring(firstBracket, lastBracket + 1));
          }
        } catch (e) {
          console.warn('Could not parse fabric analysis, falling back to default prompt.');
        }
        if (fabricAnalysis.length > 0) {
          promptText = PromptBuilder.buildRoleSwapPrompt(
            fabricAnalysis,
            roleAssignments,
            patternForSvg,
            skillLevel,
            patternId
          );
        } else {
          // Fallback to normal prompt if analysis fails
          promptText = PromptBuilder.buildPrompt(
            fabricImages.length,
            patternForSvg,
            patternInstruction,
            skillLevel,
            patternId
          );
        }
      } else {
        promptText = PromptBuilder.buildPrompt(
          fabricImages.length,
          patternForSvg,
          patternInstruction,
          skillLevel,
          patternId
        );
      }
      
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
      instructions: this.addDisclaimerToInstructions(this.validateInstructions(parsedResponse.instructions)),
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

  /**
   * Add disclaimer to beginning of instructions
   */
  private addDisclaimerToInstructions(instructions: string[]): string[] {
    const disclaimer = '📋 IMPORTANT: This is only a recommendation. You are free to design this quilt however you wish - rearrange blocks, change colors, or modify the layout to suit your creative vision!';
    return [disclaimer, ...instructions];
  }
}