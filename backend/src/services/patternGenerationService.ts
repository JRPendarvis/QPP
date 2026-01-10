// src/services/patternGenerationService.ts

import { PrismaClient } from '@prisma/client';
import { ClaudeService } from './claudeService';
import { SUBSCRIPTION_TIERS } from '../config/stripe.config';
import { generateInstructions } from './instructions/generateInstructions';
import { parseQuiltSizeIn } from '../utils/parseQuiltSize';
import { normalizePatternId } from '../utils/patternNormalization';
import { buildFabricsByRole, convertToFabricAssignments } from '../utils/fabricMapping';

const prisma = new PrismaClient();

export interface GeneratePatternRequest {
  userId: string;
  images: string[];
  imageTypes: string[];
  skillLevel?: string;
  challengeMe?: boolean;
  selectedPattern?: string;
  roleAssignments?: any;
}

export interface GeneratePatternResult {
  pattern: any;
  usage: {
    used: number;
    limit: number;
    remaining: number;
  };
}

export class PatternGenerationService {
  private claudeService: ClaudeService;

  constructor() {
    this.claudeService = new ClaudeService();
  }

  async validateUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        skillLevel: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        currentPeriodEnd: true,
        generationsThisMonth: true,
      },
    });

    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    if (
      user.subscriptionStatus === 'canceled' ||
      (user.currentPeriodEnd && new Date(user.currentPeriodEnd) < new Date())
    ) {
      throw new Error('SUBSCRIPTION_EXPIRED');
    }

    const tierConfig = SUBSCRIPTION_TIERS[user.subscriptionTier as keyof typeof SUBSCRIPTION_TIERS];

    if (user.generationsThisMonth >= tierConfig.generationsPerMonth) {
      throw new Error('GENERATION_LIMIT_REACHED');
    }

    return { user, tierConfig };
  }

  determineSkillLevel(skillLevel?: string, userSkillLevel?: string, challengeMe?: boolean): string {
    let targetSkillLevel = skillLevel || userSkillLevel || 'beginner';

    if (challengeMe) {
      const skillProgression = ['beginner', 'advanced_beginner', 'intermediate', 'advanced', 'expert'];
      const currentIndex = skillProgression.indexOf(targetSkillLevel);
      if (currentIndex < skillProgression.length - 1) {
        targetSkillLevel = skillProgression[currentIndex + 1];
      }
    }

    return targetSkillLevel;
  }

  async generateInstructions(pattern: any, patternToUse: string, roleAssignments: any) {
    const resolvedPatternId = patternToUse;
    const fabricsByRole = buildFabricsByRole(roleAssignments, pattern);

    pattern.patternId = resolvedPatternId;
    pattern.fabricsByRole = fabricsByRole;

    try {
      const quiltSize = parseQuiltSizeIn(pattern.estimatedSize);
      const fabricAssignments = convertToFabricAssignments(fabricsByRole);
      const det = generateInstructions(
        resolvedPatternId,
        { widthIn: quiltSize.width, heightIn: quiltSize.height },
        fabricAssignments
      );

      if (det.kind === 'generated') {
        pattern.instructions = det.instructions;
        pattern.instructionsSource = 'deterministic';
        console.log(
          `[INSTRUCTIONS] Deterministic used patternId="${resolvedPatternId}" steps=${det.instructions.length}`
        );
      } else {
        pattern.instructionsSource = 'llm';
        console.warn(`[INSTRUCTIONS] Deterministic not supported patternId="${resolvedPatternId}"`);
      }
    } catch (e) {
      pattern.instructionsSource = 'llm';
      console.warn(
        `[INSTRUCTIONS] Deterministic generation failed patternId="${resolvedPatternId}". Using LLM instructions.`,
        e
      );
    }

    return pattern;
  }

  async generate(request: GeneratePatternRequest): Promise<GeneratePatternResult> {
    const { userId, images, imageTypes, skillLevel, challengeMe, selectedPattern, roleAssignments } = request;

    const patternToUse = normalizePatternId(selectedPattern);
    console.log(`📋 Pattern to use: "${patternToUse}" (from: "${selectedPattern}")`);

    const { user, tierConfig } = await this.validateUser(userId);

    const targetSkillLevel = this.determineSkillLevel(skillLevel, user.skillLevel, challengeMe);

    // Claude generates visual/design + metadata
    let pattern: any = await this.claudeService.generateQuiltPattern(
      images,
      imageTypes,
      targetSkillLevel,
      patternToUse,
      roleAssignments
    );

    // Generate deterministic instructions when supported
    pattern = await this.generateInstructions(pattern, patternToUse, roleAssignments);

    const savedPattern = await prisma.$transaction(async (tx) => {
      const newPattern = await tx.pattern.create({
        data: {
          userId: user.id,
          patternData: pattern as any,
          downloaded: false,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: {
          generationsThisMonth: { increment: 1 },
        },
      });

      return newPattern;
    });

    const remainingGenerations = tierConfig.generationsPerMonth - (user.generationsThisMonth + 1);

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
        used: user.generationsThisMonth + 1,
        limit: tierConfig.generationsPerMonth,
        remaining: remainingGenerations,
      },
    };
  }
}
