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

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export class ClaudeService {
  private _fabricImages: string[] = [];

  async generateQuiltPattern(
    fabricImages: string[],
    imageTypes: string[] = [],
    skillLevel: string = 'beginner',
    selectedPattern?: string,
    roleAssignments?: any
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
      const { patternForSvg, patternInstruction, patternId } = PromptBuilder.selectPattern(
        skillLevel,
        selectedPattern,
        fabricImages.length
      );

      PatternGenerationLogger.logRequestParameters(
        patternForSvg,
        patternId,
        skillLevel,
        fabricImages.length,
        imageTypes,
        selectedPattern
      );

      const { base64s, mimeTypes } = await ImagePreparationService.prepare(fabricImages, imageTypes);

      const promptText = await PromptOrchestrator.buildPrompt(
        anthropic,
        fabricImages.length,
        base64s,
        mimeTypes,
        patternForSvg,
        patternInstruction,
        skillLevel,
        patternId,
        roleAssignments
      );

      const imageContent = PromptBuilder.buildImageContent(base64s, mimeTypes);
      const responseText = await ClaudeApiClient.generatePattern(anthropic, promptText, imageContent);

      this._fabricImages = base64s;

      const parsedResponse = ResponseParser.parse(responseText);
      
      // Get pattern difficulty from pattern definition (not user's skill level)
      const patternDefinition = patternId ? getPatternById(patternId) : null;
      const patternDifficulty = patternDefinition?.skillLevel || skillLevel;
      
      const pattern = PatternBuilder.build(parsedResponse, patternForSvg, patternDifficulty, this._fabricImages);

      PatternGenerationLogger.logPatternSuccess(pattern, patternForSvg, parsedResponse);

      return pattern;
    } catch (error) {
      throw error;
    }
  }
}