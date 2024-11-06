import { ILocker } from "../../../src/models/locker.model";
import { ILockerRepository } from "../../../src/repositories/interfaces/locker.repository.interface";
import { LockerStatus } from "../../../src/types/enums";
import { LockerService } from "../../../src/services/locker.service";
import { Types } from "mongoose";

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
            const mockLocker: Partial<ILocker> = {
                bloqId: new Types.ObjectId(1),
                status: LockerStatus.OPEN
            };
            
            mockLockerRepository.create.mockResolvedValue({
                id: '123',
                ...mockLocker
            } as ILocker);

            const result = await lockerService.createLocker(mockLocker);

            expect(mockLockerRepository.create).toHaveBeenCalledWith(mockLocker);
            expect(result).toEqual({
                id: '123',
                ...mockLocker
            });
        });
    });

    describe('getLockerById', () => {
        it('should return a locker by id', async () => {
            const mockLocker: Partial<ILocker> = {
                id: '123',
                bloqId: new Types.ObjectId(1),
                status: LockerStatus.OPEN
            };

            mockLockerRepository.findById.mockResolvedValue(mockLocker as any);

            const result = await lockerService.getLockerById('123');

            expect(mockLockerRepository.findById).toHaveBeenCalledWith('123');
            expect(result).toEqual(mockLocker);
        });

        it('should return null if locker not found', async () => {
            mockLockerRepository.findById.mockResolvedValue(null);

            const result = await lockerService.getLockerById('123');

            expect(mockLockerRepository.findById).toHaveBeenCalledWith('123');
            expect(result).toBeNull();
        });
    });

    describe('getAllLockers', () => {
        it('should return all lockers', async () => {
            const mockLockers: Partial<ILocker>[] = [
                { id: '123', bloqId: new Types.ObjectId(1), status: LockerStatus.OPEN },
                { id: '456', bloqId: new Types.ObjectId(1), status: LockerStatus.CLOSED }
            ];

            mockLockerRepository.findAll.mockResolvedValue(mockLockers as any);

            const result = await lockerService.getAllLockers();

            expect(mockLockerRepository.findAll).toHaveBeenCalled();
            expect(result).toEqual(mockLockers);
        });
    });

    describe('findLockersByBloqId', () => {
        it('should return lockers by bloqId', async () => {
            const bloqId = new Types.ObjectId(1);
            const mockLockers: Partial<ILocker>[] = [
                { id: '123', bloqId, status: LockerStatus.OPEN },
                { id: '456', bloqId, status: LockerStatus.CLOSED }
            ];

            mockLockerRepository.findByBloqId.mockResolvedValue(mockLockers as any);

            const result = await lockerService.findLockersByBloqId(bloqId.toString());

            expect(mockLockerRepository.findByBloqId).toHaveBeenCalledWith(bloqId.toString());
            expect(result).toEqual(mockLockers);
        });
    });

    describe('findAvailableLockers', () => {+
        it('should return available lockers for a bloqId', async () => {
            const bloqId = new Types.ObjectId(1);
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