import { ILockerService } from '../../../src/services/interfaces/locker.service.interface';
import { Request, Response } from 'express';
import { LockerController } from '../../../src/controllers/locker.controller';
import { v4 as uuidv4 } from 'uuid';

describe('toggleLockerStatus', () => {
  let mockLockerService: jest.Mocked<ILockerService>;
  let lockerController: LockerController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;
  let jsonSpy: jest.Mock;
  let statusSpy: jest.Mock;
  const lockerId = uuidv4();

  beforeEach(() => {
    jsonSpy = jest.fn();
    statusSpy = jest.fn().mockReturnThis();
    mockNext = jest.fn();

    mockResponse = {
      json: jsonSpy,
      status: statusSpy,
      send: jest.fn()
    };
    mockLockerService = {
      toggleLockerStatus: jest.fn(),
    } as any;
    lockerController = new LockerController(mockLockerService);
    
    mockRequest = {
      params: {
        id: lockerId
      }
    };
  });

  it('should successfully toggle locker status', async () => {
    const mockLocker = { 
      id: lockerId, 
      status: 'OCCUPIED',
    };
    mockLockerService.toggleLockerStatus.mockResolvedValue(mockLocker as any);

    await lockerController.toggleLockerStatus(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockLockerService.toggleLockerStatus).toHaveBeenCalledWith(lockerId);
    expect(jsonSpy).toHaveBeenCalledWith(mockLocker);
  });
  
});