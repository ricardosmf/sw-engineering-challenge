import { ILockerService } from '../../../src/services/interfaces/locker.service.interface';
import { Request, Response } from 'express';
import { LockerController } from '../../../src/controllers/locker.controller';

describe('toggleLockerStatus', () => {
  let mockLockerService: jest.Mocked<ILockerService>;
  let lockerController: LockerController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;
  let jsonSpy: jest.Mock;
  let statusSpy: jest.Mock;

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
        id: '123'
      }
    };
  });

  it('should successfully toggle locker status', async () => {
    const mockLocker = { 
      id: '123', 
      status: 'OCCUPIED',
    };
    mockLockerService.toggleLockerStatus.mockResolvedValue(mockLocker as any);

    await lockerController.toggleLockerStatus(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockLockerService.toggleLockerStatus).toHaveBeenCalledWith('123');
    expect(jsonSpy).toHaveBeenCalledWith(mockLocker);
  });
  
});