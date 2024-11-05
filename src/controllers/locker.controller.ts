import { Request, Response } from 'express';
import { ILockerService } from "../services/interfaces/locker.service.interface";

export class LockerController {
  constructor(private lockerService: ILockerService) { }

  async createLocker(req: Request, res: Response): Promise<void> {
    try {
      const locker = await this.lockerService.createLocker(req.body);
      res.status(201).json(locker);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create locker' });
    }
  }

  async getLocker(req: Request, res: Response): Promise<void> {
    try {
      const locker = await this.lockerService.getLockerById(req.params.id);
      if (!locker) {
        res.status(404).json({ error: 'Locker not found' });
        return;
      }
      res.json(locker);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get locker' });
    }
  }

  async getAllLockers(req: Request, res: Response): Promise<void> {
    try {
      const lockers = await this.lockerService.getAllLockers();

      if (!lockers) {
        res.status(404).json({ error: 'Lockers not found' });
        return;
      }

      res.json(lockers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get all lockers' });
    }
  }

  async updateLocker(req: Request, res: Response): Promise<void> {
    try {
      const locker = await this.lockerService.updateLocker(req.params.id, req.body);
      res.json(locker);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update locker' });
    }
  }

  async deleteLocker(req: Request, res: Response): Promise<void> {
    try {
      await this.lockerService.deleteLocker(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete locker' });
    }
  }

  async findLockersByBloq(req: Request, res: Response): Promise<void> {
    try {
      const lockers = await this.lockerService.findLockersByBloqId(req.params.bloqId);

      if (!lockers) {
        res.status(404).json({ error: 'Lockers not found' });
        return;
      }

      res.json(lockers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get all lockers' });
    }
  }

  async findAvailableLockers(req: Request, res: Response): Promise<void> {
    try {
      const lockers = await this.lockerService.findAvailableLockers(req.params.bloqId);
      if (!lockers) {
        res.status(404).json({ error: 'Available lockers not found' });
        return;
      }
      res.json(lockers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get available lockers' });
    }
  }

  async toggleLockerStatus(req: Request, res: Response): Promise<void> {
    try {
      const locker = await this.lockerService.toggleLockerStatus(req.params.id);
      res.json(locker);
    } catch (error) {
      res.status(500).json({ error: 'Failed to toggle locker status' });
    }
  }
}