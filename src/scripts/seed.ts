import mongoose from 'mongoose';
import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { Bloq } from '../models/bloq.model';
import { Locker } from '../models/locker.model';
import { Rent } from '../models/rent.model';

config();

interface IBloq {
  id: string;
  title: string;
  address: string;
}

interface ILocker {
  id: string;
  bloqId: string;
  status: string;
  isOccupied: boolean;
}

interface IRent {
  id: string;
  lockerId: string | null;
  weight: number;
  size: string;
  status: string;
}

async function seedDatabase() {
  try {
    const bloqs: IBloq[] = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../../data/bloqs.json'), 'utf-8')
    );
    const lockers: ILocker[] = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../../data/lockers.json'), 'utf-8')
    );
    const rents: IRent[] = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../../data/rents.json'), 'utf-8')
    );

    const uri = process.env.MONGO_URI;

    await mongoose.connect(uri || 'mongodb://localhost:27017/bloqit');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Bloq.deleteMany({}),
      Locker.deleteMany({}),
      Rent.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Insert in correct order
    await Bloq.insertMany(
      bloqs.map(bloq => ({
        _id: bloq.id,
        title: bloq.title,
        address: bloq.address
      }))
    );
    console.log(`Inserted ${bloqs.length} bloqs`);

    await Locker.insertMany(
      lockers.map(locker => ({
        _id: locker.id,
        bloqId: locker.bloqId,
        status: locker.status,
        isOccupied: locker.isOccupied
      }))
    );
    console.log(`Inserted ${lockers.length} lockers`);

    await Rent.insertMany(
      rents.map(rent => ({
        _id: rent.id,
        lockerId: rent.lockerId,
        weight: rent.weight,
        size: rent.size,
        status: rent.status
      }))
    );
    console.log(`Inserted ${rents.length} rents`);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };