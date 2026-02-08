import { Request, Response } from 'express';
import { PatternController } from '../patternController';
import { FabricCoordinationService } from '../../services/ai/fabricCoordinationService';

// Mock services
jest.mock('../../services/pdf/pdfService');
jest.mock('../../services/pattern/patternGenerationService');
jest.mock('../../services/pattern/patternDownloadService');
jest.mock('../../services/ai/fabricCoordinationService');

const mockFabricCoordinationService = FabricCoordinationService as jest.MockedClass<typeof FabricCoordinationService>;

describe('PatternController - autoAssignFabricRoles', () => {
  let controller: PatternController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    controller = new PatternController();

    mockJson = jest.fn().mockReturnThis();
    mockStatus = jest.fn().mockReturnThis();
    
    mockResponse = {
      json: mockJson,
      status: mockStatus,
    };

    mockRequest = {
      body: {},
    };
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

      mockRequest.body = {
        fabrics: [
          { imageData: 'data1', fileName: 'fabric1.jpg' },
          { imageData: 'data2', fileName: 'fabric2.jpg' },
          { imageData: 'data3', fileName: 'fabric3.jpg' },
          { imageData: 'data4', fileName: 'fabric4.jpg' },
        ],
      };

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

      mockRequest.body = {
        fabrics: [
          { imageData: 'data1', fileName: 'fabric1.jpg' },
          { imageData: 'data2', fileName: 'fabric2.jpg' },
          { imageData: 'data3', fileName: 'fabric3.jpg' },
        ],
      };

      await controller.autoAssignFabricRoles(mockRequest as Request, mockResponse as Response);

      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockAssignments,
        message: 'Fabric roles automatically coordinated',
      });
    });

    it('should call FabricCoordinationService with correct parameters', async () => {
      const mockAssignRoles = jest.fn().mockResolvedValue({
        background: 'f1.jpg',
        primary: 'f2.jpg',
        secondary: 'f3.jpg',
      });
      mockFabricCoordinationService.prototype.autoAssignRoles = mockAssignRoles;

      const fabricData = [
        { imageData: 'imagedata1', fileName: 'f1.jpg' },
        { imageData: 'imagedata2', fileName: 'f2.jpg' },
        { imageData: 'imagedata3', fileName: 'f3.jpg' },
      ];

      mockRequest.body = { fabrics: fabricData };

      await controller.autoAssignFabricRoles(mockRequest as Request, mockResponse as Response);

      expect(mockAssignRoles).toHaveBeenCalledWith(fabricData);
    });
  });

  describe('Validation errors', () => {
    it('should return 400 when fabrics is missing', async () => {
      mockRequest.body = {};

      await controller.autoAssignFabricRoles(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid request: fabrics array is required',
      });
    });

    it('should return 400 when fabrics is not an array', async () => {
      mockRequest.body = { fabrics: 'not-an-array' };

      await controller.autoAssignFabricRoles(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid request: fabrics array is required',
      });
    });

    it('should return 400 when fewer than 2 fabrics provided', async () => {
      mockRequest.body = {
        fabrics: [
          { imageData: 'data1', fileName: 'fabric1.jpg' },
        ],
      };

      await controller.autoAssignFabricRoles(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Please upload at least 2 fabrics for auto-assignment',
      });
    });

    it('should return 400 when more than 10 fabrics provided', async () => {
      mockRequest.body = {
        fabrics: Array.from({ length: 11 }, (_, i) => ({
          imageData: `data${i}`,
          fileName: `fabric${i}.jpg`,
        })),
      };

      await controller.autoAssignFabricRoles(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Maximum 10 fabrics allowed for auto-assignment',
      });
    });

    it('should return 400 when fabric data structure is invalid', async () => {
      mockRequest.body = {
        fabrics: [
          { imageData: 'data1', fileName: 'fabric1.jpg' },
          { fileName: 'fabric2.jpg' }, // Missing imageData
          { imageData: 'data3', fileName: 'fabric3.jpg' },
        ],
      };

      await controller.autoAssignFabricRoles(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid fabric data format',
      });
    });

    it('should return 400 when fileName is missing', async () => {
      mockRequest.body = {
        fabrics: [
          { imageData: 'data1', fileName: 'fabric1.jpg' },
          { imageData: 'data2' }, // Missing fileName
        ],
      };

      await controller.autoAssignFabricRoles(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid fabric data format',
      });
    });

    it('should return 400 when imageData is not a string', async () => {
      mockRequest.body = {
        fabrics: [
          { imageData: 'data1', fileName: 'fabric1.jpg' },
          { imageData: 12345, fileName: 'fabric2.jpg' }, // Not a string
        ],
      };

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

      mockRequest.body = {
        fabrics: [
          { imageData: 'data1', fileName: 'fabric1.jpg' },
          { imageData: 'data2', fileName: 'fabric2.jpg' },
          { imageData: 'data3', fileName: 'fabric3.jpg' },
        ],
      };

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

      mockRequest.body = {
        fabrics: [
          { imageData: 'data1', fileName: 'fabric1.jpg' },
          { imageData: 'data2', fileName: 'fabric2.jpg' },
        ],
      };

      await controller.autoAssignFabricRoles(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to auto-assign fabric roles',
      });
    });

    it('should log coordination attempts to console', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      mockFabricCoordinationService.prototype.autoAssignRoles = jest.fn().mockResolvedValue({
        background: 'f1.jpg',
        primary: 'f2.jpg',
        secondary: 'f3.jpg',
      });

      mockRequest.body = {
        fabrics: [
          { imageData: 'data1', fileName: 'f1.jpg' },
          { imageData: 'data2', fileName: 'f2.jpg' },
          { imageData: 'data3', fileName: 'f3.jpg' },
        ],
      };

      await controller.autoAssignFabricRoles(mockRequest as Request, mockResponse as Response);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[PatternController] Auto-assigning roles for 3 fabrics')
      );

      consoleSpy.mockRestore();
    });

    it('should log errors to console.error', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      mockFabricCoordinationService.prototype.autoAssignRoles = jest.fn().mockRejectedValue(
        new Error('Test error')
      );

      mockRequest.body = {
        fabrics: [
          { imageData: 'data1', fileName: 'f1.jpg' },
          { imageData: 'data2', fileName: 'f2.jpg' },
        ],
      };

      await controller.autoAssignFabricRoles(mockRequest as Request, mockResponse as Response);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[PatternController] Auto-assign fabric roles error:'),
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Edge cases', () => {
    it('should handle exactly 2 fabrics (minimum valid)', async () => {
      mockFabricCoordinationService.prototype.autoAssignRoles = jest.fn().mockResolvedValue({
        background: 'f1.jpg',
        primary: 'f2.jpg',
        secondary: 'f1.jpg',
      });

      mockRequest.body = {
        fabrics: [
          { imageData: 'data1', fileName: 'f1.jpg' },
          { imageData: 'data2', fileName: 'f2.jpg' },
        ],
      };

      await controller.autoAssignFabricRoles(mockRequest as Request, mockResponse as Response);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });

    it('should handle exactly 10 fabrics (maximum valid)', async () => {
      mockFabricCoordinationService.prototype.autoAssignRoles = jest.fn().mockResolvedValue({
        background: 'f1.jpg',
        primary: 'f2.jpg',
        secondary: 'f3.jpg',
      });

      mockRequest.body = {
        fabrics: Array.from({ length: 10 }, (_, i) => ({
          imageData: `data${i}`,
          fileName: `f${i}.jpg`,
        })),
      };

      await controller.autoAssignFabricRoles(mockRequest as Request, mockResponse as Response);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });

    it('should handle empty fabrics array', async () => {
      mockRequest.body = { fabrics: [] };

      await controller.autoAssignFabricRoles(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Please upload at least 2 fabrics for auto-assignment',
      });
    });
  });
});
