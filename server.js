require('dotenv').config();
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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Attach io to app for use in routes
app.set('io', io);

// Initialize Services
setAstrologerIo(io);
setSessionIo(io);
startTicker();

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/astroluna')
  .then(() => console.log('✓ MongoDB Connected'))
  .catch(err => console.error('✗ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/astrology', require('./routes/astrology'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/charts', require('./routes/charts'));

// Basic Routes
app.get('/', (req, res) => res.send('Astroluna Server Running'));

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