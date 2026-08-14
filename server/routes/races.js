import express from 'express';
import ApiCache from '../models/ApiCache.js';

const router = express.Router();
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

router.get('/:season', async (req, res) => {
  try {
    const season = Number(req.params.season);

    const cached = await ApiCache.findOne({ key: String(season) });
    const isFresh = cached && (Date.now() - cached.updatedAt.getTime() < CACHE_TTL_MS);

    if (isFresh) {
      res.set('X-Cache', 'HIT');
      return res.json(cached.data);
    }

    const response = await fetch(`https://api.jolpi.ca/ergast/f1/${season}/races.json`);

    if (!response.ok) {
      return res.status(502).json({ error: 'Failed to fetch race data from upstream API'});
    }

    const data = await response.json();

    if (!data || !data.MRData) {
      return res.status(502).json({ error: 'Received malformed data from upstream API' });
    }

    await ApiCache.findOneAndUpdate(
      { key: String(season) },
      { data },
      { upsert: true, returnDocument: 'after' }
    );

    res.set('X-Cache', 'MISS');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;