import { BloqController } from '../../../src/controllers/bloq.controller';
import { Request, Response } from 'express';
import { IBloqService } from '../../../src/services/interfaces/bloq.service.interface';
import { IBloq } from '../../../src/models/bloq.model';

describe('BloqController', () => {
  let bloqController: BloqController;
  let mockBloqService: jest.Mocked<IBloqService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    responseJson = jest.fn();
    responseStatus = jest.fn().mockReturnThis();
    
    mockResponse = {
      json: responseJson,
      status: responseStatus,
    };

    mockBloqService = {
      getAllBloqs: jest.fn(),
      getBloqById: jest.fn(),
      createBloq: jest.fn(),
      updateBloq: jest.fn(),
      deleteBloq: jest.fn(),
    };

    bloqController = new BloqController(mockBloqService);
    mockRequest = {};
  });

  describe('getAllBloqs', () => {
    it('should return all bloqs with status 200', async () => {
      // Arrange
      const mockBloqs = [
        { id: '1', title: 'Bloq 1' },
        { id: '2', title: 'Bloq 2' }
      ];
      mockBloqService.getAllBloqs.mockResolvedValue(mockBloqs as IBloq[]);

      // Act
      await bloqController.getAllBloqs(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockBloqService.getAllBloqs).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith(mockBloqs);
    });

    it('should return 404 when no bloqs are found', async () => {
      // Arrange
      mockBloqService.getAllBloqs.mockResolvedValue(null as any);

      // Act
      await bloqController.getAllBloqs(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockBloqService.getAllBloqs).toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ error: 'Bloqs not found' });
    });

    it('should return 500 when service throws error', async () => {
      // Arrange
      mockBloqService.getAllBloqs.mockRejectedValue(new Error('Database error'));

      // Act
      await bloqController.getAllBloqs(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockBloqService.getAllBloqs).toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: 'Failed to get all bloqs' });
    });
  });
});