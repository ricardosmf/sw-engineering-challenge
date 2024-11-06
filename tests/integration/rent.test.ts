// tests/integration/rent.test.ts

import request from 'supertest';
import app from '../../src/app';
import mongoose from 'mongoose';
import { Rent } from '../../src/models/rent.model';
import { Locker } from '../../src/models/locker.model';
import { RentStatus, RentSize, LockerStatus } from '../../src/types/enums';

describe('Rent API Integration Tests', () => {
  let testLockerId: string;

  beforeAll(async () => {
    // Create a test locker to use in rent tests
    const locker = await Locker.create({
      bloqId: new mongoose.Types.ObjectId(),
      status: LockerStatus.OPEN,
      isOccupied: false
    });
    testLockerId = locker._id.toString();
  });

  afterAll(async () => {
    await Locker.deleteMany({});
    await Rent.deleteMany({});
  });

  beforeEach(async () => {
    await Rent.deleteMany({});
  });

  describe('POST /api/rents', () => {
    it('should create a new rent', async () => {
      const rentData = {
        lockerId: testLockerId,
        weight: 5,
        size: RentSize.M,
        status: RentStatus.CREATED
      };

      const response = await request(app)
        .post('/api/rents')
        .send(rentData)
        .expect(201);

      expect(response.body).toMatchObject({
        lockerId: testLockerId,
        weight: 5,
        size: RentSize.M,
        status: RentStatus.CREATED
      });
    });

    it('should return 500 when creating rent with invalid data', async () => {
      const invalidRentData = {
        lockerId: 'invalid-id',
        weight: -1,
        size: 'INVALID_SIZE',
        status: 'INVALID_STATUS'
      };

      await request(app)
        .post('/api/rents')
        .send(invalidRentData)
        .expect(500);
    });
  });

  describe('GET /api/rents', () => {
    it('should return all rents', async () => {
      // Create test rents
      const testRents = [
        {
          lockerId: testLockerId,
          weight: 5,
          size: RentSize.M,
          status: RentStatus.CREATED
        },
        {
          lockerId: testLockerId,
          weight: 10,
          size: RentSize.L,
          status: RentStatus.WAITING_PICKUP
        }
      ];
      await Rent.create(testRents);

      const response = await request(app)
        .get('/api/rents')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toMatchObject(testRents[0]);
      expect(response.body[1]).toMatchObject(testRents[1]);
    });
  });

  describe('GET /api/rents/active', () => {
    it('should return only active rents', async () => {
      // Create test rents with different statuses
      const testRents = [
        {
          lockerId: testLockerId,
          weight: 5,
          size: RentSize.M,
          status: RentStatus.WAITING_PICKUP
        },
        {
          lockerId: testLockerId,
          weight: 10,
          size: RentSize.L,
          status: RentStatus.DELIVERED
        }
      ];
      await Rent.create(testRents);

      const response = await request(app)
        .get('/api/rents/active')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].status).toBe(RentStatus.WAITING_PICKUP);
    });
  });

  describe('PATCH /api/rents/:id/status', () => {
    it('should update rent status', async () => {
      // Create a test rent
      const rent = await Rent.create({
        lockerId: testLockerId,
        weight: 5,
        size: RentSize.M,
        status: RentStatus.CREATED
      });

      const response = await request(app)
        .patch(`/api/rents/${rent._id}/status`)
        .send({ status: RentStatus.WAITING_PICKUP })
        .expect(200);

      expect(response.body.status).toBe(RentStatus.WAITING_PICKUP);
    });

    it('should return 404 for non-existent rent', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .patch(`/api/rents/${fakeId}/status`)
        .send({ status: RentStatus.WAITING_PICKUP })
        .expect(404);
    });
  });

  describe('GET /api/rents/locker/:lockerId', () => {
    it('should return rents for specific locker', async () => {
      // Create test rent for the locker
      const rent = await Rent.create({
        lockerId: testLockerId,
        weight: 5,
        size: RentSize.M,
        status: RentStatus.CREATED
      });

      const response = await request(app)
        .get(`/api/rents/locker/${testLockerId}`)
        .expect(200);

      expect(response.body).toMatchObject({
        lockerId: testLockerId,
        weight: 5,
        size: RentSize.M,
        status: RentStatus.CREATED
      });
    });

    it('should return 404 for non-existent locker', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .get(`/api/rents/locker/${fakeId}`)
        .expect(404);
    });
  });
});