import { BorderConfiguration } from '../../types/Border';
import { QuiltSizeCatalog } from './quiltSizeCatalog';
import sharp from 'sharp';

/**
 * Unique-quilt generator.
 * Builds a level-aware unique composition without selecting a predefined quilt pattern.
 */
export class UniqueQuiltGenerationService {
  private static readonly DEFAULT_COLORS = ['#E5E7EB', '#C084FC', '#34D399', '#F59E0B', '#60A5FA', '#F87171'];
  private static readonly ROLE_NAMES = ['Background', 'Primary', 'Secondary', 'Accent'];
  private static readonly SEAM_ALLOWANCE_IN = 0.25;

  async generateUniqueQuiltPattern(
    fabricImages: string[],
    skillLevel: string,
    quiltSize?: string,
    borderConfiguration?: BorderConfiguration
  ): Promise<any> {
    const borderCount = borderConfiguration?.enabled ? borderConfiguration.borders.length : 0;
    const patternFabricImages = borderCount > 0
      ? fabricImages.slice(0, Math.max(1, fabricImages.length - borderCount))
      : fabricImages;

    const patternColors = await this.extractDominantColors(patternFabricImages);
    const allColors = await this.extractDominantColors(fabricImages);
    const dimensions = QuiltSizeCatalog.resolveDimensions(quiltSize);
    const estimatedSize = QuiltSizeCatalog.formatDisplaySize(dimensions);
    const normalizedSkill = this.normalizeSkillLevel(skillLevel);
    const grid = this.getGridForSkill(normalizedSkill);
    const seed = this.randomInt(1_000_000, 9_999_999);
    const variantCounts = this.calculateVariantCounts(seed, grid.rows, grid.cols);

    const visualSvg = this.buildUniqueSvg(
      patternFabricImages,
      patternColors,
      normalizedSkill,
      borderConfiguration,
      allColors,
      seed
    );

    const fabricRequirements = this.buildFabricRequirements(
      dimensions.widthIn,
      dimensions.heightIn,
      patternColors,
      borderConfiguration
    );

    return {
      patternId: 'unique',
      patternName: `Unique ${this.capitalize(normalizedSkill)} Quilt`,
      description: `A one-of-a-kind quilt composition generated for your ${normalizedSkill} skill level.`,
      fabricLayout: 'Unique layout generated from your fabrics and skill level without choosing a predefined quilt pattern.',
      selectionRationale: {
        mode: 'unique',
        reason: `Generated a non-catalog quilt composition by combining your fabric color values and ${normalizedSkill} complexity targets.`,
        targetSkillLevel: normalizedSkill,
      },
      difficulty: this.capitalize(normalizedSkill),
      estimatedSize,
      instructions: this.buildUniqueInstructions(
        normalizedSkill,
        dimensions.widthIn,
        dimensions.heightIn,
        grid.cols,
        grid.rows,
        borderConfiguration,
        variantCounts
      ),
      visualSvg,
      requestedQuiltSize: quiltSize,
      fabricRequirements,
      fabricImages,
      ...(borderConfiguration ? { borderConfiguration } : {}),
      meta: {
        isUnique: true,
        uniqueVersion: 'v2',
      },
    };
  }

  private normalizeSkillLevel(skillLevel?: string): 'beginner' | 'intermediate' | 'advanced' {
    const level = (skillLevel || 'beginner').toLowerCase();
    if (level === 'advanced') {
      return 'advanced';
    }
    if (level === 'intermediate') {
      return 'intermediate';
    }
    return 'beginner';
  }

  private buildUniqueSvg(
    fabricImages: string[],
    colors: string[],
    skillLevel: 'beginner' | 'intermediate' | 'advanced',
    borderConfiguration?: BorderConfiguration,
    allColors?: string[],
    seed?: number
  ): string {
    const width = 300;
    const height = 400;
    const palette = colors.length > 0 ? colors : UniqueQuiltGenerationService.DEFAULT_COLORS;
    const resolvedSeed = seed ?? this.randomInt(1_000_000, 9_999_999);

    const grid = this.getGridForSkill(skillLevel);
    const cellW = width / grid.cols;
    const cellH = height / grid.rows;

    const fabricDefs = this.buildFabricDefs(fabricImages);
    const hasFabricDefs = fabricImages.length > 0;

    let bodySvg = '';
    for (let row = 0; row < grid.rows; row += 1) {
      for (let col = 0; col < grid.cols; col += 1) {
        const x = col * cellW;
        const y = row * cellH;
        const tileSeed = resolvedSeed + row * 997 + col * 383;
        const c1 = palette[(row + col) % palette.length];
        const c2 = palette[(row * 2 + col + 1) % palette.length];
        const c3 = palette[(row + col * 3 + 2) % palette.length];
        const variant = tileSeed % 3;
        const fabricRefA = hasFabricDefs ? `url(#uq-fabric-${(row + col) % fabricImages.length})` : c1;
        const fabricRefB = hasFabricDefs ? `url(#uq-fabric-${(row * 2 + col + 1) % fabricImages.length})` : c2;
        const fabricRefC = hasFabricDefs ? `url(#uq-fabric-${(row + col * 3 + 2) % fabricImages.length})` : c3;

        if (variant === 0) {
          bodySvg += `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${cellW.toFixed(2)}" height="${cellH.toFixed(2)}" fill="${fabricRefA}"/>`;
          bodySvg += `<rect x="${(x + cellW * 0.2).toFixed(2)}" y="${(y + cellH * 0.2).toFixed(2)}" width="${(cellW * 0.6).toFixed(2)}" height="${(cellH * 0.6).toFixed(2)}" fill="${fabricRefB}" opacity="0.8"/>`;
        } else if (variant === 1) {
          bodySvg += `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${cellW.toFixed(2)}" height="${cellH.toFixed(2)}" fill="${fabricRefA}"/>`;
          bodySvg += `<polygon points="${x.toFixed(2)},${y.toFixed(2)} ${(x + cellW).toFixed(2)},${y.toFixed(2)} ${(x + cellW).toFixed(2)},${(y + cellH).toFixed(2)}" fill="${fabricRefB}" opacity="0.85"/>`;
          bodySvg += `<polygon points="${x.toFixed(2)},${y.toFixed(2)} ${x.toFixed(2)},${(y + cellH).toFixed(2)} ${(x + cellW).toFixed(2)},${(y + cellH).toFixed(2)}" fill="${fabricRefC}" opacity="0.75"/>`;
        } else {
          const cx = x + cellW / 2;
          const cy = y + cellH / 2;
          bodySvg += `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${cellW.toFixed(2)}" height="${cellH.toFixed(2)}" fill="${fabricRefA}"/>`;
          bodySvg += `<polygon points="${cx.toFixed(2)},${(y + cellH * 0.1).toFixed(2)} ${(x + cellW * 0.9).toFixed(2)},${cy.toFixed(2)} ${cx.toFixed(2)},${(y + cellH * 0.9).toFixed(2)} ${(x + cellW * 0.1).toFixed(2)},${cy.toFixed(2)}" fill="${fabricRefB}" opacity="0.8"/>`;
        }
      }
    }

    const borderSvg = this.buildBorderSvg(width, height, borderConfiguration, allColors || palette);

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%" role="img" aria-label="Unique quilt preview">
  <defs>${fabricDefs}</defs>
  <rect x="0" y="0" width="${width}" height="${height}" fill="#ffffff"/>
  ${bodySvg}
  ${borderSvg}
</svg>`;
  }

  private buildFabricDefs(fabricImages: string[]): string {
    if (!fabricImages.length) {
      return '';
    }

    return fabricImages
      .map((image, index) => {
        const href = image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`;
        return `<pattern id="uq-fabric-${index}" patternUnits="userSpaceOnUse" width="40" height="40"><image href="${href}" x="0" y="0" width="40" height="40" preserveAspectRatio="xMidYMid slice"/></pattern>`;
      })
      .join('');
  }

  private buildBorderSvg(
    width: number,
    height: number,
    borderConfiguration: BorderConfiguration | undefined,
    colors: string[]
  ): string {
    if (!borderConfiguration?.enabled || borderConfiguration.borders.length === 0) {
      return '';
    }

    const totalBorderWidthIn = borderConfiguration.borders.reduce((sum, border) => sum + border.width, 0);
    const maxPixelWidth = Math.min(width, height) * 0.2;
    const pxPerIn = totalBorderWidthIn > 0 ? maxPixelWidth / totalBorderWidthIn : 0;

    let inset = 0;
    let svg = '';

    const sortedBorders = [...borderConfiguration.borders].sort((a, b) => a.order - b.order);
    sortedBorders.forEach((border, index) => {
      const strokeWidth = Math.max(1, border.width * pxPerIn);
      const color = colors[(border.fabricIndex + index) % colors.length] || '#D1D5DB';
      const x = inset + strokeWidth / 2;
      const y = inset + strokeWidth / 2;
      const w = Math.max(0, width - (inset + strokeWidth / 2) * 2);
      const h = Math.max(0, height - (inset + strokeWidth / 2) * 2);

      svg += `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${w.toFixed(2)}" height="${h.toFixed(2)}" fill="none" stroke="${color}" stroke-width="${strokeWidth.toFixed(2)}"/>`;
      inset += strokeWidth;
    });

    return svg;
  }

  private buildFabricRequirements(
    widthIn: number,
    heightIn: number,
    patternColors: string[],
    borderConfiguration?: BorderConfiguration
  ): Array<{ role: string; yards: number; description: string; inches?: number }> {
    const areaInSq = widthIn * heightIn;
    const quiltTopYards = areaInSq / 1296;
    const totalYards = quiltTopYards * 1.25;

    const splits = [0.45, 0.3, 0.15, 0.1];
    const roleCount = Math.max(1, Math.min(patternColors.length, UniqueQuiltGenerationService.ROLE_NAMES.length));

    const requirements: Array<{ role: string; yards: number; description: string; inches?: number }> = Array.from({ length: roleCount }, (_, index) => {
      const split = splits[index] || (1 / roleCount);
      const yards = Math.max(0.25, Number((totalYards * split).toFixed(2)));
      return {
        role: UniqueQuiltGenerationService.ROLE_NAMES[index],
        yards,
        description: `${this.capitalize(UniqueQuiltGenerationService.ROLE_NAMES[index].toLowerCase())} fabric for unique layout pieces`,
      };
    });

    if (borderConfiguration?.enabled && borderConfiguration.borders.length > 0) {
      const perimeterIn = (widthIn + heightIn) * 2;
      borderConfiguration.borders.forEach((border, index) => {
        const inches = Math.ceil(perimeterIn + border.width * 8);
        requirements.push({
          role: `Border ${index + 1}`,
          yards: Number((inches / 36).toFixed(2)),
          inches,
          description: `${border.width}\" wide strips`,
        });
      });
    }

    return requirements;
  }

  private buildUniqueInstructions(
    skillLevel: 'beginner' | 'intermediate' | 'advanced',
    quiltWidthIn: number,
    quiltHeightIn: number,
    cols: number,
    rows: number,
    borderConfiguration: BorderConfiguration | undefined,
    variantCounts: { simpleSquares: number; halfSquareTriangles: number; diamondPoints: number }
  ): string[] {
    const complexityNotes: Record<'beginner' | 'intermediate' | 'advanced', string> = {
      beginner: 'Use chain piecing in short rows to keep assembly simple and organized.',
      intermediate: 'Build and label sections before final assembly to keep orientation consistent.',
      advanced: 'Assemble in quadrants and verify directional seams before joining all sections.',
    };

    const finishedBlockWidth = this.roundToQuarter(quiltWidthIn / cols);
    const finishedBlockHeight = this.roundToQuarter(quiltHeightIn / rows);
    const cutBlockWidth = this.roundToQuarter(finishedBlockWidth + (UniqueQuiltGenerationService.SEAM_ALLOWANCE_IN * 2));
    const cutBlockHeight = this.roundToQuarter(finishedBlockHeight + (UniqueQuiltGenerationService.SEAM_ALLOWANCE_IN * 2));
    const totalBlocks = cols * rows;

    const borderSummary = borderConfiguration?.enabled && borderConfiguration.borders.length > 0
      ? `Add ${borderConfiguration.borders.length} border${borderConfiguration.borders.length === 1 ? '' : 's'} after the quilt center is assembled.`
      : 'No borders configured for this layout.';

    return [
      'OVERVIEW',
      `Finished quilt size: ${this.formatNumber(quiltWidthIn)}" x ${this.formatNumber(quiltHeightIn)}" with a ${rows} x ${cols} block grid (${totalBlocks} total blocks).`,
      `Finished block size: ${this.formatNumber(finishedBlockWidth)}" x ${this.formatNumber(finishedBlockHeight)}".`,
      '',
      'CUTTING',
      `Cut each base block at ${this.formatNumber(cutBlockWidth)}" x ${this.formatNumber(cutBlockHeight)}" (includes 1/4" seam allowance on all sides).`,
      `Cutting plan: Cut ${totalBlocks} base rectangles and sort into Background/Primary/Secondary/Accent groups using the fabric requirements yardage table.`,
      'Sort fabrics by value (light, medium, dark) before cutting to preserve contrast in the unique layout.',
      '',
      'PATTERN TYPES USED',
      `Simple Squares (${variantCounts.simpleSquares} blocks): Piece as full square units and keep seam direction consistent within each row.`,
      `Half-Square Triangles (${variantCounts.halfSquareTriangles} blocks): Pair two fabrics and stitch on the diagonal seam line so triangles stay mirrored where possible.`,
      `Diamond Points (${variantCounts.diamondPoints} blocks): Center the diamond motif in each block and trim/square the unit before row assembly.`,
      '',
      'PIECING',
      `Piece ${rows} rows with ${cols} blocks per row. Press seams in alternating directions for adjacent rows so intersections nest cleanly.`,
      'Arrange blocks on a design wall and photograph placement before final stitching to preserve the intended value flow.',
      complexityNotes[skillLevel],
      '',
      'ROW ASSEMBLY',
      `Assemble each row left-to-right (${cols} blocks per row), then staystitch row edges if bias seams are present from triangle blocks.`,
      'Label rows from top to bottom before joining to preserve layout order.',
      '',
      'QUILT ASSEMBLY',
      `Join rows in sequence to complete the quilt center, then square to ${this.formatNumber(quiltWidthIn)}" x ${this.formatNumber(quiltHeightIn)}" before quilting.`,
      '',
      'BORDERS',
      borderSummary,
      '',
      'FINISHING',
      'Complete quilt top, layer with batting/backing, quilt as desired, then bind.',
    ];
  }

  private getGridForSkill(skillLevel: 'beginner' | 'intermediate' | 'advanced'): { cols: number; rows: number } {
    const complexityBySkill: Record<'beginner' | 'intermediate' | 'advanced', { cols: number; rows: number }> = {
      beginner: { cols: 6, rows: 8 },
      intermediate: { cols: 8, rows: 10 },
      advanced: { cols: 10, rows: 12 },
    };

    return complexityBySkill[skillLevel];
  }

  private calculateVariantCounts(seed: number, rows: number, cols: number): { simpleSquares: number; halfSquareTriangles: number; diamondPoints: number } {
    let simpleSquares = 0;
    let halfSquareTriangles = 0;
    let diamondPoints = 0;

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const tileSeed = seed + row * 997 + col * 383;
        const variant = tileSeed % 3;

        if (variant === 0) {
          simpleSquares += 1;
        } else if (variant === 1) {
          halfSquareTriangles += 1;
        } else {
          diamondPoints += 1;
        }
      }
    }

    return { simpleSquares, halfSquareTriangles, diamondPoints };
  }

  private roundToQuarter(value: number): number {
    return Math.round(value * 4) / 4;
  }

  private formatNumber(value: number): string {
    return Number.isInteger(value) ? `${value}` : value.toFixed(2).replace(/\.00$/, '');
  }

  private async extractDominantColors(fabricImages: string[]): Promise<string[]> {
    const colors: string[] = [];

    for (let i = 0; i < fabricImages.length; i += 1) {
      const fallback = UniqueQuiltGenerationService.DEFAULT_COLORS[i % UniqueQuiltGenerationService.DEFAULT_COLORS.length];
      const image = fabricImages[i];

      try {
        if (!image || typeof image !== 'string') {
          colors.push(fallback);
          continue;
        }

        const buffer = Buffer.from(image, 'base64');
        const stats = await sharp(buffer).stats();
        const dominant = stats.dominant;

        if (!dominant) {
          colors.push(fallback);
          continue;
        }

        colors.push(this.rgbToHex(dominant.r, dominant.g, dominant.b));
      } catch {
        colors.push(fallback);
      }
    }

    if (colors.length === 0) {
      return [UniqueQuiltGenerationService.DEFAULT_COLORS[0]];
    }

    return colors;
  }

  private rgbToHex(r: number, g: number, b: number): string {
    const toHex = (value: number) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

}
