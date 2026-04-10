import fs from 'node:fs';
import path from 'node:path';
import { PDFService } from '../src/services/pdf/pdfService';
import { SvgGenerator } from '../src/utils/svgGenerator';
import type { QuiltPattern } from '../src/types/QuiltPattern';
import type { Fabric } from '../src/types/Fabric';

async function main() {
  const fabrics: Fabric[] = [
    { color: '#F3E8FF', type: 'solid' },
    { color: '#2563EB', type: 'solid' },
    { color: '#059669', type: 'solid' },
    { color: '#F59E0B', type: 'solid' },
  ];

  const visualSvg = SvgGenerator.generateFromTemplate('pinwheel', fabrics);

  const samplePattern: QuiltPattern = {
    patternId: 'pinwheel',
    patternName: 'Sample Pinwheel',
    difficulty: 'Beginner',
    estimatedSize: '60x72 inches',
    description: 'Sample pattern generated to validate PDF rendering of blank block template.',
    fabricLayout: 'Use 4 fabrics in a balanced pinwheel layout.',
    visualSvg,
    instructions: [],
    fabricsByRole: {
      background: 'Background',
      primary: 'Primary',
      secondary: 'Secondary',
      accent: 'Accent',
    },
    fabricRequirements: [
      { role: 'Background', yards: 1.25, description: 'Background fabric' },
      { role: 'Primary', yards: 1.0, description: 'Primary fabric' },
      { role: 'Secondary', yards: 1.0, description: 'Secondary fabric' },
      { role: 'Accent', yards: 0.75, description: 'Accent fabric' },
    ],
  };

  const pdfService = new PDFService();
  const pdfBuffer = await pdfService.generatePatternPDF(samplePattern, 'Local Dev');

  const outputDir = path.resolve(__dirname, '../tmp');
  fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, 'sample-pinwheel2.pdf');
  fs.writeFileSync(outputPath, pdfBuffer);

  console.log(`PDF generated: ${outputPath}`);
  console.log(`PDF size: ${pdfBuffer.length} bytes`);
}

main().catch((err) => {
  console.error('Failed to generate sample PDF:', err);
  process.exit(1);
});
