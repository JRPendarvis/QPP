import { PatternService } from '@/services/patternService';
import { ErrorHandler } from '@/utils/errorHandler';
import { PatternStateManager } from '@/utils/patternStateManager';
import { PatternGenerationResponse } from '@/types/PatternGenerationResponse';
import { QuiltPattern } from '@/types/QuiltPattern';

/**
 * Pattern generation workflow orchestrator
 * Single Responsibility: Execute complete pattern generation workflow
 */
export class PatternGenerationWorkflow {
  /**
   * Execute pattern generation with all state updates
   */
  static async execute(
    fabrics: File[],
    userSkillLevel: string,
    challengeMe: boolean,
    selectedPattern: string | undefined,
    quiltSize: string | undefined,
    callbacks: {
      onStart: () => void;
      onSuccess: (pattern: QuiltPattern) => void;
      onError: (error: string) => void;
      onComplete: () => void;
    }
  ): Promise<void> {
    callbacks.onStart();

    try {
      const response = await PatternService.generatePattern({
        fabrics,
        skillLevel: userSkillLevel,
        challengeMe,
        selectedPattern,
        quiltSize,
      });

      this.handleResponse(response, callbacks);
    } catch (err) {
      this.handleError(err, callbacks);
    } finally {
      callbacks.onComplete();
    }
  }

  /**
   * Handle API response
   */
  private static handleResponse(
    response: PatternGenerationResponse,
    callbacks: { onSuccess: (pattern: QuiltPattern) => void; onError: (error: string) => void }
  ): void {
    if (response.success && response.data) {
      PatternStateManager.handleSuccess(response, callbacks.onSuccess);
    } else {
      callbacks.onError(response.message || 'Failed to generate pattern');
    }
  }

  /**
   * Handle errors
   */
  private static handleError(
    err: unknown,
    callbacks: { onError: (error: string) => void }
  ): void {
    console.error('Pattern generation error:', err);
    callbacks.onError(ErrorHandler.parsePatternError(err));
  }
}
