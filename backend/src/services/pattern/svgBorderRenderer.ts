import { BorderConfiguration } from '../../types/Border';
import { Fabric } from '../../types/Fabric';

/**
 * Service for rendering borders in SVG visual previews
 */
export class SvgBorderRenderer {
  /**
   * Generates SVG border rectangles around the quilt blocks
   * 
   * @param borderConfiguration - Border configuration with widths
   * @param allFabrics - All fabrics including border fabrics
   * @param quiltWidth - Width of quilt top (before borders)
   * @param quiltHeight - Height of quilt top (before borders)
   * @returns SVG string with border rectangles
   */
  static renderBorders(
    borderConfiguration: BorderConfiguration,
    allFabrics: Fabric[],
    quiltWidth: number = 300,
    quiltHeight: number = 400
  ): string {
    if (!borderConfiguration.enabled || !borderConfiguration.borders.length) {
      return '';
    }

    const borders = [...borderConfiguration.borders].sort((a, b) => a.order - b.order);
    let borderSvg = '';
    
    // Calculate cumulative border widths
    let cumulativeWidth = 0;
    
    borders.forEach((border) => {
      const borderFabric = allFabrics[border.fabricIndex];
      if (!borderFabric) {
        console.warn(`Border fabric at index ${border.fabricIndex} not found`);
        return;
      }

      // Calculate border position
      // Borders go AROUND the quilt, so each border is offset by previous borders
      const x = cumulativeWidth;
      const y = cumulativeWidth;
      const width = quiltWidth + (2 * cumulativeWidth) + (2 * border.width * 10); // Scale width for SVG units
      const height = quiltHeight + (2 * cumulativeWidth) + (2 * border.width * 10);
      
      // Get fill value (color or fabric pattern)
      const fillValue = this.getFillValue(borderFabric, allFabrics);
      
      // Create border as a frame (rectangle with hole in middle)
      borderSvg += `
  <!-- Border ${border.order}: ${border.width}" width -->
  <rect x="${x}" y="${y}" width="${width}" height="${height}" 
        fill="${fillValue}" stroke="#888" stroke-width="0.5"/>`;
      
      // Update cumulative width for next border
      cumulativeWidth += border.width * 10;
    });

    return borderSvg;
  }

  /**
   * Gets the fill value for a fabric (color or pattern reference)
   */
  private static getFillValue(fabric: Fabric, allFabrics: Fabric[]): string {
    if (fabric.type === 'printed' && fabric.image) {
      const index = allFabrics.indexOf(fabric);
      return `url(#fabricImage${index})`;
    }
    return fabric.color || '#CCCCCC';
  }
}
