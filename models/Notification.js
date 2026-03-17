const mongoose = require('mongoose');
const NotificationSchema = new mongoose.Schema({
  userId: String,
  type: { type: String, default: 'system' },
  title: String,
  message: String,
  details: Object,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Notification', NotificationSchema);
