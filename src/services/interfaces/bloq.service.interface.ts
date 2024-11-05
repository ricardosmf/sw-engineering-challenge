import { IBloq } from "../../models/bloq.model";

export interface IBloqService {
  createBloq(bloq: Partial<IBloq>): Promise<IBloq>;
  getBloqById(id: string): Promise<IBloq | null>;
  getAllBloqs(): Promise<IBloq[]>;
  updateBloq(id: string, bloq: Partial<IBloq>): Promise<IBloq | null>;
  deleteBloq(id: string): Promise<boolean>;
}