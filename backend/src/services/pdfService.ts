// src/services/pdfService.ts

import PDFDocument from 'pdfkit';
import { QuiltPattern } from '../types/QuiltPattern';
import { renderPatternBlocks } from '../utils/pdfPatternBlocks';

import { generateInstructions } from './instructions/generateInstructions';
import { parseQuiltSizeIn } from '../utils/parseQuiltSize';

export class PDFService {
  async generatePatternPDF(pattern: QuiltPattern, userName: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'LETTER',
          margins: { top: 50, bottom: 50, left: 50, right: 50 },
        });

        // Collect PDF chunks
        const chunks: Buffer[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Header
        doc
          .fontSize(24)
          .font('Helvetica-Bold')
          .fillColor('#4F46E5')
          .text('QuiltPlannerPro', { align: 'center' })
          .moveDown(0.5);

        // Pattern Name
        doc
          .fontSize(20)
          .fillColor('#111827')
          .text(pattern.patternName, { align: 'center' })
          .moveDown(1);

        // Metadata Box
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

        // Pattern Visualization & Blank Block Template Sections
        renderPatternBlocks(doc, pattern.visualSvg);

        // Description Section
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
          .text(pattern.description, { align: 'justify' })
          .moveDown(1);

        // Fabric Layout Section
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
          .text(pattern.fabricLayout, { align: 'justify' })
          .moveDown(1.5);

        // Instructions Section
        doc
          .fontSize(14)
          .font('Helvetica-Bold')
          .fillColor('#111827')
          .text('Step-by-Step Instructions')
          .moveDown(0.25);

        // ---------------------------------------
        // Deterministic instructions (if supported)
        // ---------------------------------------
        let instructionsToPrint: string[] = pattern.instructions ?? [];
        let instructionSource: 'deterministic' | 'fallback' = 'fallback';

        try {
          // Prefer explicit patternId; fall back to id/name if needed.
          const patternId =
            (pattern as any).patternId ??
            (pattern as any).id ??
            String(pattern.patternName || '')
              .trim()
              .toLowerCase()
              .replace(/\s+/g, '-');

          const quiltSize = parseQuiltSizeIn(pattern.estimatedSize);

          // Fabrics must be structured. Do NOT parse prose.
          // Best: provide this on the pattern object when calling PDFService.
          const fabricsByRole =
            (pattern as any).fabricsByRole ?? {
              background: 'Background fabric',
              primary: 'Primary fabric',
              secondary: 'Secondary fabric',
              accent: 'Accent fabric',
            };

          const res = generateInstructions(patternId, quiltSize, fabricsByRole);
          if (res.kind === 'generated') {
            instructionsToPrint = res.instructions;
            instructionSource = 'deterministic';
          }
        } catch {
          // If deterministic generation fails for any reason,
          // fall back to pattern.instructions (existing behavior).
        }

        // Source marker (small, subtle)
        doc
          .fontSize(9)
          .font('Helvetica-Oblique')
          .fillColor('#6B7280')
          .text(
            instructionSource === 'deterministic'
              ? '(Generated from pattern plan — deterministic)'
              : '(Generated from pattern description — fallback)',
            { align: 'left' }
          )
          .moveDown(0.5);

        doc.fontSize(10).font('Helvetica').fillColor('#374151');

        instructionsToPrint.forEach((instruction, index) => {
          const stepNumber = `${index + 1}.`;
          const cleanInstruction = instruction.replace(/^\d+[).)]\s*/, '');

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

        // Footer (must be before doc.end())
        if (typeof (doc as any).flushPages === 'function') {
          (doc as any).flushPages();
        }

        const pageCount = (doc as any).bufferedPageRange().count;
        if (pageCount > 0) {
          for (let i = 0; i < pageCount; i++) {
            try {
              (doc as any).switchToPage(i);
              doc
                .fontSize(8)
                .fillColor('#9CA3AF')
                .text(
                  `Generated by QuiltPlannerPro on ${new Date().toLocaleDateString()} | Page ${i + 1} of ${pageCount}`,
                  50,
                  750,
                  { align: 'center', width: 495 }
                );
            } catch (err) {
              // Prevent crash if page is not available
              console.error(`Footer: switchToPage(${i}) failed:`, err);
            }
          }
        }

        // Finalize PDF
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
