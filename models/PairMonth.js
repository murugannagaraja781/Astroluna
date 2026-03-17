const mongoose = require('mongoose');
const PairMonthSchema = new mongoose.Schema({
  pairId: { type: String, required: true, index: true },
  clientId: String,
  astrologerId: String,
  yearMonth: { type: String, required: true },
  currentSlab: { type: Number, default: 0 },
  slabLockedAt: { type: Number, default: 0 },
  resetAt: Date
});
PairMonthSchema.index({ pairId: 1, yearMonth: 1 }, { unique: true });
module.exports = mongoose.model('PairMonth', PairMonthSchema);
