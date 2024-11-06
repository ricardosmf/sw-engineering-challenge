import { NextFunction, Request, Response } from 'express';
import { IBloqService } from '../services/interfaces/bloq.service.interface';

export class BloqController {
  constructor(private bloqService: IBloqService) {}

  async createBloq(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bloq = await this.bloqService.createBloq(req.body);
      res.status(201).json(bloq);
    } catch (error) {
      next(error);
    }
  }

  async getBloq(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bloq = await this.bloqService.getBloqById(req.params.id);
      res.json(bloq);
    } catch (error) {
      next(error);
    }
  }

  async getAllBloqs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bloqs = await this.bloqService.getAllBloqs();
      res.json(bloqs);
    } catch (error) {
      next(error);
    }
  }

  async updateBloq(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bloq = await this.bloqService.updateBloq(req.params.id, req.body);
      res.json(bloq);
    } catch (error) {
      next(error);
    }
  }

  async deleteBloq(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.bloqService.deleteBloq(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}