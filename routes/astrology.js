const express = require('express');
const router = express.Router();
const { User, Session, Review } = require('../models');
const { DateTime } = require('luxon');
const { fetchDailyHoroscope } = require("../utils/rasiEng/horoscopeData");

// Get Astrologers List
router.get('/astrologers', async (req, res) => {
  try {
    const astrologers = await User.find({ role: 'astrologer' })
      .select('userId name skills price isOnline isChatOnline isAudioOnline isVideoOnline experience isVerified image isBusy')
      .lean();

    const formatted = astrologers.map(a => ({
      userId: a.userId,
      name: a.name,
      skills: a.skills || [],
      price: a.price || 15,
      isOnline: a.isOnline || false,
      isChatOnline: a.isChatOnline || false,
      isAudioOnline: a.isAudioOnline || false,
      isVideoOnline: a.isVideoOnline || false,
      experience: a.experience || 0,
      isVerified: a.isVerified || false,
      isBusy: a.isBusy || false,
      image: a.image || ''
    }));

    res.json({ ok: true, astrologers: formatted });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Get Astrologer Session History
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const sessions = await Session.find({
      $or: [{ astrologerId: userId }, { toUserId: userId, type: { $in: ['audio', 'video', 'chat'] } }],
      status: 'ended'
    })
      .sort({ actualBillingStart: -1 })
      .limit(50)
      .lean();

    const populatedSessions = await Promise.all(sessions.map(async (s) => {
      const cId = s.clientId || s.fromUserId;
      const client = await User.findOne({ userId: cId }).select('name').lean();
      return { ...s, clientName: client ? client.name : 'Unknown Client' };
    }));

    res.json({ ok: true, sessions: populatedSessions });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Submit/Update Review
router.post('/review', async (req, res) => {
  try {
    const { sessionId, clientId, clientName, astrologerId, astrologerName, rating, review } = req.body;
    const newReview = await Review.findOneAndUpdate({ sessionId }, { sessionId, clientId, clientName, astrologerId, astrologerName, rating, review }, { upsert: true, new: true });
    res.json({ ok: true, review: newReview });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Get Latest Reviews
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(10).lean();
    res.json({ ok: true, reviews });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Daily Horoscope
router.get('/daily-horoscope', async (req, res) => {
  try {
    const today = DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd');
    let data = await fetchDailyHoroscope(today);
    
    // Fallback if no data
    if (!data || !Array.isArray(data) || data.length === 0) {
        // Return dummy or last known good data logic (simplified for router)
        return res.json({ ok: true, content: "Check back later for your daily insight." });
    }

    const signName = req.query.sign;
    let targetItem = data[0];
    if (signName) {
      const found = data.find(d => (d.sign_en && d.sign_en.toLowerCase() === signName.toLowerCase()) || d.sign_ta === signName);
      if (found) targetItem = found;
    }

    const rawText = targetItem.prediction_ta || targetItem.prediction_en || "Today is looking promising!";
    
    res.json({ 
      success: true, 
      data: {
        date: today,
        forecast_ta: targetItem.prediction_ta || rawText,
        forecast_en: targetItem.prediction_en || rawText,
        ...targetItem
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Check back later for your daily insight." });
  }
});

module.exports = router;
