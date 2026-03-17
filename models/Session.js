const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  sessionId: { type: String, unique: true },
  clientId: String,
  astrologerId: String,
  clientConnectedAt: Number,
  astrologerConnectedAt: Number,
  actualBillingStart: Number,
  sessionEndAt: Number,
  status: { type: String, enum: ['active', 'ended'], default: 'active' },
  fromUserId: String,
  toUserId: String,
  type: String,
  duration: Number,
  totalEarned: Number,
  totalDeducted: Number
});

module.exports = mongoose.model('Session', SessionSchema);
