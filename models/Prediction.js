import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  season: {
    type: Number,
    required: true,
  },
  round: {
    type: Number,
    required: true,
  },
  predictedPodium: {
    type: [String],
    required: true,
    validate: {
      validator: (arr) => arr.length === 3,
      message: 'Predicted podium must contain exactly 3 drivers',
    },
  },
  actualPodium: {
    type: [String],
    default: null,
  },
  points: {
    type: Number,
    default: null,
  },
}, { timestamps: true });

predictionSchema.index({ userId: 1, season: 1, round: 1 }, { unique: true });

const Prediction = mongoose.model('Prediction', predictionSchema);

export default Prediction;