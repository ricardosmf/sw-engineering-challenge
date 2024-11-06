import { Router } from "express";
import { RentController } from "../controllers/rent.controller";

export const rentRouter = (rentController: RentController): Router => {
    const router = Router();

    router.post('/', (req, res, next) =>
        rentController.createRent(req, res, next)
    );

    router.get('/', (req, res, next) =>
        rentController.getAllRents(req, res, next)
    );

    router.get('/active', (req, res, next) =>
        rentController.getActiveRents(req, res, next)
    );

    router.get('/locker/:lockerId', (req, res, next) =>
        rentController.getRentByLockerId(req, res, next)
    );

    router.get('/:id', (req, res, next) =>
        rentController.getRentById(req, res, next)
    );

    router.patch('/:id/status', (req, res, next) =>
        rentController.updateRentStatus(req, res, next)
    );

    return router;
};