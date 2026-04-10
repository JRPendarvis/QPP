import PDFDocument from 'pdfkit';
import { ISvgRasterizer, SharpSvgRasterizer } from './svgRasterizer';

/**
 * Extracts fabric image patterns from SVG <defs>
 */
function extractFabricPatterns(svgString: string): Map<string, string> {
  const patterns = new Map<string, string>();
  
  // Parse individual <pattern> blocks so attribute order does not matter.
  const patternBlocks = svgString.matchAll(/<pattern\b[\s\S]*?<\/pattern>/g);

  for (const blockMatch of patternBlocks) {
    const block = blockMatch[0];
    const idMatch = block.match(/\bid=['"]([^'"]+)['"]/);
    const imageMatch = block.match(/(?:href|xlink:href)=['"]data:image\/[^;]+;base64,([^'"]+)['"]/);

    if (idMatch && imageMatch) {
      patterns.set(idMatch[1], imageMatch[1]);
    }
  }
  
  return patterns;
}

/**
 * Extract fill value from either fill="..." or style="fill:...".
 */
function extractFill(element: string): string {
  const fillMatch = element.match(/\bfill=['"]([^'"]+)['"]/);
  if (fillMatch) return fillMatch[1];

  const styleMatch = element.match(/\bstyle=['"]([^'"]+)['"]/);
  if (!styleMatch) return '#FFFFFF';

  const fillFromStyle = styleMatch[1].match(/(?:^|;)\s*fill\s*:\s*([^;]+)/i);
  return fillFromStyle ? fillFromStyle[1].trim() : '#FFFFFF';
}

function tryRenderPatternImage(
  doc: InstanceType<typeof PDFDocument>,
  base64Data: string,
  x: number,
  y: number,
  width: number,
  height: number
): boolean {
  try {
    const imageBuffer = Buffer.from(base64Data, 'base64');
    doc.image(imageBuffer, x, y, {
      fit: [width, height],
      align: 'center',
      valign: 'center'
    });
    return true;
  } catch (err) {
    console.error('Error rendering fabric pattern:', err);
    return false;
  }
}

function parsePolygonPoints(points: string, scale: number, startX: number, startY: number): Array<[number, number]> {
  return points
    .trim()
    .split(/\s+/)
    .map((pair) => pair.split(','))
    .filter((pair) => pair.length === 2)
    .map((pair) => [
      parseFloat(pair[0]) * scale + startX,
      parseFloat(pair[1]) * scale + startY,
    ] as [number, number])
    .filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
}

/**
 * Draws an outline-only (stroke) representation of the SVG blocks.
 * Used for the blank block template section of the PDF.
 */
export function drawSVGPatternOutline(doc: InstanceType<typeof PDFDocument>, svgString: string): void {
  const startX = 50 + (512 - 320) / 2; // Centered within 512pt usable width
  const startY = doc.y;

  drawSVGOutlineShapes(doc, svgString, startX, startY);

  // Move cursor past visualization
  doc.y = startY + 320;
}

/**
 * Renders the full SVG (with transforms and embedded images) as a rasterized image.
 * Accepts an optional ISvgRasterizer to allow swapping the imaging backend
 * (e.g. in tests) without modifying this module (Dependency Inversion).
 */
export async function drawSVGPatternAsync(
  doc: InstanceType<typeof PDFDocument>,
  svgString: string,
  rasterizer: ISvgRasterizer = new SharpSvgRasterizer()
): Promise<void> {
  const startY = doc.y;

  // Page width 612pt (LETTER), margins 50+50=100pt → usable 512pt
  const pageUsableWidth = 512;
  const maxHeight = 320;

  const { fitWidth, fitHeight } = getSvgFitDimensions(svgString, pageUsableWidth, maxHeight);

  // Center the image horizontally within the usable area (left margin 50pt)
  const startX = 50 + (pageUsableWidth - fitWidth) / 2;

  try {
    const pngBuffer = await rasterizer.rasterize(Buffer.from(svgString));
    doc.image(pngBuffer, startX, startY, {
      fit: [fitWidth, fitHeight],
      align: 'center',
      valign: 'center',
    });
  } catch (err) {
    console.error('Error rasterizing SVG for PDF, falling back to manual renderer:', err);
    // Fallback keeps export working if rasterization fails in a specific environment.
    drawSVGOutlineShapes(doc, svgString, startX, startY, false);
  }

  // Move cursor past visualization
  doc.y = startY + fitHeight + 10;
}

function getSvgFitDimensions(svgString: string, maxWidth = 320, maxHeight = 320): { fitWidth: number; fitHeight: number } {
  const viewBoxMatch = svgString.match(/viewBox=['"]([^'"]+)['"]/i);
  if (!viewBoxMatch) {
    return { fitWidth: maxWidth, fitHeight: maxHeight };
  }

  const parts = viewBoxMatch[1].trim().split(/\s+/).map(Number);
  if (parts.length !== 4 || !parts.every(Number.isFinite)) {
    return { fitWidth: maxWidth, fitHeight: maxHeight };
  }

  const viewBoxWidth = Math.abs(parts[2]) || 1;
  const viewBoxHeight = Math.abs(parts[3]) || 1;

  if (viewBoxWidth / viewBoxHeight >= maxWidth / maxHeight) {
    return { fitWidth: maxWidth, fitHeight: (viewBoxHeight / viewBoxWidth) * maxWidth };
  }

  return { fitWidth: (viewBoxWidth / viewBoxHeight) * maxHeight, fitHeight: maxHeight };
}

function drawSVGOutlineShapes(
  doc: InstanceType<typeof PDFDocument>,
  svgString: string,
  startX: number,
  startY: number,
  outlineOnly = true
): void {
  // Extract fabric image patterns from SVG
  const fabricPatterns = extractFabricPatterns(svgString);
  
  // Extract shape elements from SVG
  const rectMatches = svgString.matchAll(/<rect[^>]+>/g);
  const polygonMatches = svgString.matchAll(/<polygon[^>]+>/g);
  const scale = 0.8;

  for (const match of rectMatches) {
    const rect = match[0];

    const xMatch = rect.match(/x=['"]([^'"]+)['"]/);
    const yMatch = rect.match(/y=['"]([^'"]+)['"]/);
    const widthMatch = rect.match(/width=['"]([^'"]+)['"]/);
    const heightMatch = rect.match(/height=['"]([^'"]+)['"]/);

    if (xMatch && yMatch && widthMatch && heightMatch) {
      const x = parseFloat(xMatch[1]) * scale + startX;
      const y = parseFloat(yMatch[1]) * scale + startY;
      const width = parseFloat(widthMatch[1]) * scale;
      const height = parseFloat(heightMatch[1]) * scale;
      
      if (outlineOnly) {
        doc.rect(x, y, width, height)
           .stroke('#888888');
      } else {
        const fill = extractFill(rect);
        
        // Check if fill references a fabric pattern (e.g., "url(#fabricImage0)")
        const patternMatch = fill.match(/url\(#([^)]+)\)/);
        
        if (patternMatch && fabricPatterns.has(patternMatch[1])) {
          // Render fabric image pattern
          const base64Data = fabricPatterns.get(patternMatch[1])!;

          const rendered = tryRenderPatternImage(doc, base64Data, x, y, width, height);
          if (rendered) {
            // Add border for definition
            doc.rect(x, y, width, height).stroke('#000000');
          } else {
            // Fallback to solid color
            doc.rect(x, y, width, height)
               .fillAndStroke('#CCCCCC', '#000000');
          }
        } else if (fill.startsWith('url(')) {
          // Unknown pattern reference fallback
          doc.rect(x, y, width, height)
             .fillAndStroke('#CCCCCC', '#000000');
        } else {
          // Render solid color
          doc.rect(x, y, width, height)
             .fillAndStroke(fill, '#000000');
        }
      }
    }
  }

  for (const match of polygonMatches) {
    const polygon = match[0];
    const pointsMatch = polygon.match(/\bpoints=['"]([^'"]+)['"]/);
    if (!pointsMatch) continue;

    const points = parsePolygonPoints(pointsMatch[1], scale, startX, startY);
    if (points.length < 3) continue;

    if (outlineOnly) {
      doc.polygon(...points).stroke('#888888');
      continue;
    }

    const fill = extractFill(polygon);
    const patternMatch = fill.match(/url\(#([^)]+)\)/);

    if (patternMatch && fabricPatterns.has(patternMatch[1])) {
      const base64Data = fabricPatterns.get(patternMatch[1])!;
      const xs = points.map(([x]) => x);
      const ys = points.map(([, y]) => y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);

      doc.save();
      doc.polygon(...points).clip();
      const rendered = tryRenderPatternImage(doc, base64Data, minX, minY, maxX - minX, maxY - minY);
      doc.restore();

      if (rendered) {
        doc.polygon(...points).stroke('#000000');
      } else {
        doc.polygon(...points).fillAndStroke('#CCCCCC', '#000000');
      }
    } else if (fill.startsWith('url(')) {
      doc.polygon(...points).fillAndStroke('#CCCCCC', '#000000');
    } else {
      doc.polygon(...points).fillAndStroke(fill, '#000000');
    }
  }

}
