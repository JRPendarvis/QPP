import { PatternSelector } from '../patternSelector';
import { getPatternsForSkillLevel } from '../../../utils/skillLevelHelper';
import { getPatternById } from '../../../config/quiltPatterns';
import { PATTERNS_BY_SKILL } from '../../../config/skill-levels';

// Mock dependencies
jest.mock('../../../utils/skillLevelHelper');
jest.mock('../../../config/quiltPatterns');
jest.mock('../../../config/skill-levels', () => ({
  PATTERNS_BY_SKILL: {
    beginner: ['simple-squares', 'checkerboard'],
    advanced_beginner: ['four-patch', 'nine-patch'],
    intermediate: ['flying-geese', 'pinwheel'],
    advanced: ['sawtooth-star', 'ohio-star'],
    expert: ['mariners-compass', 'storm-at-sea'],
  },
}));

const mockedGetPatternsForSkillLevel = getPatternsForSkillLevel as jest.MockedFunction<typeof getPatternsForSkillLevel>;
const mockedGetPatternById = getPatternById as jest.MockedFunction<typeof getPatternById>;

describe('PatternSelector', () => {
  let selector: PatternSelector;

  beforeEach(() => {
    selector = new PatternSelector();
    jest.clearAllMocks();
  });

  describe('selectPattern - User-chosen pattern', () => {
    it('should return user-chosen pattern when selectedPattern is provided', () => {
      const result = selector.selectPattern('intermediate', 'flying-geese', 4);

      expect(result.patternForSvg).toBe('Flying Geese');
      expect(result.patternId).toBe('flying-geese');
      expect(result.patternInstruction).toContain('Flying Geese');
      expect(result.patternInstruction).toContain('user\'s specific choice');
    });

    it('should ignore skillLevel when user selects specific pattern', () => {
      const result = selector.selectPattern('beginner', 'mariners-compass', 6);

      expect(result.patternForSvg).toBe("Mariner's Compass");
      expect(result.patternId).toBe('mariners-compass');
    });

    it('should not call auto-selection when pattern is selected', () => {
      selector.selectPattern('intermediate', 'pinwheel', 4);

      expect(mockedGetPatternsForSkillLevel).not.toHaveBeenCalled();
    });
  });

  describe('selectPattern - Auto-selection with skill level priority', () => {
    beforeEach(() => {
      // Setup mock patterns with different characteristics
      const mockPatterns = {
        'mariners-compass': {
          id: 'mariners-compass',
          name: 'Mariners Compass',
          skillLevel: 'expert',
          description: 'Complex compass design',
          minColors: 4,
          maxFabrics: 8,
          recommendedFabricCount: 6,
          allowRotation: true,
        },
        'storm-at-sea': {
          id: 'storm-at-sea',
          name: 'Storm at Sea',
          skillLevel: 'expert',
          description: 'Intricate curved pattern',
          minColors: 3,
          maxFabrics: 6,
          recommendedFabricCount: 4,
          allowRotation: true,
        },
        'pinwheel': {
          id: 'pinwheel',
          name: 'Pinwheel',
          skillLevel: 'intermediate',
          description: 'Spinning pinwheel blocks',
          minColors: 2,
          maxFabrics: 5,
          recommendedFabricCount: 3,
          allowRotation: true,
        },
        'simple-squares': {
          id: 'simple-squares',
          name: 'Simple Squares',
          skillLevel: 'beginner',
          description: 'Basic square blocks',
          minColors: 2,
          maxFabrics: 8,
          recommendedFabricCount: 4,
          allowRotation: false,
        },
      };

      mockedGetPatternById.mockImplementation((id: string) => mockPatterns[id as keyof typeof mockPatterns] || undefined);
    });

    it('should prioritize patterns at exact skill level for expert users', () => {
      // Mock: Expert-level patterns available
      mockedGetPatternsForSkillLevel.mockReturnValue([
        'simple-squares', 'pinwheel', 'mariners-compass', 'storm-at-sea'
      ]);

      const result = selector.selectPattern('expert', 'auto', 4);

      // Should select from expert patterns (mariners-compass or storm-at-sea)
      expect(result.patternId).toMatch(/mariners-compass|storm-at-sea/);
      expect(result.patternInstruction).toContain('expert');
    });

    it('should fall back to lower skill levels when no exact match exists', () => {
      // First call for exact level returns empty (no expert patterns match fabric count)
      // Second call for all accessible levels returns patterns
      mockedGetPatternsForSkillLevel.mockReturnValue([
        'simple-squares', 'pinwheel', 'mariners-compass', 'storm-at-sea'
      ]);

      // Mock getPatternById to return null for expert patterns with this fabric count
      mockedGetPatternById.mockImplementation((id: string) => {
        if (id === 'mariners-compass' || id === 'storm-at-sea') {
          return {
            id,
            name: id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            skillLevel: 'expert',
            description: 'Expert pattern',
            minColors: 6, // Don't match fabric count of 2
            maxFabrics: 8,
            recommendedFabricCount: 6,
            allowRotation: true,
          };
        }
        return {
          id,
          name: id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          skillLevel: 'intermediate',
          description: 'Intermediate pattern',
          minColors: 2,
          maxFabrics: 5,
          recommendedFabricCount: 3,
          allowRotation: true,
        };
      });

      const result = selector.selectPattern('expert', 'auto', 2);

      // Should fall back to lower level patterns that match fabric count
      expect(result.patternId).toBeDefined();
      expect(result.patternForSvg).toBeDefined();
    });

    it('should filter patterns by fabric count', () => {
      // Reset for this specific test - only storm-at-sea matches fabric count of 4
      mockedGetPatternsForSkillLevel.mockReturnValue(['storm-at-sea', 'mariners-compass']);
      mockedGetPatternById.mockImplementation((id: string) => {
        if (id === 'storm-at-sea') {
          return {
            id: 'storm-at-sea',
            name: 'Storm at Sea',
            skillLevel: 'expert',
            description: 'Complex curved pattern',
            minColors: 3,
            maxFabrics: 6,
            recommendedFabricCount: 4,
            allowRotation: true,
          };
        }
        if (id === 'mariners-compass') {
          return {
            id: 'mariners-compass',
            name: "Mariner's Compass",
            skillLevel: 'expert',
            description: 'Complex compass design',
            minColors: 7, // Doesn't match fabric count of 4
            maxFabrics: 10,
            recommendedFabricCount: 8,
            allowRotation: true,
          };
        }
        return undefined;
      });
      
      const result = selector.selectPattern('expert', 'auto', 4);

      expect(result.patternId).toBe('storm-at-sea');
      // Only storm-at-sea matches fabric count of 4 (requires 3-6 fabrics)
    });

    it('should return error when no patterns match criteria', () => {
      // Mock with patterns that don't match fabric count
      mockedGetPatternsForSkillLevel.mockReturnValue(['storm-at-sea']);
      mockedGetPatternById.mockReturnValue({
        id: 'storm-at-sea',
        name: 'Storm at Sea',
        skillLevel: 'expert',
        description: 'Complex pattern',
        minColors: 10, // Doesn't match fabric count
        maxFabrics: 12,
        recommendedFabricCount: 10,
        allowRotation: true,
      });

      const result = selector.selectPattern('expert', 'auto', 4);

      expect(result.patternForSvg).toBe('');
      expect(result.patternInstruction).toContain('ERROR');
      expect(result.patternInstruction).toContain('No valid pattern found');
      expect(result.patternId).toBeUndefined();
    });
  });

  describe('selectPattern - Fabric count validation', () => {
    beforeEach(() => {
      mockedGetPatternsForSkillLevel.mockReturnValue(['pinwheel', 'storm-at-sea']);
      mockedGetPatternById.mockImplementation((id: string) => {
        if (id === 'pinwheel') {
          return {
            id: 'pinwheel',
            name: 'Pinwheel',
            skillLevel: 'intermediate',
            description: 'Spinning pattern',
            minColors: 2,
            maxFabrics: 4,
            recommendedFabricCount: 3,
            allowRotation: true,
          };
        }
        if (id === 'storm-at-sea') {
          return {
            id: 'storm-at-sea',
            name: 'Storm at Sea',
            skillLevel: 'expert',
            description: 'Complex curved pattern',
            minColors: 5,
            maxFabrics: 8,
            recommendedFabricCount: 6,
            allowRotation: true,
          };
        }
        return undefined;
      });
    });

    it('should select pattern matching fabric count range', () => {
      const result = selector.selectPattern('intermediate', 'auto', 3);

      // Only pinwheel (2-4 fabrics) matches, not storm-at-sea (5-8 fabrics)
      expect(result.patternId).toBe('pinwheel');
    });

    it('should handle fabricCount at minimum threshold', () => {
      const result = selector.selectPattern('intermediate', 'auto', 2);

      expect(result.patternId).toBe('pinwheel');
    });

    it('should handle fabricCount at maximum threshold', () => {
      const result = selector.selectPattern('intermediate', 'auto', 8);

      expect(result.patternId).toBe('storm-at-sea');
    });

    it('should work without fabricCount parameter', () => {
      const result = selector.selectPattern('intermediate', 'auto');

      // Should not filter by fabric count
      expect(result.patternId).toMatch(/pinwheel|storm-at-sea/);
      expect(result.patternForSvg).toBeDefined();
    });
  });

  describe('selectPattern - Edge cases', () => {
    it('should handle empty string as selectedPattern (auto mode)', () => {
      mockedGetPatternsForSkillLevel.mockReturnValue(['simple-squares']);
      mockedGetPatternById.mockReturnValue({
        id: 'simple-squares',
        name: 'Simple Squares',
        skillLevel: 'beginner',
        description: 'Basic squares',
        minColors: 2,
        maxFabrics: 6,
        recommendedFabricCount: 4,
        allowRotation: false,
      });

      const result = selector.selectPattern('beginner', '', 4);

      expect(result.patternId).toBe('simple-squares');
    });

    it('should handle "auto" as selectedPattern explicitly', () => {
      mockedGetPatternsForSkillLevel.mockReturnValue(['checkerboard']);
      mockedGetPatternById.mockReturnValue({
        id: 'checkerboard',
        name: 'Checkerboard',
        skillLevel: 'beginner',
        description: 'Checkerboard pattern',
        minColors: 2,
        maxFabrics: 4,
        recommendedFabricCount: 2,
        allowRotation: false,
      });

      const result = selector.selectPattern('beginner', 'auto', 2);

      expect(result.patternId).toBe('checkerboard');
    });

    it('should handle unknown skill level gracefully', () => {
      mockedGetPatternsForSkillLevel.mockReturnValue([]);

      const result = selector.selectPattern('unknown-level', 'auto', 4);

      expect(result.patternForSvg).toBe('');
      expect(result.patternInstruction).toContain('ERROR');
    });
  });

  describe('Pattern instruction formatting', () => {
    it('should include skill level in auto-selected pattern instruction', () => {
      mockedGetPatternsForSkillLevel.mockReturnValue(['flying-geese']);
      mockedGetPatternById.mockReturnValue({
        id: 'flying-geese',
        name: 'Flying Geese',
        skillLevel: 'intermediate',
        description: 'Flying geese pattern',
        minColors: 2,
        maxFabrics: 5,
        recommendedFabricCount: 3,
        allowRotation: true,
      });

      const result = selector.selectPattern('intermediate', 'auto', 3);

      expect(result.patternInstruction).toContain('intermediate skill level');
    });

    it('should format pattern name correctly in instruction', () => {
      const result = selector.selectPattern('expert', 'mariners-compass', 6);

      expect(result.patternInstruction).toContain("Mariner's Compass");
      expect(result.patternForSvg).toBe("Mariner's Compass");
    });
  });
});
