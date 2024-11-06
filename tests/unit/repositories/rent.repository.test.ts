import { RentRepository } from '../../../src/repositories/rent.repository';
import { IRent } from '../../../src/models/rent.model';
import { RentStatus } from '../../../src/types/enums';
import { Rent } from '../../../src/models/rent.model';

// Mock the Rent model
jest.mock('../../../src/models/rent.model', () => ({
  Rent: {
    find: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  }
}));


describe('RentRepository', () => {
  let rentRepository: RentRepository;
  const MockRent = Rent as jest.Mocked<typeof Rent>;

  beforeEach(() => {
    rentRepository = new RentRepository();
    jest.clearAllMocks();
  });

  describe('findActiveRents', () => {
    it('should return rents with active statuses', async () => {
      // Arrange
      const mockActiveRents: Partial<IRent>[] = [
        { id: '1', status: RentStatus.CREATED },
        { id: '2', status: RentStatus.WAITING_DROPOFF },
        { id: '3', status: RentStatus.WAITING_PICKUP }
      ];

      MockRent.find.mockResolvedValue(mockActiveRents);

      // Act
      const result = await rentRepository.findActiveRents();

      // Assert
      expect(MockRent.find).toHaveBeenCalledWith({
        status: {
          $in: [
            RentStatus.CREATED,
            RentStatus.WAITING_DROPOFF,
            RentStatus.WAITING_PICKUP
          ]
        }
      });
      expect(result).toEqual(mockActiveRents);
    });

    it('should return empty array when no active rents found', async () => {
      // Arrange
      MockRent.find.mockResolvedValue([]);

      // Act
      const result = await rentRepository.findActiveRents();

      // Assert
      expect(result).toEqual([]);
      expect(MockRent.find).toHaveBeenCalled();
    });

    it('should throw error when database operation fails', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      MockRent.find.mockRejectedValue(dbError);

      // Act & Assert
      await expect(rentRepository.findActiveRents())
        .rejects
        .toThrow('Database connection failed');
    });
  });
});