import { IRent } from "../models/rent.model";
import { ILockerRepository } from "../repositories/interfaces/locker.repository.interface";
import { IRentRepository } from "../repositories/interfaces/rent.repository.interface";
import { RentStatus } from "../types/enums";
import { IRentService } from "./interfaces/rent.service.interface";

export class RentService implements IRentService {
  constructor(
    private rentRepository: IRentRepository,
    private lockerRepository: ILockerRepository
  ) {}

  async createRent(rentData: Partial<IRent>): Promise<IRent> {
    const locker = await this.lockerRepository.findById(rentData.lockerId!.toString());
    if (!locker) {
      throw new Error('Locker not found');
    }
    if (locker.isOccupied) {
      throw new Error('Locker is already occupied');
    }

    const rent = await this.rentRepository.create(rentData);
    await this.lockerRepository.update(rentData.lockerId!.toString(), { isOccupied: true });
    return rent;
  }

  async getRentById(id: string): Promise<IRent | null> {
    return await this.rentRepository.findById(id);
  }

  async getAllRents(): Promise<IRent[]> {
    return await this.rentRepository.findAll();
  }

  async updateRent(id: string, rent: Partial<IRent>): Promise<IRent | null> {
    return await this.rentRepository.update(id, rent);
  }

  async deleteRent(id: string): Promise<boolean> {
    return await this.rentRepository.delete(id);
  }

  async updateRentStatus(id: string, status: RentStatus): Promise<IRent | null> {
    const rent = await this.rentRepository.findById(id);
    if (!rent) {
      throw new Error('Rent not found');
    }

    if (status === RentStatus.DELIVERED) {
      await this.lockerRepository.update(rent.lockerId.toString(), { isOccupied: false });
    }

    return await this.rentRepository.update(id, { status });
  }

  async getActiveRents(): Promise<IRent[]> {
    return await this.rentRepository.findActiveRents();
  }

  async getRentByLockerId(lockerId: string): Promise<IRent | null> {
    return await this.rentRepository.findByLockerId(lockerId);
  }
}