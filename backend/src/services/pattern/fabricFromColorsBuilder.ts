import { Fabric } from '../../types/ClaudeResponse';

/**
 * Builds fabric objects from color data only
 */
export class FabricFromColorsBuilder {
  /**
   * Builds fabrics from colors with optional images
   */
  static build(
    fabricColors: string[],
    fabricImages: string[]
  ): Fabric[] {
    return fabricColors.map((color, idx) => ({
      color: color,
      type: 'solid' as const,
      image: fabricImages[idx] || '',
    }));
  }
}
