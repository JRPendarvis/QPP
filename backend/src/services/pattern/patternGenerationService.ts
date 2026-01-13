// src/services/patternGenerationService.ts

import { ClaudeService } from '../ai/claudeService';
import { SubscriptionValidator, ValidatedUser } from '../subscription/subscriptionValidator';
import { SkillLevelService } from '../user/skillLevelService';
import { InstructionGenerationService } from './instructionGenerationService';
import { PatternRepository } from '../../repositories/patternRepository';
import { normalizePatternId } from '../../utils/patternNormalization';

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

/**
 * Orchestrates quilt pattern generation workflow
 * Single Responsibility: Coordinates pattern generation using injected services
 * Follows Dependency Inversion: Depends on abstractions (services) not concrete implementations
 */
export class PatternGenerationService {
  private claudeService: ClaudeService;
  private subscriptionValidator: SubscriptionValidator;
  private skillLevelService: SkillLevelService;
  private instructionService: InstructionGenerationService;
  private patternRepository: PatternRepository;

  constructor() {
    this.claudeService = new ClaudeService();
    this.subscriptionValidator = new SubscriptionValidator();
    this.skillLevelService = new SkillLevelService();
    this.instructionService = new InstructionGenerationService();
    this.patternRepository = new PatternRepository();
  }

  async generate(request: GeneratePatternRequest): Promise<GeneratePatternResult> {
    const { userId, images, imageTypes, skillLevel, challengeMe, selectedPattern, roleAssignments } = request;

    const patternToUse = normalizePatternId(selectedPattern);
    console.log(`📋 Pattern to use: "${patternToUse}" (from: "${selectedPattern}")`);

    // Validate user subscription and limits
    const { user, tierConfig } = await this.subscriptionValidator.validateUser(userId);

    // Determine target skill level (with optional challenge mode)
    const targetSkillLevel = this.skillLevelService.determineSkillLevel(skillLevel, user.skillLevel, challengeMe);

    // Claude generates visual/design + metadata
    let pattern: any = await this.claudeService.generateQuiltPattern(
      images,
      imageTypes,
      targetSkillLevel,
      patternToUse,
      roleAssignments
    );

    // Generate deterministic instructions when supported
    pattern = await this.instructionService.generateInstructions(pattern, patternToUse, roleAssignments);

    // Save pattern and increment usage count
    const savedPattern = await this.patternRepository.savePattern({
      userId: user.id,
      patternData: pattern,
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
