import request from 'supertest';
import app from '../../src/app';
import mongoose from 'mongoose';
import { Bloq } from '../../src/models/bloq.model';
import { Locker } from '../../src/models/locker.model';
import { Rent } from '../../src/models/rent.model';
import { RentStatus, LockerStatus } from '../../src/types/enums';
import { seedDatabase } from '../../src/scripts/seed';

describe('Bloq-it API Integration Tests', () => {
  const EXISTING_BLOQ_ID = 'c3ee858c-f3d8-45a3-803d-e080649bbb6f';
  const EXISTING_LOCKER_ID = '1b8d1e89-2514-4d91-b813-044bf0ce8d20';
  const EXISTING_RENT_ID = '40efc6fd-f10c-4561-88bf-be916613377c';

  beforeAll(async () => {
    await seedDatabase(); 
    await mongoose.disconnect();
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bloqit');
  });

  afterAll(async () => {
    await Bloq.deleteMany({});
    await Locker.deleteMany({});
    await Rent.deleteMany({});
    await mongoose.connection.close();
  });

  describe('Bloq Endpoints', () => {
    it('should get Luitton Vouis store details', async () => {
      const response = await request(app)
        .get(`/api/bloqs/${EXISTING_BLOQ_ID}`)
        .expect(200);

      expect(response.body).toMatchObject({
        _id: EXISTING_BLOQ_ID,
        title: 'Luitton Vouis Champs Elysées',
        address: '101 Av. des Champs-Élysées, 75008 Paris, France'
      });
    });

    it('should list all bloqs', async () => {
      const response = await request(app)
        .get('/api/bloqs')
        .expect(200);

      expect(response.body).toHaveLength(3);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: 'Riod Eixample',
            address: 'Pg. de Gràcia, 74, L\'Eixample, 08008 Barcelona, Spain'
          })
        ])
      );
    });
  });

  describe('Locker Endpoints', () => {
    it('should get occupied locker details', async () => {
      const response = await request(app)
        .get(`/api/lockers/${EXISTING_LOCKER_ID}`)
        .expect(200);

      expect(response.body).toMatchObject({
        _id: EXISTING_LOCKER_ID,
        bloqId: EXISTING_BLOQ_ID,
        status: LockerStatus.CLOSED,
        isOccupied: true
      });
    });

    it('should get available lockers for Bluberry store', async () => {
      const BLUBERRY_ID = '22ffa3c5-3a3d-4f71-81f1-cac18ffbc510';
      const response = await request(app)
        .get(`/api/lockers/bloq/${BLUBERRY_ID}/available`)
        .expect(200);

      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            bloqId: BLUBERRY_ID,
            isOccupied: false
          })
        ])
      );
    });

    it('should toggle locker status', async () => {
      const locker = await request(app)
        .get(`/api/lockers/${EXISTING_LOCKER_ID}`)
        .expect(200);
      const response = await request(app)
        .patch(`/api/lockers/${EXISTING_LOCKER_ID}/toggle`)
        .expect(200);

      expect(response.body.status).toBe(
        locker.body.status === LockerStatus.OPEN ? LockerStatus.CLOSED : LockerStatus.OPEN
      );
    });
  });

  describe('Rent Endpoints', () => {
    it('should get active rent details', async () => {
      const response = await request(app)
        .get(`/api/rents/${EXISTING_RENT_ID}`)
        .expect(200);

      expect(response.body).toMatchObject({
        _id: EXISTING_RENT_ID,
        lockerId: EXISTING_LOCKER_ID,
        weight: 7,
        size: 'L',
        status: RentStatus.WAITING_PICKUP
      });
    });

    it('should list all active rents', async () => {
      const response = await request(app)
        .get('/api/rents/active')
        .expect(200);

      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            status: expect.stringMatching(/CREATED|WAITING_DROPOFF|WAITING_PICKUP/)
          })
        ])
      );
    });

    it('should create new rent', async () => {
      const AVAILABLE_LOCKER_ID = '8b4b59ae-8de5-4322-a426-79c29315a9f1';
      const newRent = {
        lockerId: AVAILABLE_LOCKER_ID,
        weight: 5,
        size: 'M',
        status: RentStatus.CREATED
      };

      const response = await request(app)
        .post('/api/rents')
        .send(newRent)
        .expect(201);

      expect(response.body).toMatchObject({
        lockerId: AVAILABLE_LOCKER_ID,
        weight: 5,
        size: 'M',
        status: RentStatus.CREATED
      });

      // Verify locker is now occupied
      const lockerResponse = await request(app)
        .get(`/api/lockers/${AVAILABLE_LOCKER_ID}`)
        .expect(200);

      expect(lockerResponse.body.isOccupied).toBe(true);
    });
  });

  describe('Complex Scenarios', () => {
    it('should verify rent delivery updates locker status', async () => {
      // Update rent to delivered
      const updateResponse = await request(app)
        .patch(`/api/rents/${EXISTING_RENT_ID}/status`)
        .send({ status: RentStatus.DELIVERED })
        .expect(200);

      expect(updateResponse.body.status).toBe(RentStatus.DELIVERED);

      // Verify locker is now available
      const lockerResponse = await request(app)
        .get(`/api/lockers/${EXISTING_LOCKER_ID}`)
        .expect(200);

      expect(lockerResponse.body.isOccupied).toBe(false);
    });
  });
});