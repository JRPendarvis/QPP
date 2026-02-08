import { FabricCoordinationService } from '../fabricCoordinationService';
import Anthropic from '@anthropic-ai/sdk';

// Mock Anthropic SDK
jest.mock('@anthropic-ai/sdk');

// Mock console to avoid noise in test output
global.console.log = jest.fn();
global.console.error = jest.fn();

describe('FabricCoordinationService', () => {
  let service: FabricCoordinationService;
  let mockAnthropicCreate: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock for Anthropic client
    mockAnthropicCreate = jest.fn();
    (Anthropic as jest.MockedClass<typeof Anthropic>).mockImplementation(() => ({
      messages: {
        create: mockAnthropicCreate,
      },
    } as any));

    service = new FabricCoordinationService();
  });

  describe('autoAssignRoles - Success cases', () => {
    it('should successfully assign fabric roles with all 4 roles', async () => {
      const mockResponse = {
        content: [{
          type: 'text',
          text: JSON.stringify({
            background: 3,
            primary: 1,
            secondary: 2,
            accent: 4,
            reasoning: 'Fabric 3 provides subtle background, 1 is bold primary, 2 complements, 4 adds contrast.'
          })
        }]
      };
      mockAnthropicCreate.mockResolvedValue(mockResponse);

      const fabrics = [
        { imageData: 'base64data1', fileName: 'fabric1.jpg' },
        { imageData: 'base64data2', fileName: 'fabric2.jpg' },
        { imageData: 'base64data3', fileName: 'fabric3.jpg' },
        { imageData: 'base64data4', fileName: 'fabric4.jpg' },
      ];

      const result = await service.autoAssignRoles(fabrics);

      expect(result).toEqual({
        background: 'fabric3.jpg',
        primary: 'fabric1.jpg',
        secondary: 'fabric2.jpg',
        accent: 'fabric4.jpg',
      });
    });

    it('should assign roles without accent when not provided by AI', async () => {
      const mockResponse = {
        content: [{
          type: 'text',
          text: JSON.stringify({
            background: 2,
            primary: 1,
            secondary: 3,
            reasoning: 'No fabric suitable for accent role.'
          })
        }]
      };
      mockAnthropicCreate.mockResolvedValue(mockResponse);

      const fabrics = [
        { imageData: 'base64data1', fileName: 'fabric1.jpg' },
        { imageData: 'base64data2', fileName: 'fabric2.jpg' },
        { imageData: 'base64data3', fileName: 'fabric3.jpg' },
      ];

      const result = await service.autoAssignRoles(fabrics);

      expect(result).toEqual({
        background: 'fabric2.jpg',
        primary: 'fabric1.jpg',
        secondary: 'fabric3.jpg',
      });
      expect(result.accent).toBeUndefined();
    });

    it('should handle markdown code blocks in AI response', async () => {
      const mockResponse = {
        content: [{
          type: 'text',
          text: '```json\n{"background": 1, "primary": 2, "secondary": 3, "reasoning": "Test"}\n```'
        }]
      };
      mockAnthropicCreate.mockResolvedValue(mockResponse);

      const fabrics = [
        { imageData: 'data1', fileName: 'f1.jpg' },
        { imageData: 'data2', fileName: 'f2.jpg' },
        { imageData: 'data3', fileName: 'f3.jpg' },
      ];

      const result = await service.autoAssignRoles(fabrics);

      expect(result.background).toBe('f1.jpg');
      expect(result.primary).toBe('f2.jpg');
      expect(result.secondary).toBe('f3.jpg');
    });

    it('should call Anthropic API with correct parameters', async () => {
      const mockResponse = {
        content: [{
          type: 'text',
          text: '{"background": 1, "primary": 2, "secondary": 3}'
        }]
      };
      mockAnthropicCreate.mockResolvedValue(mockResponse);

      const fabrics = [
        { imageData: 'img1data', fileName: 'fabric1.jpg' },
        { imageData: 'img2data', fileName: 'fabric2.jpg' },
        { imageData: 'img3data', fileName: 'fabric3.jpg' },
      ];

      await service.autoAssignRoles(fabrics);

      expect(mockAnthropicCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'user',
              content: expect.arrayContaining([
                expect.objectContaining({ type: 'text' }),
                expect.objectContaining({
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: 'image/jpeg',
                    data: 'img1data'
                  }
                }),
              ])
            })
          ])
        })
      );
    });
  });

  describe('autoAssignRoles - Validation', () => {
    it('should reject fewer than 2 fabrics', async () => {
      const fabrics = [
        { imageData: 'data1', fileName: 'fabric1.jpg' },
      ];

      await expect(service.autoAssignRoles(fabrics))
        .rejects
        .toThrow('Auto-assignment requires 2-10 fabrics');
    });

    it('should reject more than 10 fabrics', async () => {
      const fabrics = Array.from({ length: 11 }, (_, i) => ({
        imageData: `data${i}`,
        fileName: `fabric${i}.jpg`,
      }));

      await expect(service.autoAssignRoles(fabrics))
        .rejects
        .toThrow('Auto-assignment requires 2-10 fabrics');
    });

    it('should accept exactly 2 fabrics', async () => {
      const mockResponse = {
        content: [{
          type: 'text',
          text: '{"background": 1, "primary": 2, "secondary": 1}'
        }]
      };
      mockAnthropicCreate.mockResolvedValue(mockResponse);

      const fabrics = [
        { imageData: 'data1', fileName: 'f1.jpg' },
        { imageData: 'data2', fileName: 'f2.jpg' },
      ];

      const result = await service.autoAssignRoles(fabrics);
      expect(result).toBeDefined();
    });

    it('should accept exactly 10 fabrics', async () => {
      const mockResponse = {
        content: [{
          type: 'text',
          text: '{"background": 1, "primary": 2, "secondary": 3}'
        }]
      };
      mockAnthropicCreate.mockResolvedValue(mockResponse);

      const fabrics = Array.from({ length: 10 }, (_, i) => ({
        imageData: `data${i}`,
        fileName: `f${i}.jpg`,
      }));

      const result = await service.autoAssignRoles(fabrics);
      expect(result).toBeDefined();
    });
  });

  describe('autoAssignRoles - Error handling', () => {
    it('should throw error when AI response has no text content', async () => {
      const mockResponse = {
        content: [{ type: 'image', data: 'somedata' }]
      };
      mockAnthropicCreate.mockResolvedValue(mockResponse);

      const fabrics = [
        { imageData: 'data1', fileName: 'f1.jpg' },
        { imageData: 'data2', fileName: 'f2.jpg' },
        { imageData: 'data3', fileName: 'f3.jpg' },
      ];

      await expect(service.autoAssignRoles(fabrics))
        .rejects
        .toThrow('No text response from Claude');
    });

    it('should throw error when JSON parsing fails', async () => {
      const mockResponse = {
        content: [{
          type: 'text',
          text: 'This is not valid JSON'
        }]
      };
      mockAnthropicCreate.mockResolvedValue(mockResponse);

      const fabrics = [
        { imageData: 'data1', fileName: 'f1.jpg' },
        { imageData: 'data2', fileName: 'f2.jpg' },
        { imageData: 'data3', fileName: 'f3.jpg' },
      ];

      await expect(service.autoAssignRoles(fabrics))
        .rejects
        .toThrow('Could not parse fabric role assignments from AI response');
    });

    it('should throw error when required role is missing', async () => {
      const mockResponse = {
        content: [{
          type: 'text',
          text: '{"background": 1, "primary": 2}'  // Missing secondary
        }]
      };
      mockAnthropicCreate.mockResolvedValue(mockResponse);

      const fabrics = [
        { imageData: 'data1', fileName: 'f1.jpg' },
        { imageData: 'data2', fileName: 'f2.jpg' },
        { imageData: 'data3', fileName: 'f3.jpg' },
      ];

      await expect(service.autoAssignRoles(fabrics))
        .rejects
        .toThrow('Invalid or missing assignment for secondary');
    });

    it('should throw error when role assignment is out of bounds', async () => {
      const mockResponse = {
        content: [{
          type: 'text',
          text: '{"background": 1, "primary": 5, "secondary": 3}'  // 5 is out of bounds
        }]
      };
      mockAnthropicCreate.mockResolvedValue(mockResponse);

      const fabrics = [
        { imageData: 'data1', fileName: 'f1.jpg' },
        { imageData: 'data2', fileName: 'f2.jpg' },
        { imageData: 'data3', fileName: 'f3.jpg' },
      ];

      await expect(service.autoAssignRoles(fabrics))
        .rejects
        .toThrow('Invalid or missing assignment for primary');
    });

    it('should throw error when role assignment is zero', async () => {
      const mockResponse = {
        content: [{
          type: 'text',
          text: '{"background": 0, "primary": 1, "secondary": 2}'
        }]
      };
      mockAnthropicCreate.mockResolvedValue(mockResponse);

      const fabrics = [
        { imageData: 'data1', fileName: 'f1.jpg' },
        { imageData: 'data2', fileName: 'f2.jpg' },
        { imageData: 'data3', fileName: 'f3.jpg' },
      ];

      await expect(service.autoAssignRoles(fabrics))
        .rejects
        .toThrow('Invalid or missing assignment for background');
    });
  });

  describe('autoAssignRoles - Accent role handling', () => {
    it('should include accent when valid', async () => {
      const mockResponse = {
        content: [{
          type: 'text',
          text: '{"background": 1, "primary": 2, "secondary": 3, "accent": 4}'
        }]
      };
      mockAnthropicCreate.mockResolvedValue(mockResponse);

      const fabrics = [
        { imageData: 'data1', fileName: 'f1.jpg' },
        { imageData: 'data2', fileName: 'f2.jpg' },
        { imageData: 'data3', fileName: 'f3.jpg' },
        { imageData: 'data4', fileName: 'f4.jpg' },
      ];

      const result = await service.autoAssignRoles(fabrics);
      expect(result.accent).toBe('f4.jpg');
    });

    it('should ignore accent when out of bounds', async () => {
      const mockResponse = {
        content: [{
          type: 'text',
          text: '{"background": 1, "primary": 2, "secondary": 3, "accent": 10}'
        }]
      };
      mockAnthropicCreate.mockResolvedValue(mockResponse);

      const fabrics = [
        { imageData: 'data1', fileName: 'f1.jpg' },
        { imageData: 'data2', fileName: 'f2.jpg' },
        { imageData: 'data3', fileName: 'f3.jpg' },
      ];

      const result = await service.autoAssignRoles(fabrics);
      expect(result.accent).toBeUndefined();
    });

    it('should ignore accent when zero', async () => {
      const mockResponse = {
        content: [{
          type: 'text',
          text: '{"background": 1, "primary": 2, "secondary": 3, "accent": 0}'
        }]
      };
      mockAnthropicCreate.mockResolvedValue(mockResponse);

      const fabrics = [
        { imageData: 'data1', fileName: 'f1.jpg' },
        { imageData: 'data2', fileName: 'f2.jpg' },
        { imageData: 'data3', fileName: 'f3.jpg' },
      ];

      const result = await service.autoAssignRoles(fabrics);
      expect(result.accent).toBeUndefined();
    });
  });

  describe('Prompt generation', () => {
    it('should include fabric count in prompt', async () => {
      const mockResponse = {
        content: [{
          type: 'text',
          text: '{"background": 1, "primary": 2, "secondary": 3}'
        }]
      };
      mockAnthropicCreate.mockResolvedValue(mockResponse);

      const fabrics = [
        { imageData: 'data1', fileName: 'f1.jpg' },
        { imageData: 'data2', fileName: 'f2.jpg' },
        { imageData: 'data3', fileName: 'f3.jpg' },
      ];

      await service.autoAssignRoles(fabrics);

      const callArgs = mockAnthropicCreate.mock.calls[0][0];
      const textContent = callArgs.messages[0].content.find((c: any) => c.type === 'text');
      
      expect(textContent.text).toContain('3 fabric');
      expect(textContent.text).toContain('numbered 1-3');
    });

    it('should describe all role types in prompt', async () => {
      const mockResponse = {
        content: [{
          type: 'text',
          text: '{"background": 1, "primary": 2, "secondary": 3}'
        }]
      };
      mockAnthropicCreate.mockResolvedValue(mockResponse);

      const fabrics = [
        { imageData: 'data1', fileName: 'f1.jpg' },
        { imageData: 'data2', fileName: 'f2.jpg' },
        { imageData: 'data3', fileName: 'f3.jpg' },
      ];

      await service.autoAssignRoles(fabrics);

      const callArgs = mockAnthropicCreate.mock.calls[0][0];
      const textContent = callArgs.messages[0].content.find((c: any) => c.type === 'text');
      
      expect(textContent.text).toContain('background');
      expect(textContent.text).toContain('primary');
      expect(textContent.text).toContain('secondary');
      expect(textContent.text).toContain('accent');
    });
  });
});
