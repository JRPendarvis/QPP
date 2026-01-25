// src/services/pattern/__tests__/initialPromptBuilder.test.ts

import { InitialPromptBuilder } from '../initialPromptBuilder';

describe('InitialPromptBuilder', () => {
  describe('build', () => {
    it('should include all required parameters in prompt', () => {
      const params = {
        fabricCount: 4,
        patternForSvg: 'checkerboard',
        patternInstruction: 'Create a checkerboard pattern',
        skillDescription: 'Beginner level skills',
        patternDescription: 'A simple checkerboard design',
        patternGuidance: 'Pattern guidance text',
        targetSize: '60×72 inches throw quilt',
        skillLevel: 'beginner',
      };

      const result = InitialPromptBuilder.build(params);

      expect(result).toContain('4 fabric images');
      expect(result).toContain('Create a checkerboard pattern');
      expect(result).toContain('CHECKERBOARD');
      expect(result).toContain('A simple checkerboard design');
      expect(result).toContain('Pattern guidance text');
      expect(result).toContain('Beginner level skills');
      expect(result).toContain('60×72 inches throw quilt');
    });

    it('should uppercase pattern name in critical section', () => {
      const params = {
        fabricCount: 3,
        patternForSvg: 'nine-patch',
        patternInstruction: 'Test',
        skillDescription: 'Test',
        patternDescription: 'Test',
        patternGuidance: '',
        targetSize: '60×72 inches throw quilt',
        skillLevel: 'beginner',
      };

      const result = InitialPromptBuilder.build(params);
      expect(result).toContain('NINE-PATCH');
    });

    it('should include fabric analysis steps', () => {
      const params = {
        fabricCount: 2,
        patternForSvg: 'test',
        patternInstruction: 'Test',
        skillDescription: 'Test',
        patternDescription: 'Test',
        patternGuidance: '',
        targetSize: '60×72 inches throw quilt',
        skillLevel: 'beginner',
      };

      const result = InitialPromptBuilder.build(params);
      expect(result).toContain('STEP 1: ANALYZE EACH FABRIC');
      expect(result).toContain('PRINTED fabric');
      expect(result).toContain('SOLID fabric');
      expect(result).toContain('VALUE: LIGHT / MEDIUM / DARK');
      expect(result).toContain('PRINT SCALE: SOLID / SMALL / MEDIUM / LARGE');
    });

    it('should include role assignment step', () => {
      const params = {
        fabricCount: 2,
        patternForSvg: 'test',
        patternInstruction: 'Test',
        skillDescription: 'Test',
        patternDescription: 'Test',
        patternGuidance: '',
        targetSize: '60×72 inches throw quilt',
        skillLevel: 'beginner',
      };

      const result = InitialPromptBuilder.build(params);
      expect(result).toContain('STEP 2: ASSIGN FABRIC ROLES');
      expect(result).toContain('BACKGROUND / PRIMARY / SECONDARY / ACCENT');
    });

    it('should include JSON schema template', () => {
      const params = {
        fabricCount: 3,
        patternForSvg: 'test',
        patternInstruction: 'Test',
        skillDescription: 'Test',
        patternDescription: 'Test',
        patternGuidance: '',
        targetSize: '60×72 inches throw quilt',
        skillLevel: 'intermediate',
      };

      const result = InitialPromptBuilder.build(params);
      expect(result).toContain('"patternName":');
      expect(result).toContain('"fabricAnalysis":');
      expect(result).toContain('"roleAssignments":');
      expect(result).toContain('"fabricLayout":');
      expect(result).toContain('"instructions":');
    });

    it('should replace all underscores in skill level with global regex', () => {
      const params = {
        fabricCount: 2,
        patternForSvg: 'test',
        patternInstruction: 'Test',
        skillDescription: 'Test',
        patternDescription: 'Test',
        patternGuidance: '',
        targetSize: '60×72 inches throw quilt',
        skillLevel: 'very_advanced_expert',
      };

      const result = InitialPromptBuilder.build(params);
      expect(result).toContain('"difficulty": "very advanced expert"');
      expect(result).not.toContain('very_advanced_expert');
    });

    it('should require exact fabric count in requirements', () => {
      const params = {
        fabricCount: 5,
        patternForSvg: 'test',
        patternInstruction: 'Test',
        skillDescription: 'Test',
        patternDescription: 'Test',
        patternGuidance: '',
        targetSize: '60×72 inches throw quilt',
        skillLevel: 'beginner',
      };

      const result = InitialPromptBuilder.build(params);
      expect(result).toContain('exactly 5 entries');
    });
  });
});
