// src/services/pattern/__tests__/promptFormatter.test.ts

import { PromptFormatter } from '../promptFormatter';
import { SkillLevelResolver } from '../skillLevelResolver';
import { PatternDescriptionResolver } from '../patternDescriptionResolver';
import { PatternGuidanceFormatter } from '../patternGuidanceFormatter';
import { FabricSummaryBuilder } from '../fabricSummaryBuilder';
import { QuiltSizeMapper } from '../quiltSizeMapper';
import { InitialPromptBuilder } from '../initialPromptBuilder';
import { RoleSwapPromptBuilder } from '../roleSwapPromptBuilder';
import { getPatternPrompt } from '../../../config/prompts';
import { normalizePatternId } from '../../../utils/patternNormalization';

jest.mock('../skillLevelResolver');
jest.mock('../patternDescriptionResolver');
jest.mock('../patternGuidanceFormatter');
jest.mock('../fabricSummaryBuilder');
jest.mock('../quiltSizeMapper');
jest.mock('../initialPromptBuilder');
jest.mock('../roleSwapPromptBuilder');
jest.mock('../../../config/prompts');
jest.mock('../../../utils/patternNormalization');

describe('PromptFormatter', () => {
  let formatter: PromptFormatter;

  beforeEach(() => {
    formatter = new PromptFormatter();
    jest.clearAllMocks();

    // Setup default mocks
    (SkillLevelResolver.getDescription as jest.Mock).mockReturnValue('Beginner skill description');
    (PatternDescriptionResolver.getDescription as jest.Mock).mockReturnValue('Pattern description');
    (PatternGuidanceFormatter.buildFullGuidance as jest.Mock).mockReturnValue('Full guidance');
    (QuiltSizeMapper.getFormattedSize as jest.Mock).mockReturnValue('60×72 inches throw quilt');
    (InitialPromptBuilder.build as jest.Mock).mockReturnValue('Assembled initial prompt');
    (normalizePatternId as jest.Mock).mockReturnValue('normalized-pattern');
    (getPatternPrompt as jest.Mock).mockReturnValue(null);
  });

  describe('buildPrompt', () => {
    it('should delegate to SkillLevelResolver for skill description', () => {
      formatter.buildPrompt(4, 'checkerboard', 'Test instruction', 'beginner');

      expect(SkillLevelResolver.getDescription).toHaveBeenCalledWith('beginner');
    });

    it('should get pattern prompt when patternId is provided', () => {
      formatter.buildPrompt(4, 'checkerboard', 'Test', 'beginner', 'test-pattern');

      expect(normalizePatternId).toHaveBeenCalledWith('test-pattern');
      expect(getPatternPrompt).toHaveBeenCalledWith('normalized-pattern');
    });

    it('should not get pattern prompt when patternId is undefined', () => {
      formatter.buildPrompt(4, 'checkerboard', 'Test', 'beginner');

      expect(normalizePatternId).not.toHaveBeenCalled();
      expect(getPatternPrompt).not.toHaveBeenCalled();
    });

    it('should delegate to PatternDescriptionResolver and PatternGuidanceFormatter', () => {
      formatter.buildPrompt(4, 'checkerboard', 'Test', 'beginner');

      expect(PatternDescriptionResolver.getDescription).toHaveBeenCalledWith('checkerboard', null);
      expect(PatternGuidanceFormatter.buildFullGuidance).toHaveBeenCalledWith('checkerboard', null);
    });

    it('should delegate to QuiltSizeMapper and InitialPromptBuilder', () => {
      formatter.buildPrompt(4, 'checkerboard', 'Test', 'beginner', undefined, 'queen');

      expect(QuiltSizeMapper.getFormattedSize).toHaveBeenCalledWith('queen');
      expect(InitialPromptBuilder.build).toHaveBeenCalled();
    });

    it('should pass all parameters to InitialPromptBuilder', () => {
      formatter.buildPrompt(5, 'nine-patch', 'Instruction text', 'intermediate', 'pattern-id', 'twin');

      expect(InitialPromptBuilder.build).toHaveBeenCalledWith({
        fabricCount: 5,
        patternForSvg: 'nine-patch',
        patternInstruction: 'Instruction text',
        skillDescription: 'Beginner skill description',
        patternDescription: 'Pattern description',
        patternGuidance: 'Full guidance',
        targetSize: '60×72 inches throw quilt',
        skillLevel: 'intermediate',
      });
    });

    it('should return assembled prompt', () => {
      const result = formatter.buildPrompt(4, 'checkerboard', 'Test', 'beginner');
      expect(result).toBe('Assembled initial prompt');
    });
  });

  describe('buildRoleSwapPrompt', () => {
    const fabricAnalysis = [
      {
        fabricIndex: 0,
        description: 'Blue floral',
        type: 'printed' as const,
        value: 'medium' as const,
        printScale: 'medium' as const,
        dominantColor: '#0000FF',
      },
    ];

    const roleAssignments = {
      background: { fabricIndex: 0, description: 'Blue floral' },
      primary: null,
      secondary: null,
      accent: null,
    };

    beforeEach(() => {
      (FabricSummaryBuilder.buildFabricSummary as jest.Mock).mockReturnValue('Fabric summary');
      (FabricSummaryBuilder.buildRolesSummary as jest.Mock).mockReturnValue('Roles summary');
      (PatternGuidanceFormatter.buildRoleSwapGuidance as jest.Mock).mockReturnValue('Swap guidance');
      (RoleSwapPromptBuilder.build as jest.Mock).mockReturnValue('Assembled role swap prompt');
    });

    it('should delegate to SkillLevelResolver for skill description', () => {
      formatter.buildRoleSwapPrompt(fabricAnalysis, roleAssignments, 'checkerboard', 'advanced');

      expect(SkillLevelResolver.getDescription).toHaveBeenCalledWith('advanced');
    });

    it('should get pattern prompt when patternId is provided', () => {
      formatter.buildRoleSwapPrompt(fabricAnalysis, roleAssignments, 'checkerboard', 'beginner', 'test-pattern');

      expect(normalizePatternId).toHaveBeenCalledWith('test-pattern');
      expect(getPatternPrompt).toHaveBeenCalledWith('normalized-pattern');
    });

    it('should delegate to FabricSummaryBuilder', () => {
      formatter.buildRoleSwapPrompt(fabricAnalysis, roleAssignments, 'checkerboard', 'beginner');

      expect(FabricSummaryBuilder.buildFabricSummary).toHaveBeenCalledWith(fabricAnalysis);
      expect(FabricSummaryBuilder.buildRolesSummary).toHaveBeenCalledWith(roleAssignments);
    });

    it('should delegate to PatternGuidanceFormatter for role swap guidance', () => {
      formatter.buildRoleSwapPrompt(fabricAnalysis, roleAssignments, 'checkerboard', 'beginner');

      expect(PatternGuidanceFormatter.buildRoleSwapGuidance).toHaveBeenCalledWith(null);
    });

    it('should delegate to QuiltSizeMapper and RoleSwapPromptBuilder', () => {
      formatter.buildRoleSwapPrompt(fabricAnalysis, roleAssignments, 'checkerboard', 'beginner', undefined, 'king');

      expect(QuiltSizeMapper.getFormattedSize).toHaveBeenCalledWith('king');
      expect(RoleSwapPromptBuilder.build).toHaveBeenCalled();
    });

    it('should pass all parameters to RoleSwapPromptBuilder', () => {
      formatter.buildRoleSwapPrompt(fabricAnalysis, roleAssignments, 'four-patch', 'intermediate', 'pattern-id', 'full');

      expect(RoleSwapPromptBuilder.build).toHaveBeenCalledWith({
        patternForSvg: 'four-patch',
        fabricSummary: 'Fabric summary',
        rolesSummary: 'Roles summary',
        patternDescription: 'Pattern description',
        patternGuidance: 'Swap guidance',
        skillDescription: 'Beginner skill description',
        targetSize: '60×72 inches throw quilt',
      });
    });

    it('should return assembled role swap prompt', () => {
      const result = formatter.buildRoleSwapPrompt(fabricAnalysis, roleAssignments, 'checkerboard', 'beginner');
      expect(result).toBe('Assembled role swap prompt');
    });
  });
});
