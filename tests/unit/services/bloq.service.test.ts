import { BloqService } from '../../../src/services/bloq.service';
import { IBloqRepository } from '../../../src/repositories/interfaces/bloq.repository.interface';
import { IBloq } from '../../../src/models/bloq.model';

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
        id: '123',
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
      const mockBloq: Partial<IBloq> = {
        _id: '123',
        title: 'Test Bloq',
        address: 'Test Address',
      };
      mockBloqRepository.findById.mockResolvedValue(mockBloq as IBloq);
  
      // Act
      const result = await bloqService.getBloqById('123');
  
      // Assert
      expect(mockBloqRepository.findById).toHaveBeenCalledWith('123');
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
          _id: '123',
          title: 'Bloq 1',
          address: 'Address 1',
        },
        {
          _id: '456',
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
      const updateData: Partial<IBloq> = {
        title: 'Updated Title',
        address: 'Updated Address'
      };
      const updatedBloq: Partial<IBloq> = {
        _id: '123',
        ...updateData,
      };
      mockBloqRepository.update.mockResolvedValue(updatedBloq as IBloq);
  
      // Act
      const result = await bloqService.updateBloq('123', updateData);
  
      // Assert
      expect(mockBloqRepository.update).toHaveBeenCalledWith('123', updateData);
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
      mockBloqRepository.delete.mockResolvedValue(true);
  
      // Act
      const result = await bloqService.deleteBloq('123');
  
      // Assert
      expect(mockBloqRepository.delete).toHaveBeenCalledWith('123');
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