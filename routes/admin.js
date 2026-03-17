const express = require('express');
const router = express.Router();
const { User, AstrologerApplication, Banner, AcademyVideo, AccountDeletionRequest } = require('../models');

// Astrologer Applications
router.get('/astrologer-requests', async (req, res) => {
  try {
    const requests = await AstrologerApplication.find({ status: 'pending' }).sort({ appliedAt: -1 }).lean();
    res.json({ ok: true, requests });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Server Error' });
  }
});

// Banner Management
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

router.get('/academy/videos', async (req, res) => {
  try {
    const videos = await AcademyVideo.find().sort({ order: 1 });
    res.json({ ok: true, videos });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Academy Video Management
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

// Account Deletion Requests
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
