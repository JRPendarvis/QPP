import PDFDocument from 'pdfkit';

/**
 * Extracts fabric image patterns from SVG <defs>
 */
function extractFabricPatterns(svgString: string): Map<string, string> {
  const patterns = new Map<string, string>();
  
  // Match pattern elements with embedded images
  const patternRegex = /<pattern id=['"]([^'"]+)['"][^>]*>[\s\S]*?<image href=['"]data:image\/[^;]+;base64,([^'"]+)['"][^>]*>[\s\S]*?<\/pattern>/g;
  
  let match;
  while ((match = patternRegex.exec(svgString)) !== null) {
    const patternId = match[1]; // e.g., "fabricImage0"
    const base64Data = match[2];
    patterns.set(patternId, base64Data);
  }
  
  return patterns;
}

/**
 * Draws SVG rects on a PDF document. If outlineOnly is true, only strokes are drawn.
 * Now supports rendering printed fabric patterns as images.
 */
export function drawSVGPattern(doc: InstanceType<typeof PDFDocument>, svgString: string, outlineOnly = false): void {
  // Extract fabric image patterns from SVG
  const fabricPatterns = extractFabricPatterns(svgString);
  
  // Extract rect elements from SVG
  const rectMatches = svgString.matchAll(/<rect[^>]+>/g);

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
        const fillMatch = rect.match(/fill=['"]([^'"]+)['"]/);
        const fill = fillMatch ? fillMatch[1] : '#FFFFFF';
        
        // Check if fill references a fabric pattern (e.g., "url(#fabricImage0)")
        const patternMatch = fill.match(/url\(#([^)]+)\)/);
        
        if (patternMatch && fabricPatterns.has(patternMatch[1])) {
          // Render fabric image pattern
          const base64Data = fabricPatterns.get(patternMatch[1])!;
          const imageBuffer = Buffer.from(base64Data, 'base64');
          
          try {
            // Draw the fabric image to fill the rectangle
            doc.image(imageBuffer, x, y, {
              fit: [width, height],
              align: 'center',
              valign: 'center'
            });
            // Add border for definition
            doc.rect(x, y, width, height).stroke('#000000');
          } catch (err) {
            console.error('Error rendering fabric pattern:', err);
            // Fallback to solid color
            doc.rect(x, y, width, height)
               .fillAndStroke('#CCCCCC', '#000000');
          }
        } else {
          // Render solid color
          doc.rect(x, y, width, height)
             .fillAndStroke(fill, '#000000');
        }
      }
    }
  }

  // Move cursor past visualization
  doc.y = startY + 320;
}
