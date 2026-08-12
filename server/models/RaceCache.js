import mongoose from 'mongoose';

const raceCacheScehma = new mongoose.Schema({
  season: {
    type: Number,
    required: true,
    unique: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
}, { timestamps: true });

const RaceCache = mongoose.model('RaceCache', raceCacheScehma);

export default RaceCache;