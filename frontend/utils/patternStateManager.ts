import { PatternGenerationResponse } from '@/types/PatternGenerationResponse';
import { QuiltPattern } from '@/types/QuiltPattern';

/**
 * Pattern state management utilities
 * Single Responsibility: Pattern state operations
 */
export class PatternStateManager {
  /**
   * Handle successful pattern generation response
   */
  static handleSuccess(
    response: PatternGenerationResponse,
    setPattern: (pattern: QuiltPattern) => void
  ): void {
    if (response.success && response.data) {
      setPattern(response.data.pattern);
    }
  }

  /**
   * Reset pattern state with scroll to top
   */
  static resetWithScroll(
    fabricCount: number,
    setPattern: (pattern: null) => void,
    setError: (error: string) => void,
    setGenerating: (generating: boolean) => void
  ): void {
    console.log('🔄 Reset pattern - keeping', fabricCount, 'fabrics');
    setPattern(null);
    setError('');
    setGenerating(false);

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }
}
