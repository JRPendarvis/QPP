import PDFDocument from 'pdfkit';
import type { QuiltPattern } from '../../types/QuiltPattern';
import { renderPatternBlocks } from '../../utils/pdfPatternBlocks';

/**
 * Service for rendering PDF content sections
 * Single Responsibility: Description, fabric layout, and pattern visualization rendering
 */
export class PDFContentRenderer {
  /**
   * Render pattern visualization and blank block template
   */
  renderPatternVisualization(doc: InstanceType<typeof PDFDocument>, visualSvg: string): void {
    renderPatternBlocks(doc, visualSvg);
  }

  /**
   * Render description section
   */
  renderDescription(doc: InstanceType<typeof PDFDocument>, description: string): void {
    doc
      .fontSize(14)
      .fillColor('#111827')
      .font('Helvetica-Bold')
      .text('Pattern Description')
      .moveDown(0.5);

    doc
      .fontSize(10)
      .font('Helvetica')
      .fillColor('#374151')
      .text(description, { align: 'justify' })
      .moveDown(1);
  }

  /**
   * Render fabric layout section
   */
  renderFabricLayout(doc: InstanceType<typeof PDFDocument>, fabricLayout: string): void {
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .fillColor('#111827')
      .text('Fabric Layout')
      .moveDown(0.5);

    doc
      .fontSize(10)
      .font('Helvetica')
      .fillColor('#374151')
      .text(fabricLayout, { align: 'justify' })
      .moveDown(1.5);
  }

  /**
   * Render all content sections (visualization + description + fabric layout)
   */
  renderAllContentSections(doc: InstanceType<typeof PDFDocument>, pattern: QuiltPattern): void {
    this.renderPatternVisualization(doc, pattern.visualSvg);
    this.renderDescription(doc, pattern.description);
    this.renderFabricLayout(doc, pattern.fabricLayout);
  }
}
