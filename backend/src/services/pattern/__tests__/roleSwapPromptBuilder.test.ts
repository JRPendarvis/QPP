// src/services/pattern/__tests__/roleSwapPromptBuilder.test.ts

import { RoleSwapPromptBuilder } from '../roleSwapPromptBuilder';

describe('RoleSwapPromptBuilder', () => {
  describe('build', () => {
    it('should include all required parameters', () => {
      const params = {
        patternForSvg: 'checkerboard',
        fabricSummary: 'Fabric summary text',
        rolesSummary: 'Roles summary text',
        patternDescription: 'Pattern description',
        patternGuidance: 'Pattern guidance',
        skillDescription: 'Skill description',
        targetSize: '60×72 inches throw quilt',
      };

      const result = RoleSwapPromptBuilder.build(params);

      expect(result).toContain('checkerboard');
      expect(result).toContain('Fabric summary text');
      expect(result).toContain('Roles summary text');
      expect(result).toContain('Pattern description');
      expect(result).toContain('Pattern guidance');
      expect(result).toContain('Skill description');
      expect(result).toContain('60×72 inches throw quilt');
    });

    it('should include fabric and role sections', () => {
      const params = {
        patternForSvg: 'test',
        fabricSummary: 'Test fabrics',
        rolesSummary: 'Test roles',
        patternDescription: 'Test',
        patternGuidance: 'Test',
        skillDescription: 'Test',
        targetSize: '60×72 inches throw quilt',
      };

      const result = RoleSwapPromptBuilder.build(params);
      expect(result).toContain('**FABRICS:**');
      expect(result).toContain("**USER'S ROLE ASSIGNMENTS:**");
    });

    it('should include simplified JSON schema', () => {
      const params = {
        patternForSvg: 'test',
        fabricSummary: 'Test',
        rolesSummary: 'Test',
        patternDescription: 'Test',
        patternGuidance: 'Test',
        skillDescription: 'Test',
        targetSize: '60×72 inches throw quilt',
      };

      const result = RoleSwapPromptBuilder.build(params);
      expect(result).toContain('"fabricLayout":');
      expect(result).toContain('"instructions":');
      expect(result).toContain('"warnings":');
      expect(result).not.toContain('"fabricAnalysis":'); // Should not be in role swap
    });

    it('should mention target size in generation instructions', () => {
      const params = {
        patternForSvg: 'test',
        fabricSummary: 'Test',
        rolesSummary: 'Test',
        patternDescription: 'Test',
        patternGuidance: 'Test',
        skillDescription: 'Test',
        targetSize: '90×95 inches queen quilt',
      };

      const result = RoleSwapPromptBuilder.build(params);
      expect(result).toContain('90×95 inches queen quilt');
    });
  });
});
