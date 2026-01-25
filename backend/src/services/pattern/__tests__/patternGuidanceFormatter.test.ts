// src/services/pattern/__tests__/patternGuidanceFormatter.test.ts

import { PatternGuidanceFormatter } from '../patternGuidanceFormatter';

describe('PatternGuidanceFormatter', () => {
  describe('buildFullGuidance', () => {
    it('should return empty string when patternPrompt is null', () => {
      const result = PatternGuidanceFormatter.buildFullGuidance('checkerboard', null);
      expect(result).toBe('');
    });

    it('should return empty string when patternPrompt is undefined', () => {
      const result = PatternGuidanceFormatter.buildFullGuidance('checkerboard', undefined);
      expect(result).toBe('');
    });

    it('should build full guidance when patternPrompt is provided', () => {
      const patternPrompt = {
        fabricRoleGuidance: 'Role guidance text',
        cuttingInstructions: 'Cutting instructions text',
        assemblyNotes: 'Assembly notes text',
        commonMistakes: 'Common mistakes text',
      };
      const result = PatternGuidanceFormatter.buildFullGuidance('checkerboard', patternPrompt);
      
      expect(result).toContain('PATTERN-SPECIFIC GUIDANCE FOR CHECKERBOARD:');
      expect(result).toContain('Role guidance text');
      expect(result).toContain('Cutting Guidance:');
      expect(result).toContain('Cutting instructions text');
      expect(result).toContain('Assembly Guidance:');
      expect(result).toContain('Assembly notes text');
      expect(result).toContain('Common Mistakes to Avoid:');
      expect(result).toContain('Common mistakes text');
    });

    it('should uppercase pattern name in guidance header', () => {
      const patternPrompt = {
        fabricRoleGuidance: 'Test',
        cuttingInstructions: 'Test',
        assemblyNotes: 'Test',
        commonMistakes: 'Test',
      };
      const result = PatternGuidanceFormatter.buildFullGuidance('nine-patch', patternPrompt);
      expect(result).toContain('NINE-PATCH:');
    });
  });

  describe('buildRoleSwapGuidance', () => {
    it('should return empty string when patternPrompt is null', () => {
      const result = PatternGuidanceFormatter.buildRoleSwapGuidance(null);
      expect(result).toBe('');
    });

    it('should return empty string when patternPrompt is undefined', () => {
      const result = PatternGuidanceFormatter.buildRoleSwapGuidance(undefined);
      expect(result).toBe('');
    });

    it('should build simplified guidance when patternPrompt is provided', () => {
      const patternPrompt = {
        fabricRoleGuidance: 'Role guidance text',
        assemblyNotes: 'Assembly notes text',
      };
      const result = PatternGuidanceFormatter.buildRoleSwapGuidance(patternPrompt);
      
      expect(result).toContain('PATTERN-SPECIFIC GUIDANCE:');
      expect(result).toContain('Role guidance text');
      expect(result).toContain('Assembly notes text');
    });

    it('should not include cutting or mistakes sections', () => {
      const patternPrompt = {
        fabricRoleGuidance: 'Role guidance',
        assemblyNotes: 'Assembly notes',
        cuttingInstructions: 'Should not appear',
        commonMistakes: 'Should not appear',
      };
      const result = PatternGuidanceFormatter.buildRoleSwapGuidance(patternPrompt);
      
      expect(result).not.toContain('Cutting');
      expect(result).not.toContain('Common Mistakes');
      expect(result).not.toContain('Should not appear');
    });
  });
});
