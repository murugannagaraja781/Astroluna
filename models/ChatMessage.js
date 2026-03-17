const mongoose = require('mongoose');
const ChatMessageSchema = new mongoose.Schema({
  messageId: { type: String, unique: true },
  sessionId: String,
  fromUserId: String,
  toUserId: String,
  text: String,
  type: { type: String, default: 'text' },
  timestamp: { type: Number, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
