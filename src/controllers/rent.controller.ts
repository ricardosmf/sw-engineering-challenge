import { Request, Response, NextFunction } from 'express';
import { RentService } from '../services/rent.service';
import { RentStatus } from '../types/enums';
import { RentNotFoundError, RentNotFoundForLockerError, RentValidationError } from '../errors/rent.errors';
import { IRent } from '../models/rent.model';

export class RentController {
  constructor(private rentService: RentService) {}

  async createRent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const locker = await this.rentService.createRent(req.body);
      res.status(201).json(locker);
    } catch (error) {
      next(error);
    }
  }

  async getAllRents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rents = await this.rentService.getAllRents();
      res.status(200).json(rents);
    } catch (error) {
      next(error);
    }
  };

  async getRentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const rent = await this.rentService.getRentById(id);
      res.status(200).json(rent);
    } catch (error) {
      next(error);
    }
  };

  async updateRent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const rentData = req.body;
      const updatedRent = await this.rentService.updateRent(id, rentData);
      res.status(200).json(updatedRent);
    } catch (error) {
      next(error);
    }
  };

  async deleteRent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.rentService.deleteRent(id);
      if (deleted) {
        res.status(204).send();
      } else {
        throw new RentNotFoundError(id);
      }
    } catch (error) {
      next(error);
    }
  };

  async updateRentStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!Object.values(RentStatus).includes(status)) {
        throw new RentValidationError('Invalid rent status');
      }

      const updatedRent = await this.rentService.updateRentStatus(id, status);
      res.status(200).json(updatedRent);
    } catch (error) {
      next(error);
    }
  };

  async getActiveRents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const activeRents = await this.rentService.getActiveRents();
      res.status(200).json(activeRents);
    } catch (error) {
      next(error);
    }
  };

  async getRentByLockerId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { lockerId } = req.params;
      const rent = await this.rentService.getRentByLockerId(lockerId);
      
      if (!rent) {
        throw new RentNotFoundForLockerError(lockerId);
      }
      
      res.status(200).json(rent);
    } catch (error) {
      next(error);
    }
  };
}
