const mongoose = require('mongoose');
const AstrologerApplicationSchema = new mongoose.Schema({
  applicationId: { type: String, unique: true },
  realName: { type: String, required: true },
  displayName: String,
  gender: String,
  dob: String,
  tob: String,
  pob: String,
  cellNumber1: { type: String, required: true },
  cellNumber2: String,
  whatsAppNumber: String,
  email: String,
  address: String,
  aadharNumber: String,
  panNumber: String,
  astrologyExperience: String,
  profession: String,
  bankDetails: String,
  upiName: String,
  upiNumber: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  appliedAt: { type: Date, default: Date.now },
  processedAt: Date,
  processedBy: String,
  notes: String
});
module.exports = mongoose.model('AstrologerApplication', AstrologerApplicationSchema);
