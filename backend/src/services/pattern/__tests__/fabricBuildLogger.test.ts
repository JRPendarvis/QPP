import { FabricBuildLogger } from '../fabricBuildLogger';

describe('FabricBuildLogger', () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe('log', () => {
    it('should log fabric building context', () => {
      const analysis = [
        { type: 'printed', fabricType: undefined },
        { type: 'solid', fabricType: undefined }
      ];
      const colors: string[] = [];
      const images = ['img1.jpg', 'img2.jpg'];

      FabricBuildLogger.log(analysis, colors, images);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '🧵 [FabricAssembler] Building fabrics:',
        {
          fabricAnalysisCount: 2,
          fabricColorsCount: 0,
          fabricImagesCount: 2,
          analysis: [
            { type: 'printed', fabricType: undefined, hasImage: true },
            { type: 'solid', fabricType: undefined, hasImage: true }
          ]
        }
      );
    });

    it('should handle empty arrays', () => {
      FabricBuildLogger.log([], [], []);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '🧵 [FabricAssembler] Building fabrics:',
        {
          fabricAnalysisCount: 0,
          fabricColorsCount: 0,
          fabricImagesCount: 0,
          analysis: []
        }
      );
    });

    it('should correctly map hasImage based on fabricImages array', () => {
      const analysis = [
        { type: 'printed' },
        { type: 'solid' },
        { type: 'printed' }
      ];
      const images = ['img1.jpg'];

      FabricBuildLogger.log(analysis, [], images);

      const loggedData = consoleLogSpy.mock.calls[0][1];
      expect(loggedData.analysis[0].hasImage).toBe(true);
      expect(loggedData.analysis[1].hasImage).toBe(false);
      expect(loggedData.analysis[2].hasImage).toBe(false);
    });
  });
});
