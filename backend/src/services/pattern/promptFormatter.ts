// src/services/pattern/promptFormatter.ts

import { getPatternPrompt } from '../../config/prompts';
import { normalizePatternId } from '../../utils/patternNormalization';
import { SkillLevelResolver } from './skillLevelResolver';
import { PatternDescriptionResolver } from './patternDescriptionResolver';
import { PatternGuidanceFormatter } from './patternGuidanceFormatter';
import { FabricSummaryBuilder } from './fabricSummaryBuilder';
import { QuiltSizeMapper } from './quiltSizeMapper';
import { InitialPromptBuilder } from './initialPromptBuilder';
import { RoleSwapPromptBuilder } from './roleSwapPromptBuilder';

export interface FabricAnalysis {
  fabricIndex: number;
  description: string;
  type: 'printed' | 'solid';
  value: 'light' | 'medium' | 'dark';
  printScale: 'solid' | 'small' | 'medium' | 'large';
  dominantColor: string;
  recommendedRole?: 'background' | 'primary' | 'secondary' | 'accent';
  roleReason?: string;
}

export interface RoleAssignment {
  fabricIndex: number;
  description: string;
}

export interface RoleAssignments {
  background: RoleAssignment | null;
  primary: RoleAssignment | null;
  secondary: RoleAssignment | null;
  accent: RoleAssignment | null;
}

/**
 * Orchestrates AI prompt construction for Claude pattern generation
 * Single Responsibility: Coordinates prompt building services only
 */
export class PromptFormatter {
  /**
   * Build complete prompt for Claude API pattern generation
   * @param fabricCount - Number of fabrics
   * @param patternForSvg - Pattern name for SVG
   * @param patternInstruction - Pattern-specific instruction text
   * @param skillLevel - User's skill level
   * @param patternId - Optional pattern ID for detailed prompts
   * @param quiltSize - Optional desired quilt size
   * @returns Complete formatted prompt
   */
  buildPrompt(
    fabricCount: number,
    patternForSvg: string,
    patternInstruction: string,
    skillLevel: string,
    patternId?: string,
    quiltSize?: string,
    availableYardageByFabric?: Array<number | null>
  ): string {
    const skillDescription = SkillLevelResolver.getDescription(skillLevel);
    const patternPrompt = patternId ? getPatternPrompt(normalizePatternId(patternId)) : null;
    const patternDescription = PatternDescriptionResolver.getDescription(patternForSvg, patternPrompt);
    const patternGuidance = PatternGuidanceFormatter.buildFullGuidance(patternForSvg, patternPrompt);
    const targetSize = QuiltSizeMapper.getFormattedSize(quiltSize);
    const yardageGuidance = this.buildYardageGuidance(availableYardageByFabric);

    return InitialPromptBuilder.build({
      fabricCount,
      patternForSvg,
      patternInstruction,
      skillDescription,
      patternDescription,
      patternGuidance,
      targetSize,
      skillLevel,
      yardageGuidance,
    });
  }

  /**
   * Build prompt for re-analyzing with swapped fabric roles
   * @param fabricAnalysis - Analysis of all fabrics
   * @param newRoleAssignments - User's custom role assignments
   * @param patternForSvg - Pattern name
   * @param skillLevel - Skill level
   * @param patternId - Optional pattern ID
   * @param quiltSize - Optional desired quilt size
   * @returns Formatted role swap prompt
   */
  buildRoleSwapPrompt(
    fabricAnalysis: FabricAnalysis[],
    newRoleAssignments: RoleAssignments,
    patternForSvg: string,
    skillLevel: string,
    patternId?: string,
    quiltSize?: string,
    availableYardageByFabric?: Array<number | null>
  ): string {
    const skillDescription = SkillLevelResolver.getDescription(skillLevel);
    const patternPrompt = patternId ? getPatternPrompt(normalizePatternId(patternId)) : null;
    const patternDescription = PatternDescriptionResolver.getDescription(patternForSvg, patternPrompt);
    const fabricSummary = FabricSummaryBuilder.buildFabricSummary(fabricAnalysis);
    const rolesSummary = FabricSummaryBuilder.buildRolesSummary(newRoleAssignments);
    const patternGuidance = PatternGuidanceFormatter.buildRoleSwapGuidance(patternPrompt);
    const targetSize = QuiltSizeMapper.getFormattedSize(quiltSize);
    const yardageGuidance = this.buildYardageGuidance(availableYardageByFabric);

    return RoleSwapPromptBuilder.build({
      patternForSvg,
      fabricSummary,
      rolesSummary,
      patternDescription,
      patternGuidance,
      skillDescription,
      targetSize,
      yardageGuidance,
    });
  }

  private buildYardageGuidance(availableYardageByFabric?: Array<number | null>): string {
    if (!availableYardageByFabric || availableYardageByFabric.length === 0) {
      return '';
    }

    const constrainedFabrics = availableYardageByFabric
      .map((yards, index) => {
        if (yards === null || yards === undefined) {
          return null;
        }
        return `- Fabric ${index + 1}: ${yards} yards available`;
      })
      .filter((line): line is string => !!line);

    if (constrainedFabrics.length === 0) {
      return '';
    }

    return `\n\n**FABRIC AVAILABILITY CONSTRAINTS**\nThe quilter has limited yardage for these fabrics. Design the quilt to stay within these limits:\n${constrainedFabrics.join('\n')}`;
  }
}
