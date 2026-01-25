import { renderInstructions as renderCheckerboardInstructions } from '../../config/patterns/checkerboard/renderInstructions';
import { renderInstructions as renderFourPatchInstructions } from '../../config/patterns/four-patch/renderInstructions';
import { renderInstructions as renderNinePatchInstructions } from '../../config/patterns/nine-patch/renderInstructions';

/**
 * Computes accurate fabric layout from pattern instructions
 */
export class LayoutComputer {
  private static readonly QUILT_SIZES = {
    baby: { widthIn: 36, heightIn: 52 },
    lap: { widthIn: 50, heightIn: 65 },
    twin: { widthIn: 66, heightIn: 90 },
    full: { widthIn: 80, heightIn: 90 },
    queen: { widthIn: 90, heightIn: 95 },
    king: { widthIn: 105, heightIn: 95 },
    default: { widthIn: 60, heightIn: 72 }
  };

  /**
   * Computes accurate layout from pattern render instructions
   */
  static computeAccurateLayout(
    patternForSvg: string,
    estimatedSize: string,
    fabricNames: string[],
    quiltSizeKey?: string
  ): string | null {
    const quiltSize = this.QUILT_SIZES[quiltSizeKey as keyof typeof this.QUILT_SIZES] 
      || this.QUILT_SIZES.default;

    const fabricAssignments = {
      namesBySlot: fabricNames.length > 0 
        ? fabricNames 
        : Array.from({ length: 2 }, (_, i) => `Fabric ${i + 1}`),
      slotsByRole: {}
    };

    try {
      const instructions = this.renderPatternInstructions(
        patternForSvg.toLowerCase(),
        quiltSize,
        fabricAssignments
      );

      if (!instructions) return null;

      const layoutLine = instructions.find(line => 
        line.toLowerCase().includes('computed layout') || 
        line.toLowerCase().includes('grid') ||
        (line.toLowerCase().includes('squares') && line.toLowerCase().includes('total'))
      );

      if (layoutLine) {
        return layoutLine
          .replace('Computed layout: ', '')
          .replace(/^[^:]+:\s*/, '')
          .trim();
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

  /**
   * Renders pattern-specific instructions
   */
  private static renderPatternInstructions(
    normalizedPattern: string,
    quiltSize: { widthIn: number; heightIn: number },
    fabricAssignments: any
  ): string[] | null {
    switch (normalizedPattern) {
      case 'checkerboard':
        return renderCheckerboardInstructions(quiltSize, fabricAssignments, {
          preferredFinishedBlockIn: [12, 10, 8]
        });
      case 'four-patch':
        return renderFourPatchInstructions(quiltSize, fabricAssignments);
      case 'nine-patch':
        return renderNinePatchInstructions(quiltSize, fabricAssignments, {
          finishedBlockIn: 12,
          squareFinishedIn: 4
        });
      default:
        return null;
    }
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
