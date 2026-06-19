// src/services/patternGenerationService.ts

import { SubscriptionValidator } from '../subscription/subscriptionValidator';
import { SkillLevelService } from '../user/skillLevelService';
import { InstructionGenerationService } from './instructionGenerationService';
import { PatternRepository } from '../../repositories/patternRepository';
import { normalizePatternId } from '../../utils/patternNormalization';
import { BorderConfiguration } from '../../types/Border';
import { FeedbackRequirementService } from '../admin/feedbackRequirementService';
import { DeterministicQuiltGenerationService } from './deterministicQuiltGenerationService';
import { getCreditCost } from '../../config/credits.config';
import { UniqueQuiltGenerationService } from './uniqueQuiltGenerationService';
import { getAllPatterns } from '../../config/patterns';
import { QuiltSizeCatalog } from './quiltSizeCatalog';

export interface GeneratePatternRequest {
  userId: string;
  images: string[];
  imageTypes: string[];
  skillLevel?: string;
  challengeMe?: boolean;
  selectedPattern?: string;
  roleAssignments?: any;
  quiltSize?: string;
  borderConfiguration?: BorderConfiguration;
}

export interface GeneratePatternResult {
  pattern: any;
  usage: {
    used: number;
    limit: number;
    remaining: number;
  };
}

/**
 * Orchestrates quilt pattern generation workflow
 * Single Responsibility: Coordinates pattern generation using injected services
 * Follows Dependency Inversion: Depends on abstractions (services) not concrete implementations
 */
export class PatternGenerationService {
  private subscriptionValidator: SubscriptionValidator;
  private skillLevelService: SkillLevelService;
  private instructionService: InstructionGenerationService;
  private patternRepository: PatternRepository;
  private deterministicQuiltGenerationService: DeterministicQuiltGenerationService;
  private uniqueQuiltGenerationService: UniqueQuiltGenerationService;

  constructor() {
    this.subscriptionValidator = new SubscriptionValidator();
    this.skillLevelService = new SkillLevelService();
    this.instructionService = new InstructionGenerationService();
    this.patternRepository = new PatternRepository();
    this.deterministicQuiltGenerationService = new DeterministicQuiltGenerationService();
    this.uniqueQuiltGenerationService = new UniqueQuiltGenerationService();
  }

  async generate(request: GeneratePatternRequest): Promise<GeneratePatternResult> {
    const { userId, images, imageTypes, skillLevel, challengeMe, selectedPattern, roleAssignments, quiltSize, borderConfiguration } = request;
    const creditsRequired = getCreditCost('patternGeneration');

    const patternToUse = normalizePatternId(selectedPattern);
    console.log(`📋 Pattern to use: "${patternToUse}" (from: "${selectedPattern}")`);

    // Check feedback requirement for complimentary subscribers
    const feedbackStatus = await FeedbackRequirementService.checkFeedbackRequirement(userId);
    if (!feedbackStatus.canGenerate) {
      throw new Error(feedbackStatus.message);
    }

    // Log feedback reminder if approaching due date
    if (feedbackStatus.isRequired && feedbackStatus.daysUntilRequired <= 7 && feedbackStatus.daysUntilRequired > 0) {
      console.log(`⚠️ Feedback reminder: ${feedbackStatus.message}`);
    }

    // Validate user subscription and limits
    const { user, tierConfig } = await this.subscriptionValidator.validateUser(userId, creditsRequired);

    // Determine target skill level (with optional challenge mode)
    const targetSkillLevel = this.skillLevelService.determineSkillLevel(skillLevel, user.skillLevel, challengeMe);

    let resolvedPatternSelection = patternToUse;
    let autoSelectedBy: 'ai' | 'deterministic' = 'deterministic';
    let autoSelectionReason: string | undefined;

    if (patternToUse === 'auto') {
      autoSelectedBy = 'deterministic';
      autoSelectionReason = 'Auto-selected from predefined patterns based on skill level and fabric count.';

      console.log('[PatternGenerationService] Deterministic auto-selection enabled for predefined patterns only.', {
        targetSkillLevel,
        fabricCount: images.length,
      });
    }

    const isUniqueMode = patternToUse === 'unique';

    let pattern: any;

    if (isUniqueMode) {
      pattern = await this.uniqueQuiltGenerationService.generateUniqueQuiltPattern(
        images,
        targetSkillLevel,
        quiltSize,
        borderConfiguration
      );

      const catalogIds = new Set(getAllPatterns().map((p) => p.id));
      const catalogNameSet = new Set(getAllPatterns().map((p) => p.name.toLowerCase()));

      // Enforce unique-mode contract: never look like a catalog pattern.
      if (!pattern.patternId || catalogIds.has(String(pattern.patternId).toLowerCase())) {
        pattern.patternId = 'unique';
      }

      const patternIdNormalized = String(pattern.patternId || '').trim().toLowerCase();
      const patternNameNormalized = String(pattern.patternName || '').trim().toLowerCase();

      if (catalogIds.has(patternIdNormalized) || catalogNameSet.has(patternNameNormalized)) {
        pattern = this.buildForcedUniqueFallbackPattern(images, targetSkillLevel, quiltSize, borderConfiguration);
      }

      if (!pattern.patternName) {
        pattern.patternName = `Unique ${targetSkillLevel} Quilt`;
      }

      // Unique mode should not expose auto-selection/candidate rationale.
      delete pattern.autoSelection;

      pattern.meta = {
        ...(pattern.meta || {}),
        isUnique: true,
      };
    } else {
      pattern = await this.deterministicQuiltGenerationService.generateQuiltPattern(
        images,
        targetSkillLevel,
        resolvedPatternSelection,
        quiltSize,
        borderConfiguration
      );
    }

    if (patternToUse === 'auto') {
      pattern.autoSelection = {
        selectedBy: autoSelectedBy,
        reason: autoSelectionReason,
        targetSkillLevel,
      };
    }

    // Generate deterministic instructions only for catalog-backed generation.
    // Unique mode is intentionally not tied to catalog pattern instruction plans.
    if (!isUniqueMode) {
      const resolvedPatternId = pattern?.patternId || resolvedPatternSelection;
      pattern = await this.instructionService.generateInstructions(pattern, resolvedPatternId, roleAssignments);
    }

    // Save pattern and increment usage count
    const savedPattern = await this.patternRepository.savePattern({
      userId: user.id,
      patternData: pattern,
      creditsUsed: creditsRequired,
    });

    const remainingCredits = tierConfig.creditsPerMonth - (user.generationsThisMonth + creditsRequired);

    console.log('Pattern structure:', {
      patternId: pattern.patternId,
      instructionsSource: pattern.instructionsSource,
      hasInstructions: !!pattern.instructions,
      instructionsLength: pattern.instructions?.length,
    });

    return {
      pattern: {
        ...pattern,
        id: savedPattern.id,
      },
      usage: {
        used: user.generationsThisMonth + creditsRequired,
        limit: tierConfig.creditsPerMonth,
        remaining: remainingCredits,
      },
    };
  }

  private buildForcedUniqueFallbackPattern(
    images: string[],
    targetSkillLevel: string,
    quiltSize?: string,
    borderConfiguration?: BorderConfiguration
  ): any {
    const normalizedSkill = String(targetSkillLevel || 'beginner').toLowerCase();
    const dimensions = QuiltSizeCatalog.resolveDimensions(quiltSize);
    const estimatedSize = QuiltSizeCatalog.formatDisplaySize(dimensions);

    const colsBySkill: Record<string, number> = {
      beginner: 6,
      advanced_beginner: 7,
      intermediate: 8,
      advanced: 10,
      expert: 12,
    };
    const rowsBySkill: Record<string, number> = {
      beginner: 8,
      advanced_beginner: 9,
      intermediate: 10,
      advanced: 12,
      expert: 14,
    };

    const cols = colsBySkill[normalizedSkill] || 8;
    const rows = rowsBySkill[normalizedSkill] || 10;
    const width = 300;
    const height = 400;
    const cellW = width / cols;
    const cellH = height / rows;
    const palette = ['#E5E7EB', '#60A5FA', '#34D399', '#F59E0B', '#F87171', '#A78BFA'];
    const fabricDefs = this.buildFabricDefsFromBase64(images);
    const hasFabricDefs = images.length > 0;

    let cells = '';
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const x = c * cellW;
        const y = r * cellH;
        const colorA = palette[(r + c) % palette.length];
        const colorB = palette[(r * 2 + c + 1) % palette.length];
        const fabricFillA = hasFabricDefs ? `url(#fallback-fabric-${(r + c) % images.length})` : colorA;
        const fabricFillB = hasFabricDefs ? `url(#fallback-fabric-${(r * 2 + c + 1) % images.length})` : colorB;

        cells += `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${cellW.toFixed(2)}" height="${cellH.toFixed(2)}" fill="${fabricFillA}"/>`;
        cells += `<polygon points="${x.toFixed(2)},${y.toFixed(2)} ${(x + cellW).toFixed(2)},${y.toFixed(2)} ${(x + cellW).toFixed(2)},${(y + cellH).toFixed(2)}" fill="${fabricFillB}" opacity="0.75"/>`;
      }
    }

    const visualSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%" role="img" aria-label="Unique quilt preview">
  <defs>${fabricDefs}</defs>
  <rect x="0" y="0" width="${width}" height="${height}" fill="#ffffff"/>
  ${cells}
</svg>`;

    return {
      patternId: 'unique',
      patternName: `Unique ${targetSkillLevel} Quilt`,
      description: `A non-catalog quilt composition generated at ${targetSkillLevel} level.`,
      fabricLayout: 'Unique layout generated without using a catalog pattern.',
      difficulty: targetSkillLevel,
      estimatedSize,
      instructions: [
        'Sort your uploaded fabrics by value and contrast before cutting.',
        'Cut strips and units according to the fabric requirements shown.',
        'Lay out the quilt sections on a design wall to confirm visual balance.',
        'Piece sections in small batches and press seams consistently.',
        'Assemble sections into rows, then join rows to finish the quilt top.',
        'Layer with batting and backing, quilt as desired, then bind.',
      ],
      visualSvg,
      requestedQuiltSize: quiltSize,
      fabricRequirements: [
        { role: 'Background', yards: 1.5, description: 'Background fabric for negative space' },
        { role: 'Primary', yards: 1.25, description: 'Primary fabric for dominant shapes' },
        { role: 'Secondary', yards: 1.0, description: 'Secondary fabric for contrast' },
        { role: 'Accent', yards: 0.75, description: 'Accent fabric for highlights' },
      ],
      fabricImages: images,
      ...(borderConfiguration ? { borderConfiguration } : {}),
      selectionRationale: {
        mode: 'unique',
        reason: `Catalog output was detected and replaced with a forced non-catalog unique composition for ${targetSkillLevel} skill level.`,
        targetSkillLevel,
      },
      meta: {
        isUnique: true,
        uniqueVersion: 'fallback-v1',
      },
    };
  }

  private buildFabricDefsFromBase64(images: string[]): string {
    if (!images.length) {
      return '';
    }

    return images
      .map((image, index) => {
        const href = image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`;
        return `<pattern id="fallback-fabric-${index}" patternUnits="userSpaceOnUse" width="40" height="40"><image href="${href}" x="0" y="0" width="40" height="40" preserveAspectRatio="xMidYMid slice"/></pattern>`;
      })
      .join('');
  }
}
