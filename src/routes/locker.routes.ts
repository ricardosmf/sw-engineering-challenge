import { Router } from "express";
import { LockerController } from "../controllers/locker.controller";

export const lockerRouter = (lockerController: LockerController): Router => {
    const router = Router();
  
    router.post('/', (req, res, next) => 
      lockerController.createLocker(req, res, next)
    );
    
    router.get('/', (req, res, next) => 
      lockerController.getAllLockers(req, res, next)
    );
    
    router.get('/bloq/:bloqId', (req, res, next) => 
      lockerController.findLockersByBloq(req, res, next)
    );
    
    router.get('/bloq/:bloqId/available', (req, res, next) => 
      lockerController.findAvailableLockers(req, res, next)
    )
    
    router.get('/:id', (req, res, next) => 
      lockerController.getLocker(req, res, next)
    );
    
    router.patch('/:id', (req, res, next) => 
      lockerController.updateLocker(req, res, next)
    );
    
    router.patch('/:id/toggle', (req, res, next) => 
      lockerController.toggleLockerStatus(req, res, next)
    );
    
    router.delete('/:id', (req, res, next) => 
      lockerController.deleteLocker(req, res, next)
    );
  
    return router;
  };