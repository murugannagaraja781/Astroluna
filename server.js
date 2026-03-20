require('dotenv').config();
console.log('--- Startup Config ---');
console.log('PORT in env:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Present' : 'Missing');
console.log('MSG91 Template:', process.env.MSG91_TEMPLATE_ID);
console.log('----------------------');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');

// Services & Utils
const { setIo: setAstrologerIo } = require('./services/astrologerService');
const { setIo: setSessionIo, startTicker } = require('./services/sessionService');
const { logActivity } = require('./utils/logger');

// Express App Setup
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger (Debug)
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.url} | Body: ${JSON.stringify(req.body)}`);
  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Health Checks (for monitoring/hosting) ──────────────────────────────────
app.get('/', (req, res) => res.json({ ok: true, message: 'Astroluna Backend is running' }));
app.get('/version', (req, res) => res.json({ version: '1.0.0', status: 'healthy' }));

// Attach io to app for use in routes
app.set('io', io);

// Initialize Services
setAstrologerIo(io);
setSessionIo(io);
startTicker();

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/astroluna';
mongoose.connect(MONGODB_URI)

  .then(() => console.log('✓ MongoDB Connected'))
  .catch(err => console.error('✗ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/auth')); // Compatibility for Mobile App (Legacy paths: /api/send-otp, /api/verify-otp)
app.use('/api/user', require('./routes/user'));
app.use('/api/astrology', require('./routes/astrology'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/charts', require('./routes/charts'));
app.use('/api/rasi-eng', require('./routes/rasiEng')); // VipChart, Birth Chart, Matching, Horoscope

// ── Alias routes to fix 404s from mobile app ──────────────────────────────

// City search — app calls /api/city-* but server has /api/charts/city-*
app.use('/api/city-autocomplete', (req, res, next) => { req.url = '/city-autocomplete'; require('./routes/charts')(req, res, next); });
app.use('/api/city-timezone',     (req, res, next) => { req.url = '/city-timezone';     require('./routes/charts')(req, res, next); });

// Banners — app calls /api/home/banners, server has /api/admin/banners
app.get('/api/home/banners', async (req, res) => {
  try {
    const { Banner } = require('./models');
    const banners = await Banner.find({ active: { $ne: false } }).sort({ order: 1 }).lean();
    res.json({ ok: true, data: banners });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Porutham matching — app calls /api/match/porutham, server has /api/charts/porutham
app.post('/api/match/porutham', (req, res, next) => { req.url = '/porutham'; require('./routes/charts')(req, res, next); });

// Academy videos — app calls /api/academy/videos (read-only public), server has /api/admin/academy/videos
app.get('/api/academy/videos', async (req, res) => {
  try {
    const { AcademyVideo } = require('./models');
    const videos = await AcademyVideo.find().sort({ order: 1 }).lean();
    res.json({ ok: true, videos });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Astrologer registration — app calls /api/astrologer/register, server has /api/auth/register-astrologer
app.post('/api/astrologer/register', (req, res, next) => { req.url = '/register-astrologer'; require('./routes/auth')(req, res, next); });

// Referral — app calls /api/referral/stats/:userId and /api/withdraw-referral, server has them under /api/user/
app.get('/api/referral/stats/:userId', (req, res, next) => { req.url = '/referral/stats/' + req.params.userId; require('./routes/user')(req, res, next); });
app.post('/api/withdraw-referral',    (req, res, next) => { req.url = '/withdraw-referral'; require('./routes/user')(req, res, next); });

// Admin Dashboard Data
app.get('/api/admin/astrologers/attended', async (req, res) => {
  try {
    const { User } = require('./models');
    const astrologers = await User.find({ role: 'astrologer' })
      .select('userId name phone totalEarnings isOnline isChatOnline isAudioOnline isVideoOnline')
      .lean();
    res.json({ ok: true, astrologers });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Astrologer service toggle — app calls /api/astrologer/service-toggle
app.post('/api/astrologer/service-toggle', async (req, res) => {
  try {
    const { userId, service, enabled } = req.body;
    if (!userId || !service) return res.status(400).json({ ok: false, error: 'userId and service required' });

    const { User } = require('./models');
    const field = service === 'chat'  ? 'isChatOnline'  :
                  service === 'audio' ? 'isAudioOnline' :
                  service === 'video' ? 'isVideoOnline' : null;

    if (!field) return res.status(400).json({ ok: false, error: 'Invalid service. Use: chat, audio, video' });

    const update = { [field]: !!enabled };
    // Recompute master isOnline: true if ANY service is enabled
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ ok: false, error: 'User not found' });

    user[field] = !!enabled;
    user.isOnline = user.isChatOnline || user.isAudioOnline || user.isVideoOnline;
    await user.save();

    // Broadcast status change to all clients via socket
    const ioInstance = app.get('io');
    if (ioInstance) {
      ioInstance.emit('astro-status-change', {
        userId,
        service,
        isEnabled: !!enabled,
        isOnline: user.isOnline,
        isChatOnline: user.isChatOnline,
        isAudioOnline: user.isAudioOnline,
        isVideoOnline: user.isVideoOnline
      });
    }

    res.json({ ok: true, isOnline: user.isOnline, [field]: !!enabled });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Payment history — app calls /api/payment/history/:userId
app.get('/api/payment/history/:userId', async (req, res) => {
  try {
    const { Payment } = require('./models');
    const payments = await Payment.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    res.json({ ok: true, payments });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Free Horoscope (generate chart)  — app calls /api/horoscope/generate-chart
app.use('/api/horoscope', require('./routes/freeHoroscope'));

// Rasipalan — also mount on legacy path just in case
app.use('/api/rasipalan', require('./routes/rasipalan'));

// ── Compatibility Aliases for Mobile App ───────────────────────────────────
// App calls /api/daily-horoscope, server has /api/astrology/daily-horoscope
app.get('/api/daily-horoscope', (req, res, next) => {
  req.url = '/daily-horoscope';
  require('./routes/astrology')(req, res, next);
});

// App calls /api/rasi-eng/horoscope/daily, server has /api/astrology/daily-horoscope (or similar)
app.get('/api/rasi-eng/horoscope/daily', (req, res, next) => {
  req.url = '/daily-horoscope';
  require('./routes/astrology')(req, res, next);
});

// ── FCM Token Registration ─────────────────────────────────────────────────
// App calls POST /register with { userId, fcmToken }
app.post('/register', async (req, res) => {
  try {
    const { userId, fcmToken } = req.body;
    if (!userId || !fcmToken) return res.json({ ok: false, error: 'userId and fcmToken required' });
    const { User } = require('./models');
    await User.findOneAndUpdate({ userId }, { fcmToken }, { returnDocument: 'after' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── Chat History ───────────────────────────────────────────────────────────
// App calls GET /api/chat/history/:sessionId?limit=20&before=<timestamp>
app.get('/api/chat/history/:sessionId', async (req, res) => {
  try {
    const { ChatMessage } = require('./models');
    const { sessionId } = req.params;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const before = req.query.before ? parseInt(req.query.before) : null;

    const query = { sessionId };
    if (before) query.timestamp = { $lt: before };

    const messages = await ChatMessage.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    res.json({ ok: true, messages: messages.reverse(), hasMore: messages.length === limit });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── PhonePe Status Check ───────────────────────────────────────────────────
// App calls GET /api/phonepe/status/:transactionId
app.get('/api/phonepe/status/:transactionId', async (req, res) => {
  try {
    const { checkPhonePeOrderStatus } = require('./utils/paymentHelpers');
    const result = await checkPhonePeOrderStatus(req.params.transactionId);
    res.json({ ok: true, state: result.state, data: result.data });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── PhonePe Sign (alias for payment/create) ────────────────────────────────
// App calls POST /api/phonepe/sign — proxied to payment creation flow
app.post('/api/phonepe/sign', async (req, res, next) => {
  req.url = '/create';
  require('./routes/payment')(req, res, next);
});

// Basic Routes
// Root served by express.static('public')

// File Upload
const upload = multer({ dest: 'uploads/' });
app.post('/upload', upload.single('file'), (req, res) => {
  return res.json({ ok: true, url: req.file ? '/uploads/' + req.file.filename : '' });
});

// Socket.IO Connection Handler
const registerSocketHandlers = require('./sockets/socketHandlers');
io.on('connection', (socket) => {
  logActivity('socket', `New connection: ${socket.id}`);
  registerSocketHandlers(io, socket);
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✓ Server listening on port ${PORT}`);
});