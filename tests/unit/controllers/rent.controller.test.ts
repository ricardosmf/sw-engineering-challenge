import { Request, Response } from 'express';
import { RentController } from '../../../src/controllers/rent.controller';
import { IRentService } from '../../../src/services/interfaces/rent.service.interface';
import { IRent } from '../../../src/models/rent.model';
import { Types } from 'mongoose';

describe('RentController', () => {
  let rentController: RentController;
  let mockRentService: jest.Mocked<IRentService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonSpy: jest.Mock;
  let statusSpy: jest.Mock;

  beforeEach(() => {
    jsonSpy = jest.fn();
    statusSpy = jest.fn().mockReturnThis();
    
    mockResponse = {
      json: jsonSpy,
      status: statusSpy,
    };

    mockRentService = {
      getRentByLockerId: jest.fn(),
    } as any;

    rentController = new RentController(mockRentService);
    
    mockRequest = {
      params: {
        lockerId: '1'
      }
    };
  });

  describe('getRentByLocker', () => {
    it('should return rents when found for specific locker', async () => {
      // Arrange
      const lockerId = new Types.ObjectId(1);
      const mockRents: Partial<IRent> = 
        { id: '1', lockerId: lockerId }
      ;
      mockRentService.getRentByLockerId.mockResolvedValue(mockRents as IRent);

      // Act
      await rentController.getRentByLocker(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockRentService.getRentByLockerId)
        .toHaveBeenCalledWith('1');
      expect(jsonSpy).toHaveBeenCalledWith(mockRents);
      expect(statusSpy).not.toHaveBeenCalled();
    });

    it('should return 404 when no rent found for locker', async () => {
      // Arrange
      mockRentService.getRentByLockerId.mockResolvedValue(null as any);

      // Act
      await rentController.getRentByLocker(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(statusSpy).toHaveBeenCalledWith(404);
      expect(jsonSpy).toHaveBeenCalledWith({ error: 'Rent not found' });
    });

    it('should return 500 when service throws error', async () => {
      // Arrange
      mockRentService.getRentByLockerId
        .mockRejectedValue(new Error('Database error'));

      // Act
      await rentController.getRentByLocker(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({ 
        error: 'Failed to get rent by locker' 
      });
    });
  });
});