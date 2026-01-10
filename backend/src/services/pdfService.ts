// src/services/pdfService.ts

import PDFDocument from 'pdfkit';
import { QuiltPattern } from '../types/QuiltPattern';
import { renderPatternBlocks } from '../utils/pdfPatternBlocks';

import { generateInstructions } from './instructions/generateInstructions';
import { parseQuiltSizeIn } from '../utils/parseQuiltSize';
import type { FabricAssignments } from './instructions/fabricAssignments';

export class PDFService {
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
        // Deterministic instructions (MVP: REQUIRED)
        // ---------------------------------------
        let resolvedPatternId = 'unknown';
        let instructionsToPrint: string[] = [];

        try {
          resolvedPatternId =
            (pattern as any).patternId ??
            (pattern as any).id ??
            String(pattern.patternName || '')
              .trim()
              .toLowerCase()
              .replace(/\s+/g, '-');

          const quiltSize = parseQuiltSizeIn(pattern.estimatedSize);

          // MUST be structured. Do NOT parse prose.
          const fabricsByRole =
            (pattern as any).fabricsByRole ?? {
              background: 'Background fabric',
              primary: 'Primary fabric',
              secondary: 'Secondary fabric',
              accent: 'Accent fabric',
            };

          console.log('[PDF DEBUG] resolvedPatternId =', resolvedPatternId);
          console.log('[PDF DEBUG] estimatedSize =', pattern.estimatedSize);
          console.log('[PDF DEBUG] fabricsByRole =', fabricsByRole);

          // Convert types for generateInstructions
          const fabricAssignments: FabricAssignments = {
            namesBySlot: [
              fabricsByRole.background || 'Background fabric',
              fabricsByRole.primary || 'Primary fabric',
              fabricsByRole.secondary || 'Secondary fabric',
              fabricsByRole.accent || 'Accent fabric',
            ],
          };

          const res = generateInstructions(
            resolvedPatternId,
            { widthIn: quiltSize.width, heightIn: quiltSize.height },
            fabricAssignments
          );

          if (res.kind !== 'generated') {
            throw new Error(
              `Deterministic instructions not available for patternId="${resolvedPatternId}". ` +
                `Refusing to fall back to LLM instructions.`
            );
          }

          instructionsToPrint = res.instructions;

          console.log(
            `[PDF] patternId=${resolvedPatternId} instructionSource=deterministic steps=${instructionsToPrint.length}`
          );
        } catch (err) {
          // Big visible badge AND fail request
          const badgeY = doc.y;

          doc.rect(50, badgeY, 495, 28).stroke('#FCA5A5');

          doc
            .fontSize(10)
            .font('Helvetica-Bold')
            .fillColor('#B91C1C')
            .text(
              `ERROR: Deterministic instructions missing for "${resolvedPatternId}". PDF generation blocked for MVP.`,
              60,
              badgeY + 8,
              { width: 475 }
            );

          console.error('[PDF ERROR] Deterministic instructions required but unavailable.', err);

          reject(err);
          return;
        }

        // Green badge: deterministic used
        const okBadgeY = doc.y;
        doc.rect(50, okBadgeY, 495, 22).stroke('#A7F3D0');
        doc
          .fontSize(10)
          .font('Helvetica-Bold')
          .fillColor('#065F46')
          .text('INSTRUCTIONS: DETERMINISTIC (PLAN-BASED)', 60, okBadgeY + 6);

        doc.moveDown(1);

        // Instructions body
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
            } catch (footerErr) {
              console.error(`Footer: switchToPage(${i}) failed:`, footerErr);
            }
          }
        }

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
