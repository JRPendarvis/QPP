import { SVG_TEMPLATES } from '../config/quiltTemplates';

/**
 * SVG generation utilities for quilt patterns
 */
export class SvgGenerator {
  /**
   * Generate SVG from template with specified colors
   */
  static generateFromTemplate(patternType: string, colors: string[]): string {
    console.log('═══════════════════════════════════════════════════');
    console.log('🎨 SVG TEMPLATE GENERATION:');
    console.log(`  Requested Pattern: "${patternType}"`);
    console.log(`  Available Templates: ${Object.keys(SVG_TEMPLATES).join(', ')}`);
    
    const { template, templateUsed } = this.findTemplate(patternType);
    const normalizedColors = this.normalizeColors(colors);
    const blocks = this.generateBlocks(template, normalizedColors);
    
    return this.wrapSvg(blocks);
  }

  /**
   * Find appropriate template for pattern type
   */
  private static findTemplate(patternType: string): { template: string; templateUsed: string } {
    let template = SVG_TEMPLATES[patternType];
    let templateUsed = patternType;
    
    if (!template) {
      // Try to find a close match
      const templateKeys = Object.keys(SVG_TEMPLATES);
      const closeMatch = templateKeys.find(key => 
        key.toLowerCase().includes(patternType.toLowerCase()) ||
        patternType.toLowerCase().includes(key.toLowerCase())
      );
      
      if (closeMatch) {
        template = SVG_TEMPLATES[closeMatch];
        templateUsed = closeMatch;
        console.log(`  ⚠️ No exact match! Using close match: "${closeMatch}"`);
      } else {
        template = SVG_TEMPLATES['Simple Squares'];
        templateUsed = 'Simple Squares';
        console.log(`  ❌ No template found! Using fallback: "Simple Squares"`);
      }
    } else {
      console.log(`  ✅ Exact template match found: "${patternType}"`);
    }
    
    console.log(`  Template Being Used: "${templateUsed}"`);
    console.log(`  Template Content Preview: ${template.substring(0, 150)}...`);
    console.log('═══════════════════════════════════════════════════');
    
    return { template, templateUsed };
  }

  /**
   * Ensure minimum number of colors with fallbacks
   */
  private static normalizeColors(colors: string[]): string[] {
    if (colors.length < 2) {
      return [...colors, '#4A90A4', '#D4A574', '#8B7355'];
    }
    return colors;
  }

  /**
   * Generate 3x4 grid of pattern blocks (3 columns, 4 rows)
   */
  private static generateBlocks(template: string, colors: string[]): string {
    let blocks = '';
    
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        const x = col * 100;
        const y = row * 100;
        
        // Use colors in order
        const color1 = colors[0 % colors.length];
        const color2 = colors[1 % colors.length];
        const color3 = colors[2 % colors.length];
        
        // Random rotation (0, 90, 180, or 270 degrees) for variety
        const rotations = [0, 90, 180, 270];
        const rotation = rotations[Math.floor(Math.random() * rotations.length)];
        
        // Replace color placeholders in template
        let blockTemplate = template
          .replace(/COLOR1/g, color1)
          .replace(/COLOR2/g, color2)
          .replace(/COLOR3/g, color3);
        
        // Add subtle stroke for definition
        blockTemplate = blockTemplate.replace(/<rect /g, '<rect stroke="rgba(0,0,0,0.1)" stroke-width="0.5" ')
                                       .replace(/<polygon /g, '<polygon stroke="rgba(0,0,0,0.1)" stroke-width="0.5" ')
                                       .replace(/<path /g, '<path stroke="rgba(0,0,0,0.1)" stroke-width="0.5" ')
                                       .replace(/<circle /g, '<circle stroke="rgba(0,0,0,0.1)" stroke-width="0.5" ');
        
        // Apply rotation around block center (50, 50)
        const transform = rotation > 0 
          ? `translate(${x},${y}) rotate(${rotation} 50 50)`
          : `translate(${x},${y})`;
        
        blocks += `    <g transform="${transform}">\n      ${blockTemplate.trim()}\n    </g>\n`;
      }
    }
    
    return blocks;
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
   */
  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Wrap blocks in SVG container with enhanced styling
   */
  private static wrapSvg(blocks: string): string {
    return `<svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Subtle fabric texture -->
    <pattern id="fabricTexture" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
      <rect width="4" height="4" fill="rgba(255,255,255,0.02)"/>
      <circle cx="2" cy="2" r="0.5" fill="rgba(0,0,0,0.03)"/>
    </pattern>
    
    <!-- Soft shadow for depth -->
    <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="0.5"/>
      <feOffset dx="0.5" dy="0.5" result="offsetblur"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.15"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <!-- Quilting stitch effect -->
    <filter id="quilting">
      <feGaussianBlur in="SourceAlpha" stdDeviation="0.3"/>
      <feOffset dx="0.2" dy="0.2" result="offsetblur"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.2"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Clean white background -->
  <rect width="300" height="400" fill="#ffffff"/>
  
  <!-- Pattern blocks with enhanced styling -->
  <g filter="url(#quilting)">
${blocks}  </g>
  
  <!-- Subtle overall texture overlay -->
  <rect width="300" height="400" fill="url(#fabricTexture)" opacity="0.4"/>
</svg>`;
  }
}
