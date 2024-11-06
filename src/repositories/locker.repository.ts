import { ILocker, Locker } from "../models/locker.model";
import { LockerStatus } from "../types/enums";
import { ILockerRepository } from "./interfaces/locker.repository.interface";

export class LockerRepository implements ILockerRepository {
  async create(locker: Partial<ILocker>): Promise<ILocker> {
    if (locker.isOccupied === undefined) {
      locker.isOccupied = false;
    }
    return await Locker.create(locker);
  }

  async findById(id: string): Promise<ILocker | null> {
    return await Locker.findById(id);
  }

  async findAll(): Promise<ILocker[]> {
    return await Locker.find();
  }

  async update(id: string, locker: Partial<ILocker>): Promise<ILocker | null> {
    if (locker.isOccupied === undefined) {
      locker.isOccupied = false;
    }
    return await Locker.findByIdAndUpdate(id, locker, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await Locker.findByIdAndDelete(id);
    return !!result;
  }

  async findByBloqId(bloqId: string): Promise<ILocker[]> {
    return await Locker.find({ bloqId });
  }

  async findAvailable(bloqId: string): Promise<ILocker[]> {
    return await Locker.find({
      bloqId,
      isOccupied: false
    });
  }
}
