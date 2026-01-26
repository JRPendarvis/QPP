/**
 * Normalizes fabric type strings to standard values
 */
export class FabricTypeNormalizer {
  /**
   * Normalizes fabric type to 'printed' or 'solid'
   */
  static normalize(rawType: string | undefined): 'printed' | 'solid' {
    if (!rawType) {
      return 'solid';
    }

    return rawType.toLowerCase() === 'printed' ? 'printed' : 'solid';
  }
}
