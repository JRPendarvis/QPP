import { SVG_TEMPLATES, SVG_TEMPLATES_BY_ID } from '../config/quiltTemplates';
import { getPattern } from '../config/patterns';

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
    
    const { template, templateUsed, patternDef } = this.findTemplate(patternType);
    const normalizedColors = this.normalizeColors(colors);
    const blocks = this.generateBlocks(template, normalizedColors, patternDef);
    
    return this.wrapSvg(blocks);
  }

  /**
   * Convert display name to pattern ID
   * "Churn Dash" -> "churn-dash"
   * "Strip Quilt" -> "strip-quilt"
   * "Drunkard's Path" -> "drunkards-path"
   */
  private static toPatternId(patternType: string): string {
    return patternType
      .toLowerCase()
      .replace(/['']/g, '')     // Remove apostrophes
      .replace(/\s+/g, '-')     // Spaces to dashes
      .replace(/--+/g, '-');    // Collapse multiple dashes
  }

  /**
   * Find appropriate template for pattern type
   * Returns both the template string and the PatternDefinition (if available)
   */
  private static findTemplate(patternType: string): { 
    template: string; 
    templateUsed: string; 
    patternDef: ReturnType<typeof getPattern> | undefined;
  } {
    // Convert to pattern ID
    const patternId = this.toPatternId(patternType);
    console.log(`  Pattern ID: "${patternId}" (from "${patternType}")`);
    
    // Try to get PatternDefinition from new system
    const patternDef = getPattern(patternId);
    
    if (patternDef) {
      console.log(`  ✅ PatternDefinition found: "${patternDef.id}"`);
      console.log(`     - allowRotation: ${patternDef.allowRotation}`);
      console.log(`     - minColors: ${patternDef.minColors}, maxColors: ${patternDef.maxColors}`);
      console.log(`     - hasGetColors: ${!!patternDef.getColors}`);
      console.log(`     - hasGetTemplate: ${!!patternDef.getTemplate}`);
    } else {
      console.log(`  ⚠️ PatternDefinition NOT found for ID: "${patternId}"`);
    }

    // Try to find template (first by ID, then by display name)
    let template: string | undefined;
    let templateUsed: string;

    // 1. Try SVG_TEMPLATES_BY_ID first (if it exists)
    if (typeof SVG_TEMPLATES_BY_ID !== 'undefined' && SVG_TEMPLATES_BY_ID[patternId]) {
      template = SVG_TEMPLATES_BY_ID[patternId];
      templateUsed = patternId;
      console.log(`  ✅ Template found by ID: "${patternId}"`);
    }
    // 2. Try SVG_TEMPLATES by display name
    else if (SVG_TEMPLATES[patternType]) {
      template = SVG_TEMPLATES[patternType];
      templateUsed = patternType;
      console.log(`  ✅ Template found by display name: "${patternType}"`);
    }
    // 3. Try to find a close match
    else {
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
    }
    
    console.log(`  Template Being Used: "${templateUsed}"`);
    console.log(`  Template Preview: ${template.substring(0, 100)}...`);
    console.log('═══════════════════════════════════════════════════');
    
    return { template, templateUsed, patternDef };
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
  private static generateBlocks(
    template: string, 
    colors: string[],
    patternDef?: ReturnType<typeof getPattern>
  ): string {
    let blocks = '';
    
    // Determine if rotation is allowed for this pattern
    // Default to true for legacy patterns without PatternDefinition
    const canRotate = patternDef?.allowRotation ?? true;
    
    console.log(`🔄 Rotation for this pattern: ${canRotate ? 'ENABLED' : 'DISABLED'}`);
    if (patternDef) {
      console.log(`   (from PatternDefinition: ${patternDef.id})`);
    } else {
      console.log(`   (using default: true - no PatternDefinition found)`);
    }
    
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        const blockIndex = row * 3 + col;
        const x = col * 100;
        const y = row * 100;

        // Get colors for this block
        let blockColors: string[];
        if (patternDef?.getColors) {
          blockColors = patternDef.getColors(colors, { blockIndex, row, col });
        } else {
          // Default: use first 3 colors or cycle through available
          blockColors = colors.slice(0, Math.max(3, colors.length));
          // Pad with existing colors if needed
          while (blockColors.length < 8) {
            blockColors.push(colors[blockColors.length % colors.length]);
          }
        }

        // Use dynamic template if available
        let blockTemplate = (patternDef?.getTemplate)
          ? patternDef.getTemplate(blockColors)
          : template;
          
        // Replace up to 8 COLORn placeholders
        for (let i = 0; i < 8; i++) {
          const colorPlaceholder = new RegExp(`COLOR${i + 1}`, 'g');
          blockTemplate = blockTemplate.replace(colorPlaceholder, blockColors[i] || colors[i % colors.length] || colors[0]);
        }

        // Remove any nested <svg> tags from block templates
        blockTemplate = blockTemplate.replace(/<svg[^>]*>/gi, '').replace(/<\/svg>/gi, '');

        // Add subtle stroke for definition (if not already present)
        if (!blockTemplate.includes('stroke=')) {
          blockTemplate = blockTemplate
            .replace(/<rect /g, '<rect stroke="rgba(0,0,0,0.1)" stroke-width="0.5" ')
            .replace(/<polygon /g, '<polygon stroke="rgba(0,0,0,0.1)" stroke-width="0.5" ')
            .replace(/<path /g, '<path stroke="rgba(0,0,0,0.1)" stroke-width="0.5" ')
            .replace(/<circle /g, '<circle stroke="rgba(0,0,0,0.1)" stroke-width="0.5" ');
        }

        // Apply rotation around block center (50, 50) ONLY if pattern allows it
        let transform: string;
        if (canRotate) {
          const rotations = [0, 90, 180, 270];
          const rotation = rotations[Math.floor(Math.random() * rotations.length)];
          transform = rotation > 0 
            ? `translate(${x},${y}) rotate(${rotation} 50 50)`
            : `translate(${x},${y})`;
        } else {
          // NO ROTATION - just translate to position
          transform = `translate(${x},${y})`;
        }

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