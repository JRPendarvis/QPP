import { SVG_TEMPLATES, SVG_TEMPLATES_BY_ID } from '../config/templates';
import { getPattern } from '../config/patterns';

/**
 * Represents a fabric used in quilt patterns.
 */
export type Fabric = {
  color: string;
  type: 'solid' | 'printed';
  image?: string;
};

/**
 * Represents the result of finding a template for a pattern type.
 */
type TemplateResult = {
  template: string;
  patternDef: ReturnType<typeof getPattern> | undefined;
};

export class SvgGenerator {
  /**
   * Generates an SVG string for a given pattern type and fabrics.
   * @param patternType The name of the quilt pattern.
   * @param fabrics Array of fabric objects.
   */
  static generateFromTemplate(patternType: string, fabrics: Fabric[]): string {
    const { template, patternDef } = this.findTemplate(patternType);
    if (!template) {
      throw new Error(`SVG template not found for pattern type: ${patternType}`);
    }
    if (!Array.isArray(fabrics) || fabrics.length === 0) {
      throw new Error('At least one fabric must be provided.');
    }
    const blocks = this.generateBlocksWithFabrics(template, fabrics, patternDef);
    const defs = this.buildImagePatterns(fabrics);
    return this.wrapSvg(blocks, defs);
  }


  /**
   * Generates SVG blocks for the quilt pattern using the provided fabrics.
   */
  private static generateBlocksWithFabrics(
    template: string,
    fabrics: Fabric[],
    patternDef?: ReturnType<typeof getPattern>
  ): string {
    let blocks = '';
    const canRotate = patternDef?.allowRotation ?? true;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        const blockIndex = row * 3 + col;
        const x = col * 100;
        const y = row * 100;
        let blockFabrics: Fabric[];
        if (patternDef?.getColors) {
          const colorArr = patternDef.getColors(fabrics.map(f => f.color), { blockIndex, row, col });
          blockFabrics = colorArr.map(color => fabrics.find(f => f.color === color) || fabrics[0]);
        } else {
          blockFabrics = fabrics.slice(0, Math.max(3, fabrics.length));
          while (blockFabrics.length < 8) {
            blockFabrics.push(fabrics[blockFabrics.length % fabrics.length]);
          }
        }
        let blockTemplate = (patternDef?.getTemplate)
          ? patternDef.getTemplate(blockFabrics.map(f => f.color))
          : template;
        for (let i = 0; i < 8; i++) {
          const fabric = blockFabrics[i] || fabrics[0];
          let fillValue = fabric.color;
          if (fabric.type === 'printed' && fabric.image) {
            fillValue = `url(#fabricImage${fabrics.indexOf(fabric)})`;
          }
          const colorPlaceholder = new RegExp(`COLOR${i + 1}`, 'g');
          blockTemplate = blockTemplate.replace(colorPlaceholder, fillValue);
        }
        blockTemplate = blockTemplate.replace(/<svg[^>]*>/gi, '').replace(/<\/svg>/gi, '');
        if (!blockTemplate.includes('stroke=')) {
          blockTemplate = blockTemplate
            .replace(/<rect /g, '<rect stroke="rgba(0,0,0,0.1)" stroke-width="0.5" ')
            .replace(/<polygon /g, '<polygon stroke="rgba(0,0,0,0.1)" stroke-width="0.5" ')
            .replace(/<path /g, '<path stroke="rgba(0,0,0,0.1)" stroke-width="0.5" ')
            .replace(/<circle /g, '<circle stroke="rgba(0,0,0,0.1)" stroke-width="0.5" ');
        }
        let transform: string;
        if (canRotate) {
          const rotations = [0, 90, 180, 270];
          const rotation = rotations[Math.floor(Math.random() * rotations.length)];
          transform = rotation > 0
            ? `translate(${x},${y}) rotate(${rotation} 50 50)`
            : `translate(${x},${y})`;
        } else {
          transform = `translate(${x},${y})`;
        }
        blocks += `    <g transform="${transform}">\n      ${blockTemplate.trim()}\n    </g>\n`;
      }
    }
    return blocks;
  }

  /**
   * Builds SVG <pattern> definitions for printed fabrics.
   */
  private static buildImagePatterns(fabrics: Fabric[]): string {
    let defs = '';
    fabrics.forEach((fabric, idx) => {
      if (fabric.type === 'printed' && fabric.image) {
        defs += `\n<pattern id="fabricImage${idx}" patternUnits="objectBoundingBox" width="1" height="1">` +
          `<image href="data:image/png;base64,${fabric.image}" x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" />` +
        `</pattern>`;
      }
    });
    return defs;
  }

  /**
   * Wraps SVG blocks and definitions into a complete SVG string.
   */
  private static wrapSvg(blocks: string, extraDefs: string = ''): string {
    return `<svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="fabricTexture" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
      <rect width="4" height="4" fill="rgba(255,255,255,0.02)"/>
      <circle cx="2" cy="2" r="0.5" fill="rgba(0,0,0,0.03)"/>
    </pattern>
    ${extraDefs}
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
  <rect width="300" height="400" fill="#ffffff"/>
  <g filter="url(#quilting)">
${blocks}  </g>
</svg>`;
  }


  /**
   * Normalizes a pattern type string to a pattern ID.
   */
  private static toPatternId(patternType: string): string {
    return patternType
      .toLowerCase()
      .replace(/['']/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-');
  }

  /**
   * Finds the SVG template and pattern definition for a given pattern type.
   */
  private static findTemplate(patternType: string): TemplateResult {
    const { normalizePatternId } = require('../controllers/patternController');
    const patternId = normalizePatternId(this.toPatternId(patternType));
    const patternDef = getPattern(patternId);
    let template: string | undefined;
    if (typeof SVG_TEMPLATES_BY_ID !== 'undefined' && SVG_TEMPLATES_BY_ID[patternId]) {
      template = SVG_TEMPLATES_BY_ID[patternId];
    } else if (SVG_TEMPLATES[patternType]) {
      template = SVG_TEMPLATES[patternType];
    } else {
      const templateKeys = Object.keys(SVG_TEMPLATES);
      const closeMatch = templateKeys.find(key =>
        key.toLowerCase().includes(patternType.toLowerCase()) ||
        patternType.toLowerCase().includes(key.toLowerCase())
      );
      if (closeMatch) {
        template = SVG_TEMPLATES[closeMatch];
      } else {
        template = SVG_TEMPLATES['Simple Squares'];
      }
    }
    return { template: template ?? '', patternDef };
  }


  /**
   * Shuffles an array using Fisher-Yates algorithm.
   */
  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
