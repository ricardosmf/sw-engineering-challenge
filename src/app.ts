import express, { Application } from 'express';
import { bloqRouter } from './routes/bloq.routes';
import { BloqController } from './controllers/bloq.controller';
import { LockerController } from './controllers/locker.controller';
import { RentController } from './controllers/rent.controller';
import { lockerRouter } from './routes/locker.routes';
import { rentRouter } from './routes/rent.routes';
import { LockerService } from './services/locker.service';
import { LockerRepository } from './repositories/locker.repository';
import { RentRepository } from './repositories/rent.repository';
import { RentService } from './services/rent.service';
import { BloqRepository } from './repositories/bloq.repository';
import { BloqService } from './services/bloq.service';
import { errorHandler } from './middleware/error.middleware';

const app: Application = express();

app.use(express.json());

// Initialize repositories and services
const lockerRepository = new LockerRepository();
const lockerService = new LockerService(lockerRepository);
const rentRepository = new RentRepository();
const rentService = new RentService(rentRepository, lockerRepository);
const bloqRepository = new BloqRepository();
const bloqService = new BloqService(bloqRepository);

// Inject services into controllers
const bloqController = new BloqController(bloqService);
const lockerController = new LockerController(lockerService);
const rentController = new RentController(rentService);

app.use(express.json());

app.use('/api/bloqs', bloqRouter(bloqController));
app.use('/api/lockers', lockerRouter(lockerController));
app.use('/api/rents', rentRouter(rentController));

app.use(errorHandler);

export default app;