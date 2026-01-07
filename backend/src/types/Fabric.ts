/**
 * Represents a fabric used in quilt patterns.
 */
export type Fabric = {
  /** Hex color code or CSS color value */
  color: string;
  
  /** Type of fabric - solid color or printed pattern */
  type: 'solid' | 'printed';
  
  /** Optional base64-encoded image data for printed fabrics */
  image?: string;
};
