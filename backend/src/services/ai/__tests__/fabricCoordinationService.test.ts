import { FabricCoordinationService } from '../fabricCoordinationService';
import Anthropic from '@anthropic-ai/sdk';

// Mock Anthropic SDK
jest.mock('@anthropic-ai/sdk');

// Test Data Factories
const createMockFabric = (index: number, overrides?: { imageData?: string; fileName?: string }) => ({
  imageData: overrides?.imageData || `base64data${index}`,
  fileName: overrides?.fileName || `fabric${index}.jpg`,
});

const createMockFabrics = (count: number) => 
  Array.from({ length: count }, (_, i) => createMockFabric(i + 1));

const createMockResponse = (assignments: Record<string, number | string>, asMarkdown = false) => {
  const jsonContent = JSON.stringify(assignments);
  return {
    content: [{
      type: 'text',
      text: asMarkdown ? `\`\`\`json\n${jsonContent}\n\`\`\`` : jsonContent,
    }],
  };
};

// Mock console to avoid noise in test output
const mockConsole = () => {
  global.console.log = jest.fn();
  global.console.error = jest.fn();
};

mockConsole();

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
      const mockResponse = createMockResponse({
        background: 3,
        primary: 1,
        secondary: 2,
        accent: 4,
        reasoning: 'Fabric 3 provides subtle background, 1 is bold primary, 2 complements, 4 adds contrast.'
      });
      mockAnthropicCreate.mockResolvedValue(mockResponse);

      const fabrics = createMockFabrics(4);

      const result = await service.autoAssignRoles(fabrics);

      expect(result).toEqual({
        background: 'fabric3.jpg',
        primary: 'fabric1.jpg',
        secondary: 'fabric2.jpg',
        accent: 'fabric4.jpg',
      });
    });

    it('should assign roles without accent when not provided by AI', async () => {
      const mockResponse = createMockResponse({
        background: 2,
        primary: 1,
        secondary: 3,
        reasoning: 'No fabric suitable for accent role.'
      });
      mockAnthropicCreate.mockResolvedValue(mockResponse);

      const fabrics = createMockFabrics(3);

      const result = await service.autoAssignRoles(fabrics);

      expect(result).toEqual({
        background: 'fabric2.jpg',
        primary: 'fabric1.jpg',
        secondary: 'fabric3.jpg',
      });
      expect(result.accent).toBeUndefined();
    });

    it('should handle markdown code blocks in AI response', async () => {
      const mockResponse = createMockResponse({
        background: 1,
        primary: 2,
        secondary: 3,
        reasoning: 'Test'
      }, true); // With markdown wrapper
      mockAnthropicCreate.mockResolvedValue(mockResponse);

      const fabrics = createMockFabrics(3);

      const result = await service.autoAssignRoles(fabrics);

      expect(result.background).toBe('fabric1.jpg');
      expect(result.primary).toBe('fabric2.jpg');
      expect(result.secondary).toBe('fabric3.jpg');
    });

    it('should call Anthropic API with correct parameters', async () => {
      const mockResponse = createMockResponse({ background: 1, primary: 2, secondary: 3 });
      mockAnthropicCreate.mockResolvedValue(mockResponse);

      const fabrics = createMockFabrics(3);

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
                    data: 'base64data1' // Updated to match factory
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
      await expect(service.autoAssignRoles(createMockFabrics(1)))
        .rejects
        .toThrow('Auto-assignment requires 2-10 fabrics');
    });

    it('should reject more than 10 fabrics', async () => {
      await expect(service.autoAssignRoles(createMockFabrics(11)))
        .rejects
        .toThrow('Auto-assignment requires 2-10 fabrics');
    });

    it('should accept exactly 2 fabrics', async () => {
      mockAnthropicCreate.mockResolvedValue(createMockResponse({ background: 1, primary: 2, secondary: 1 }));

      const result = await service.autoAssignRoles(createMockFabrics(2));
      expect(result).toBeDefined();
    });

    it('should accept exactly 10 fabrics', async () => {
      mockAnthropicCreate.mockResolvedValue(createMockResponse({ background: 1, primary: 2, secondary: 3 }));

      const result = await service.autoAssignRoles(createMockFabrics(10));
      expect(result).toBeDefined();
    });
  });

  describe('autoAssignRoles - Error handling', () => {
    it('should throw error when AI response has no text content', async () => {
      const mockResponse = {
        content: [{ type: 'image', data: 'somedata' }]
      };
      mockAnthropicCreate.mockResolvedValue(mockResponse);

      await expect(service.autoAssignRoles(createMockFabrics(3)))
        .rejects
        .toThrow('No text response from Claude');
    });

    it('should throw error when JSON parsing fails', async () => {
      mockAnthropicCreate.mockResolvedValue({
        content: [{ type: 'text', text: 'This is not valid JSON' }]
      });

      await expect(service.autoAssignRoles(createMockFabrics(3)))
        .rejects
        .toThrow('Could not parse fabric role assignments from AI response');
    });

    it('should throw error when required role is missing', async () => {
      mockAnthropicCreate.mockResolvedValue(createMockResponse({ background: 1, primary: 2 })); // Missing secondary

      await expect(service.autoAssignRoles(createMockFabrics(3)))
        .rejects
        .toThrow('Invalid or missing assignment for secondary');
    });

    it('should throw error when role assignment is out of bounds', async () => {
      mockAnthropicCreate.mockResolvedValue(createMockResponse({ background: 1, primary: 5, secondary: 3 }));

      await expect(service.autoAssignRoles(createMockFabrics(3)))
        .rejects
        .toThrow('Invalid or missing assignment for primary');
    });

    it('should throw error when role assignment is zero', async () => {
      mockAnthropicCreate.mockResolvedValue(createMockResponse({ background: 0, primary: 1, secondary: 2 }));

      await expect(service.autoAssignRoles(createMockFabrics(3)))
        .rejects
        .toThrow('Invalid or missing assignment for background');
    });
  });

  describe('autoAssignRoles - Accent role handling', () => {
    it('should include accent when valid', async () => {
      mockAnthropicCreate.mockResolvedValue(createMockResponse({ background: 1, primary: 2, secondary: 3, accent: 4 }));

      const result = await service.autoAssignRoles(createMockFabrics(4));
      expect(result.accent).toBe('fabric4.jpg');
    });

    it('should ignore accent when out of bounds', async () => {
      mockAnthropicCreate.mockResolvedValue(createMockResponse({ background: 1, primary: 2, secondary: 3, accent: 10 }));

      const result = await service.autoAssignRoles(createMockFabrics(3));
      expect(result.accent).toBeUndefined();
    });

    it('should ignore accent when zero', async () => {
      mockAnthropicCreate.mockResolvedValue(createMockResponse({ background: 1, primary: 2, secondary: 3, accent: 0 }));

      const result = await service.autoAssignRoles(createMockFabrics(3));
      expect(result.accent).toBeUndefined();
    });
  });

  describe('Prompt generation', () => {
    it('should include fabric count in prompt', async () => {
      mockAnthropicCreate.mockResolvedValue(createMockResponse({ background: 1, primary: 2, secondary: 3 }));

      await service.autoAssignRoles(createMockFabrics(3));

      const callArgs = mockAnthropicCreate.mock.calls[0][0];
      const textContent = callArgs.messages[0].content.find((c: any) => c.type === 'text');
      
      expect(textContent.text).toContain('3 fabric');
      expect(textContent.text).toContain('numbered 1-3');
    });

    it('should describe all role types in prompt', async () => {
      mockAnthropicCreate.mockResolvedValue(createMockResponse({ background: 1, primary: 2, secondary: 3 }));

      await service.autoAssignRoles(createMockFabrics(3));

      const callArgs = mockAnthropicCreate.mock.calls[0][0];
      const textContent = callArgs.messages[0].content.find((c: any) => c.type === 'text');
      
      expect(textContent.text).toContain('background');
      expect(textContent.text).toContain('primary');
      expect(textContent.text).toContain('secondary');
      expect(textContent.text).toContain('accent');
    });
  });
});
