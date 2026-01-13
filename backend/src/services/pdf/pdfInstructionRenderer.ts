import PDFDocument from 'pdfkit';

/**
 * Service for rendering instruction sections in PDFs
 * Single Responsibility: Instruction rendering with status badges
 */
export class PDFInstructionRenderer {
  /**
   * Render section title
   */
  renderSectionTitle(doc: InstanceType<typeof PDFDocument>): void {
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .fillColor('#111827')
      .text('Step-by-Step Instructions')
      .moveDown(0.25);
  }

  /**
   * Render error badge for missing deterministic instructions
   */
  renderErrorBadge(doc: InstanceType<typeof PDFDocument>, patternId: string): void {
    const badgeY = doc.y;
    doc.rect(50, badgeY, 495, 28).stroke('#FCA5A5');

    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#B91C1C')
      .text(
        `ERROR: Deterministic instructions missing for "${patternId}". PDF generation blocked for MVP.`,
        60,
        badgeY + 8,
        { width: 475 }
      );
  }

  /**
   * Render success badge for deterministic instructions
   */
  renderSuccessBadge(doc: InstanceType<typeof PDFDocument>, patternId: string): void {
    const okBadgeY = doc.y;
    doc.rect(50, okBadgeY, 495, 22).stroke('#A7F3D0');
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#065F46')
      .text(`INSTRUCTIONS: DETERMINISTIC (patternId=${patternId})`, 60, okBadgeY + 6);

    doc.moveDown(1);
  }

  /**
   * Render instruction steps
   */
  renderInstructions(doc: InstanceType<typeof PDFDocument>, instructions: string[]): void {
    doc.fontSize(10).font('Helvetica').fillColor('#374151');

    instructions.forEach((instruction, index) => {
      const stepNumber = `${index + 1}.`;
      const cleanInstruction = instruction.replace(/^\d+[).)]\s*/, '');

      // Add new page if near bottom
      if (doc.y > 700) {
        doc.addPage();
      }

      doc
        .font('Helvetica-Bold')
        .text(stepNumber, { continued: true })
        .font('Helvetica')
        .text(` ${cleanInstruction}`, { align: 'justify' })
        .moveDown(0.5);
    });
  }

  /**
   * Render complete instruction section (title + badge + instructions)
   */
  renderCompleteInstructionSection(doc: InstanceType<typeof PDFDocument>, instructions: string[], patternId: string): void {
    this.renderSectionTitle(doc);
    this.renderSuccessBadge(doc, patternId);
    this.renderInstructions(doc, instructions);
  }
}
