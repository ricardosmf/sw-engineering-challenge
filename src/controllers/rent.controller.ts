import { Request, Response } from 'express';
import { IRentService } from '../services/interfaces/rent.service.interface';

export class RentController {
  constructor(private rentService: IRentService) {}

  async createRent(req: Request, res: Response): Promise<void> {
    try {
      const rent = await this.rentService.createRent(req.body);
      res.status(201).json(rent);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create rent' });
    }
  }

  async getRent(req: Request, res: Response): Promise<void> {
    try {
      const rent = await this.rentService.getRentById(req.params.id);
      if (!rent) {
        res.status(404).json({ error: 'Rent not found' });
        return;
      }
      res.json(rent);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get rent' });
    }
  }

  async getAllRents(req: Request, res: Response): Promise<void> {
    try {
      const rents = await this.rentService.getAllRents();
      if (!rents) {
        res.status(404).json({ error: 'Rents not found' });
        return;
      }
      res.json(rents);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get all rents' });
    }
  }

  async updateRentStatus(req: Request, res: Response): Promise<void> {
    try {
      const rent = await this.rentService.updateRentStatus(
        req.params.id,
        req.body.status
      );
      res.json(rent);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update rent status' });
    }
  }

  async getActiveRents(req: Request, res: Response): Promise<void> {
    try {
      const rents = await this.rentService.getActiveRents();
      if (!rents) {
        res.status(404).json({ error: 'Rents not found' });
        return;
      }
      res.json(rents);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get active rents' });
    }
  }

  async getRentsByLocker(req: Request, res: Response): Promise<void> {
    try {
      const rents = await this.rentService.getRentsByLockerId(req.params.lockerId);
      if (!rents) {
        res.status(404).json({ error: 'Rents not found' });
        return;
      }
      res.json(rents);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get rents by locker' });
    }
  }
}
