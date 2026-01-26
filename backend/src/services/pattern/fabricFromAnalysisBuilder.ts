import { Fabric } from '../../types/ClaudeResponse';
import { FabricTypeNormalizer } from './fabricTypeNormalizer';

/**
 * Builds fabric objects from Claude fabric analysis data
 */
export class FabricFromAnalysisBuilder {
  /**
   * Builds fabrics from analysis with fallback colors and images
   */
  static build(
    fabricAnalysis: any[],
    fabricColors: string[],
    fabricImages: string[]
  ): Fabric[] {
    return fabricAnalysis.map((fa: any, idx) => {
      const rawType = fa.type || fa.fabricType;
      const normalizedType = FabricTypeNormalizer.normalize(rawType);
      
      return {
        color: fa.dominantColor || fabricColors[idx] || '#CCCCCC',
        type: normalizedType,
        image: fabricImages[idx] || '',
      };
    });
  }
}
