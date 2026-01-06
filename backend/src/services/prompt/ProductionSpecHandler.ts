export interface ProductionQuiltSpec {
  blocksAcross: number;
  blocksDown: number;
  finishedBlockSizeInches: number;
  borders?: {
    leftInches: number;
    rightInches: number;
    topInches: number;
    bottomInches: number;
  } | null;
  sizeLabel?: string;
}

/**
 * Service responsible for handling production quilt specifications
 * and generating preview/production contracts.
 * 
 * Single Responsibility: Production spec formatting and contract generation
 */
export class ProductionSpecHandler {
  /**
   * Generate the preview contract text for the AI prompt
   */
  static generatePreviewContract(): string {
    return `
**QPP PREVIEW CONTRACT (MUST FOLLOW EXACTLY)**
- The on-screen quilt you are describing is ALWAYS a 3×4 PREVIEW grid (12 blocks) used only for visualization.
- The 3×4 preview is NOT the final quilt and MUST NOT be used to infer:
  - final quilt size (in inches)
  - total block counts beyond 12
  - borders
  - yardage
  - layouts like 6×8, 8×10, etc.
- If no Production Quilt Spec is provided:
  - Set "isPreviewOnly": true
  - Set "previewGrid": "3x4"
  - Set "productionGrid": null
  - Set "estimatedSize": "PREVIEW (3x4) — not final size"
  - Instructions MUST be limited to: (a) block construction, (b) how the 3×4 preview is arranged
  - Instructions MUST NOT include: border steps, quilt-top assembly beyond the 3×4 preview, total cut quantities for a full quilt, or any final dimensions in inches
- If a Production Quilt Spec IS provided:
  - Set "isPreviewOnly": false
  - Set "previewGrid": "3x4"
  - Set "productionGrid": "<blocksAcross>x<blocksDown>" from the spec
  - estimatedSize MUST be computed from the spec and MUST be mathematically consistent
  - Instructions MUST include cutting quantities and assembly steps for the production grid ONLY.
`;
  }

  /**
   * Generate production spec block for the AI prompt
   */
  static generateProductionBlock(productionSpec?: ProductionQuiltSpec): string {
    if (!productionSpec) {
      return `
**NO PRODUCTION QUILT SPEC PROVIDED**
- You MUST remain in PREVIEW mode only.
`;
    }

    return `
**PRODUCTION QUILT SPEC (YOU MUST OBEY THIS EXACTLY)**
- blocksAcross: ${productionSpec.blocksAcross}
- blocksDown: ${productionSpec.blocksDown}
- finishedBlockSizeInches: ${productionSpec.finishedBlockSizeInches}
- borders: ${productionSpec.borders ? JSON.stringify(productionSpec.borders) : 'null'}
- sizeLabel: ${productionSpec.sizeLabel ? `"${productionSpec.sizeLabel}"` : 'null'}

**PRODUCTION MATH RULES (MUST FOLLOW)**
- productionGrid = "${productionSpec.blocksAcross}x${productionSpec.blocksDown}"
- QuiltTopWidthInches  = blocksAcross × finishedBlockSizeInches
- QuiltTopHeightInches = blocksDown  × finishedBlockSizeInches
- If borders are provided:
  - FinalWidthInches  = QuiltTopWidthInches  + leftInches + rightInches
  - FinalHeightInches = QuiltTopHeightInches + topInches  + bottomInches
- "estimatedSize" MUST equal "FinalWidthInches x FinalHeightInches inches" (or quilt-top if borders are null)
- Do NOT invent different grids, sizes, or border widths.
`;
  }

  /**
   * Calculate estimated size from production spec
   */
  static calculateEstimatedSize(productionSpec?: ProductionQuiltSpec): string {
    if (!productionSpec) {
      return `"PREVIEW (3x4) — not final size"`;
    }

    const width = productionSpec.blocksAcross * productionSpec.finishedBlockSizeInches +
      (productionSpec.borders?.leftInches ?? 0) +
      (productionSpec.borders?.rightInches ?? 0);

    const height = productionSpec.blocksDown * productionSpec.finishedBlockSizeInches +
      (productionSpec.borders?.topInches ?? 0) +
      (productionSpec.borders?.bottomInches ?? 0);

    return `"${width}x${height} inches"`;
  }

  /**
   * Get production grid string
   */
  static getProductionGrid(productionSpec?: ProductionQuiltSpec): string {
    return productionSpec
      ? `"${productionSpec.blocksAcross}x${productionSpec.blocksDown}"`
      : 'null';
  }

  /**
   * Serialize production spec for JSON output
   */
  static serializeProductionSpec(productionSpec?: ProductionQuiltSpec): string {
    return productionSpec ? JSON.stringify(productionSpec) : 'null';
  }
}
