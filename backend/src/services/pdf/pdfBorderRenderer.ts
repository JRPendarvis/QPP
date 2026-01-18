import PDFDocument from 'pdfkit';
import type { QuiltPattern } from '../../types/QuiltPattern';
import { BorderSizeCalculator } from '../../utils/borderSizeCalculator';

/**
 * Service for rendering border information in PDFs
 * Single Responsibility: Border section rendering
 */
export class PDFBorderRenderer {
  /**
   * Render border information section
   */
  renderBorderSection(doc: InstanceType<typeof PDFDocument>, pattern: QuiltPattern): void {
    console.log('🎨 [PDFBorderRenderer] Checking borders:', {
      hasBorderConfiguration: !!pattern.borderConfiguration,
      borderEnabled: pattern.borderConfiguration?.enabled,
      borderCount: pattern.borderConfiguration?.borders?.length || 0,
      borders: pattern.borderConfiguration?.borders
    });
    
    if (!pattern.borderConfiguration?.enabled || !pattern.borderConfiguration.borders.length) {
      console.log('⚠️ [PDFBorderRenderer] Skipping border rendering - not enabled or no borders');
      return;
    }

    console.log('✅ [PDFBorderRenderer] Rendering border section');
    const { borderConfiguration, borderDimensions } = pattern;
    
    // Section title
    doc
      .fontSize(14)
      .fillColor('#111827')
      .font('Helvetica-Bold')
      .text('Borders')
      .moveDown(0.5);

    // Size explanation
    if (borderDimensions) {
      doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor('#374151')
        .text(
          `Quilt Top Size: ${BorderSizeCalculator.formatSize(
            borderDimensions.quiltTopWidth,
            borderDimensions.quiltTopHeight
          )}`
        )
        .text(
          `Total Border Width: ${borderDimensions.totalBorderWidth}"`
        )
        .text(
          `Finished Size (with borders): ${BorderSizeCalculator.formatSize(
            borderDimensions.finishedWidth,
            borderDimensions.finishedHeight
          )}`,
          { continued: false }
        )
        .moveDown(0.5);
    }

    // Border details
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Border Cutting Instructions')
      .moveDown(0.3);

    const sortedBorders = [...borderConfiguration.borders].sort((a, b) => a.order - b.order);
    
    sortedBorders.forEach((border, index) => {
      const fabricRequirement = pattern.fabricRequirements?.find(
        req => req.role === `Border ${border.order}`
      );
      
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .fillColor('#4338ca')
        .text(`Border ${border.order} (${border.width}" width):`, { continued: true })
        .font('Helvetica')
        .fillColor('#374151')
        .text(` ${fabricRequirement?.description || 'See fabric requirements'}`)
        .moveDown(0.3);
      
      if (fabricRequirement?.inches) {
        const yards = (fabricRequirement.inches / 36).toFixed(2);
        doc
          .fontSize(9)
          .fillColor('#6b7280')
          .text(`  • Total length needed: ${fabricRequirement.inches}" (${yards} yards)`)
          .moveDown(0.2);
      }
    });

    doc.moveDown(1);
  }

  /**
   * Render size calculations with borders
   */
  renderSizeCalculations(
    doc: InstanceType<typeof PDFDocument>,
    quiltTopSize: string,
    totalBorderWidth: number,
    finishedSize: string
  ): void {
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#111827')
      .text('Size Calculations:')
      .moveDown(0.3);

    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor('#374151')
      .text(`  1. Quilt Top: ${quiltTopSize}`)
      .text(`  2. Add Borders: +${totalBorderWidth}" on all sides`)
      .text(`  3. Finished Size: ${finishedSize}`)
      .moveDown(1);
  }
}
