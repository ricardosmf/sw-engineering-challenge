import app from './app';
import connectDB from './database';
import dotenv from 'dotenv';
import { PORT_APP } from './core/config/config';

dotenv.config();

const PORT = PORT_APP || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
