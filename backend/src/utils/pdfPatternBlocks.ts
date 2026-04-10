
import PDFDocument from 'pdfkit';

import { renderPatternVisualization } from './renderPatternVisualization';
import { renderBlankBlockTemplate } from './renderBlankBlockTemplate';

/**
 * Renders both the pattern visualization and blank block template sections in the PDF.
 */
export async function renderPatternBlocks(doc: InstanceType<typeof PDFDocument>, visualSvg: string) {
  if (visualSvg && visualSvg.includes('svg')) {
    await renderPatternVisualization(doc, visualSvg);
    renderBlankBlockTemplate(doc, visualSvg);
  }
}
