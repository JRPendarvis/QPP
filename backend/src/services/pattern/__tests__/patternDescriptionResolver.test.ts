// src/services/pattern/__tests__/patternDescriptionResolver.test.ts

import { PatternDescriptionResolver } from '../patternDescriptionResolver';
import { PatternFormatter } from '../../../utils/patternFormatter';

jest.mock('../../../utils/patternFormatter', () => ({
  PatternFormatter: {
    getPatternDescription: jest.fn(),
  },
}));

describe('PatternDescriptionResolver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDescription', () => {
    it('should return characteristics from patternPrompt when provided', () => {
      const patternPrompt = {
        characteristics: 'Test characteristics',
      };
      const result = PatternDescriptionResolver.getDescription('checkerboard', patternPrompt);
      expect(result).toBe('Test characteristics');
      expect(PatternFormatter.getPatternDescription).not.toHaveBeenCalled();
    });

    it('should use PatternFormatter when patternPrompt is null', () => {
      (PatternFormatter.getPatternDescription as jest.Mock).mockReturnValue('Formatter description');
      const result = PatternDescriptionResolver.getDescription('checkerboard', null);
      expect(result).toBe('Formatter description');
      expect(PatternFormatter.getPatternDescription).toHaveBeenCalledWith('checkerboard');
    });

    it('should use PatternFormatter when patternPrompt is undefined', () => {
      (PatternFormatter.getPatternDescription as jest.Mock).mockReturnValue('Formatter description');
      const result = PatternDescriptionResolver.getDescription('four-patch', undefined);
      expect(result).toBe('Formatter description');
      expect(PatternFormatter.getPatternDescription).toHaveBeenCalledWith('four-patch');
    });
  });
});

