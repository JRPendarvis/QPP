// src/services/pattern/__tests__/skillLevelResolver.test.ts

import { SkillLevelResolver } from '../skillLevelResolver';

describe('SkillLevelResolver', () => {
  describe('getDescription', () => {
    it('should return beginner description for beginner skill level', () => {
      const result = SkillLevelResolver.getDescription('beginner');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return intermediate description for intermediate skill level', () => {
      const result = SkillLevelResolver.getDescription('intermediate');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return advanced description for advanced skill level', () => {
      const result = SkillLevelResolver.getDescription('advanced');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should default to beginner for unknown skill level', () => {
      const result = SkillLevelResolver.getDescription('unknown');
      const beginnerResult = SkillLevelResolver.getDescription('beginner');
      expect(result).toBe(beginnerResult);
    });

    it('should default to beginner for empty string', () => {
      const result = SkillLevelResolver.getDescription('');
      const beginnerResult = SkillLevelResolver.getDescription('beginner');
      expect(result).toBe(beginnerResult);
    });

    it('should return different descriptions for different skill levels', () => {
      const beginner = SkillLevelResolver.getDescription('beginner');
      const intermediate = SkillLevelResolver.getDescription('intermediate');
      const advanced = SkillLevelResolver.getDescription('advanced');
      
      expect(beginner).not.toBe(intermediate);
      expect(intermediate).not.toBe(advanced);
      expect(beginner).not.toBe(advanced);
    });
  });
});
