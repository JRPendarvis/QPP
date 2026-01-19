import { getPatternsForSkillLevel, getSkillHierarchy, canAccessPattern } from '../skillLevelHelper';

// Mock the skill-levels config
jest.mock('../../config/skill-levels', () => ({
  PATTERNS_BY_SKILL: {
    beginner: ['four-patch', 'strip-quilt', 'nine-patch'],
    advanced_beginner: ['rail-fence', 'log-cabin'],
    intermediate: ['flying-geese', 'churn-dash', 'bear-paw'],
    advanced: ['mariner-compass', 'drunkards-path'],
    expert: ['double-wedding-ring', 'grandmother-flower-garden']
  }
}));

describe('skillLevelHelper', () => {
  describe('getSkillHierarchy', () => {
    it('should return the skill level hierarchy in order', () => {
      const hierarchy = getSkillHierarchy();
      
      expect(hierarchy).toEqual([
        'beginner',
        'advanced_beginner',
        'intermediate',
        'advanced',
        'expert'
      ]);
    });

    it('should return a copy of the hierarchy array', () => {
      const hierarchy1 = getSkillHierarchy();
      const hierarchy2 = getSkillHierarchy();
      
      expect(hierarchy1).not.toBe(hierarchy2); // Different array instances
      expect(hierarchy1).toEqual(hierarchy2); // Same content
    });
  });

  describe('getPatternsForSkillLevel', () => {
    it('should return only beginner patterns for beginner level', () => {
      const patterns = getPatternsForSkillLevel('beginner');
      
      expect(patterns).toEqual(['four-patch', 'strip-quilt', 'nine-patch']);
    });

    it('should return beginner + advanced_beginner patterns for advanced_beginner level', () => {
      const patterns = getPatternsForSkillLevel('advanced_beginner');
      
      expect(patterns).toContain('four-patch');
      expect(patterns).toContain('strip-quilt');
      expect(patterns).toContain('nine-patch');
      expect(patterns).toContain('rail-fence');
      expect(patterns).toContain('log-cabin');
      expect(patterns.length).toBe(5);
    });

    it('should accumulate patterns from all levels up to intermediate', () => {
      const patterns = getPatternsForSkillLevel('intermediate');
      
      // Beginner patterns
      expect(patterns).toContain('four-patch');
      expect(patterns).toContain('strip-quilt');
      expect(patterns).toContain('nine-patch');
      
      // Advanced beginner patterns
      expect(patterns).toContain('rail-fence');
      expect(patterns).toContain('log-cabin');
      
      // Intermediate patterns
      expect(patterns).toContain('flying-geese');
      expect(patterns).toContain('churn-dash');
      expect(patterns).toContain('bear-paw');
      
      expect(patterns.length).toBe(8);
    });

    it('should accumulate patterns from all levels up to advanced', () => {
      const patterns = getPatternsForSkillLevel('advanced');
      
      expect(patterns.length).toBe(10);
      expect(patterns).toContain('mariner-compass');
      expect(patterns).toContain('drunkards-path');
    });

    it('should return all patterns for expert level', () => {
      const patterns = getPatternsForSkillLevel('expert');
      
      expect(patterns.length).toBe(12);
      expect(patterns).toContain('double-wedding-ring');
      expect(patterns).toContain('grandmother-flower-garden');
    });

    it('should default to beginner for unknown skill level', () => {
      const patterns = getPatternsForSkillLevel('unknown');
      
      expect(patterns).toEqual(['four-patch', 'strip-quilt', 'nine-patch']);
    });

    it('should default to beginner for empty string', () => {
      const patterns = getPatternsForSkillLevel('');
      
      expect(patterns).toEqual(['four-patch', 'strip-quilt', 'nine-patch']);
    });

    it('should handle case sensitivity by defaulting to beginner', () => {
      const patterns = getPatternsForSkillLevel('BEGINNER');
      
      expect(patterns).toEqual(['four-patch', 'strip-quilt', 'nine-patch']);
    });
  });

  describe('canAccessPattern', () => {
    it('should allow beginner to access beginner patterns', () => {
      expect(canAccessPattern('beginner', 'four-patch')).toBe(true);
      expect(canAccessPattern('beginner', 'strip-quilt')).toBe(true);
      expect(canAccessPattern('beginner', 'nine-patch')).toBe(true);
    });

    it('should not allow beginner to access higher level patterns', () => {
      expect(canAccessPattern('beginner', 'rail-fence')).toBe(false);
      expect(canAccessPattern('beginner', 'flying-geese')).toBe(false);
      expect(canAccessPattern('beginner', 'mariner-compass')).toBe(false);
      expect(canAccessPattern('beginner', 'double-wedding-ring')).toBe(false);
    });

    it('should allow intermediate to access beginner and intermediate patterns', () => {
      expect(canAccessPattern('intermediate', 'four-patch')).toBe(true);
      expect(canAccessPattern('intermediate', 'rail-fence')).toBe(true);
      expect(canAccessPattern('intermediate', 'flying-geese')).toBe(true);
    });

    it('should not allow intermediate to access advanced patterns', () => {
      expect(canAccessPattern('intermediate', 'mariner-compass')).toBe(false);
      expect(canAccessPattern('intermediate', 'double-wedding-ring')).toBe(false);
    });

    it('should allow expert to access all patterns', () => {
      expect(canAccessPattern('expert', 'four-patch')).toBe(true);
      expect(canAccessPattern('expert', 'rail-fence')).toBe(true);
      expect(canAccessPattern('expert', 'flying-geese')).toBe(true);
      expect(canAccessPattern('expert', 'mariner-compass')).toBe(true);
      expect(canAccessPattern('expert', 'double-wedding-ring')).toBe(true);
    });

    it('should return false for non-existent patterns', () => {
      expect(canAccessPattern('expert', 'non-existent-pattern')).toBe(false);
    });

    it('should handle unknown skill levels by using beginner permissions', () => {
      expect(canAccessPattern('unknown-level', 'four-patch')).toBe(true);
      expect(canAccessPattern('unknown-level', 'rail-fence')).toBe(false);
    });
  });
});
