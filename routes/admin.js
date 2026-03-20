const express = require('express');
const router = express.Router();
const { 
  User, 
  AstrologerApplication, 
  Banner, 
  AcademyVideo, 
  AccountDeletionRequest, 
  Withdrawal, 
  Notification, 
  Session, 
  BillingLedger 
} = require('../models');

// --- Admin Dashboard Stats ---
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const clientsCount = await User.countDocuments({ role: 'client' });
    const astrologersCount = await User.countDocuments({ role: 'astrologer' });
    
    // Financial Stats
    const walletStats = await User.aggregate([
      { $group: { _id: null, totalBalance: { $sum: '$walletBalance' }, totalEarnings: { $sum: '$totalEarnings' } } }
    ]);
    
    const pendingApplications = await AstrologerApplication.countDocuments({ status: 'pending' });
    const pendingWithdrawals = await Withdrawal.countDocuments({ status: 'pending' });
    
    const activeSessionsCount = require('../utils/socketRegistry').activeSessions.size;

    res.json({
      ok: true,
      stats: {
        users: { total: totalUsers, clients: clientsCount, astrologers: astrologersCount },
        finance: {
          totalClientBalance: walletStats[0]?.totalBalance || 0,
          totalAstroEarnings: walletStats[0]?.totalEarnings || 0
        },
        pending: {
          applications: pendingApplications,
          withdrawals: pendingWithdrawals
        },
        activeSessions: activeSessionsCount
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// --- Admin Notifications ---
router.get('/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find({ type: 'admin' }).sort({ createdAt: -1 }).limit(50);
    const unreadCount = await Notification.countDocuments({ type: 'admin', read: false });
    res.json({ ok: true, notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.post('/notifications/read', async (req, res) => {
  try {
    const { notificationId } = req.body;
    if (notificationId) {
      await Notification.findByIdAndUpdate(notificationId, { read: true });
    } else {
      await Notification.updateMany({ type: 'admin', read: false }, { read: true });
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// --- Astrologer Applications ---
router.get('/astrologer-requests', async (req, res) => {
  try {
    const requests = await AstrologerApplication.find().sort({ appliedAt: -1 }).lean();
    res.json({ ok: true, requests });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Server Error' });
  }
});

router.post('/astrologer-requests/approve/:id', async (req, res) => {
  try {
    const app = await AstrologerApplication.findById(req.params.id);
    if (!app) return res.status(404).json({ ok: false, error: 'Application not found' });

    // Update Application
    app.status = 'approved';
    app.processedAt = new Date();
    await app.save();

    // Update User
    const user = await User.findOne({ phone: app.cellNumber1 });
    if (user) {
      user.role = 'astrologer';
      user.name = app.displayName || app.realName;
      user.isVerified = true;
      user.astrologerExperience = app.astrologyExperience;
      user.astrologerAbout = app.profession;
      await user.save();
    }

    res.json({ ok: true, message: 'Application approved and user role updated' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.post('/astrologer-requests/reject/:id', async (req, res) => {
  try {
    const { notes } = req.body;
    const app = await AstrologerApplication.findByIdAndUpdate(req.params.id, {
      status: 'rejected',
      processedAt: new Date(),
      notes
    }, { new: true });
    res.json({ ok: true, app });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// --- Withdrawal Management ---
router.get('/withdrawals', async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const withdrawals = await Withdrawal.find(query).sort({ requestedAt: -1 }).lean();
    
    // Populate Astro Names
    const populated = await Promise.all(withdrawals.map(async (w) => {
      const astro = await User.findOne({ userId: w.astroId }).select('name phone').lean();
      return { ...w, astroName: astro?.name || 'Unknown', astroPhone: astro?.phone || '' };
    }));

    res.json({ ok: true, withdrawals: populated });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.post('/withdrawals/process', async (req, res) => {
  try {
    const { withdrawalId, status, adminId } = req.body;
    const withdrawal = await Withdrawal.findOneAndUpdate(
      { withdrawalId },
      { status, processedAt: new Date(), processedBy: adminId },
      { new: true }
    );
    res.json({ ok: true, withdrawal });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// --- Banner Management ---
router.get('/banners', async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1 });
    res.json({ ok: true, data: banners });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.post('/banners', async (req, res) => {
  try {
    const banner = new Banner(req.body);
    await banner.save();
    res.json({ ok: true, data: banner });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.put('/banners/:id', async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ ok: true, data: banner });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.delete('/banners/:id', async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// --- Academy Video Management ---
router.get('/academy/videos', async (req, res) => {
  try {
    const videos = await AcademyVideo.find().sort({ order: 1 });
    res.json({ ok: true, videos });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.post('/academy/videos', async (req, res) => {
  try {
    const video = new AcademyVideo(req.body);
    await video.save();
    res.json({ ok: true, video });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.put('/academy/videos/:id', async (req, res) => {
  try {
    const video = await AcademyVideo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ ok: true, video });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.delete('/academy/videos/:id', async (req, res) => {
  try {
    await AcademyVideo.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// --- Account Deletion Requests ---
router.get('/deletion-requests', async (req, res) => {
  try {
    const requests = await AccountDeletionRequest.find().sort({ requestedAt: -1 });
    res.json({ ok: true, requests });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.post('/process-deletion', async (req, res) => {
  try {
    const { requestId, status, notes, adminId } = req.body;
    const request = await AccountDeletionRequest.findOneAndUpdate(
      { requestId },
      { status, notes, processedAt: new Date(), processedBy: adminId },
      { new: true }
    );
    res.json({ ok: true, request });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
