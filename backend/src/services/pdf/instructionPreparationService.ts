import { normalizePatternId } from '../../utils/patternNormalization';
import { parseQuiltSizeIn } from '../../utils/parseQuiltSize';
import { generateInstructions } from '../instructions/generateInstructions';
import type { FabricAssignments } from '../instructions/fabricAssignments';
import type { QuiltPattern } from '../../types/QuiltPattern';

export interface PreparedInstructions {
  instructions: string[];
  patternId: string;
  source: 'deterministic';
}

/**
 * Service for preparing deterministic quilt instructions
 * Single Responsibility: Extract and validate instruction data from pattern
 */
export class InstructionPreparationService {
  /**
   * Prepare deterministic instructions from pattern data
   * Throws error if deterministic instructions not available
   */
  prepareInstructions(pattern: QuiltPattern): PreparedInstructions {
    // Extract pattern ID from various possible sources
    const rawPatternId =
      (pattern as any).patternId ??
      (pattern as any).id ??
      String(pattern.patternName || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-');

    const resolvedPatternId = normalizePatternId(rawPatternId);

    // Parse quilt size
    const quiltSize = parseQuiltSizeIn(pattern.estimatedSize);

    // Extract fabric assignments (structured data required)
    const fabricsByRole =
      (pattern as any).fabricsByRole ?? {
        background: 'Background fabric',
        primary: 'Primary fabric',
        secondary: 'Secondary fabric',
        accent: 'Accent fabric',
      };

    console.log('[PDF DEBUG] resolvedPatternId =', resolvedPatternId);
    console.log('[PDF DEBUG] estimatedSize =', pattern.estimatedSize);
    console.log('[PDF DEBUG] fabricsByRole =', fabricsByRole);

    // Extract fabric assignments from fabricRequirements if available
    const fabricRequirements = (pattern as any).fabricRequirements || [];
    
    console.log('[PDF DEBUG] Full pattern object keys:', Object.keys(pattern));
    console.log('[PDF DEBUG] fabricRequirements =', JSON.stringify(fabricRequirements, null, 2));
    
    // Use actual fabric names from requirements, filtering out backing/batting/binding
    const actualFabricNames = fabricRequirements
      .filter((req: any) => !['Backing', 'Batting', 'Binding'].includes(req.role))
      .map((req: any) => req.role);
    
    console.log('[PDF DEBUG] actualFabricNames from requirements =', actualFabricNames);
    console.log('[PDF DEBUG] actualFabricNames.length =', actualFabricNames.length);

    const fabricAssignments: FabricAssignments = {
      namesBySlot: actualFabricNames.length > 0 
        ? actualFabricNames
        : [
            fabricsByRole.background || 'Background fabric',
            fabricsByRole.primary || 'Primary fabric',
            fabricsByRole.secondary || 'Secondary fabric',
            fabricsByRole.accent || 'Accent fabric',
          ],
    };

    // Generate deterministic instructions
    const res = generateInstructions(
      resolvedPatternId,
      { widthIn: quiltSize.width, heightIn: quiltSize.height },
      fabricAssignments
    );

    if (res.kind !== 'generated') {
      throw new Error(
        `Deterministic instructions not available for patternId="${resolvedPatternId}". ` +
          `Refusing to fall back to LLM instructions.`
      );
    }

    // Add source metadata as first instruction
    const instructionsWithMetadata = [
      `Instruction source: DETERMINISTIC (patternId=${resolvedPatternId})`,
      ...res.instructions,
    ];

    console.log(
      `[PDF] patternId=${resolvedPatternId} instructionSource=deterministic steps=${res.instructions.length}`
    );

    return {
      instructions: instructionsWithMetadata,
      patternId: resolvedPatternId,
      source: 'deterministic',
    };
  }
}
