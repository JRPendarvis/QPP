import Anthropic from '@anthropic-ai/sdk';
import { PromptBuilder } from './promptBuilder';
import { FabricAnalysisService } from '../ai/fabricAnalysisService';

/**
 * Orchestrates prompt building with optional role assignments
 */
export class PromptOrchestrator {
  /**
   * Builds appropriate prompt text based on role assignments
   * 
   * @param anthropic - Anthropic API client
   * @param fabricCount - Number of fabric images
   * @param base64s - Base64 encoded fabric images
   * @param mimeTypes - MIME types of images
   * @param patternForSvg - Pattern type for SVG generation
   * @param patternInstruction - Pattern instruction text
   * @param skillLevel - User's skill level
   * @param patternId - Optional pattern ID
   * @param roleAssignments - Optional role assignments for fabrics
   * @param quiltSize - Optional desired quilt size
   * @returns Prompt text for Claude API
   * 
   * @example
   * ```typescript
   * const prompt = await PromptOrchestrator.buildPrompt(
   *   anthropic,
   *   3,
   *   base64s,
   *   mimeTypes,
   *   'nine-patch',
   *   'Create a...',
   *   'beginner',
   *   'np-001',
   *   roleAssignments,
   *   'queen'
   * );
   * ```
   */
  static async buildPrompt(
    anthropic: Anthropic,
    fabricCount: number,
    base64s: string[],
    mimeTypes: string[],
    patternForSvg: string,
    patternInstruction: string,
    skillLevel: string,
    patternId: string | undefined,
    roleAssignments?: any,
    quiltSize?: string
  ): Promise<string> {
    if (!roleAssignments) {
      return PromptBuilder.buildPrompt(
        fabricCount,
        patternForSvg,
        patternInstruction,
        skillLevel,
        patternId,
        quiltSize
      );
    }

    const imageContent = PromptBuilder.buildImageContent(base64s, mimeTypes);
    const fabricAnalysis = await FabricAnalysisService.analyze(anthropic, imageContent);
    
    if (fabricAnalysis.length > 0) {
      return PromptBuilder.buildRoleSwapPrompt(
        fabricAnalysis,
        roleAssignments,
        patternForSvg,
        skillLevel,
        patternId,
        quiltSize
      );
    }

    return PromptBuilder.buildPrompt(
      fabricCount,
      patternForSvg,
      patternInstruction,
      skillLevel,
      patternId,
      quiltSize
    );
  }
}
