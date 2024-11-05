import { Bloq, IBloq } from "../models/bloq.model";
import { IBloqRepository } from "./interfaces/bloq.repository.interface";

export class BloqRepository implements IBloqRepository {
  async create(bloq: Partial<IBloq>): Promise<IBloq> {
    return await Bloq.create(bloq);
  }

  async findById(id: string): Promise<IBloq | null> {
    return await Bloq.findById(id);
  }

  async findAll(): Promise<IBloq[]> {
    return await Bloq.find();
  }

  async update(id: string, bloq: Partial<IBloq>): Promise<IBloq | null> {
    return await Bloq.findByIdAndUpdate(id, bloq, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await Bloq.findByIdAndDelete(id);
    return !!result;
  }
}