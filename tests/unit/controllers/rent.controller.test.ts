import { Request, Response } from 'express';
import { RentController } from '../../../src/controllers/rent.controller';
import { IRentService } from '../../../src/services/interfaces/rent.service.interface';
import { v4 as uuidv4 } from 'uuid';

describe('RentController', () => {
  let rentController: RentController;
  let mockRentService: jest.Mocked<IRentService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;
  let jsonSpy: jest.Mock;
  let statusSpy: jest.Mock;

  const lockerId = uuidv4();
  const rentId = uuidv4();

  beforeEach(() => {
    jsonSpy = jest.fn();
    statusSpy = jest.fn().mockReturnThis();
    mockNext = jest.fn();
    
    mockResponse = {
      json: jsonSpy,
      status: statusSpy,
      send: jest.fn()
    };

    mockRentService = {
      getRentByLockerId: jest.fn(),
      createRent: jest.fn(),
      getAllRents: jest.fn(),
      getRentById: jest.fn(),
      updateRent: jest.fn(),
      deleteRent: jest.fn(),
      updateRentStatus: jest.fn(),
      getActiveRents: jest.fn()
    } as any;

    rentController = new RentController(mockRentService as any);
    
    mockRequest = {
      params: {
        id: rentId,
        lockerId: lockerId
      },
      body: {
        status: 'ACTIVE'
      }
    };
  });

  describe('getRentByLockerId', () => {
    it('should return rent when found for specific locker', async () => {
      const mockRent = {
        id: rentId,
        lockerId: lockerId
      };
      mockRentService.getRentByLockerId.mockResolvedValue(mockRent as any);

      await rentController.getRentByLockerId(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockRentService.getRentByLockerId).toHaveBeenCalledWith(lockerId);
      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith(mockRent);
    });

    it('should call next with RentNotFoundError when no rent found', async () => {
      mockRentService.getRentByLockerId.mockResolvedValue(null);

      await rentController.getRentByLockerId(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockNext.mock.calls[0][0]).toBeInstanceOf(Error);
    });
  });
});