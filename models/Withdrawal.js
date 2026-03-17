const mongoose = require('mongoose');
const WithdrawalSchema = new mongoose.Schema({
  withdrawalId: { type: String, unique: true, sparse: true },
  astroId: String,
  amount: Number,
  type: { type: String, enum: ['payout', 'referral', 'earnings'], default: 'payout' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  requestedAt: { type: Date, default: Date.now },
  processedAt: Date
});
module.exports = mongoose.model('Withdrawal', WithdrawalSchema);
