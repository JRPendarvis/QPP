// src/services/instructionGenerationService.ts

import { generateInstructions } from '../instructions/generateInstructions';
import { parseQuiltSizeIn } from '../../utils/parseQuiltSize';
import { buildFabricsByRole, convertToFabricAssignments } from '../../utils/fabricMapping';

/**
 * Generates deterministic instructions for quilt patterns
 * Single Responsibility: Instruction generation logic only
 */
export class InstructionGenerationService {
  /**
   * Generate deterministic instructions for a pattern
   * Falls back to LLM instructions if deterministic generation is not supported
   * 
   * @param pattern - The pattern object to enhance with instructions
   * @param patternId - The normalized pattern ID
   * @param roleAssignments - Fabric role assignments from user or AI
   * @returns Pattern enhanced with instructions and metadata
   */
  async generateInstructions(pattern: any, patternId: string, roleAssignments: any): Promise<any> {
    const resolvedPatternId = patternId;
    const fabricsByRole = buildFabricsByRole(roleAssignments, pattern);

    pattern.patternId = resolvedPatternId;
    pattern.fabricsByRole = fabricsByRole;

    try {
      const quiltSize = parseQuiltSizeIn(pattern.estimatedSize);
      
      // Use actual fabric names from fabricRequirements if available
      const fabricRequirements = pattern.fabricRequirements || [];
      const actualFabricNames = fabricRequirements
        .filter((req: any) => !['Backing', 'Batting', 'Binding'].includes(req.role))
        .map((req: any) => req.role);
      
      console.log('[INSTRUCTIONS] actualFabricNames from requirements =', actualFabricNames);
      
      // Create fabric assignments with actual names or fall back to fabricsByRole
      const fabricAssignments = actualFabricNames.length > 0
        ? { namesBySlot: actualFabricNames }
        : convertToFabricAssignments(fabricsByRole);
      
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
}
