import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

import userRoutes from './routes/userRoutes';
import urlRoutes from './routes/urlRoutes';
import homeRoutes from './routes/homeRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//for SSR
app.set('view engine', 'ejs');
app.set('views', path.resolve('./src/views'));

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/users', userRoutes);
app.use('/url', urlRoutes);
app.use('/', homeRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
