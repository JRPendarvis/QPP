import { PatternService } from '@/services/patternService';
import { ErrorHandler } from '@/utils/errorHandler';
import { PatternStateManager } from '@/utils/patternStateManager';
import { PatternGenerationResponse } from '@/types/PatternGenerationResponse';
import { QuiltPattern } from '@/types/QuiltPattern';
import { AxiosError } from 'axios';

/**
 * Pattern generation workflow orchestrator
 * Single Responsibility: Execute complete pattern generation workflow
 */
export class PatternGenerationWorkflow {
  private static readonly KNOWN_CATALOG_PATTERN_NAMES = new Set([
    'simple squares',
    'strip quilt',
    'checkerboard',
    'rail fence',
    'four patch',
    'nine patch',
    'half square triangles',
    'hourglass',
    'bow tie',
    'flying geese',
    'pinwheel',
    'log cabin',
    'sawtooth star',
    'ohio star',
    'kaleidoscope star',
    'churn dash',
    'lone star',
    'mariners compass',
    'new york beauty',
    'storm at sea',
    'drunkards path',
    'mosaic star',
    'grandmothers flower garden',
    'double wedding ring',
    'pickle dish',
    'complex medallion',
  ]);

  private static isUniqueRequest(selectedPattern: string | undefined): boolean {
    return (selectedPattern || '').toLowerCase().includes('unique');
  }

  private static isCatalogLikePattern(pattern: QuiltPattern): boolean {
    const patternAny = pattern as any;
    const patternId = String(patternAny?.patternId || '').toLowerCase();
    const patternName = String(pattern?.patternName || '').toLowerCase();

    if (patternId && patternId !== 'unique') {
      return true;
    }

    return this.KNOWN_CATALOG_PATTERN_NAMES.has(patternName);
  }

  private static async fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Failed to read fabric image'));
      reader.readAsDataURL(file);
    });
  }

  private static resolveQuiltSizeEstimate(quiltSize?: string): { totalYards: number; estimatedSize: string } {
    const key = (quiltSize || 'default').toLowerCase();
    const map: Record<string, { totalYards: number; estimatedSize: string }> = {
      baby: { totalYards: 1.85, estimatedSize: '36x52 inches' },
      lap: { totalYards: 3.15, estimatedSize: '50x65 inches' },
      twin: { totalYards: 5.75, estimatedSize: '66x90 inches' },
      full: { totalYards: 6.95, estimatedSize: '80x90 inches' },
      queen: { totalYards: 8.3, estimatedSize: '90x95 inches' },
      king: { totalYards: 9.7, estimatedSize: '105x95 inches' },
      default: { totalYards: 4.5, estimatedSize: '60x72 inches' },
    };

    return map[key] || map.default;
  }

  private static async buildClientUniqueFallbackPattern(userSkillLevel: string, fabrics: File[], quiltSize?: string): Promise<QuiltPattern> {
    const normalizedSkill = (userSkillLevel || 'beginner').toLowerCase();
    const width = 300;
    const height = 400;
    const runtimeSeed = `${Date.now()}-${Math.random()}-${fabrics.map((file) => file.name).join('|')}`;
    const hashSeed = runtimeSeed.split('').reduce((acc, ch) => ((acc * 33) ^ ch.charCodeAt(0)) >>> 0, 5381);
    let rngState = hashSeed || 1;
    const seededRandom = () => {
      rngState = (rngState * 1664525 + 1013904223) >>> 0;
      return rngState / 4294967296;
    };
    const normalizedTier = normalizedSkill === 'expert'
      ? 'advanced'
      : (normalizedSkill === 'intermediate' || normalizedSkill === 'advanced')
        ? normalizedSkill
        : 'beginner';

    const gridByTier: Record<string, { cols: number; rows: number }> = {
      beginner: { cols: 4, rows: 6 },
      intermediate: { cols: 5, rows: 7 },
      advanced: { cols: 6, rows: 8 },
    };

    const blockPoolByTier: Record<string, string[]> = {
      beginner: ['Simple Square', 'Four Patch', 'Rail Fence', 'Strip Quilt'],
      intermediate: ['Four Patch', 'Nine Patch', 'Half-Square Triangles', 'Flying Geese', 'Log Cabin'],
      // Keep advanced fallback aligned to motifs the SVG renderer actually draws.
      advanced: ['Nine Patch', 'Log Cabin', 'Rail Fence', 'Four Patch', 'Half-Square Triangles', 'Flying Geese'],
    };

    const selectedGrid = gridByTier[normalizedTier] || gridByTier.beginner;
    const pool = blockPoolByTier[normalizedTier] || blockPoolByTier.beginner;
    const selectedCount = Math.max(2, Math.min(4, pool.length, (hashSeed % 3) + 2));
    const selectedBlocks = [...pool]
      .map((name) => ({ name, rank: name.split('').reduce((acc, ch) => ((acc * 31) ^ ch.charCodeAt(0)) >>> 0, hashSeed) }))
      .sort((a, b) => a.rank - b.rank)
      .slice(0, selectedCount)
      .map((entry) => entry.name);

    const cols = selectedGrid.cols;
    const rows = selectedGrid.rows;
    const cellW = width / cols;
    const cellH = height / rows;
    const palette = ['#E5E7EB', '#60A5FA', '#34D399', '#F59E0B', '#F87171', '#A78BFA'];
    const fabricDataUrls = await Promise.all(
      fabrics.slice(0, 8).map((file) => this.fileToDataUrl(file).catch(() => ''))
    );
    const validFabricUrls = fabricDataUrls.filter(Boolean);
    const hasFabricDefs = validFabricUrls.length > 0;
    const fabricDefs = validFabricUrls
      .map((url, index) => `<pattern id="client-fabric-${index}" patternUnits="userSpaceOnUse" width="40" height="40"><image href="${url}" x="0" y="0" width="40" height="40" preserveAspectRatio="xMidYMid slice"/></pattern>`)
      .join('');

    let cells = '';
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const x = c * cellW;
        const y = r * cellH;
        const colorA = palette[(r + c) % palette.length];
        const colorB = palette[(r * 2 + c + 1) % palette.length];
        const colorC = palette[(r + c * 3 + 2) % palette.length];
        const fabricFillA = hasFabricDefs ? `url(#client-fabric-${(r + c) % validFabricUrls.length})` : colorA;
        const fabricFillB = hasFabricDefs ? `url(#client-fabric-${(r * 2 + c + 1) % validFabricUrls.length})` : colorB;
        const fabricFillC = hasFabricDefs ? `url(#client-fabric-${(r + c * 3 + 2) % validFabricUrls.length})` : colorC;
        const blockName = selectedBlocks[(r * cols + c) % selectedBlocks.length] || 'Simple Square';
        const variant = Math.floor(seededRandom() * 4);
        const cx = x + cellW / 2;
        const cy = y + cellH / 2;
        const rotation = (variant % 4) * 90;
        const start = `<g transform="rotate(${rotation}, ${cx.toFixed(2)}, ${cy.toFixed(2)})">`;
        const end = '</g>';

        if (blockName === 'Simple Square') {
          cells += `${start}<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${cellW.toFixed(2)}" height="${cellH.toFixed(2)}" fill="${fabricFillA}"/>${end}`;
        } else if (blockName === 'Four Patch') {
          const hw = cellW / 2;
          const hh = cellH / 2;
          cells += `${start}
            <rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${hw.toFixed(2)}" height="${hh.toFixed(2)}" fill="${fabricFillA}"/>
            <rect x="${(x + hw).toFixed(2)}" y="${y.toFixed(2)}" width="${hw.toFixed(2)}" height="${hh.toFixed(2)}" fill="${fabricFillB}"/>
            <rect x="${x.toFixed(2)}" y="${(y + hh).toFixed(2)}" width="${hw.toFixed(2)}" height="${hh.toFixed(2)}" fill="${fabricFillB}"/>
            <rect x="${(x + hw).toFixed(2)}" y="${(y + hh).toFixed(2)}" width="${hw.toFixed(2)}" height="${hh.toFixed(2)}" fill="${fabricFillA}"/>
          ${end}`;
        } else if (blockName === 'Rail Fence' || blockName === 'Strip Quilt' || blockName === 'Log Cabin') {
          const stripeCount = blockName === 'Log Cabin' ? 5 : 4;
          const stripeH = cellH / stripeCount;
          let stripes = start;
          for (let i = 0; i < stripeCount; i += 1) {
            const fill = [fabricFillA, fabricFillB, fabricFillC][i % 3];
            stripes += `<rect x="${x.toFixed(2)}" y="${(y + i * stripeH).toFixed(2)}" width="${cellW.toFixed(2)}" height="${stripeH.toFixed(2)}" fill="${fill}"/>`;
          }
          stripes += end;
          cells += stripes;
        } else if (blockName === 'Nine Patch') {
          const tw = cellW / 3;
          const th = cellH / 3;
          let nine = start;
          for (let rr = 0; rr < 3; rr += 1) {
            for (let cc = 0; cc < 3; cc += 1) {
              const fill = (rr + cc + variant) % 2 === 0 ? fabricFillA : fabricFillB;
              nine += `<rect x="${(x + cc * tw).toFixed(2)}" y="${(y + rr * th).toFixed(2)}" width="${tw.toFixed(2)}" height="${th.toFixed(2)}" fill="${fill}"/>`;
            }
          }
          nine += end;
          cells += nine;
        } else {
          cells += `${start}
            <rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${cellW.toFixed(2)}" height="${cellH.toFixed(2)}" fill="${fabricFillA}"/>
            <polygon points="${x.toFixed(2)},${y.toFixed(2)} ${(x + cellW).toFixed(2)},${y.toFixed(2)} ${(x + cellW).toFixed(2)},${(y + cellH).toFixed(2)}" fill="${fabricFillB}" opacity="0.86"/>
            <polygon points="${x.toFixed(2)},${y.toFixed(2)} ${x.toFixed(2)},${(y + cellH).toFixed(2)} ${(x + cellW).toFixed(2)},${(y + cellH).toFixed(2)}" fill="${fabricFillC}" opacity="0.72"/>
          ${end}`;
        }
      }
    }

    const visualSvg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%" role="img" aria-label="Unique quilt preview">\n  <defs>${fabricDefs}</defs>\n  <rect x="0" y="0" width="${width}" height="${height}" fill="#ffffff"/>\n  ${cells}\n</svg>`;
    const roleNames = ['Background', 'Primary', 'Secondary', 'Accent'];
    const requirementCount = Math.max(1, Math.min(validFabricUrls.length || fabrics.length || 4, roleNames.length));
    const defaultSplits = [0.45, 0.3, 0.15, 0.1];
    const sizeEstimate = this.resolveQuiltSizeEstimate(quiltSize);
    const estimatedTotalYards = sizeEstimate.totalYards;
    const fabricRequirements = Array.from({ length: requirementCount }, (_, index) => {
      const split = defaultSplits[index] || (1 / requirementCount);
      const yards = Math.max(0.25, Number((estimatedTotalYards * split).toFixed(2)));
      const role = roleNames[index] || `Fabric ${index + 1}`;

      return {
        role,
        yards,
        description: `${role} fabric for unique layout pieces.`,
      };
    });

    return {
      patternName: `Unique ${userSkillLevel} Quilt`,
      patternId: 'unique',
      description: `A one-of-a-kind quilt composition generated at ${userSkillLevel} level from your uploaded fabrics.`,
      fabricLayout: `Client fallback unique layout composed from ${selectedBlocks.length} block motifs: ${selectedBlocks.join(', ')}.`,
      difficulty: userSkillLevel,
      estimatedSize: sizeEstimate.estimatedSize,
      instructions: [
        `Selected block motifs used in this layout: ${selectedBlocks.join(', ')}.`,
        'Sort fabrics by value and contrast before cutting.',
        'Cut and piece each block family in small batches.',
        'Lay out blocks on a design wall and confirm visual flow before stitching rows.',
        'Assemble rows, then join rows into the quilt center with consistent seam allowance.',
        'Add borders if desired, then quilt and bind.',
      ],
      visualSvg,
      fabricRequirements,
      selectionRationale: {
        mode: 'unique',
        reason: 'Catalog output was detected, so a non-catalog unique fallback was generated on the client using selected block families.',
        targetSkillLevel: userSkillLevel,
        selectedBlocks,
      },
      meta: {
        isUnique: true,
        uniqueVersion: 'client-fallback-v1',
        localOnly: true,
      },
    } as QuiltPattern;
  }

  private static async coerceUniqueResponse(
    selectedPattern: string | undefined,
    userSkillLevel: string,
    fabrics: File[],
    quiltSize: string | undefined,
    response: PatternGenerationResponse
  ): Promise<PatternGenerationResponse> {
    if (!this.isUniqueRequest(selectedPattern)) {
      return response;
    }

    const pattern = response.data?.pattern;
    if (!pattern) {
      return {
        ...response,
        success: true,
        data: {
          ...(response.data || {}),
          pattern: await this.buildClientUniqueFallbackPattern(userSkillLevel, fabrics, quiltSize),
        },
      };
    }

    const patternAny = pattern as any;
    const isUniqueMeta = Boolean(patternAny?.meta?.isUnique);
    const hasUniqueRationale = patternAny?.selectionRationale?.mode === 'unique';
    const isCatalogLike = this.isCatalogLikePattern(pattern);

    if (isCatalogLike || (!isUniqueMeta && !hasUniqueRationale)) {
      return {
        ...response,
        success: true,
        data: {
          ...(response.data || {}),
          pattern: await this.buildClientUniqueFallbackPattern(userSkillLevel, fabrics, quiltSize),
        },
      };
    }

    return response;
  }

  /**
   * Execute pattern generation with all state updates
   */
  static async execute(
    fabrics: File[],
    userSkillLevel: string,
    challengeMe: boolean,
    selectedPattern: string | undefined,
    quiltSize: string | undefined,
    borders: any | undefined,
    callbacks: {
      onStart: () => void;
      onSuccess: (pattern: QuiltPattern) => void;
      onError: (error: string) => void;
      onComplete: () => void;
    }
  ): Promise<{ used: number; limit: number; remaining: number } | null> {
    callbacks.onStart();

    try {
      const response = await PatternService.generatePattern({
        fabrics,
        skillLevel: userSkillLevel,
        challengeMe,
        selectedPattern,
        quiltSize,
        bordersEnabled: borders && borders.length > 0,
        borders,
      });

      const uniqueSafeResponse = await this.coerceUniqueResponse(selectedPattern, userSkillLevel, fabrics, quiltSize, response);

      this.handleResponse(uniqueSafeResponse, callbacks);
      return uniqueSafeResponse.data?.usage || null;
    } catch (err) {
      const axiosError = err as AxiosError;
      const isUniqueMode = this.isUniqueRequest(selectedPattern);
      const isServer500 = axiosError?.response?.status === 500;

      if (isUniqueMode && isServer500) {
        const fallbackPattern = await this.buildClientUniqueFallbackPattern(userSkillLevel, fabrics, quiltSize);
        callbacks.onSuccess(fallbackPattern);
        callbacks.onError('Unique mode temporarily used a local fallback due to server error.');
        return null;
      }

      this.handleError(err, callbacks);
      return null;
    } finally {
      callbacks.onComplete();
    }
  }

  /**
   * Handle API response
   */
  private static handleResponse(
    response: PatternGenerationResponse,
    callbacks: { onSuccess: (pattern: QuiltPattern) => void; onError: (error: string) => void }
  ): void {
    if (response.success && response.data) {
      PatternStateManager.handleSuccess(response, callbacks.onSuccess);
    } else {
      callbacks.onError(response.message || 'Failed to generate pattern');
    }
  }

  /**
   * Handle errors
   */
  private static handleError(
    err: unknown,
    callbacks: { onError: (error: string) => void }
  ): void {
    console.error('Pattern generation error:', err);
    callbacks.onError(ErrorHandler.parsePatternError(err));
  }
}
