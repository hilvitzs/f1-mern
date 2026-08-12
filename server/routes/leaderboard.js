import express from 'express';
import Prediction from '../models/Prediction.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const leaderboard = await Prediction.aggregate([
      { $match: { points: { $ne: null } } },
      { $group: { _id: '$userId', totalPoints: { $sum: '$points' }, predictionsScored: { $sum: 1 } } },
      { $sort: { totalPoints: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          email: '$user.email',
          totalPoints: 1,
          predictionsScored: 1,
        },
      },
    ]);

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;