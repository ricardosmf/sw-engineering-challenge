import { ILocker } from "../../models/locker.model";

export interface ILockerService {
  createLocker(locker: Partial<ILocker>): Promise<ILocker>;
  getLockerById(id: string): Promise<ILocker | null>;
  getAllLockers(): Promise<ILocker[]>;
  updateLocker(id: string, locker: Partial<ILocker>): Promise<ILocker | null>;
  deleteLocker(id: string): Promise<boolean>;
  findLockersByBloqId(bloqId: string): Promise<ILocker[]>;
  findAvailableLockers(bloqId: string): Promise<ILocker[]>;
  toggleLockerStatus(id: string): Promise<ILocker | null>;
}