import Anthropic from '@anthropic-ai/sdk';
import { RetryHandler } from '../../utils/retryHandler';
import { PromptBuilder } from '../pattern/promptBuilder';
import { ImagePreparationService } from '../image/imagePreparationService';
import { ResponseParser } from '../pattern/responseParser';
import { PatternBuilder } from '../pattern/patternBuilder';
import { PatternGenerationLogger } from '../pattern/patternGenerationLogger';
import { ClaudeApiClient } from './claudeApiClient';
import { PromptOrchestrator } from '../pattern/promptOrchestrator';
import { QuiltPattern } from '../../types/QuiltPattern';
import { getPatternById } from '../../config/quiltPatterns';
import { BorderConfiguration } from '../../types/Border';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export class ClaudeService {
  async generateQuiltPattern(
    fabricImages: string[],
    imageTypes: string[] = [],
    skillLevel: string = 'beginner',
    selectedPattern?: string,
    roleAssignments?: any,
    quiltSize?: string,
    borderConfiguration?: BorderConfiguration
  ): Promise<QuiltPattern> {
    return RetryHandler.withRetry(
      () => this.attemptPatternGeneration(fabricImages, imageTypes, skillLevel, selectedPattern, roleAssignments, quiltSize, borderConfiguration),
      3,
      'Pattern generation'
    );
  }

  private async attemptPatternGeneration(
    fabricImages: string[],
    imageTypes: string[] = [],
    skillLevel: string = 'beginner',
    selectedPattern?: string,
    roleAssignments?: any,
    quiltSize?: string,
    borderConfiguration?: BorderConfiguration
  ): Promise<QuiltPattern> {
    try {
      // Separate pattern fabrics from border fabrics
      // Border fabrics are the LAST N fabrics in the array
      const borderCount = borderConfiguration?.enabled ? borderConfiguration.borders.length : 0;
      const patternFabricImages = borderCount > 0 
        ? fabricImages.slice(0, fabricImages.length - borderCount)
        : fabricImages;
      const patternImageTypes = borderCount > 0
        ? imageTypes.slice(0, imageTypes.length - borderCount)
        : imageTypes;
      
      console.log('🎨 [ClaudeService] Fabric separation:', {
        totalFabrics: fabricImages.length,
        borderCount,
        patternFabricCount: patternFabricImages.length,
        borderFabricIndices: borderCount > 0 ? `${fabricImages.length - borderCount} to ${fabricImages.length - 1}` : 'none'
      });

      const { patternForSvg, patternInstruction, patternId } = PromptBuilder.selectPattern(
        skillLevel,
        selectedPattern,
        patternFabricImages.length  // Use pattern fabric count, not total
      );

      PatternGenerationLogger.logRequestParameters(
        patternForSvg,
        patternId,
        skillLevel,
        patternFabricImages.length,  // Log pattern fabric count
        patternImageTypes,
        selectedPattern
      );

      const { base64s, mimeTypes } = await ImagePreparationService.prepare(patternFabricImages, patternImageTypes);

      const promptText = await PromptOrchestrator.buildPrompt(
        anthropic,
        patternFabricImages.length,  // Use pattern fabric count
        base64s,
        mimeTypes,
        patternForSvg,
        patternInstruction,
        skillLevel,
        patternId,
        roleAssignments,
        quiltSize
      );

      const imageContent = PromptBuilder.buildImageContent(base64s, mimeTypes);
      const responseText = await ClaudeApiClient.generatePattern(anthropic, promptText, imageContent);

      const parsedResponse = ResponseParser.parse(responseText);
      
      // Get pattern difficulty from pattern definition (not user's skill level)
      const patternDefinition = patternId ? getPatternById(patternId) : null;
      const patternDifficulty = patternDefinition?.skillLevel || skillLevel;
      
      // Pass ALL fabric images (pattern + border) to PatternBuilder
      // PatternBuilder will use parsedResponse (which only has pattern fabrics analyzed)
      // and will attach border configuration for PDF rendering
      const pattern = PatternBuilder.build(
        parsedResponse, 
        patternForSvg, 
        patternDifficulty, 
        fabricImages,  // ALL fabrics (pattern + border)
        quiltSize, 
        borderConfiguration
      );

      PatternGenerationLogger.logPatternSuccess(pattern, patternForSvg, parsedResponse);

      return pattern;
    } catch (error) {
      throw error;
    }
  }
}