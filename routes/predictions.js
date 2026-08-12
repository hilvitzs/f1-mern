import express from 'express';
import Prediction from '../models/Prediction.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { scorePrediction } from '../utils/scorePrediction.js';

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

router.post('/score/:season/:round', requireAuth, async (req, res) => {
  try {
    const season = Number(req.params.season);
    const round = Number(req.params.round);

    const response = await fetch(`https://api.jolpi.ca/ergast/f1/${season}/${round}/results.json`);
    if (!response.ok) {
      return res.status(502).json({ error: 'Failed to fetch results from upstream API' });
    }

    const data = await response.json();
    const races = data.MRData.RaceTable.Races;

    if (!races || races.length === 0) {
      return res.status(404).json({ error: 'No results available yet for this race' });
    }

    const actualPodium = races[0].Results.slice(0, 3).map((r) => r.Driver.driverId);

    const predictions = await Prediction.find({ season, round, points: null });

    for (const prediction of predictions) {
      const points = scorePrediction(prediction.predictedPodium, actualPodium);
      prediction.actualPodium = actualPodium;
      prediction.points = points;
      await prediction.save();
    }

    res.json({ actualPodium, scoredCount: predictions.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;