import { Router } from "express";
import { RentController } from "../controllers/rent.controller";

export const rentRouter = (rentController: RentController): Router => {
    const router = Router();

    router.post('/', (req, res) =>
        rentController.createRent(req, res)
    );

    router.get('/', (req, res) =>
        rentController.getAllRents(req, res)
    );

    router.get('/active', (req, res) =>
        rentController.getActiveRents(req, res)
    );

    router.get('/locker/:lockerId', (req, res) =>
        rentController.getRentsByLocker(req, res)
    );

    router.get('/:id', (req, res) =>
        rentController.getRent(req, res)
    );

    router.patch('/:id/status', (req, res) =>
        rentController.updateRentStatus(req, res)
    );

    return router;
};