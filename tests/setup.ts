import mongoose from 'mongoose';

// Mock Mongoose connection
beforeAll(async () => {
  const url = 'mongodb://127.0.0.1:27017/test';
  await mongoose.connect(url);
});

afterAll(async () => {
  await mongoose.connection.close();
});