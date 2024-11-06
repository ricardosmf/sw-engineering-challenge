import { Types } from 'mongoose';
import { Locker, ILocker } from '../../../src/models/locker.model';
import { LockerStatus } from '../../../src/types/enums';
import { LockerRepository } from '../../../src/repositories/locker.repository';

jest.mock('../../../src/models/locker.model', () => ({
  Locker: {
    find: jest.fn(),
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
      _id: new Types.ObjectId().toString(),
      bloqId: new Types.ObjectId(),
      isOccupied: false,
      status: LockerStatus.OPEN,
    };
  });

  describe('findAvailable', () => {
    it('should return available lockers for a given bloqId', async () => {
      // Arrange
      const bloqId = new Types.ObjectId().toString()
      const mockLockers = [
        { 
          _id: new Types.ObjectId().toString(), 
          bloqId, 
          isOccupied: false, 
          status: LockerStatus.OPEN 
        },
        { 
          _id: new Types.ObjectId().toString(), 
          bloqId, 
          isOccupied: false, 
          status: LockerStatus.OPEN 
        }
      ];
      
      jest.spyOn(Locker, 'find').mockResolvedValue(mockLockers);

      // Act
      const result = await lockerRepository.findAvailable(bloqId.toString());

      // Assert
      expect(Locker.find).toHaveBeenCalledWith({
        bloqId,
        isOccupied: false,
        status: LockerStatus.OPEN
      });
      expect(result).toEqual(mockLockers);
    });

    it('should return empty array when no available lockers found', async () => {
      // Arrange
      const bloqId = new Types.ObjectId().toString();
      jest.spyOn(Locker, 'find').mockResolvedValue([]);

      // Act
      const result = await lockerRepository.findAvailable(bloqId);

      // Assert
      expect(result).toEqual([]);
    });
  });
  describe('update', () => {
    it('should update a locker successfully', async () => {
      // Arrange
      const id = new Types.ObjectId().toString();
      const updateData = { isOccupied: true };
      const updatedLocker = { ...mockLocker, ...updateData };
      jest.spyOn(Locker, 'findByIdAndUpdate').mockResolvedValue(updatedLocker);
  
      // Act
      const result = await lockerRepository.update(id, updateData);
  
      // Assert
      expect(Locker.findByIdAndUpdate).toHaveBeenCalledWith(id, updateData, { new: true });
      expect(result).toEqual(updatedLocker);
    });
  
    it('should return null when locker not found', async () => {
      // Arrange
      const id = new Types.ObjectId().toString();
      jest.spyOn(Locker, 'findByIdAndUpdate').mockResolvedValue(null);
  
      // Act
      const result = await lockerRepository.update(id, { isOccupied: true });
  
      // Assert
      expect(result).toBeNull();
    });
  });
  
  describe('delete', () => {
    it('should delete a locker successfully', async () => {
      // Arrange
      const id = new Types.ObjectId().toString();
      jest.spyOn(Locker, 'findByIdAndDelete').mockResolvedValue(mockLocker);
  
      // Act
      const result = await lockerRepository.delete(id);
  
      // Assert
      expect(Locker.findByIdAndDelete).toHaveBeenCalledWith(id);
      expect(result).toBe(true);
    });
  
    it('should return false when locker not found', async () => {
      // Arrange
      const id = new Types.ObjectId().toString();
      jest.spyOn(Locker, 'findByIdAndDelete').mockResolvedValue(null);
  
      // Act
      const result = await lockerRepository.delete(id);
  
      // Assert
      expect(result).toBe(false);
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