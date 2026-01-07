import { QuiltPattern } from '@/types/QuiltPattern';

/**
 * Callback factory for pattern generation workflow
 * Single Responsibility: Create workflow callbacks from state setters
 */
export class WorkflowCallbackFactory {
  /**
   * Create callbacks for pattern generation workflow
   */
  static createPatternCallbacks(
    setGenerating: (value: boolean) => void,
    setError: (value: string) => void,
    setPattern: (value: QuiltPattern | null) => void
  ) {
    return {
      onStart: () => this.handleStart(setGenerating, setError, setPattern),
      onSuccess: setPattern,
      onError: setError,
      onComplete: () => this.handleComplete(setGenerating),
    };
  }

  /**
   * Handle workflow start
   */
  private static handleStart(
    setGenerating: (value: boolean) => void,
    setError: (value: string) => void,
    setPattern: (value: QuiltPattern | null) => void
  ): void {
    setGenerating(true);
    setError('');
    setPattern(null);
  }

  /**
   * Handle workflow completion
   */
  private static handleComplete(setGenerating: (value: boolean) => void): void {
    setGenerating(false);
  }
}
