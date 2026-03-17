const mongoose = require('mongoose');
const ReviewSchema = new mongoose.Schema({
  sessionId: { type: String, unique: true },
  clientId: String,
  clientName: String,
  astrologerId: String,
  astrologerName: String,
  rating: { type: Number, min: 1, max: 5 },
  review: String
}, { timestamps: true });
module.exports = mongoose.model('Review', ReviewSchema);
