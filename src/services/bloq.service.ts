import { IBloqService } from './interfaces/bloq.service.interface';
import { IBloq } from '../models/bloq.model';
import { IBloqRepository } from '../repositories/interfaces/bloq.repository.interface';
import { BloqNotFoundError, BloqsNotFoundError } from '../errors/bloq.errors';

export class BloqService implements IBloqService {
  constructor(private bloqRepository: IBloqRepository) { }

  async createBloq(bloq: Partial<IBloq>): Promise<IBloq> {
    return await this.bloqRepository.create(bloq);
  }

  async getBloqById(id: string): Promise<IBloq | null> {
    const bloq = await this.bloqRepository.findById(id);
    if (!bloq) {
      throw new BloqNotFoundError(id);
    }
    return bloq;
  }

  async getAllBloqs(): Promise<IBloq[]> {
    const bloqs = await this.bloqRepository.findAll();
    if (!bloqs) {
      throw new BloqsNotFoundError();
    }
    return bloqs;
  }

  async updateBloq(id: string, bloq: Partial<IBloq>): Promise<IBloq | null> {
    return await this.bloqRepository.update(id, bloq);
  }

  async deleteBloq(id: string): Promise<boolean> {
    return await this.bloqRepository.delete(id);
  }
}
