import { IRent } from "../../models/rent.model";
import { IBaseRepository } from "./base.repository.interface";

export interface IRentRepository extends IBaseRepository<IRent> {
  findByLockerId(lockerId: string): Promise<IRent[]>;
  findActiveRents(): Promise<IRent[]>;
}