const mongoose = require('mongoose');
const PaymentSchema = new mongoose.Schema({
  transactionId: { type: String, unique: true },
  merchantTransactionId: String,
  userId: String,
  amount: Number,
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  providerRefId: String,
  isApp: { type: Boolean, default: false }
});
module.exports = mongoose.model('Payment', PaymentSchema);
