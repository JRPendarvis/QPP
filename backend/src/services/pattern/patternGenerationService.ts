// src/services/patternGenerationService.ts

import { SubscriptionValidator } from '../subscription/subscriptionValidator';
import { SkillLevelService } from '../user/skillLevelService';
import { InstructionGenerationService } from './instructionGenerationService';
import { PatternRepository } from '../../repositories/patternRepository';
import { normalizePatternId } from '../../utils/patternNormalization';
import { BorderConfiguration } from '../../types/Border';
import { FeedbackRequirementService } from '../admin/feedbackRequirementService';
import { DeterministicQuiltGenerationService } from './deterministicQuiltGenerationService';

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

  constructor() {
    this.subscriptionValidator = new SubscriptionValidator();
    this.skillLevelService = new SkillLevelService();
    this.instructionService = new InstructionGenerationService();
    this.patternRepository = new PatternRepository();
    this.deterministicQuiltGenerationService = new DeterministicQuiltGenerationService();
  }

  async generate(request: GeneratePatternRequest): Promise<GeneratePatternResult> {
    const { userId, images, skillLevel, challengeMe, selectedPattern, roleAssignments, quiltSize, borderConfiguration } = request;

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
    const { user, tierConfig } = await this.subscriptionValidator.validateUser(userId);

    // Determine target skill level (with optional challenge mode)
    const targetSkillLevel = this.skillLevelService.determineSkillLevel(skillLevel, user.skillLevel, challengeMe);

    let pattern: any = await this.deterministicQuiltGenerationService.generateQuiltPattern(
      images,
      targetSkillLevel,
      patternToUse,
      quiltSize,
      borderConfiguration
    );

    // Generate deterministic instructions when supported.
    // In auto mode, deterministic generation resolves a concrete pattern id on the pattern object.
    const resolvedPatternId = pattern?.patternId || patternToUse;
    pattern = await this.instructionService.generateInstructions(pattern, resolvedPatternId, roleAssignments);

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
