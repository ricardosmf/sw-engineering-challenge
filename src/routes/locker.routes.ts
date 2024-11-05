import { Router } from "express";
import { LockerController } from "../controllers/locker.controller";

export const lockerRouter = (lockerController: LockerController): Router => {
    const router = Router();
  
    router.post('/', (req, res) => 
      lockerController.createLocker(req, res)
    );
    
    router.get('/', (req, res) => 
      lockerController.getAllLockers(req, res)
    );
    
    router.get('/bloq/:bloqId', (req, res) => 
      lockerController.findLockersByBloq(req, res)
    );
    
    router.get('/bloq/:bloqId/available', (req, res) => 
      lockerController.findAvailableLockers(req, res)
    )
    
    router.get('/:id', (req, res) => 
      lockerController.getLocker(req, res)
    );
    
    router.patch('/:id', (req, res) => 
      lockerController.updateLocker(req, res)
    );
    
    router.post('/:id/toggle', (req, res) => 
      lockerController.toggleLockerStatus(req, res)
    );
    
    router.delete('/:id', (req, res) => 
      lockerController.deleteLocker(req, res)
    );
  
    return router;
  };