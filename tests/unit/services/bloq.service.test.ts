import { BloqService } from '../../../src/services/bloq.service';
import { IBloqRepository } from '../../../src/repositories/interfaces/bloq.repository.interface';
import { IBloq } from '../../../src/models/bloq.model';
import { v4 as uuidv4 } from 'uuid';

describe('BloqService', () => {

  let bloqService: BloqService;
  let mockBloqRepository: jest.Mocked<IBloqRepository>;

  beforeEach(() => {
    mockBloqRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    bloqService = new BloqService(mockBloqRepository);
  });

  describe('createBloq', () => {

    it('should successfully create a bloq', async () => {
      // Arrange
      const mockBloqData: Partial<IBloq> = {
        title: 'Test Bloq',
        address: 'Test Content'
      };

      const mockCreatedBloq: Partial<IBloq> = {
        id: uuidv4(),
        title: mockBloqData.title!,
        address: mockBloqData.address!
      };

      mockBloqRepository.create.mockResolvedValue(mockCreatedBloq as IBloq);

      // Act
      const result = await bloqService.createBloq(mockBloqData);

      // Assert
      expect(mockBloqRepository.create).toHaveBeenCalledWith(mockBloqData);
      expect(result).toEqual(mockCreatedBloq);
    });

    it('should throw an error if repository create fails', async () => {
      // Arrange
      const mockBloqData: Partial<IBloq> = {
        title: 'Test Bloq',
        address: 'Test Address'
      };

      const error = new Error('Database error');
      mockBloqRepository.create.mockRejectedValue(error);

      // Act & Assert
      await expect(bloqService.createBloq(mockBloqData))
        .rejects
        .toThrow('Database error');
      expect(mockBloqRepository.create).toHaveBeenCalledWith(mockBloqData);
    });
  });

  describe('getBloqById', () => {
    it('should return a bloq when found', async () => {
      // Arrange
      const mockId = uuidv4();
      const mockBloq: Partial<IBloq> = {
        id: mockId,
        title: 'Test Bloq',
        address: 'Test Address',
      };
      mockBloqRepository.findById.mockResolvedValue(mockBloq as IBloq);

      // Act
      const result = await bloqService.getBloqById(mockId);

      // Assert
      expect(mockBloqRepository.findById).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(mockBloq);
    });

    it('should throw error when bloq not found', async () => {
      // Arrange
      const nonExistentId = 'nonexistent';
      mockBloqRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(bloqService.getBloqById(nonExistentId)).rejects.toThrow(`Bloq with ID ${nonExistentId} not found`);
      expect(mockBloqRepository.findById).toHaveBeenCalledWith(nonExistentId);
    });
  });

  describe('getAllBloqs', () => {
    it('should return all bloqs', async () => {
      // Arrange
      const mockBloqs: Partial<IBloq>[] = [
        {
          _id: uuidv4(),
          title: 'Bloq 1',
          address: 'Address 1',
        },
        {
          _id: uuidv4(),
          title: 'Bloq 2',
          address: 'Address 2',
        }
      ];
      mockBloqRepository.findAll.mockResolvedValue(mockBloqs as IBloq[]);

      // Act
      const result = await bloqService.getAllBloqs();

      // Assert
      expect(mockBloqRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockBloqs);
    });
  });

  describe('updateBloq', () => {
    it('should successfully update a bloq', async () => {
      // Arrange
      const mockId = uuidv4();
      const updateData: Partial<IBloq> = {
        title: 'Updated Title',
        address: 'Updated Address'
      };
      const updatedBloq: Partial<IBloq> = {
        id: mockId,
        ...updateData,
      };
      mockBloqRepository.update.mockResolvedValue(updatedBloq as IBloq);

      // Act
      const result = await bloqService.updateBloq(mockId, updateData);

      // Assert
      expect(mockBloqRepository.update).toHaveBeenCalledWith(mockId, updateData);
      expect(result).toEqual(updatedBloq);
    });

    it('should return null when updating non-existent bloq', async () => {
      // Arrange
      mockBloqRepository.update.mockResolvedValue(null);

      // Act
      const result = await bloqService.updateBloq('nonexistent', { title: 'New Title' });

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('deleteBloq', () => {
    it('should successfully delete a bloq', async () => {
      // Arrange
      const mockId = uuidv4();
      mockBloqRepository.delete.mockResolvedValue(true);

      // Act
      const result = await bloqService.deleteBloq(mockId);

      // Assert
      expect(mockBloqRepository.delete).toHaveBeenCalledWith(mockId);
      expect(result).toBe(true);
    });

    it('should return false when deleting non-existent bloq', async () => {
      // Arrange
      mockBloqRepository.delete.mockResolvedValue(false);

      // Act
      const result = await bloqService.deleteBloq('nonexistent');

      // Assert
      expect(mockBloqRepository.delete).toHaveBeenCalledWith('nonexistent');
      expect(result).toBe(false);
    });
  });
});