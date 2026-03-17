const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  phone: { type: String, unique: true },
  name: String,
  role: { type: String, enum: ['client', 'astrologer', 'superadmin'], default: 'client' },
  isOnline: { type: Boolean, default: false },
  isChatOnline: { type: Boolean, default: false },
  isAudioOnline: { type: Boolean, default: false },
  isVideoOnline: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
  skills: [String],
  price: { type: Number, default: 20 },
  walletBalance: { type: Number, default: 108 },
  totalEarnings: { type: Number, default: 0 },
  experience: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  isDocumentVerified: { type: Boolean, default: false },
  documentStatus: { type: String, enum: ['none', 'processing', 'verified'], default: 'none' },
  image: { type: String, default: '' },
  birthDetails: {
    dob: String,
    tob: String,
    pob: String,
    lat: Number,
    lon: Number
  },
  intakeDetails: {
    gender: String,
    marital: String,
    occupation: String,
    topic: String,
    partner: {
      name: String,
      dob: String,
      tob: String,
      pob: String
    }
  },
  isAvailable: { type: Boolean, default: false },
  isBusy: { type: Boolean, default: false },
  availabilityExpiresAt: Date,
  fcmToken: String,
  lastSeen: { type: Date, default: Date.now },
  referredBy: { type: String, default: null },
  referralCode: { type: String, unique: true, sparse: true },
  hasRecharged: { type: Boolean, default: false },
  referralEarnings: { type: Number, default: 0 },
  referralWithdrawn: { type: Number, default: 0 },
  astrologerRequestStatus: { type: String, enum: ['none', 'pending', 'approved', 'rejected'], default: 'none' },
  astrologerRequestedAt: Date,
  astrologerExperience: String,
  astrologerAbout: String,
  astrologerSkills: [String],
  bankDetails: {
    accountHolder: String,
    accountNumber: String,
    bankName: String,
    ifscCode: String,
    upiId: String
  }
});

module.exports = mongoose.model('User', UserSchema);
