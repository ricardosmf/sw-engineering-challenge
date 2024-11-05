import { Router } from "express";
import { BloqController } from "../controllers/bloq.controller";

export const bloqRouter = (bloqController: BloqController): Router => {
    const router = Router();

    router.post('/', (req, res) =>
        bloqController.createBloq(req, res)
    );

    router.get('/', (req, res, next) =>
        bloqController.getAllBloqs(req, res)
    );

    router.get('/:id', (req, res) =>
        bloqController.getBloq(req, res)
    );

    router.patch('/:id', (req, res) =>
        bloqController.updateBloq(req, res)
    );

    router.delete('/:id', (req, res) =>
        bloqController.deleteBloq(req, res)
    );

    return router;
};