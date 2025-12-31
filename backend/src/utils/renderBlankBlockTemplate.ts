import PDFDocument from 'pdfkit';
import { drawSVGPattern } from './pdfSvgUtils';

/**
 * Renders the blank block template section in the PDF.
 */
export function renderBlankBlockTemplate(doc: InstanceType<typeof PDFDocument>, visualSvg: string) {
  doc.fontSize(14)
    .font('Helvetica-Bold')
    .fillColor('#111827')
    .text('Blank Block Template')
    .moveDown(0.5);
  try {
    drawSVGPattern(doc, visualSvg, true); // true = outline only
    doc.moveDown(1.5);
  } catch (err) {
    console.error('Error drawing blank SVG:', err);
    doc.fontSize(10)
      .font('Helvetica')
      .fillColor('#6B7280')
      .text('(Blank block template available in web app)', { align: 'center' })
      .moveDown(1);
  }
}
