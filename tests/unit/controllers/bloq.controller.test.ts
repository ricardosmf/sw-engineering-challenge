import { BloqController } from '../../../src/controllers/bloq.controller';
import { Request, Response } from 'express';
import { IBloqService } from '../../../src/services/interfaces/bloq.service.interface';
import { IBloq } from '../../../src/models/bloq.model';

describe('BloqController', () => {
  let bloqController: BloqController;
  let mockBloqService: jest.Mocked<IBloqService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    responseJson = jest.fn();
    responseStatus = jest.fn().mockReturnThis();
    mockNext = jest.fn();
    
    mockResponse = {
      json: responseJson,
      status: responseStatus,
      send: jest.fn()
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

  describe('createBloq', () => {
    it('should create a bloq and return 201', async () => {
      const mockBloq = { id: '1', title: 'New Bloq' };
      mockRequest.body = mockBloq;
      mockBloqService.createBloq.mockResolvedValue(mockBloq as IBloq);
  
      await bloqController.createBloq(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
  
      expect(mockBloqService.createBloq).toHaveBeenCalledWith(mockBloq);
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith(mockBloq);
    });
  
    it('should pass errors to next middleware', async () => {
      const error = new Error('Creation failed');
      mockBloqService.createBloq.mockRejectedValue(error);
  
      await bloqController.createBloq(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
  
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
  
  describe('getBloq', () => {
    it('should return a bloq by id', async () => {
      const mockBloq = { id: '1', title: 'Test Bloq' };
      mockRequest.params = { id: '1' };
      mockBloqService.getBloqById.mockResolvedValue(mockBloq as IBloq);
  
      await bloqController.getBloq(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
  
      expect(mockBloqService.getBloqById).toHaveBeenCalledWith('1');
      expect(responseJson).toHaveBeenCalledWith(mockBloq);
    });
  
    it('should pass errors to next middleware', async () => {
      const error = new Error('Bloq not found');
      mockRequest.params = { id: '1' };
      mockBloqService.getBloqById.mockRejectedValue(error);
  
      await bloqController.getBloq(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
  
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
  
  describe('updateBloq', () => {
    it('should update a bloq and return it', async () => {
      const mockBloq = { id: '1', title: 'Updated Bloq' };
      mockRequest.params = { id: '1' };
      mockRequest.body = mockBloq;
      mockBloqService.updateBloq.mockResolvedValue(mockBloq as IBloq);
  
      await bloqController.updateBloq(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
  
      expect(mockBloqService.updateBloq).toHaveBeenCalledWith('1', mockBloq);
      expect(responseJson).toHaveBeenCalledWith(mockBloq);
    });
  
    it('should pass errors to next middleware', async () => {
      const error = new Error('Update failed');
      mockRequest.params = { id: '1' };
      mockBloqService.updateBloq.mockRejectedValue(error);
  
      await bloqController.updateBloq(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
  
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
  
  describe('deleteBloq', () => {
    it('should delete a bloq and return 204', async () => {
      mockRequest.params = { id: '1' };
      mockBloqService.deleteBloq.mockResolvedValue(true);
  
      await bloqController.deleteBloq(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
  
      expect(mockBloqService.deleteBloq).toHaveBeenCalledWith('1');
      expect(responseStatus).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });
  
    it('should pass errors to next middleware', async () => {
      const error = new Error('Delete failed');
      mockRequest.params = { id: '1' };
      mockBloqService.deleteBloq.mockRejectedValue(error);
  
      await bloqController.deleteBloq(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
  
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});