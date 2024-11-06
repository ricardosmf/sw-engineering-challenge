import { ILocker } from "../../../src/models/locker.model";
import { ILockerRepository } from "../../../src/repositories/interfaces/locker.repository.interface";
import { LockerStatus } from "../../../src/types/enums";
import { LockerService } from "../../../src/services/locker.service";
import { v4 as uuidv4 } from 'uuid';


describe('LockerService', () => {
    let lockerService: LockerService;
    let mockLockerRepository: jest.Mocked<ILockerRepository>;

    beforeEach(() => {
        mockLockerRepository = {
            create: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findByBloqId: jest.fn(),
            findAvailable: jest.fn()
        };
        lockerService = new LockerService(mockLockerRepository);
    });

    describe('createLocker', () => {
        it('should create a new locker', async () => {
            const mockBloqId = uuidv4();
            const mockLocker: Partial<ILocker> = {
                bloqId: mockBloqId,
                status: LockerStatus.OPEN,
                isOccupied: false
            };

            const mockId = uuidv4();
            mockLockerRepository.create.mockResolvedValue({
                id: mockId,
                ...mockLocker
            } as ILocker);

            const result = await lockerService.createLocker(mockLocker);

            expect(mockLockerRepository.create).toHaveBeenCalledWith(mockLocker);
            expect(result).toEqual({
                id: mockId,
                ...mockLocker
            });
        });
    });


    describe('getLockerById', () => {
        it('should return locker by id', async () => {
            const mockId = uuidv4();
            const mockLocker: Partial<ILocker> = {
                id: mockId,
                bloqId: uuidv4(),
                status: LockerStatus.OPEN,
                isOccupied: false
            };

            mockLockerRepository.findById.mockResolvedValue(mockLocker as any);

            const result = await lockerService.getLockerById(mockId);

            expect(mockLockerRepository.findById).toHaveBeenCalledWith(mockId);
            expect(result).toEqual(mockLocker);
        });
    });

    describe('getAllLockers', () => {
        it('should return all lockers', async () => {
            const mockLockers: Partial<ILocker>[] = [
                {
                    id: uuidv4(),
                    bloqId: uuidv4(),
                    status: LockerStatus.OPEN,
                    isOccupied: false
                },
                {
                    id: uuidv4(),
                    bloqId: uuidv4(),
                    status: LockerStatus.CLOSED,
                    isOccupied: true
                }
            ];

            mockLockerRepository.findAll.mockResolvedValue(mockLockers as any);

            const result = await lockerService.getAllLockers();

            expect(mockLockerRepository.findAll).toHaveBeenCalled();
            expect(result).toEqual(mockLockers);
        });
    });

    describe('findLockersByBloqId', () => {
        it('should return lockers by bloqId', async () => {
            const mockBloqId = uuidv4();
            const mockLockers: Partial<ILocker>[] = [
                {
                    id: uuidv4(),
                    bloqId: mockBloqId,
                    status: LockerStatus.OPEN
                }
            ];

            mockLockerRepository.findByBloqId.mockResolvedValue(mockLockers as any);

            const result = await lockerService.findLockersByBloqId(mockBloqId);

            expect(mockLockerRepository.findByBloqId).toHaveBeenCalledWith(mockBloqId);
            expect(result).toEqual(mockLockers);
        });
    });

    describe('findAvailableLockers', () => {
        +
        it('should return available lockers for a bloqId', async () => {
            const bloqId = uuidv4();
            const mockLockers: Partial<ILocker>[] = [
                { id: '123', bloqId, status: LockerStatus.OPEN, isOccupied: false },
                { id: '456', bloqId, status: LockerStatus.OPEN, isOccupied: false }
            ];

            mockLockerRepository.findAvailable.mockResolvedValue(mockLockers as any);

            const result = await lockerService.findAvailableLockers(bloqId.toString());

            expect(mockLockerRepository.findAvailable).toHaveBeenCalledWith(bloqId.toString());
            expect(result).toEqual(mockLockers);
        });
    });

    describe('deleteLocker', () => {
        it('should delete a locker', async () => {
            mockLockerRepository.delete.mockResolvedValue(true);

            const result = await lockerService.deleteLocker('123');

            expect(mockLockerRepository.delete).toHaveBeenCalledWith('123');
            expect(result).toBe(true);
        });

        it('should return false if deletion fails', async () => {
            mockLockerRepository.delete.mockResolvedValue(false);

            const result = await lockerService.deleteLocker('123');

            expect(mockLockerRepository.delete).toHaveBeenCalledWith('123');
            expect(result).toBe(false);
        });
    });
});