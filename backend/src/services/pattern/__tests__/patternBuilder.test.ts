import { PatternBuilder } from '../patternBuilder';
import { ClaudeResponse } from '../../../types/ClaudeResponse';
import { BorderConfiguration } from '../../../types/Border';

// Mock all dependencies
jest.mock('../../../utils/svgGenerator', () => ({
  SvgGenerator: {
    generateFromTemplate: jest.fn(() => '<svg>Mock SVG</svg>')
  }
}));

jest.mock('../instructionValidator', () => ({
  InstructionValidator: {
    validate: jest.fn((instructions) => instructions || [])
  }
}));

jest.mock('../../../utils/borderSizeCalculator', () => ({
  BorderSizeCalculator: {
    calculateBorderDimensions: jest.fn(() => ({
      innerBorder: { width: 2, perimeter: 100 },
      outerBorder: { width: 3, perimeter: 120 }
    }))
  }
}));

jest.mock('../fabricAssembler', () => ({
  FabricAssembler: {
    allocateFabrics: jest.fn((images, config) => ({
      patternImages: config?.enabled ? images.slice(0, -1) : images,
      borderImages: config?.enabled ? [images[images.length - 1]] : []
    })),
    buildPatternFabrics: jest.fn((response, images) => 
      images.map((img: string, idx: number) => ({
        color: `#${idx}${idx}${idx}${idx}${idx}${idx}`,
        type: 'solid' as const,
        image: img
      }))
    ),
    buildBorderFabrics: jest.fn((images) =>
      images.map((img: string) => ({
        color: '#CCCCCC',
        type: 'printed' as const,
        image: img
      }))
    ),
    combineAllFabrics: jest.fn((pattern, border) => [...pattern, ...border])
  }
}));

jest.mock('../sizeResolver', () => ({
  SizeResolver: {
    getDisplaySize: jest.fn((size, claude) => size ? '90×95 inches' : '60×72 inches'),
    parseDimensions: jest.fn((size) => ({ widthIn: 90, heightIn: 95 }))
  }
}));

jest.mock('../patternMetadataFormatter', () => ({
  PatternMetadataFormatter: {
    extractPatternName: jest.fn((claude, pattern) => 'Nine Patch'),
    formatDifficulty: jest.fn((diff) => diff.replace(/_/g, ' ')),
    getBorderFabricName: jest.fn((idx, total) => 
      total === 1 ? 'Border' : idx === 0 ? 'Inner Border' : 'Outer Border'
    )
  }
}));

jest.mock('../layoutComputer', () => ({
  LayoutComputer: {
    computeAccurateLayout: jest.fn(() => '5×6 grid of 12" blocks'),
    enhanceLayout: jest.fn((computed, claude) => computed || claude)
  }
}));

jest.mock('../requirementsCalculator', () => ({
  RequirementsCalculator: {
    calculateAllRequirements: jest.fn(() => [
      { role: 'Fabric 1', yards: 2.5, description: 'Primary fabric' },
      { role: 'Fabric 2', yards: 2.0, description: 'Secondary fabric' }
    ])
  }
}));

describe('PatternBuilder', () => {
  const mockResponse: ClaudeResponse = {
    patternName: 'Test Nine Patch',
    description: 'A beautiful test pattern',
    estimatedSize: '60×72 inches',
    instructions: ['Step 1', 'Step 2'],
    fabricLayout: 'Test layout',
    fabricAnalysis: [
      { fabricIndex: 0, dominantColor: '#FF0000', type: 'solid', description: 'Red fabric', value: 'medium', printScale: 'solid' }
    ],
    fabricColors: ['#FF0000']
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('build', () => {
    it('should build complete pattern without borders', () => {
      const result = PatternBuilder.build(
        mockResponse,
        'nine-patch',
        'beginner',
        ['img1']
      );

      expect(result.patternName).toBe('Nine Patch');
      expect(result.difficulty).toBe('beginner');
      expect(result.estimatedSize).toBe('60×72 inches');
      expect(result.visualSvg).toBe('<svg>Mock SVG</svg>');
      expect(result.fabricRequirements).toHaveLength(2);
      expect(result.fabricImages).toEqual(['img1']);
    });

    it('should build pattern with borders', () => {
      const borderConfig: BorderConfiguration = {
        enabled: true,
        borders: [{ id: 'b1', width: 2, fabricIndex: 0, order: 1 }]
      };

      const result = PatternBuilder.build(
        mockResponse,
        'nine-patch',
        'beginner',
        ['img1', 'border1'],
        'queen',
        borderConfig
      );

      expect(result.borderConfiguration).toBeDefined();
      expect(result.borderDimensions).toBeDefined();
    });

    it('should use quilt size when provided', () => {
      const result = PatternBuilder.build(
        mockResponse,
        'nine-patch',
        'beginner',
        ['img1'],
        'queen'
      );

      expect(result.estimatedSize).toBe('90×95 inches');
    });

    it('should format difficulty correctly', () => {
      const result = PatternBuilder.build(
        mockResponse,
        'nine-patch',
        'skill_level_beginner',
        ['img1']
      );

      expect(result.difficulty).toBe('skill level beginner');
    });

    it('should include fabric layout', () => {
      const result = PatternBuilder.build(
        mockResponse,
        'nine-patch',
        'beginner',
        ['img1']
      );

      expect(result.fabricLayout).toBe('5×6 grid of 12" blocks');
    });

    it('should use default description when none provided', () => {
      const responseWithoutDesc = { ...mockResponse, description: '' };
      
      const result = PatternBuilder.build(
        responseWithoutDesc,
        'nine-patch',
        'beginner',
        ['img1']
      );

      expect(result.description).toContain('nine-patch');
    });

    it('should handle multiple fabric images', () => {
      const result = PatternBuilder.build(
        mockResponse,
        'nine-patch',
        'beginner',
        ['img1', 'img2', 'img3']
      );

      expect(result.fabricImages).toHaveLength(3);
    });

    it('should validate instructions', () => {
      const result = PatternBuilder.build(
        mockResponse,
        'nine-patch',
        'beginner',
        ['img1']
      );

      expect(result.instructions).toEqual(['Step 1', 'Step 2']);
    });
  });
});
