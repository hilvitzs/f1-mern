import express from 'express';
import Prediction from '../models/Prediction.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const predictions = (await Prediction.find({ userId: req.userId }).sort({ season: -1, round: -1 }));
    res.json(predictions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { season, round, predictedPodium } = req.body;

    const prediction = await Prediction.create({
      userId: req.userId,
      season,
      round,
      predictedPodium,
    });

    res.status(201).json(prediction);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'You already submitted a prediction for this race' });
    }
    res.status(500).json({ error: err.message });
  }
});

export default router;