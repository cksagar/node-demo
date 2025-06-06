import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';

import userRoutes from './routes/userRoutes';
import urlRoutes from './routes/urlRoutes';
import homeRoutes from './routes/homeRoutes';
import loginRequired from './middlewares/loginrequired';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//for SSR
app.set('view engine', 'ejs');
app.set('views', path.resolve('./src/views'));

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/user', userRoutes);
app.use('/url', loginRequired, urlRoutes);
app.use('/', homeRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
