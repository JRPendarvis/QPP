// Mock OpenAI module to prevent initialization error
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockRejectedValue(new Error('Mock error'))
      }
    },
    images: {
      generate: jest.fn().mockRejectedValue(new Error('Mock error'))
    }
  }));
});

import { FabricImageAnalyzer } from '../fabricImageAnalyzer';
import { QuiltImageGenerator } from '../quiltImageGenerator';
import { OpenAiService } from '../openAiService';

// Mock console methods to avoid noise in test output
global.console.log = jest.fn();
global.console.error = jest.fn();

describe('OpenAiService Integration', () => {
  describe('Service Interfaces', () => {
    it('should have FabricImageAnalyzer with analyze method', () => {
      const analyzer = new FabricImageAnalyzer();
      expect(analyzer).toHaveProperty('analyze');
      expect(typeof analyzer.analyze).toBe('function');
    });

    it('should have QuiltImageGenerator with generate method', () => {
      const generator = new QuiltImageGenerator();
      expect(generator).toHaveProperty('generate');
      expect(typeof generator.generate).toBe('function');
    });

    it('should have OpenAiService with legacy methods', () => {
      const service = new OpenAiService();
      expect(service).toHaveProperty('analyzeFabricImages');
      expect(service).toHaveProperty('generateQuiltImage');
      expect(typeof service.analyzeFabricImages).toBe('function');
      expect(typeof service.generateQuiltImage).toBe('function');
    });
  });

  describe('Fabric Image Analysis Error Handling', () => {
    it('should return fallback descriptions on error', async () => {
      const analyzer = new FabricImageAnalyzer();
      
      // Provide invalid images to trigger error path
      const result = await analyzer.analyze(['', '']);
      
      // Should return fallback values, not throw
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result.every(desc => typeof desc === 'string')).toBe(true);
    });

    it('should handle empty array input', async () => {
      const analyzer = new FabricImageAnalyzer();
      const result = await analyzer.analyze([]);
      
      expect(result).toEqual([]);
    });
  });

  describe('Quilt Image Generation Error Handling', () => {
    it('should return empty string on generation error', async () => {
      const generator = new QuiltImageGenerator();
      
      // Provide minimal/invalid inputs to test error handling
      const result = await generator.generate('', '', [], '');
      
      // Should return empty string, not throw
      expect(result).toBe('');
    });

    it('should handle empty fabric descriptions', async () => {
      const generator = new QuiltImageGenerator();
      const result = await generator.generate('Test Pattern', 'Description', [], 'pattern-type');
      
      // Should not throw, returns empty string or valid URL
      expect(typeof result).toBe('string');
    });
  });

  describe('Legacy OpenAiService Compatibility', () => {
    it('should delegate analyzeFabricImages to FabricImageAnalyzer', async () => {
      const service = new OpenAiService();
      
      const result = await service.analyzeFabricImages(['', '']);
      
      // Should return array of descriptions
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });

    it('should delegate generateQuiltImage to both services', async () => {
      const service = new OpenAiService();
      
      const result = await service.generateQuiltImage('Pattern', 'Description', [''], 'type');
      
      // Should return string (empty or URL)
      expect(typeof result).toBe('string');
    });
  });

  describe('Service Construction', () => {
    it('should create analyzer without errors', () => {
      expect(() => new FabricImageAnalyzer()).not.toThrow();
    });

    it('should create generator without errors', () => {
      expect(() => new QuiltImageGenerator()).not.toThrow();
    });

    it('should create OpenAiService without errors', () => {
      expect(() => new OpenAiService()).not.toThrow();
    });
  });
});
