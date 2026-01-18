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
    
    // Track cumulative border width (how much we've added so far)
    let cumulativeWidth = 0;
    
    // Border fabrics are the LAST N fabrics in allFabrics array
    const patternFabricCount = allFabrics.length - borders.length;
    
    borders.forEach((border, index) => {
      // Get border fabric from the end of allFabrics array
      const borderFabricIndex = patternFabricCount + index;
      const borderFabric = allFabrics[borderFabricIndex];
      
      if (!borderFabric) {
        console.warn(`Border fabric at index ${borderFabricIndex} not found`);
        return;
      }
      
      console.log(`🎨 [SvgBorderRenderer] Border ${border.order}:`, {
        borderFabricIndex,
        fabricType: borderFabric.type,
        hasImage: !!borderFabric.image,
        color: borderFabric.color
      });

      // Scale border width for SVG units (1 inch = 10 SVG units for visualization)
      const scaledWidth = border.width * 10;
      
      // Get fill value (color or fabric pattern)
      const fillValue = this.getFillValue(borderFabric, borderFabricIndex);
      
      console.log(`🎨 [SvgBorderRenderer] Border ${border.order} fill:`, fillValue);
      
      // Calculate dimensions for this border frame
      // Borders wrap AROUND the quilt (negative offset from 0,0)
      // cumulative width is how far out this border sits from the quilt edge
      const borderOffset = -(cumulativeWidth + scaledWidth); // Negative to go outside quilt
      const totalWidth = quiltWidth + (2 * (cumulativeWidth + scaledWidth));
      const totalHeight = quiltHeight + (2 * (cumulativeWidth + scaledWidth));
      
      borderSvg += `
  <!-- Border ${border.order}: ${border.width}" width -->
  <!-- Top border strip -->
  <rect x="${borderOffset}" y="${borderOffset}" 
        width="${totalWidth}" height="${scaledWidth}" 
        fill="${fillValue}" stroke="#888" stroke-width="0.5"/>
  <!-- Bottom border strip -->
  <rect x="${borderOffset}" y="${quiltHeight + cumulativeWidth}" 
        width="${totalWidth}" height="${scaledWidth}" 
        fill="${fillValue}" stroke="#888" stroke-width="0.5"/>
  <!-- Left border strip -->
  <rect x="${borderOffset}" y="${borderOffset}" 
        width="${scaledWidth}" height="${totalHeight}" 
        fill="${fillValue}" stroke="#888" stroke-width="0.5"/>
  <!-- Right border strip -->
  <rect x="${quiltWidth + cumulativeWidth}" y="${borderOffset}" 
        width="${scaledWidth}" height="${totalHeight}" 
        fill="${fillValue}" stroke="#888" stroke-width="0.5"/>`;
      
      // Update cumulative width for next border
      cumulativeWidth += scaledWidth;
    });

    console.log(`🎨 [SvgBorderRenderer] Generated border SVG:`, {
      totalBorders: borders.length,
      totalCumulativeWidth: cumulativeWidth,
      svgLength: borderSvg.length,
      svgPreview: borderSvg.substring(0, 200),
      fullSvg: borderSvg
    });

    return borderSvg;
  }

  /**
   * Gets the fill value for a fabric (color or pattern reference)
   */
  private static getFillValue(fabric: Fabric, fabricIndex: number): string {
    if (fabric.type === 'printed' && fabric.image) {
      return `url(#fabricImage${fabricIndex})`;
    }
    return fabric.color || '#CCCCCC';
  }
}
