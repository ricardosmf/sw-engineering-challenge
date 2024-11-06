import mongoose from 'mongoose';

// Mock Mongoose connection
beforeAll(async () => {
  const url = 'mongodb://localhost:27017/bloqit';
  await mongoose.connect(url);
});

afterAll(async () => {
  await mongoose.connection.close();
});