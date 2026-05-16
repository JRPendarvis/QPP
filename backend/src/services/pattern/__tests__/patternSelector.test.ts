import { PatternSelector } from '../patternSelector';
import { getPatternById, QuiltPattern } from '../../../config/quiltPatterns';

// Mock dependencies
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

const mockedGetPatternById = getPatternById as jest.MockedFunction<typeof getPatternById>;

// Shared test data - reduces duplication
const MOCK_PATTERNS: Record<string, QuiltPattern> = {
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
  'flying-geese': {
    id: 'flying-geese',
    name: 'Flying Geese',
    skillLevel: 'intermediate',
    description: 'Flying geese pattern',
    minColors: 2,
    maxFabrics: 5,
    recommendedFabricCount: 3,
    allowRotation: true,
  },
  'checkerboard': {
    id: 'checkerboard',
    name: 'Checkerboard',
    skillLevel: 'beginner',
    description: 'Checkerboard pattern',
    minColors: 2,
    maxFabrics: 4,
    recommendedFabricCount: 2,
    allowRotation: false,
  },
};

// Helper function to create custom patterns for specific test scenarios
const createMockPattern = (overrides: Partial<QuiltPattern>): QuiltPattern => ({
  id: overrides.id || 'test-pattern',
  name: overrides.name || overrides.id?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Test Pattern',
  skillLevel: overrides.skillLevel || 'intermediate',
  description: overrides.description || 'Test pattern',
  minColors: overrides.minColors ?? 2,
  maxFabrics: overrides.maxFabrics ?? 6,
  recommendedFabricCount: overrides.recommendedFabricCount ?? 4,
  allowRotation: overrides.allowRotation ?? true,
  enabled: overrides.enabled,
});

// Helper to setup pattern mocks
const setupPatternMocks = (patternIds: string[], customPatterns?: Record<string, QuiltPattern>) => {
  const patterns = customPatterns || MOCK_PATTERNS;
  mockedGetPatternById.mockImplementation((id: string) => patterns[id] || undefined);
};

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

      expect(mockedGetPatternById).not.toHaveBeenCalled();
    });
  });

  describe('selectPattern - Auto-selection with skill level priority', () => {
    beforeEach(() => {
      // Use shared mock patterns
      setupPatternMocks(['simple-squares', 'pinwheel', 'mariners-compass', 'storm-at-sea']);
    });

    it('should prioritize patterns at exact skill level for expert users', () => {
      const result = selector.selectPattern('expert', 'auto', 4);

      // Should select from expert patterns (mariners-compass or storm-at-sea)
      expect(result.patternId).toMatch(/mariners-compass|storm-at-sea/);
      expect(result.patternInstruction).toContain('expert');
    });

    it('should fall back to higher skill levels when no exact match exists', () => {
      // Beginner exact patterns do not match fabric count of 6, so fallback should use higher levels
      const customPatterns = {
        'simple-squares': createMockPattern({ id: 'simple-squares', skillLevel: 'beginner', minColors: 2, maxFabrics: 4 }),
        checkerboard: createMockPattern({ id: 'checkerboard', skillLevel: 'beginner', minColors: 2, maxFabrics: 4 }),
        'pinwheel': MOCK_PATTERNS.pinwheel,
        'storm-at-sea': createMockPattern({ id: 'storm-at-sea', skillLevel: 'expert', minColors: 3, maxFabrics: 8 }),
      };
      setupPatternMocks(['simple-squares', 'checkerboard', 'pinwheel', 'storm-at-sea'], customPatterns);

      const result = selector.selectPattern('beginner', 'auto', 6);

      // Should pick from higher-level patterns, not lower than beginner (none lower exists)
      expect(result.patternId).toMatch(/pinwheel|storm-at-sea/);
    });

    it('should filter patterns by fabric count', () => {
      // Only storm-at-sea matches fabric count of 4
      const customPatterns = {
        'storm-at-sea': MOCK_PATTERNS['storm-at-sea'],
        'mariners-compass': createMockPattern({ id: 'mariners-compass', skillLevel: 'expert', minColors: 7, maxFabrics: 10 }),
      };
      setupPatternMocks(['storm-at-sea', 'mariners-compass'], customPatterns);
      
      const result = selector.selectPattern('expert', 'auto', 4);

      expect(result.patternId).toBe('storm-at-sea');
      // Only storm-at-sea matches fabric count of 4 (requires 3-6 fabrics)
    });

    it('should return error when no patterns match criteria', () => {
      const customPatterns = {
        'storm-at-sea': createMockPattern({ id: 'storm-at-sea', skillLevel: 'expert', minColors: 10, maxFabrics: 12 }),
      };
      setupPatternMocks(['storm-at-sea'], customPatterns);

      const result = selector.selectPattern('expert', 'auto', 4);

      expect(result.patternForSvg).toBe('');
      expect(result.patternInstruction).toContain('ERROR');
      expect(result.patternInstruction).toContain('No valid pattern found');
      expect(result.patternId).toBeUndefined();
    });
  });

  describe('selectPattern - Fabric count validation', () => {
    beforeEach(() => {
      const customPatterns = {
        pinwheel: createMockPattern({ id: 'pinwheel', skillLevel: 'intermediate', minColors: 2, maxFabrics: 4 }),
        'storm-at-sea': createMockPattern({ id: 'storm-at-sea', skillLevel: 'expert', minColors: 5, maxFabrics: 8 }),
      };
      setupPatternMocks(['pinwheel', 'storm-at-sea'], customPatterns);
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

      // Should prioritize exact skill level before considering higher levels
      expect(result.patternId).toBe('pinwheel');
      expect(result.patternForSvg).toBeDefined();
    });
  });

  describe('selectPattern - Edge cases', () => {
    it('should handle empty string as selectedPattern (auto mode)', () => {
      setupPatternMocks(['simple-squares', 'checkerboard']);

      const result = selector.selectPattern('beginner', '', 4);

      // Should auto-select one of the beginner patterns
      expect(['simple-squares', 'checkerboard']).toContain(result.patternId);
      expect(result.patternForSvg).toBeDefined();
    });

    it('should handle "auto" as selectedPattern explicitly', () => {
      setupPatternMocks(['simple-squares', 'checkerboard']);

      const result = selector.selectPattern('beginner', 'auto', 2);

      // Should auto-select one of the beginner patterns (random selection from top matches)
      expect(['simple-squares', 'checkerboard']).toContain(result.patternId);
    });

    it('should handle unknown skill level gracefully', () => {
      const result = selector.selectPattern('unknown-level', 'auto', 4);

      expect(result.patternForSvg).toBe('');
      expect(result.patternInstruction).toContain('ERROR');
    });

    it('should exclude disabled patterns from auto-selection', () => {
      const customPatterns = {
        pinwheel: createMockPattern({ 
          id: 'pinwheel', 
          skillLevel: 'intermediate', 
          minColors: 2, 
          maxFabrics: 6,
          enabled: true 
        }),
        'flying-geese': createMockPattern({ 
          id: 'flying-geese', 
          skillLevel: 'intermediate', 
          minColors: 2, 
          maxFabrics: 6,
          enabled: false 
        }),
      };
      setupPatternMocks(['pinwheel', 'flying-geese'], customPatterns);

      const result = selector.selectPattern('intermediate', 'auto', 4);

      // Should only select enabled pattern, never disabled one
      expect(result.patternId).toBe('pinwheel');
      expect(result.patternId).not.toBe('flying-geese');
    });

    it('should treat patterns without enabled property as enabled', () => {
      const customPatterns = {
        'simple-squares': createMockPattern({ 
          id: 'simple-squares', 
          skillLevel: 'beginner', 
          minColors: 2, 
          maxFabrics: 6
          // enabled property not set - should default to enabled
        }),
      };
      setupPatternMocks(['simple-squares'], customPatterns);

      const result = selector.selectPattern('beginner', 'auto', 4);

      // Pattern without enabled flag should be selectable
      expect(result.patternId).toBe('simple-squares');
    });
  });

  describe('Pattern instruction formatting', () => {
    it('should include skill level in auto-selected pattern instruction', () => {
      setupPatternMocks(['flying-geese']);

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
