import PDFDocument from 'pdfkit';
import type { QuiltPattern } from '../../types/QuiltPattern';

/**
 * Service for rendering PDF header and metadata sections
 * Single Responsibility: Header and metadata box rendering
 */
export class PDFHeaderRenderer {
  /**
   * Render header with title
   */
  renderHeader(doc: InstanceType<typeof PDFDocument>): void {
    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .fillColor('#4F46E5')
      .text('QuiltPlannerPro', { align: 'center' })
      .moveDown(0.5);
  }

  /**
   * Render pattern name title
   */
  renderPatternName(doc: InstanceType<typeof PDFDocument>, patternName: string): void {
    doc
      .fontSize(20)
      .fillColor('#111827')
      .text(patternName, { align: 'center' })
      .moveDown(1);
  }

  /**
   * Render metadata box with difficulty, size, and user name
   */
  renderMetadataBox(doc: InstanceType<typeof PDFDocument>, pattern: QuiltPattern, userName: string): void {
    doc.fontSize(10).fillColor('#6B7280').font('Helvetica');

    const metadataY = doc.y;
    doc.rect(50, metadataY, 495, 60).stroke('#E5E7EB');

    doc
      .fontSize(10)
      .fillColor('#374151')
      .text(`Difficulty: ${pattern.difficulty}`, 60, metadataY + 10)
      .text(`Size: ${pattern.estimatedSize}`, 60, metadataY + 25)
      .text(`Created for: ${userName}`, 60, metadataY + 40);

    doc.moveDown(2);
  }

  /**
   * Render complete header section (header + pattern name + metadata)
   */
  renderCompleteHeader(doc: InstanceType<typeof PDFDocument>, pattern: QuiltPattern, userName: string): void {
    this.renderHeader(doc);
    this.renderPatternName(doc, pattern.patternName);
    this.renderMetadataBox(doc, pattern, userName);
  }
}
