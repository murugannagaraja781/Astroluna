const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { User, Session, Withdrawal, BillingLedger } = require('../models');
const { logActivity } = require('../utils/logger');
const { generateReferralCode } = require('../utils/authHelpers');
const { userSockets } = require('../utils/socketRegistry');

// Get User Profile
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findOne({ userId });
    if (!user) {
      logActivity('auth', 'Profile Not Found', { userId });
      return res.status(404).json({ ok: false, error: 'User not found' });
    }

    if (!user.referralCode) {
      user.referralCode = await generateReferralCode(user.name || 'User');
      await user.save();
    }

    res.json({
      ok: true,
      userId: user.userId || '',
      name: user.name || 'User',
      phone: user.phone || '',
      role: user.role || 'client',
      walletBalance: Number(user.walletBalance || 0),
      referralCode: user.referralCode || '',
      isOnline: Boolean(user.isOnline),
      isAvailable: Boolean(user.isAvailable),
      isChatOnline: Boolean(user.isChatOnline),
      isAudioOnline: Boolean(user.isAudioOnline),
      isVideoOnline: Boolean(user.isVideoOnline),
      isBusy: Boolean(user.isBusy),
      totalEarnings: Number(user.totalEarnings || 0),
      image: user.image || ''
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Internal Error' });
  }
});

// User Session History (Client Side)
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const sessions = await Session.find({
      $or: [{ clientId: userId }, { fromUserId: userId }],
      status: 'ended'
    })
      .sort({ actualBillingStart: -1 })
      .limit(50)
      .lean();

    const populatedSessions = await Promise.all(sessions.map(async (s) => {
      const aId = s.astrologerId || s.toUserId;
      const astro = await User.findOne({ userId: aId }).select('name').lean();
      return { ...s, astrologerName: astro ? astro.name : 'Unknown Astrologer' };
    }));

    res.json({ ok: true, sessions: populatedSessions });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Intake Form APIs
router.get('/:userId/intake', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: user.intakeDetails || null });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/intake', async (req, res) => {
  try {
    const { userId, ...intakeData } = req.body;
    if (!userId) return res.status(400).json({ success: false, error: 'userId required' });
    const user = await User.findOneAndUpdate({ userId }, { $set: { intakeDetails: intakeData } }, { new: true });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: user.intakeDetails });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Referral Stats
router.get('/referral/stats/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    if (!userId || userId === 'undefined') return res.status(400).json({ ok: false, error: 'Invalid User ID' });

    const l1 = await User.find({ referredBy: userId }).select('userId name createdAt').lean();
    const l1Ids = l1.map(u => u.userId);
    const l2 = await User.find({ referredBy: { $in: l1Ids } }).select('userId name createdAt').lean();
    const l2Ids = l2.map(u => u.userId);
    const l3 = await User.find({ referredBy: { $in: l2Ids } }).select('userId name createdAt').lean();

    const user = await User.findOne({ userId }).select('referralEarnings referralWithdrawn referralCode');
    const earnings = user ? (user.referralEarnings || 0) : 0;
    const withdrawn = user ? (user.referralWithdrawn || 0) : 0;

    const cleanList = (list) => list.map(u => ({
      userId: u.userId,
      name: u.name || 'User',
      date: u.createdAt ? new Date(u.createdAt).toDateString() : ''
    }));

    res.json({
      ok: true,
      referralCode: user?.referralCode || '',
      stats: {
        level1Count: l1.length,
        level2Count: l2.length,
        level3Count: l3.length,
        totalReferrals: l1.length + l2.length + l3.length,
        referralEarnings: Math.floor(earnings),
        withdrawableAmount: Math.floor(earnings - withdrawn),
        earnings: Math.floor(earnings)
      },
      referrals: { l1: cleanList(l1), l2: cleanList(l2), l3: cleanList(l3) }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Referral Withdrawal
router.post('/withdraw-referral', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    if (!userId || !amount || amount < 1000) return res.json({ ok: false, error: 'Minimum withdrawal is ₹1000' });

    const user = await User.findOne({ userId });
    if (!user) return res.json({ ok: false, error: 'User not found' });

    const available = (user.referralEarnings || 0) - (user.referralWithdrawn || 0);
    if (amount > available || user.walletBalance < amount) return res.json({ ok: false, error: 'Insufficient balance' });

    await Withdrawal.create({ withdrawalId: crypto.randomUUID(), astroId: userId, amount, type: 'referral', status: 'pending' });

    user.walletBalance -= amount;
    user.referralWithdrawn = (user.referralWithdrawn || 0) + amount;
    await user.save();

    await BillingLedger.create({ billingId: crypto.randomUUID(), sessionId: 'referral_withdrawal_' + userId, minuteIndex: 0, chargedToClient: amount, creditedToAstrologer: 0, adminAmount: amount, reason: 'payout_withdrawal' });

    const io = req.app.get('io');
    const sId = userSockets.get(userId);
    if (sId && io) {
      io.to(sId).emit('wallet-update', { balance: user.walletBalance });
    }
    res.json({ ok: true, message: 'Withdrawal request submitted successfully' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
