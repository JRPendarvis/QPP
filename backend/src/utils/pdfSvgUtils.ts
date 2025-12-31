import PDFDocument from 'pdfkit';

/**
 * Draws SVG rects on a PDF document. If outlineOnly is true, only strokes are drawn.
 */
export function drawSVGPattern(doc: InstanceType<typeof PDFDocument>, svgString: string, outlineOnly = false): void {
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
        doc.rect(x, y, width, height)
           .fillAndStroke(fill, '#000000');
      }
    }
  }

  // Move cursor past visualization
  doc.y = startY + 320;
}
