import PDFDocument from 'pdfkit';
import { drawSVGPattern } from './pdfSvgUtils';

/**
 * Renders the colored pattern visualization section in the PDF.
 */
export function renderPatternVisualization(doc: InstanceType<typeof PDFDocument>, visualSvg: string) {
  doc.fontSize(14)
    .font('Helvetica-Bold')
    .fillColor('#111827')
    .text('Pattern Visualization')
    .moveDown(0.5);
  try {
    drawSVGPattern(doc, visualSvg);
    doc.moveDown(1.5);
  } catch (err) {
    console.error('Error drawing SVG:', err);
    doc.fontSize(10)
      .font('Helvetica')
      .fillColor('#6B7280')
      .text('(Pattern visualization available in web app)', { align: 'center' })
      .moveDown(1);
  }
}
