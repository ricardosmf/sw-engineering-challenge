import { Request, Response } from 'express';
import { IBloqService } from '../services/interfaces/bloq.service.interface';

export class BloqController {
  constructor(private bloqService: IBloqService) {}

  async createBloq(req: Request, res: Response): Promise<void> {
    try {
      const bloq = await this.bloqService.createBloq(req.body);
      res.status(201).json(bloq);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create bloq' });
    }
  }

  async getBloq(req: Request, res: Response): Promise<void> {
    try {
      const bloq = await this.bloqService.getBloqById(req.params.id);
      if (!bloq) {
        res.status(404).json({ error: 'Bloq not found' });
        return;
      }
      res.json(bloq);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get bloq' });
    }
  }

  async getAllBloqs(req: Request, res: Response): Promise<void> {
    try {
      const bloqs = await this.bloqService.getAllBloqs();
      if (!bloqs) {
        res.status(404).json({ error: 'Bloqs not found' });
        return;
      }
      res.json(bloqs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get all bloqs' });
    }
  }

  async updateBloq(req: Request, res: Response): Promise<void> {
    try {
      const bloq = await this.bloqService.updateBloq(req.params.id, req.body);
      res.json(bloq);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update bloq' });
    }
  }

  async deleteBloq(req: Request, res: Response): Promise<void> {
    try {
      await this.bloqService.deleteBloq(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete bloq' });
    }
  }
}