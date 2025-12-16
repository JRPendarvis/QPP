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
   * Generate 4x4 grid of pattern blocks
   */
  private static generateBlocks(template: string, colors: string[]): string {
    let blocks = '';
    let colorIndex = 0;
    
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const x = col * 100;
        const y = row * 100;
        
        // Cycle through all available colors
        const color1 = colors[colorIndex % colors.length];
        const color2 = colors[(colorIndex + 1) % colors.length];
        const color3 = colors[(colorIndex + 2) % colors.length];
        
        // Replace color placeholders in template
        const blockTemplate = template
          .replace(/COLOR1/g, color1)
          .replace(/COLOR2/g, color2)
          .replace(/COLOR3/g, color3);
        
        blocks += `  <g transform="translate(${x},${y})">\n    ${blockTemplate.trim()}\n  </g>\n`;
        
        // Move to next color for variety
        colorIndex++;
      }
    }
    
    return blocks;
  }

  /**
   * Wrap blocks in SVG container
   */
  private static wrapSvg(blocks: string): string {
    return `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="#f8f8f8"/>
${blocks}</svg>`;
  }
}
