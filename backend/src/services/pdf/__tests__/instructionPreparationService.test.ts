import { InstructionPreparationService } from '../instructionPreparationService';
import { generateInstructions } from '../../instructions/generateInstructions';
import type { QuiltPattern } from '../../../types/QuiltPattern';

jest.mock('../../instructions/generateInstructions', () => ({
  generateInstructions: jest.fn(),
}));

const mockedGenerateInstructions = jest.mocked(generateInstructions);

function createPattern(overrides: Partial<QuiltPattern> = {}): QuiltPattern {
  return {
    patternId: 'pinwheel',
    patternName: 'Pinwheel',
    difficulty: 'beginner',
    estimatedSize: '60×72 inches',
    description: 'desc',
    fabricLayout: 'layout',
    visualSvg: '<svg></svg>',
    instructions: [],
    ...overrides,
  };
}

describe('InstructionPreparationService', () => {
  const service = new InstructionPreparationService();

  beforeEach(() => {
    mockedGenerateInstructions.mockReset();
    mockedGenerateInstructions.mockReturnValue({
      kind: 'generated',
      instructions: ['step one', 'step two'],
    });
  });

  it('uses requested preset size over estimated size', () => {
    const pattern = createPattern({
      requestedQuiltSize: 'baby',
      estimatedSize: '60×72 inches',
    });

    service.prepareInstructions(pattern);

    expect(mockedGenerateInstructions).toHaveBeenCalledWith(
      'pinwheel',
      { widthIn: 36, heightIn: 52 },
      expect.any(Object)
    );
  });

  it('uses requested explicit dimensions over estimated size', () => {
    const pattern = createPattern({
      requestedQuiltSize: '48x64',
      estimatedSize: '60×72 inches',
    });

    service.prepareInstructions(pattern);

    expect(mockedGenerateInstructions).toHaveBeenCalledWith(
      'pinwheel',
      { widthIn: 48, heightIn: 64 },
      expect.any(Object)
    );
  });

  it('falls back to estimated size when requested size is not provided', () => {
    const pattern = createPattern({
      requestedQuiltSize: undefined,
      estimatedSize: '50×65 inches',
    });

    service.prepareInstructions(pattern);

    expect(mockedGenerateInstructions).toHaveBeenCalledWith(
      'pinwheel',
      { widthIn: 50, heightIn: 65 },
      expect.any(Object)
    );
  });

  it('prepends deterministic instruction metadata line', () => {
    const pattern = createPattern();
    const result = service.prepareInstructions(pattern);

    expect(result.instructions[0]).toBe('Instruction source: DETERMINISTIC (patternId=pinwheel)');
    expect(result.instructions.slice(1)).toEqual(['step one', 'step two']);
  });
});