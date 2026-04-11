import { generateInstructions } from '../instructions/generateInstructions';
import type { FabricAssignments } from '../instructions/fabricAssignments';
import { QuiltSizeCatalog } from './quiltSizeCatalog';

/**
 * Computes accurate fabric layout from pattern instructions
 */
export class LayoutComputer {
  /**
   * Computes accurate layout from pattern render instructions
   */
  static computeAccurateLayout(
    patternForSvg: string,
    estimatedSize: string,
    fabricNames: string[],
    requestedQuiltSize?: string
  ): string | null {
    const quiltSize = QuiltSizeCatalog.resolveDimensions(requestedQuiltSize, estimatedSize);

    const fabricAssignments: FabricAssignments = {
      namesBySlot: fabricNames.length > 0 
        ? fabricNames 
        : Array.from({ length: 2 }, (_, i) => `Fabric ${i + 1}`),
    };

    try {
      const instructionsResult = generateInstructions(
        patternForSvg.toLowerCase(),
        quiltSize,
        fabricAssignments
      );

      if (instructionsResult.kind !== 'generated') return null;

      const instructions = instructionsResult.instructions;

      const layoutLine = instructions.find(line => 
        line.toLowerCase().includes('layout:') ||
        line.toLowerCase().includes('computed layout') || 
        line.toLowerCase().includes('grid') ||
        (line.toLowerCase().includes('squares') && line.toLowerCase().includes('total'))
      );

      if (layoutLine) {
        return this.normalizeLayoutLine(layoutLine);
      }
    } catch (error) {
      console.error('Error computing accurate fabric layout:', error);
    }

    return null;
  }

  /**
   * Enhances layout by combining computed and Claude descriptions
   */
  static enhanceLayout(
    computedLayout: string | null,
    claudeLayout: string,
    fabricNames: string[]
  ): string {
    if (!computedLayout) {
      return claudeLayout || 'Arranged in a grid pattern';
    }

    const descriptive = this.extractDescriptiveElements(claudeLayout, fabricNames);
    
    if (descriptive) {
      return `${descriptive} ${computedLayout}`;
    }
    
    return computedLayout;
  }

  private static normalizeLayoutLine(layoutLine: string): string {
    const compact = layoutLine.replace(/\s+/g, ' ').trim();

    // Pinwheel deterministic format: Quilt size: ... Layout: 5 × 6 blocks ... Finished block size: 12" ...
    const layoutMatch = compact.match(/layout:\s*(\d+)\s*[×x]\s*(\d+)\s*blocks?/i);
    const blockSizeMatch = compact.match(/finished block size:\s*(\d+(?:\.\d+)?)\s*"?/i);
    const totalMatch = compact.match(/\((\d+)\s*total\)/i);

    if (layoutMatch && blockSizeMatch) {
      const cols = layoutMatch[1];
      const rows = layoutMatch[2];
      const blockSize = blockSizeMatch[1];
      const total = totalMatch?.[1] ?? String(parseInt(cols, 10) * parseInt(rows, 10));
      return `${cols}×${rows} grid of ${blockSize}" blocks (${total} total blocks)`;
    }

    return compact
      .replace('Computed layout: ', '')
      .replace(/^[^:]+:\s*/, '')
      .trim();
  }

  /**
   * Extracts descriptive elements from Claude's layout
   */
  private static extractDescriptiveElements(
    claudeLayout: string,
    fabricNames: string[]
  ): string | null {
    if (!claudeLayout) return null;

    const patterns = [
      /classic checkerboard alternation[^.]*\)/i,
      /checkerboard pattern with[^.]*\)/i,
      /alternating[^.]*squares/i,
    ];

    for (const pattern of patterns) {
      const match = claudeLayout.match(pattern);
      if (match) {
        let description = match[0].trim();
        if (!description.endsWith('.') && !description.endsWith(')')) {
          description += '.';
        }
        return description;
      }
    }

    if (claudeLayout.includes('(row+col=') || claudeLayout.includes('even positions')) {
      const sentences = claudeLayout.split('.');
      const descriptiveSentence = sentences.find(s => 
        s.includes('alternation') || s.includes('even positions') || s.includes('odd positions')
      );
      if (descriptiveSentence) {
        return descriptiveSentence.trim() + '.';
      }
    }

    return null;
  }
}
