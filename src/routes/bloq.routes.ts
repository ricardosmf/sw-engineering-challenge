import { Router } from "express";
import { BloqController } from "../controllers/bloq.controller";

export const bloqRouter = (bloqController: BloqController): Router => {
    const router = Router();

    router.post('/', (req, res, next) =>
        bloqController.createBloq(req, res, next)
    );

    router.get('/', (req, res, next) =>
        bloqController.getAllBloqs(req, res, next)
    );

    router.get('/:id', (req, res, next) =>
        bloqController.getBloq(req, res, next)
    );

    router.patch('/:id', (req, res, next) =>
        bloqController.updateBloq(req, res, next)
    );

    router.delete('/:id', (req, res, next) =>
        bloqController.deleteBloq(req, res, next)
    );

    return router;
};