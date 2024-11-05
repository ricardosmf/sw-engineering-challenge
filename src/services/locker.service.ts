import { ILocker } from "../models/locker.model";
import { ILockerRepository } from "../repositories/interfaces/locker.repository.interface";
import { LockerStatus } from "../types/enums";
import { ILockerService } from "./interfaces/locker.service.interface";

export class LockerService implements ILockerService {
  constructor(private lockerRepository: ILockerRepository) {}

  async createLocker(locker: Partial<ILocker>): Promise<ILocker> {
    return await this.lockerRepository.create(locker);
  }

  async getLockerById(id: string): Promise<ILocker | null> {
    return await this.lockerRepository.findById(id);
  }

  async getAllLockers(): Promise<ILocker[]> {
    return await this.lockerRepository.findAll();
  }

  async updateLocker(id: string, locker: Partial<ILocker>): Promise<ILocker | null> {
    return await this.lockerRepository.update(id, locker);
  }

  async deleteLocker(id: string): Promise<boolean> {
    return await this.lockerRepository.delete(id);
  }

  async findLockersByBloqId(bloqId: string): Promise<ILocker[]> {
    return await this.lockerRepository.findByBloqId(bloqId);
  }

  async findAvailableLockers(bloqId: string): Promise<ILocker[]> {
    return await this.lockerRepository.findAvailable(bloqId);
  }

  async toggleLockerStatus(id: string): Promise<ILocker | null> {
    const locker = await this.lockerRepository.findById(id);
    if (!locker) {
      throw new Error('Locker not found');
    }

    const newStatus = locker.status === LockerStatus.OPEN 
      ? LockerStatus.CLOSED 
      : LockerStatus.OPEN;

    return await this.lockerRepository.update(id, { status: newStatus });
  }
}