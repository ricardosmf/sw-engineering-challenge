import { Types } from 'mongoose';
import { Locker, ILocker } from '../../../src/models/locker.model';
import { LockerStatus } from '../../../src/types/enums';
import { LockerRepository } from '../../../src/repositories/locker.repository';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../../../src/models/locker.model', () => ({
  Locker: {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn()
  }
}));

describe('LockerRepository', () => {
  let lockerRepository: LockerRepository;
  let mockLocker: Partial<ILocker>;

  beforeEach(() => {
    lockerRepository = new LockerRepository();
    jest.clearAllMocks();
    mockLocker = {
      _id: uuidv4(),
      bloqId: uuidv4(),
      isOccupied: false,
      status: LockerStatus.OPEN,
    };
  });

  describe('create', () => {
    it('should create a new locker', async () => {
      const newLocker = {
        id: uuidv4(),
        bloqId: uuidv4(),
        status: LockerStatus.OPEN,
        isOccupied: false
      };

      (Locker.create as jest.Mock).mockResolvedValue(newLocker);

      const result = await lockerRepository.create(newLocker);

      expect(Locker.create).toHaveBeenCalledWith(newLocker);
      expect(result).toEqual(newLocker);
    });
  });

  describe('findAvailable', () => {
    it('should return available lockers for a given bloqId', async () => {
      const bloqId = uuidv4();
      const mockLockers = [
        { 
          id: uuidv4(), 
          bloqId, 
          isOccupied: false, 
        },
        { 
          id: uuidv4(), 
          bloqId,
          isOccupied: false, 
        }
      ];

      (Locker.find as jest.Mock).mockResolvedValue(mockLockers);

      const result = await lockerRepository.findAvailable(bloqId);

      expect(Locker.find).toHaveBeenCalledWith({
        bloqId,
        isOccupied: false,
      });
      expect(result).toEqual(mockLockers);
    });
  });

  describe('findById', () => {
    it('should find a locker by id', async () => {
      const lockerId = uuidv4();
      (Locker.findById as jest.Mock).mockResolvedValue(mockLocker);

      const result = await lockerRepository.findById(lockerId);

      expect(Locker.findById).toHaveBeenCalledWith(lockerId);
      expect(result).toEqual(mockLocker);
    });
  });

  describe('update', () => {
    it('should update a locker', async () => {
      const lockerId = uuidv4();
      const updateData = {
        status: LockerStatus.CLOSED,
        isOccupied: true
      };

      (Locker.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        ...mockLocker,
        ...updateData
      });

      const result = await lockerRepository.update(lockerId, updateData);

      expect(Locker.findByIdAndUpdate).toHaveBeenCalledWith(
        lockerId,
        updateData,
        { new: true }
      );
      expect(result).toEqual({
        ...mockLocker,
        ...updateData
      });
    });
  });
  
  describe('delete', () => {
    it('should delete a locker', async () => {
      const lockerId = uuidv4();
      (Locker.findByIdAndDelete as jest.Mock).mockResolvedValue(mockLocker);

      const result = await lockerRepository.delete(lockerId);

      expect(Locker.findByIdAndDelete).toHaveBeenCalledWith(lockerId);
      expect(result).toEqual(true);
    });
  });
  
  describe('findByBloqId', () => {
    it('should find lockers by bloqId', async () => {
      // Arrange
      const bloqId = new Types.ObjectId().toString();
      const mockLockers = [mockLocker];
      jest.spyOn(Locker, 'find').mockResolvedValue(mockLockers);
  
      // Act
      const result = await lockerRepository.findByBloqId(bloqId);
  
      // Assert
      expect(Locker.find).toHaveBeenCalledWith({ bloqId });
      expect(result).toEqual(mockLockers);
    });
  
    it('should return empty array when no lockers found', async () => {
      // Arrange
      const bloqId = new Types.ObjectId().toString();
      jest.spyOn(Locker, 'find').mockResolvedValue([]);
  
      // Act
      const result = await lockerRepository.findByBloqId(bloqId);
  
      // Assert
      expect(result).toEqual([]);
    });
  });
});