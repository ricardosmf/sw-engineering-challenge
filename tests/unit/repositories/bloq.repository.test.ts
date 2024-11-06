import { Bloq, IBloq } from '../../../src/models/bloq.model';
import { BloqRepository } from '../../../src/repositories/bloq.repository';

jest.mock('../../../src/models/bloq.model');

describe('BloqRepository', () => {
  let repository: BloqRepository;
  let mockBloq: Partial<IBloq>;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new BloqRepository();
    mockBloq = {
      _id: '123',
      title: 'Test Bloq',
      address: 'Test Content'
    };
  });

  describe('create', () => {
    it('should create a new bloq', async () => {
      (Bloq.create as jest.Mock).mockResolvedValue(mockBloq);

      const result = await repository.create(mockBloq);

      expect(Bloq.create).toHaveBeenCalledWith(mockBloq);
      expect(result).toEqual(mockBloq);
    });

    it('should throw error if creation fails', async () => {
      const error = new Error('Creation failed');
      (Bloq.create as jest.Mock).mockRejectedValue(error);

      await expect(repository.create(mockBloq)).rejects.toThrow('Creation failed');
    });
  });

  describe('findById', () => {
    it('should find bloq by id', async () => {
      (Bloq.findById as jest.Mock).mockResolvedValue(mockBloq);

      const result = await repository.findById('123');

      expect(Bloq.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockBloq);
    });

    it('should return null if bloq not found', async () => {
      (Bloq.findById as jest.Mock).mockResolvedValue(null);

      const result = await repository.findById('123');

      expect(Bloq.findById).toHaveBeenCalledWith('123');
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all bloqs', async () => {
      const mockBloqs = [mockBloq, { ...mockBloq, _id: '456' }];
      (Bloq.find as jest.Mock).mockResolvedValue(mockBloqs);

      const result = await repository.findAll();

      expect(Bloq.find).toHaveBeenCalled();
      expect(result).toEqual(mockBloqs);
    });

    it('should return empty array when no bloqs exist', async () => {
      (Bloq.find as jest.Mock).mockResolvedValue([]);

      const result = await repository.findAll();

      expect(Bloq.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update existing bloq', async () => {
      const updateData = { title: 'Updated Title' };
      (Bloq.findByIdAndUpdate as jest.Mock).mockResolvedValue({ ...mockBloq, ...updateData });

      const result = await repository.update('123', updateData);

      expect(Bloq.findByIdAndUpdate).toHaveBeenCalledWith('123', updateData, { new: true });
      expect(result?.title).toBe('Updated Title');
    });

    it('should return null if bloq to update not found', async () => {
      (Bloq.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      const result = await repository.update('123', { title: 'Updated Title' });

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete existing bloq', async () => {
      (Bloq.findByIdAndDelete as jest.Mock).mockResolvedValue(mockBloq);

      const result = await repository.delete('123');

      expect(Bloq.findByIdAndDelete).toHaveBeenCalledWith('123');
      expect(result).toBe(true);
    });

    it('should return false if bloq to delete not found', async () => {
      (Bloq.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      const result = await repository.delete('123');

      expect(Bloq.findByIdAndDelete).toHaveBeenCalledWith('123');
      expect(result).toBe(false);
    });
  });
});