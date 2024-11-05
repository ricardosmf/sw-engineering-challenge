import { ILocker } from "../../models/locker.model";
import { IBaseRepository } from "./base.repository.interface";

export interface ILockerRepository extends IBaseRepository<ILocker> {
  findByBloqId(bloqId: string): Promise<ILocker[]>;
  findAvailable(bloqId: string): Promise<ILocker[]>;
}