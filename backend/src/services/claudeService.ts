import Anthropic from '@anthropic-ai/sdk';
import { RetryHandler } from '../utils/retryHandler';
import { PromptBuilder } from './promptBuilder';
import { ImagePreparationService } from './imagePreparationService';
import { ResponseParser } from './responseParser';
import { PatternBuilder } from './patternBuilder';
import { PatternGenerationLogger } from './patternGenerationLogger';
import { ClaudeApiClient } from './claudeApiClient';
import { PromptOrchestrator } from './promptOrchestrator';
import { QuiltPattern } from '../types/QuiltPattern';

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
      const pattern = PatternBuilder.build(parsedResponse, patternForSvg, skillLevel, this._fabricImages);

      PatternGenerationLogger.logPatternSuccess(pattern, patternForSvg, parsedResponse);

      return pattern;
    } catch (error) {
      throw error;
    }
  }
}