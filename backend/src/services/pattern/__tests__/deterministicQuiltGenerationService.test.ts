import { DeterministicQuiltGenerationService } from '../deterministicQuiltGenerationService';

jest.mock('../promptBuilder', () => ({
  PromptBuilder: {
    selectPattern: jest.fn(() => ({
      patternForSvg: 'Pinwheel',
      patternInstruction: 'unused',
      patternId: 'pinwheel',
    })),
  },
}));

jest.mock('../patternBuilder', () => ({
  PatternBuilder: {
    build: jest.fn(() => ({
      patternName: 'Pinwheel',
      difficulty: 'intermediate',
      estimatedSize: '60×72 inches',
      description: 'deterministic',
      fabricLayout: '5×6 grid',
      visualSvg: '<svg />',
      instructions: [],
    })),
  },
}));

describe('DeterministicQuiltGenerationService', () => {
  const service = new DeterministicQuiltGenerationService();

  it('recognizes supported patterns and auto mode', () => {
    expect(service.canGenerate('pinwheel')).toBe(true);
    expect(service.canGenerate('auto')).toBe(true);
    expect(service.canGenerate(undefined)).toBe(true);
  });

  it('builds a deterministic quilt pattern for explicit selections', async () => {
    const result = await service.generateQuiltPattern(
      ['img1', 'img2', 'img3', 'img4'],
      'intermediate',
      'pinwheel',
      'default'
    );

    expect(result.patternName).toBe('Pinwheel');
    expect(result.visualSvg).toBe('<svg />');
  });

  it('builds a deterministic quilt pattern for auto mode', async () => {
    const result = await service.generateQuiltPattern(
      ['img1', 'img2', 'img3'],
      'beginner',
      'auto',
      'default'
    );

    expect(result.patternName).toBe('Pinwheel');
    expect(result.visualSvg).toBe('<svg />');
  });
});