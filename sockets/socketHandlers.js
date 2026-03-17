const crypto = require('crypto');
const { User, Session, ChatMessage, AstrologerApplication, BillingLedger, Notification, PairMonth } = require('../models');
const { logActivity } = require('../utils/logger');
const { safeAck, getOtherUserIdFromSession } = require('../utils/socketHelpers');
const {
  userSockets,
  socketToUser,
  userActiveSession,
  activeSessions,
  sessionDisconnectTimeouts,
  savedAstroStatus
} = require('../utils/socketRegistry');
const { broadcastAstroUpdate } = require('../services/astrologerService');
const { endSessionRecord, handleUserConnection } = require('../services/sessionService');
const { sendFcmV1Push, sendChatMessagePush } = require('../services/fcmService');
const { SLAB_RATES } = require('../config/billing');

module.exports = function(io, socket) {
  const checkAdmin = async (sid) => {
    const uid = socketToUser.get(sid);
    if (!uid) return false;
    const u = await User.findOne({ userId: uid });
    return u && u.role === 'superadmin';
  };

  // --- Registration ---
  socket.on('register', async (data, cb) => {
    try {
      const { phone, userId: dataUserId } = data || {};
      const userId = dataUserId || socketToUser.get(socket.id);
      const query = phone ? { phone } : (userId ? { userId } : null);
      if (!query) return safeAck(cb, { ok: false, error: 'No identifier' });

      const user = await User.findOne(query);
      if (!user) return safeAck(cb, { ok: false, error: 'User not found' });

      userSockets.set(user.userId, socket.id);
      socketToUser.set(socket.id, user.userId);
      socket.join(user.userId);

      if (sessionDisconnectTimeouts.has(user.userId)) {
        clearTimeout(sessionDisconnectTimeouts.get(user.userId));
        sessionDisconnectTimeouts.delete(user.userId);
      }

      if (user.role === 'astrologer') broadcastAstroUpdate();
      if (user.role === 'superadmin') socket.join('superadmin');

      safeAck(cb, { ok: true, userId: user.userId, role: user.role, name: user.name, walletBalance: user.walletBalance, totalEarnings: user.totalEarnings || 0, referralCode: user.referralCode });
    } catch (err) { safeAck(cb, { ok: false, error: 'Internal Error' }); }
  });

  // --- Session Management ---
  socket.on('request-session', async (data, cb) => {
    try {
      const { toUserId, type, birthData } = data || {};
      const fromUserId = socketToUser.get(socket.id);
      if (!fromUserId || !toUserId || !type) return safeAck(cb, { ok: false, error: 'Missing data' });

      const toUser = await User.findOne({ userId: toUserId });
      const fromUser = await User.findOne({ userId: fromUserId });
      if (!toUser) return safeAck(cb, { ok: false, error: 'User not found' });

      if (userActiveSession.has(toUserId)) {
         const sid = userActiveSession.get(toUserId);
         if (activeSessions.has(sid)) return safeAck(cb, { ok: false, error: 'User busy' });
         userActiveSession.delete(toUserId);
      }

      const sessionId = crypto.randomUUID();
      let clientId = fromUser.role === 'client' ? fromUserId : toUserId;
      let astrologerId = fromUser.role === 'astrologer' ? fromUserId : toUserId;

      await Session.create({ sessionId, fromUserId, toUserId, type, startTime: Date.now(), clientId, astrologerId });
      activeSessions.set(sessionId, { type, users: [fromUserId, toUserId], startedAt: Date.now(), clientId, astrologerId, status: 'ringing' });
      userActiveSession.set(fromUserId, sessionId);
      userActiveSession.set(toUserId, sessionId);

      io.to(toUserId).emit('incoming-session', { sessionId, fromUserId, callerName: fromUser.name, type, birthData });
      
      if (toUser.fcmToken) {
        sendFcmV1Push(toUser.fcmToken, { type: 'INCOMING_CALL', sessionId, callType: type, callerName: fromUser.name, callerId: fromUserId }, { title: '📞 Incoming Call', body: `${fromUser.name} is calling you` });
      }

      safeAck(cb, { ok: true, sessionId });
      setTimeout(() => {
        const s = activeSessions.get(sessionId);
        if (s && s.status === 'ringing') endSessionRecord(sessionId);
      }, 25000);
    } catch (err) { safeAck(cb, { ok: false, error: 'Internal Error' }); }
  });

  socket.on('answer-session', (data) => {
    const { sessionId, accept } = data;
    const userId = socketToUser.get(socket.id);
    const session = activeSessions.get(sessionId);
    if (!session) return;

    if (accept) {
      session.status = 'active';
      if (session.astrologerId) User.updateOne({ userId: session.astrologerId }, { isBusy: true }).then(() => broadcastAstroUpdate());
      const otherId = session.users.find(u => u !== userId);
      io.to(otherId).emit('session-answered', { sessionId, fromUserId: userId, accept: true });
    } else {
      endSessionRecord(sessionId);
    }
  });

  socket.on('session-connect', (data) => {
    const { sessionId } = data;
    const userId = socketToUser.get(socket.id);
    if (sessionId && userId) handleUserConnection(sessionId, userId);
  });

  socket.on('end-session', (data) => {
    if (data.sessionId) endSessionRecord(data.sessionId);
  });

  // --- Chat ---
  socket.on('chat-message', async (data) => {
    const { toUserId, sessionId, content, messageId } = data;
    const fromUserId = socketToUser.get(socket.id);
    if (!fromUserId || !toUserId || !content || !messageId) return;

    socket.emit('message-status', { messageId, status: 'sent' });
    ChatMessage.create({ messageId, sessionId, fromUserId, toUserId, text: content.text, timestamp: Date.now() });
    io.to(toUserId).emit('chat-message', { fromUserId, content, sessionId, timestamp: Date.now(), messageId });
    sendChatMessagePush(toUserId, fromUserId, content.text, sessionId, messageId);
  });

  socket.on('typing', (data) => {
    const { toUserId, isTyping } = data;
    const fromUserId = socketToUser.get(socket.id);
    if (fromUserId && toUserId) io.to(toUserId).emit('typing', { fromUserId, isTyping });
  });

  // --- Presence & Lifecycle ---
  socket.on('update-status', async (data) => {
    const userId = socketToUser.get(socket.id);
    if (!userId) return;
    const isOnline = !!data.isOnline;
    await User.updateOne({ userId }, { isOnline, isAvailable: isOnline, isChatOnline: isOnline, isAudioOnline: isOnline, isVideoOnline: isOnline, lastSeen: new Date() });
    broadcastAstroUpdate();
  });

  socket.on('toggle-status', async (data) => {
    const userId = socketToUser.get(socket.id);
    if (!userId) return;
    const { online, type } = data;
    const update = { lastSeen: new Date() };
    
    // mapping frontend types to backend fields
    if (type === 'chat') update.isChatOnline = !!online;
    if (type === 'audio') update.isAudioOnline = !!online;
    if (type === 'video') update.isVideoOnline = !!online;
    if (type === 'main') update.isOnline = !!online;

    await User.updateOne({ userId }, { $set: update });

    // Re-check overall isOnline if needed, or just follow the main toggle
    if (type === 'main' && !online) {
       // If main is off, force all sub-services off
       await User.updateOne({ userId }, { $set: { isChatOnline: false, isAudioOnline: false, isVideoOnline: false, isAvailable: false } });
    }
    
    // Set overall isOnline if any sub-service is on? 
    // Usually isOnline signifies "System Active"
    
    broadcastAstroUpdate();
  });

  socket.on('disconnect', async () => {
    const userId = socketToUser.get(socket.id);
    if (!userId) return;
    socketToUser.delete(socket.id);
    if (userSockets.get(userId) === socket.id) userSockets.delete(userId);

    // Set Astrologer to offline on disconnect
    const user = await User.findOne({ userId });
    if (user && user.role === 'astrologer') {
      await User.updateOne({ userId }, { 
        isOnline: false, 
        isAvailable: false, 
        isChatOnline: false, 
        isAudioOnline: false, 
        isVideoOnline: false,
        lastSeen: new Date() 
      });
      broadcastAstroUpdate();
    }

    const sid = userActiveSession.get(userId);
    if (sid) {
      const timeoutId = setTimeout(() => {
        if (activeSessions.has(sid)) endSessionRecord(sid);
      }, 60000);
      sessionDisconnectTimeouts.set(userId, timeoutId);
    }
  });

  // --- Astrologers ---
  socket.on('get-astrologers', async (cb) => {
    try {
      const astros = await User.find(
        { role: 'astrologer' },
        'userId name isOnline isChatOnline isAudioOnline isVideoOnline isAvailable isBusy price image skills experience rating isVerified languages orderCount'
      ).lean();
      safeAck(cb, { ok: true, astrologers: astros });
    } catch (err) {
      safeAck(cb, { ok: false, error: 'Failed to fetch' });
    }
  });

  // --- Admin ---

  socket.on('get-all-users', async (cb) => {
    if (!await checkAdmin(socket.id)) return safeAck(cb, { ok: false });
    const users = await User.find({}).sort({ name: 1 }).lean();
    safeAck(cb, { ok: true, users });
  });

  socket.on('admin-force-offline', async (data, cb) => {
    if (!await checkAdmin(socket.id)) return safeAck(cb, { ok: false });
    await User.updateOne({ userId: data.userId }, { isOnline: false, isAvailable: false, isChatOnline: false, isAudioOnline: false, isVideoOnline: false });
    broadcastAstroUpdate();
    safeAck(cb, { ok: true });
  });

  socket.on('send-bulk-fcm', async (data, cb) => {
    if (!await checkAdmin(socket.id)) return safeAck(cb, { ok: false });
    const users = data.allUsers ? await User.find({ fcmToken: { $exists: true } }) : await User.find({ userId: { $in: data.userIds } });
    users.forEach(u => {
        if (u.fcmToken) sendFcmV1Push(u.fcmToken, { type: 'PROMO' }, { title: data.title, body: data.body });
    });
    safeAck(cb, { ok: true });
  });
};
