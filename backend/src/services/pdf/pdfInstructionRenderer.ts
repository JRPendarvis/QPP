import PDFDocument from 'pdfkit';

const RECOMMENDATION_NOTICE_PATTERN = /important:\s*this is only a recommendation\./i;
const INSTRUCTION_SOURCE_PATTERN = /^Instruction source:\s*/i;

type InstructionRenderParts = {
  recommendationNotice?: string;
  steps: string[];
};

/**
 * Service for rendering instruction sections in PDFs
 * Single Responsibility: Instruction rendering with status badges
 */
export class PDFInstructionRenderer {
  private splitInstructionContent(instructions: string[]): InstructionRenderParts {
    let recommendationNotice: string | undefined;
    const steps: string[] = [];

    instructions.forEach((instruction) => {
      const trimmedInstruction = instruction.trim();

      if (!trimmedInstruction) {
        return;
      }

      if (INSTRUCTION_SOURCE_PATTERN.test(trimmedInstruction)) {
        return;
      }

      if (!recommendationNotice && RECOMMENDATION_NOTICE_PATTERN.test(trimmedInstruction)) {
        recommendationNotice = trimmedInstruction
          .replace(/^📌\s*/u, '')
          .replace(/—/g, '-')
          .trim();
        return;
      }

      steps.push(trimmedInstruction);
    });

    return { recommendationNotice, steps };
  }

  private renderRecommendationNotice(doc: InstanceType<typeof PDFDocument>, recommendationNotice: string): void {
    const noticeY = doc.y;

    doc.roundedRect(50, noticeY, 495, 34, 6).stroke('#FCD34D');
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#92400E')
      .text('IMPORTANT', 60, noticeY + 6, { continued: true })
      .font('Helvetica')
      .text(` ${recommendationNotice.replace(/^IMPORTANT:\s*/i, '')}`, {
        width: 455,
      });

    doc.moveDown(1.2);
  }

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
    const { recommendationNotice, steps } = this.splitInstructionContent(instructions);

    if (recommendationNotice) {
      this.renderRecommendationNotice(doc, recommendationNotice);
    }

    this.renderSectionTitle(doc);
    this.renderSuccessBadge(doc, patternId);
    this.renderInstructions(doc, steps);
  }
}
