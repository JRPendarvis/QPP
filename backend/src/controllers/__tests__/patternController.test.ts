import { Request, Response } from 'express';
import { PatternController } from '../patternController';
import { FabricCoordinationService } from '../../services/ai/fabricCoordinationService';

// Mock services
jest.mock('../../services/pdf/pdfService');
jest.mock('../../services/pattern/patternGenerationService');
jest.mock('../../services/pattern/patternDownloadService');
jest.mock('../../services/ai/fabricCoordinationService');

const mockFabricCoordinationService = FabricCoordinationService as jest.MockedClass<typeof FabricCoordinationService>;

// Test Data Helpers
const createMockFabric = (index: number) => ({
  imageData: `data${index}`,
  fileName: `fabric${index}.jpg`,
});

const createMockFabrics = (count: number) =>
  Array.from({ length: count }, (_, i) => createMockFabric(i + 1));

const createMockRequest = (body: any = {}): Partial<Request> => ({ body });

const createMockResponse = (): { response: Partial<Response>; json: jest.Mock; status: jest.Mock } => {
  const json = jest.fn().mockReturnThis();
  const status = jest.fn().mockReturnThis();
  return {
    response: { json, status },
    json,
    status,
  };
};

describe('PatternController - autoAssignFabricRoles', () => {
  let controller: PatternController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    controller = new PatternController();
    const mockResponseObj = createMockResponse();
    mockResponse = mockResponseObj.response;
    mockJson = mockResponseObj.json;
    mockStatus = mockResponseObj.status;

    mockRequest = createMockRequest();
  });

  describe('Successful coordination', () => {
    it('should successfully coordinate fabrics and return assignments', async () => {
      const mockAssignments = {
        background: 'fabric1.jpg',
        primary: 'fabric2.jpg',
        secondary: 'fabric3.jpg',
        accent: 'fabric4.jpg',
      };

      mockFabricCoordinationService.prototype.autoAssignRoles = jest.fn().mockResolvedValue(mockAssignments);

      mockRequest.body = { fabrics: createMockFabrics(4) };

      await controller.autoAssignFabricRoles(mockRequest as Request, mockResponse as Response);

      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockAssignments,
        message: 'Fabric roles automatically coordinated',
      });
      expect(mockStatus).not.toHaveBeenCalled(); // 200 is default
    });

    it('should handle coordination without accent role', async () => {
      const mockAssignments = {
        background: 'fabric1.jpg',
        primary: 'fabric2.jpg',
        secondary: 'fabric3.jpg',
      };

      mockFabricCoordinationService.prototype.autoAssignRoles = jest.fn().mockResolvedValue(mockAssignments);

      mockRequest.body = { fabrics: createMockFabrics(3) };

      await controller.autoAssignFabricRoles(mockRequest as Request, mockResponse as Response);

      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockAssignments,
        message: 'Fabric roles automatically coordinated',
      });
    });

    it('should call FabricCoordinationService with correct parameters', async () => {
      const mockAssignRoles = jest.fn().mockResolvedValue({
        background: 'fabric1.jpg',
        primary: 'fabric2.jpg',
        secondary: 'fabric3.jpg',
      });
      mockFabricCoordinationService.prototype.autoAssignRoles = mockAssignRoles;

      const fabricData = createMockFabrics(3);
      mockRequest.body = { fabrics: fabricData };

      await controller.autoAssignFabricRoles(mockRequest as Request, mockResponse as Response);

      expect(mockAssignRoles).toHaveBeenCalledWith(fabricData);
    });
  });

  describe('Validation errors', () => {
    // Parameterized tests for cleaner validation testing
    test.each([
      { scenario: 'missing', body: {}, expectedMessage: 'Invalid request: fabrics array is required' },
      { scenario: 'not an array', body: { fabrics: 'not-an-array' }, expectedMessage: 'Invalid request: fabrics array is required' },
      { scenario: 'empty array', body: { fabrics: [] }, expectedMessage: 'Please upload at least 2 fabrics for auto-assignment' },
      { scenario: 'only 1 fabric', body: { fabrics: createMockFabrics(1) }, expectedMessage: 'Please upload at least 2 fabrics for auto-assignment' },
      { scenario: '11 fabrics', body: { fabrics: createMockFabrics(11) }, expectedMessage: 'Maximum 10 fabrics allowed for auto-assignment' },
    ])('should return 400 when fabrics $scenario', async ({ body, expectedMessage }) => {
      mockRequest.body = body;

      await controller.autoAssignFabricRoles(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: expectedMessage,
      });
    });

    test.each([
      { 
        scenario: 'missing imageData', 
        fabrics: [createMockFabric(1), { fileName: 'fabric2.jpg' }, createMockFabric(3)] 
      },
      { 
        scenario: 'missing fileName', 
        fabrics: [createMockFabric(1), { imageData: 'data2' }] 
      },
      { 
        scenario: 'imageData not a string', 
        fabrics: [createMockFabric(1), { imageData: 12345, fileName: 'fabric2.jpg' }] 
      },
    ])('should return 400 when $scenario', async ({ fabrics }) => {
      mockRequest.body = { fabrics };

      await controller.autoAssignFabricRoles(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid fabric data format',
      });
    });
  });

  describe('Service errors', () => {
    it('should return 500 when coordination service throws error', async () => {
      mockFabricCoordinationService.prototype.autoAssignRoles = jest.fn().mockRejectedValue(
        new Error('AI service unavailable')
      );

      mockRequest.body = { fabrics: createMockFabrics(3) };

      await controller.autoAssignFabricRoles(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'AI service unavailable',
      });
    });

    it('should handle unknown error types', async () => {
      mockFabricCoordinationService.prototype.autoAssignRoles = jest.fn().mockRejectedValue(
        'Unknown error string'
      );

      mockRequest.body = { fabrics: createMockFabrics(2) };

      await controller.autoAssignFabricRoles(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to auto-assign fabric roles',
      });
    });

    it('should log coordination attempts to console', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      
      mockFabricCoordinationService.prototype.autoAssignRoles = jest.fn().mockResolvedValue({
        background: 'fabric1.jpg',
        primary: 'fabric2.jpg',
        secondary: 'fabric3.jpg',
      });

      mockRequest.body = { fabrics: createMockFabrics(3) };

      await controller.autoAssignFabricRoles(mockRequest as Request, mockResponse as Response);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[PatternController] Auto-assigning roles for 3 fabrics')
      );
    });

    it('should log errors to console.error', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error');
      
      mockFabricCoordinationService.prototype.autoAssignRoles = jest.fn().mockRejectedValue(
        new Error('Test error')
      );

      mockRequest.body = { fabrics: createMockFabrics(2) };

      await controller.autoAssignFabricRoles(mockRequest as Request, mockResponse as Response);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[PatternController] Auto-assign fabric roles error:'),
        expect.any(Error)
      );
    });
  });

  describe('Edge cases', () => {
    it('should handle exactly 2 fabrics (minimum valid)', async () => {
      mockFabricCoordinationService.prototype.autoAssignRoles = jest.fn().mockResolvedValue({
        background: 'fabric1.jpg',
        primary: 'fabric2.jpg',
        secondary: 'fabric1.jpg',
      });

      mockRequest.body = { fabrics: createMockFabrics(2) };

      await controller.autoAssignFabricRoles(mockRequest as Request, mockResponse as Response);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });

    it('should handle exactly 10 fabrics (maximum valid)', async () => {
      mockFabricCoordinationService.prototype.autoAssignRoles = jest.fn().mockResolvedValue({
        background: 'fabric1.jpg',
        primary: 'fabric2.jpg',
        secondary: 'fabric3.jpg',
      });

      mockRequest.body = { fabrics: createMockFabrics(10) };

      await controller.autoAssignFabricRoles(mockRequest as Request, mockResponse as Response);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });
  });
});
