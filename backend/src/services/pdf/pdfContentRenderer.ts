import PDFDocument from 'pdfkit';
import type { QuiltPattern } from '../../types/QuiltPattern';
import { renderPatternBlocks } from '../../utils/pdfPatternBlocks';
import { LayoutComputer } from '../pattern/layoutComputer';
import { normalizePatternId } from '../../utils/patternNormalization';

/**
 * Service for rendering PDF content sections
 * Single Responsibility: Description, fabric layout, and pattern visualization rendering
 */
export class PDFContentRenderer {
  private resolveFabricLayoutForPdf(pattern: QuiltPattern): string {
    const rawPatternId =
      (pattern as any).patternId ??
      (pattern as any).id ??
      String(pattern.patternName || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-');

    const patternId = normalizePatternId(rawPatternId);

    const fabricNames = (pattern.fabricRequirements || [])
      .filter((req) => !['Backing', 'Batting', 'Binding'].includes(req.role))
      .map((req) => req.role);

    const computedLayout = LayoutComputer.computeAccurateLayout(
      patternId,
      pattern.estimatedSize,
      fabricNames,
      pattern.requestedQuiltSize
    );

    return LayoutComputer.enhanceLayout(computedLayout, pattern.fabricLayout, fabricNames);
  }

  /**
   * Render pattern visualization and blank block template
   */
  async renderPatternVisualization(doc: InstanceType<typeof PDFDocument>, visualSvg: string): Promise<void> {
    await renderPatternBlocks(doc, visualSvg);
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
  async renderAllContentSections(doc: InstanceType<typeof PDFDocument>, pattern: QuiltPattern): Promise<void> {
    await this.renderPatternVisualization(doc, pattern.visualSvg);
    this.renderDescription(doc, pattern.description);
    this.renderFabricLayout(doc, this.resolveFabricLayoutForPdf(pattern));
  }
}
