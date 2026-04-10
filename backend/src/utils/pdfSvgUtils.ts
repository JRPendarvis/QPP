import PDFDocument from 'pdfkit';

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
 * Draws SVG rects on a PDF document. If outlineOnly is true, only strokes are drawn.
 * Now supports rendering printed fabric patterns as images.
 */
export function drawSVGPattern(doc: InstanceType<typeof PDFDocument>, svgString: string, outlineOnly = false): void {
  // Extract fabric image patterns from SVG
  const fabricPatterns = extractFabricPatterns(svgString);
  
  // Extract shape elements from SVG
  const rectMatches = svgString.matchAll(/<rect[^>]+>/g);
  const polygonMatches = svgString.matchAll(/<polygon[^>]+>/g);

  const startX = 200; // Center offset
  const startY = doc.y;
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

  // Move cursor past visualization
  doc.y = startY + 320;
}
