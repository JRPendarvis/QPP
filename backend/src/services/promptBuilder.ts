// src/services/promptBuilder.ts

import { PatternSelector, PatternSelectionResult } from './patternSelector';
import { PromptFormatter, FabricAnalysis, RoleAssignment, RoleAssignments } from './promptFormatter';
import { ImageContentBuilder, ClaudeImageContent } from './imageContentBuilder';

export type { PatternSelectionResult, FabricAnalysis, RoleAssignment, RoleAssignments };
export type FabricValue = 'light' | 'medium' | 'dark';
export type PrintScale = 'solid' | 'small' | 'medium' | 'large';
export type FabricRole = 'background' | 'primary' | 'secondary' | 'accent';

export interface PatternResponse {
  patternName: string;
  description: string;
  fabricAnalysis: FabricAnalysis[];
  roleAssignments: RoleAssignments;
  fabricLayout: string;
  difficulty: string;
  estimatedSize: string;
  instructions: string[];
  fabricColors: string[];
  fabricDescriptions: string[];
}

/**
 * Orchestrates prompt building for Claude AI pattern generation
 * Single Responsibility: Coordinates specialized services for prompt construction
 * Follows Dependency Inversion: Uses service abstractions
 */
export class PromptBuilder {
  private static patternSelector = new PatternSelector();
  private static promptFormatter = new PromptFormatter();
  private static imageContentBuilder = new ImageContentBuilder();

  /**
   * Select pattern based on skill level, user preference, and fabric count
   */
  static selectPattern(skillLevel: string, selectedPattern?: string, fabricCount?: number): PatternSelectionResult {
    return this.patternSelector.selectPattern(skillLevel, selectedPattern, fabricCount);
  }

  /**
   * Build complete prompt for Claude API
   */
  static buildPrompt(
    fabricCount: number,
    patternForSvg: string,
    patternInstruction: string,
    skillLevel: string,
    patternId?: string
  ): string {
    return this.promptFormatter.buildPrompt(fabricCount, patternForSvg, patternInstruction, skillLevel, patternId);
  }

  /**
   * Build prompt for re-analyzing with swapped roles
   */
  static buildRoleSwapPrompt(
    fabricAnalysis: FabricAnalysis[],
    newRoleAssignments: RoleAssignments,
    patternForSvg: string,
    skillLevel: string,
    patternId?: string
  ): string {
    return this.promptFormatter.buildRoleSwapPrompt(fabricAnalysis, newRoleAssignments, patternForSvg, skillLevel, patternId);
  }

  /**
   * Build image content array for Claude API
   */
  static buildImageContent(fabricImages: string[], imageTypes: string[] = []): ClaudeImageContent[] {
    return this.imageContentBuilder.buildImageContent(fabricImages, imageTypes);
  }
}
