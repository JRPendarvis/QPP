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
      console.log('🎨 [Frontend] Pattern data received:', {
        hasPattern: !!response.data.pattern,
        hasVisualSvg: !!response.data.pattern?.visualSvg,
        visualSvgLength: response.data.pattern?.visualSvg?.length || 0,
        visualSvgPreview: response.data.pattern?.visualSvg?.substring(0, 100) || 'EMPTY',
        patternKeys: response.data.pattern ? Object.keys(response.data.pattern) : []
      });
      
      setPattern(response.data.pattern);
      this.logPatternReceived(response.data.pattern);
    }
  }

  /**
   * Log pattern received confirmation
   */
  private static logPatternReceived(pattern: QuiltPattern): void {
    console.log('✅ Pattern received:', pattern.patternName);
    console.log('✅ Pattern ID:', pattern.id);
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
