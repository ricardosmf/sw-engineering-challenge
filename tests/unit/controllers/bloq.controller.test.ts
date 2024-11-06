import { BloqController } from '../../../src/controllers/bloq.controller';
import { Request, Response, NextFunction } from 'express';
import { IBloqService } from '../../../src/services/interfaces/bloq.service.interface';
import { IBloq } from '../../../src/models/bloq.model';
import { v4 as uuidv4 } from 'uuid';

describe('BloqController', () => {
  let bloqController: BloqController;
  let mockBloqService: jest.Mocked<IBloqService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;
  let responseEnd: jest.Mock;

  beforeEach(() => {
    responseJson = jest.fn();
    responseStatus = jest.fn().mockReturnThis();
    responseEnd = jest.fn();
    mockNext = jest.fn();

    mockResponse = {
      json: responseJson,
      status: responseStatus,
      end: responseEnd,
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
      const bloqData = { title: 'New Bloq', address: 'Test Address' };
      const mockBloq = { id: uuidv4(), ...bloqData };
      mockRequest = { body: bloqData };
      mockBloqService.createBloq.mockResolvedValue(mockBloq as IBloq);

      await bloqController.createBloq(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBloqService.createBloq).toHaveBeenCalledWith(bloqData);
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith(mockBloq);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockRequest = { body: { title: 'New Bloq' } };
      mockBloqService.createBloq.mockRejectedValue(error);

      await bloqController.createBloq(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getBloqById', () => {
    it('should return bloq when found', async () => {
      const bloqId = uuidv4();
      const mockBloq = { id: bloqId, title: 'Test Bloq', address: 'Test Address' };
      mockRequest = { params: { id: bloqId } };
      mockBloqService.getBloqById.mockResolvedValue(mockBloq as IBloq);

      await bloqController.getBloq(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBloqService.getBloqById).toHaveBeenCalledWith(bloqId);
      expect(responseJson).toHaveBeenCalledWith(mockBloq);
    });
  });

  describe('getAllBloqs', () => {
    it('should return all bloqs', async () => {
      const mockBloqs = [
        { id: uuidv4(), title: 'Bloq 1', address: 'Address 1' },
        { id: uuidv4(), title: 'Bloq 2', address: 'Address 2' }
      ];
      mockBloqService.getAllBloqs.mockResolvedValue(mockBloqs as IBloq[]);

      await bloqController.getAllBloqs(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(responseJson).toHaveBeenCalledWith(mockBloqs);
    });
  });

  describe('updateBloq', () => {
    it('should update bloq and return 200', async () => {
      const bloqId = uuidv4();
      const updateData = { title: 'Updated Bloq' };
      const updatedBloq = { id: bloqId, ...updateData };
      mockRequest = {
        params: { id: bloqId },
        body: updateData
      };
      mockBloqService.updateBloq.mockResolvedValue(updatedBloq as IBloq);

      await bloqController.updateBloq(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBloqService.updateBloq).toHaveBeenCalledWith(bloqId, updateData);
      expect(responseJson).toHaveBeenCalledWith(updatedBloq);
    });
  });

  describe('deleteBloq', () => {
    it('should delete bloq and return 204', async () => {
      const bloqId = uuidv4();
      mockRequest = { params: { id: bloqId } };
      const deletedBloq = { id: bloqId, title: 'Deleted Bloq' };
      mockBloqService.deleteBloq.mockResolvedValue(true);

      await bloqController.deleteBloq(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBloqService.deleteBloq).toHaveBeenCalledWith(bloqId);
      expect(responseStatus).toHaveBeenCalledWith(204);
    });
  });
});