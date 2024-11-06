import app from './app';
import connectDB from './config/db';
import dotenv from 'dotenv';
import { PORT_APP } from './config/config';

dotenv.config();

const PORT = PORT_APP || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
});
