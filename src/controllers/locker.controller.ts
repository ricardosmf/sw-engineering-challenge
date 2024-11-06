import { NextFunction, Request, Response } from 'express';
import { ILockerService } from "../services/interfaces/locker.service.interface";

export class LockerController {
  constructor(private lockerService: ILockerService) { }

  async createLocker(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const locker = await this.lockerService.createLocker(req.body);
      res.status(201).json(locker);
    } catch (error) {
      next(error);
    }
  }

  async getLocker(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const locker = await this.lockerService.getLockerById(req.params.id);
      res.json(locker);
    } catch (error) {
      next(error);
    }
  }

  async getAllLockers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lockers = await this.lockerService.getAllLockers();
      res.json(lockers);
    } catch (error) {
      next(error);
    }
  }

  async updateLocker(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const locker = await this.lockerService.updateLocker(req.params.id, req.body);
      res.json(locker);
    } catch (error) {
      next(error);
    }
  }

  async deleteLocker(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.lockerService.deleteLocker(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async findLockersByBloq(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lockers = await this.lockerService.findLockersByBloqId(req.params.bloqId);
      res.json(lockers);
    } catch (error) {
      next(error);
    }
  }

  async findAvailableLockers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lockers = await this.lockerService.findAvailableLockers(req.params.bloqId);
      res.json(lockers);
    } catch (error) {
      next(error);
    }
  }

  async toggleLockerStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const locker = await this.lockerService.toggleLockerStatus(req.params.id);
      res.json(locker);
    } catch (error) {
      next(error);
    }
  }
}