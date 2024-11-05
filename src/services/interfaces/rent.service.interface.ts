import { IRent } from "../../models/rent.model";
import { RentStatus } from "../../types/enums";

export interface IRentService {
  createRent(rentData: Partial<IRent>): Promise<IRent>;
  getRentById(id: string): Promise<IRent | null>;
  getAllRents(): Promise<IRent[]>;
  updateRentStatus(id: string, status: RentStatus): Promise<IRent | null>;
  getActiveRents(): Promise<IRent[]>;
  getRentsByLockerId(lockerId: string): Promise<IRent[]>;
}