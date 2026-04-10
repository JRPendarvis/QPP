import PDFDocument from 'pdfkit';
import { drawSVGPatternOutline } from './pdfSvgUtils';

const BLOCK_VIEWBOX_SIZE = 100;

function extractFirstBlockSvg(visualSvg: string): string {
  const firstBlockGroupMatch = visualSvg.match(
    /<g\b[^>]*transform=['"][^'"]*translate\([^)]*\)[^'"]*['"][^>]*>[\s\S]*?<\/g>/i
  );

  if (!firstBlockGroupMatch) {
    return visualSvg;
  }

  return `<svg viewBox="0 0 ${BLOCK_VIEWBOX_SIZE} ${BLOCK_VIEWBOX_SIZE}" xmlns="http://www.w3.org/2000/svg">${firstBlockGroupMatch[0]}</svg>`;
}

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
    const singleBlockSvg = extractFirstBlockSvg(visualSvg);
    drawSVGPatternOutline(doc, singleBlockSvg);
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
