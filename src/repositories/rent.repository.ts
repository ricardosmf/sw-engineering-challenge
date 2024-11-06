import { IRent, Rent } from "../models/rent.model";
import { RentStatus } from "../types/enums";
import { IRentRepository } from "./interfaces/rent.repository.interface";

export class RentRepository implements IRentRepository {
  async create(rent: Partial<IRent>): Promise<IRent> {
    return await Rent.create(rent);
  }

  async findById(id: string): Promise<IRent | null> {
    return await Rent.findById(id);
  }

  async findAll(): Promise<IRent[]> {
    return await Rent.find();
  }

  async update(id: string, rent: Partial<IRent>): Promise<IRent | null> {
    return await Rent.findByIdAndUpdate(id, rent, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await Rent.findByIdAndDelete(id);
    return !!result;
  }

  async findByLockerId(lockerId: string): Promise<IRent | null> {
    return await Rent.findOne({ lockerId });
  }

  async findActiveRents(): Promise<IRent[]> {
    return await Rent.find({
      status: { 
        $in: [
          RentStatus.CREATED,
          RentStatus.WAITING_DROPOFF,
          RentStatus.WAITING_PICKUP
        ]
      }
    });
  }
}