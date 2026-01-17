// src/services/pdfService.ts

import PDFDocument from 'pdfkit';
import { QuiltPattern } from '../../types/QuiltPattern';
import { InstructionPreparationService } from './instructionPreparationService';
import { PDFHeaderRenderer } from './pdfHeaderRenderer';
import { PDFContentRenderer } from './pdfContentRenderer';
import { PDFInstructionRenderer } from './pdfInstructionRenderer';
import { PDFFooterRenderer } from './pdfFooterRenderer';
import { PDFBorderRenderer } from './pdfBorderRenderer';

/**
 * Service for generating pattern PDFs
 * Single Responsibility: Orchestrate PDF generation workflow
 * Delegates rendering to specialized services following Single Responsibility
 */
export class PDFService {
  private instructionPreparation: InstructionPreparationService;
  private headerRenderer: PDFHeaderRenderer;
  private contentRenderer: PDFContentRenderer;
  private instructionRenderer: PDFInstructionRenderer;
  private footerRenderer: PDFFooterRenderer;
  private borderRenderer: PDFBorderRenderer;

  constructor() {
    this.instructionPreparation = new InstructionPreparationService();
    this.headerRenderer = new PDFHeaderRenderer();
    this.contentRenderer = new PDFContentRenderer();
    this.instructionRenderer = new PDFInstructionRenderer();
    this.footerRenderer = new PDFFooterRenderer();
    this.borderRenderer = new PDFBorderRenderer();
  }

  async generatePatternPDF(pattern: QuiltPattern, userName: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'LETTER',
          margins: { top: 50, bottom: 50, left: 50, right: 50 },
        });

        const chunks: Buffer[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Render header and metadata
        this.headerRenderer.renderCompleteHeader(doc, pattern, userName);

        // Render content sections (visualization, description, fabric layout)
        this.contentRenderer.renderAllContentSections(doc, pattern);

        // Render border information if borders are enabled
        this.borderRenderer.renderBorderSection(doc, pattern);

        // Prepare and render instructions
        try {
          const preparedInstructions = this.instructionPreparation.prepareInstructions(pattern);
          this.instructionRenderer.renderCompleteInstructionSection(
            doc,
            preparedInstructions.instructions,
            preparedInstructions.patternId
          );
        } catch (err) {
          // Render error badge and reject
          this.instructionRenderer.renderSectionTitle(doc);
          this.instructionRenderer.renderErrorBadge(doc, 'unknown');
          console.error('[PDF ERROR] Deterministic instructions required but unavailable.', err);
          reject(err);
          return;
        }

        // Render footer
        this.footerRenderer.renderFooter(doc);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
