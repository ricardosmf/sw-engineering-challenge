import { RentSize, RentStatus } from '../../../src/types/enums';
import { IRentRepository } from '../../../src/repositories/interfaces/rent.repository.interface';
import { ILockerRepository } from '../../../src/repositories/interfaces/locker.repository.interface';
import { RentService } from '../../../src/services/rent.service';

describe('createRent', () => {
  let rentService: RentService;
  let rentRepository: jest.Mocked<IRentRepository>;
  let lockerRepository: jest.Mocked<ILockerRepository>;

  beforeEach(() => {
    rentRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByLockerId: jest.fn(),
      findActiveRents: jest.fn(),

    };

    lockerRepository = {
      findByBloqId: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      findAvailable: jest.fn(),
      delete: jest.fn(),
    };

    rentService = new RentService(rentRepository, lockerRepository);
  });

  const validLockerId = 'validLockerId';

  const validRentData = {
    lockerId: validLockerId,
    weight: 2.5,
    size: RentSize.M,
    status: RentStatus.CREATED
  };

  it('should create rent successfully with valid data', async () => {
    const mockLocker = { id: validLockerId, isOccupied: false };
    const mockCreatedRent = { ...validRentData, _id: 'rentId123' };

    (lockerRepository.findById as jest.Mock).mockResolvedValue(mockLocker);
    (rentRepository.create as jest.Mock).mockResolvedValue(mockCreatedRent);

    const result = await rentService.createRent(validRentData as any);;

    expect(result).toEqual(mockCreatedRent);
    expect(lockerRepository.findById).toHaveBeenCalledWith(validLockerId);
    expect(lockerRepository.update).toHaveBeenCalledWith(validLockerId, { isOccupied: true });
    expect(rentRepository.create).toHaveBeenCalledWith(validRentData);
  });

  it('should throw error when locker does not exist', async () => {
    (lockerRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(rentService.createRent(validRentData as any))
      .rejects
      .toThrow(`Locker with ID ${validLockerId} not found`);

    expect(rentRepository.create).not.toHaveBeenCalled();
  });

  it('should throw error when locker is occupied', async () => {
    const occupiedLocker = { id: validLockerId, isOccupied: true };
    (lockerRepository.findById as jest.Mock).mockResolvedValue(occupiedLocker);

    await expect(rentService.createRent(validRentData as any))
      .rejects
      .toThrow(`Locker with ID ${validLockerId} is already occupied`);

    expect(rentRepository.create).not.toHaveBeenCalled();
  });

  it('should update locker status after creating rent', async () => {
    const mockLocker = { id: 'validLockerId', isOccupied: false };
    const mockCreatedRent = { ...validRentData, _id: 'rentId123' };

    (lockerRepository.findById as jest.Mock).mockResolvedValue(mockLocker);
    (rentRepository.create as jest.Mock).mockResolvedValue(mockCreatedRent);

    await rentService.createRent(validRentData as any);

    expect(lockerRepository.update).toHaveBeenCalledWith(
      'validLockerId',
      { isOccupied: true }
    );
  });

  describe('updateRent', () => {
    it('should update rent successfully', async () => {
      const rentId = 'rent123';
      const updateData = { weight: 3.0 };
      const updatedRent = { ...validRentData, ...updateData };

      rentRepository.update.mockResolvedValue(updatedRent as any);

      const result = await rentService.updateRent(rentId, updateData);

      expect(result).toEqual(updatedRent);
      expect(rentRepository.update).toHaveBeenCalledWith(rentId, updateData);
    });
  });

  describe('deleteRent', () => {
    it('should delete rent successfully', async () => {
      const rentId = 'rent123';
      rentRepository.delete.mockResolvedValue(true);

      const result = await rentService.deleteRent(rentId);

      expect(result).toBe(true);
      expect(rentRepository.delete).toHaveBeenCalledWith(rentId);
    });
  });

  describe('updateRentStatus', () => {
    it('should update rent status and free locker when delivered', async () => {
      const rentId = 'rent123';
      const mockRent = { ...validRentData, id: rentId };
      const updatedRent = { ...mockRent, status: RentStatus.DELIVERED };

      rentRepository.findById.mockResolvedValue(mockRent as any);
      rentRepository.update.mockResolvedValue(updatedRent as any);

      const result = await rentService.updateRentStatus(rentId, RentStatus.DELIVERED);

      expect(result).toEqual(updatedRent);
      expect(lockerRepository.update).toHaveBeenCalledWith(mockRent.lockerId.toString(), { isOccupied: false });
    });

    it('should throw error when rent not found', async () => {
      const invalidRentId = 'invalid-id';
      rentRepository.findById.mockResolvedValue(null);

      await expect(rentService.updateRentStatus(invalidRentId, RentStatus.DELIVERED))
        .rejects
        .toThrow(`Rent with ID ${invalidRentId} not found`);
    });
  });

  describe('getActiveRents', () => {
    it('should return active rents', async () => {
      const activeRents = [validRentData];
      rentRepository.findActiveRents.mockResolvedValue(activeRents as any);

      const result = await rentService.getActiveRents();

      expect(result).toEqual(activeRents);
      expect(rentRepository.findActiveRents).toHaveBeenCalled();
    });
  });

  describe('getRentsByLockerId', () => {
    it('should return rents for specific locker', async () => {
      const lockerId = 'locker123';
      const lockerRents = validRentData;
      rentRepository.findByLockerId.mockResolvedValue(lockerRents as any);

      const result = await rentService.getRentByLockerId(lockerId);

      expect(result).toEqual(lockerRents);
      expect(rentRepository.findByLockerId).toHaveBeenCalledWith(lockerId);
    });
  });
});