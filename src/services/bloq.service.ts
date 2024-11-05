import { IBloqService } from './interfaces/bloq.service.interface';
import { IBloq, Bloq } from '../models/bloq.model';
import { IBloqRepository } from '../repositories/interfaces/bloq.repository.interface';

export class BloqService implements IBloqService {
  constructor(private bloqRepository: IBloqRepository) { }

  async createBloq(bloq: Partial<IBloq>): Promise<IBloq> {
    return await this.bloqRepository.create(bloq);
  }

  async getBloqById(id: string): Promise<IBloq | null> {
    return await this.bloqRepository.findById(id);
  }

  async getAllBloqs(): Promise<IBloq[]> {
    return await this.bloqRepository.findAll();
  }

  async updateBloq(id: string, bloq: Partial<IBloq>): Promise<IBloq | null> {
    return await this.bloqRepository.update(id, bloq);
  }

  async deleteBloq(id: string): Promise<boolean> {
    return await this.bloqRepository.delete(id);
  }
}
