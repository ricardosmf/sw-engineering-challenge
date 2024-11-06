import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';
import { Bloq } from '../../src/models/bloq.model';
import { Locker } from '../../src/models/locker.model';
import { Rent } from '../../src/models/rent.model';
import { LockerStatus, RentSize, RentStatus } from '../../src/types/enums';

describe('Bloqit API Integration Tests', () => {
  const sampleBloq = {
    title: "Luitton Vouis Champs Elysées",
    address: "101 Av. des Champs-Élysées, 75008 Paris, France"
  };

  beforeEach(async () => {
    await Bloq.deleteMany({});
    await Locker.deleteMany({});
    await Rent.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Bloq Endpoints', () => {
    it('should create a bloq and its lockers', async () => {
      const bloqResponse = await request(app)
        .post('/api/bloqs')
        .send(sampleBloq)
        .expect(201);

      expect(bloqResponse.body).toMatchObject(sampleBloq);

      // Create lockers for the bloq
      const lockerData = {
        bloqId: bloqResponse.body._id,
        status: LockerStatus.OPEN,
        isOccupied: false
      };

      const lockerResponse = await request(app)
        .post('/api/lockers')
        .send(lockerData)
        .expect(201);

      expect(lockerResponse.body.bloqId).toBe(bloqResponse.body._id);
    });

    it('should get all bloqs with their lockers', async () => {
      const bloq = await Bloq.create(sampleBloq);
      await Locker.create([
        { bloqId: bloq._id, status: LockerStatus.OPEN, isOccupied: false },
        { bloqId: bloq._id, status: LockerStatus.CLOSED, isOccupied: true }
      ]);

      const response = await request(app)
        .get('/api/bloqs')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe(sampleBloq.title);
    });
  });

  describe('Locker Endpoints', () => {
    let bloqId: string;

    beforeEach(async () => {
      const bloq = await Bloq.create(sampleBloq);
      bloqId = bloq._id.toString();
    });

    it('should create and get available lockers', async () => {
      const lockerData = {
        bloqId,
        status: LockerStatus.OPEN,
        isOccupied: false
      };

      await Locker.create([
        { ...lockerData },
        { ...lockerData, status: LockerStatus.CLOSED }
      ]);

      const response = await request(app)
        .get(`/api/lockers/bloq/${bloqId}/available`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].status).toBe(LockerStatus.OPEN);
      expect(response.body[0].isOccupied).toBe(false);
    });

    it('should toggle locker status', async () => {
      const locker = await Locker.create({
        bloqId,
        status: LockerStatus.OPEN,
        isOccupied: false
      });

      const response = await request(app)
        .patch(`/api/lockers/${locker._id}/toggle`)
        .expect(200);

      expect(response.body.status).toBe(LockerStatus.CLOSED);
    });
  });

  describe('Rent Endpoints', () => {
    let lockerId: string;

    beforeEach(async () => {
      const bloq = await Bloq.create(sampleBloq);
      const locker = await Locker.create({
        bloqId: bloq._id,
        status: LockerStatus.OPEN,
        isOccupied: false
      });
      lockerId = locker._id.toString();
    });

    it('should create a rent and update locker status', async () => {
      const rentData = {
        lockerId,
        weight: 5,
        size: RentSize.M,
        status: RentStatus.CREATED
      };

      const response = await request(app)
        .post('/api/rents')
        .send(rentData)
        .expect(201);

      expect(response.body).toMatchObject(rentData);

      // Verify locker is now occupied
      const locker = await Locker.findById(lockerId);
      expect(locker?.isOccupied).toBe(true);
    });

    it('should get active rents', async () => {
      await Rent.create([
        {
          lockerId,
          weight: 5,
          size: RentSize.M,
          status: RentStatus.WAITING_PICKUP
        },
        {
          lockerId,
          weight: 3,
          size: RentSize.S,
          status: RentStatus.DELIVERED
        }
      ]);

      const response = await request(app)
        .get('/api/rents/active')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].status).toBe(RentStatus.WAITING_PICKUP);
    });

    it('should update rent status and handle locker occupation', async () => {
      const rent = await Rent.create({
        lockerId,
        weight: 5,
        size: RentSize.M,
        status: RentStatus.WAITING_PICKUP
      });

      const response = await request(app)
        .patch(`/api/rents/${rent._id}/status`)
        .send({ status: RentStatus.DELIVERED })
        .expect(200);

      expect(response.body.status).toBe(RentStatus.DELIVERED);

      // Verify locker is now available
      const locker = await Locker.findById(lockerId);
      expect(locker?.isOccupied).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid bloq ID', async () => {
      await request(app)
        .get('/api/bloqs/invalid-id')
        .expect(500);
    });

    it('should handle invalid locker ID', async () => {
      await request(app)
        .get('/api/lockers/invalid-id')
        .expect(500);
    });

    it('should handle invalid rent creation', async () => {
      await request(app)
        .post('/api/rents')
        .send({
          lockerId: 'invalid-id',
          weight: -1,
          size: 'INVALID',
          status: 'INVALID'
        })
        .expect(500);
    });
  });
});