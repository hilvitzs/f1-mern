import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import predictionRoutes from './routes/predictions.js';
import raceRoutes from './routes/races.js';
import leaderboardRoutes from './routes/leaderboard.js';
import driverRoutes from './routes/drivers.js';
import { requireAuth } from './middleware/requireAuth.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/predictions', predictionRoutes);

app.use('/api/leaderboard', leaderboardRoutes);

app.use('/api/races', raceRoutes);

app.use('/api/drivers', driverRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/protected-test', requireAuth, (req, res) => {
  res.json({ message: 'You are authenticated', userId: req.userId });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));