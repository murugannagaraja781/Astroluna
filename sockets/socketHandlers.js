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

module.exports = function (io, socket) {
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
        sendFcmV1Push(toUser.fcmToken, { type: 'INCOMING_CALL', sessionId, callType: type, callerName: fromUser.name, callerId: fromUserId }, { title: '📞 Incoming Call', body: `${fromUser.name} is calling you` }, toUserId);
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

  // answer-session-native: used by web callacceptreject.html AND Android IncomingCallActivity
  // This is the PRIMARY call answer handler — without it, all calls fail silently
  socket.on('answer-session-native', async (data, cb) => {
    const { sessionId, accept, callType } = data || {};
    const userId = socketToUser.get(socket.id);
    const session = activeSessions.get(sessionId);

    if (!session) {
      return safeAck(cb, { ok: false, error: 'Session not found or expired' });
    }

    if (accept) {
      session.status = 'active';
      // Mark astrologer as busy
      if (session.astrologerId) {
        await User.updateOne({ userId: session.astrologerId }, { isBusy: true });
        broadcastAstroUpdate();
      }
      // Notify the caller (the other user) that the call was accepted
      const callerId = session.users.find(u => u !== userId);
      io.to(callerId).emit('session-answered', { sessionId, fromUserId: userId, accept: true, callType });
      safeAck(cb, { ok: true, fromUserId: callerId, sessionId });
    } else {
      endSessionRecord(sessionId);
      safeAck(cb, { ok: true });
    }
  });

  // WebRTC signal relay — CRITICAL for ICE candidates and SDP exchange between devices
  socket.on('signal', (data) => {
    const { toUserId, sessionId, signal } = data || {};
    const fromUserId = socketToUser.get(socket.id);
    if (!toUserId || !signal) return;
    io.to(toUserId).emit('signal', { fromUserId, sessionId, signal });
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

  // --- Message Status (Double Tick) ---
  socket.on('message-status', async (data) => {
    const { messageId, status, sessionId, toUserId } = data;
    const fromUserId = socketToUser.get(socket.id);
    if (!fromUserId || !messageId || !status || !toUserId) return;

    // Forward the status to the message sender (toUserId)
    io.to(toUserId).emit('message-status', {
      messageId,
      status,
      fromUserId
    });

    // Also update in database
    try {
      const ChatMessage = require('../models/ChatMessage');
      await ChatMessage.updateOne(
        { messageId },
        { $set: { status } }
      );
    } catch (e) {
      console.error('Error updating message status:', e);
    }
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
    broadcastAstroUpdate();

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
      if (u.fcmToken) sendFcmV1Push(u.fcmToken, { type: 'PROMO' }, { title: data.title, body: data.body }, u.userId);
    });
    safeAck(cb, { ok: true });
  });

  // --- Chat History ---
  socket.on('get-history', async (data, cb) => {
    try {
      const { sessionId, limit = 50, before } = data || {};
      if (!sessionId) return safeAck(cb, { ok: false, error: 'sessionId required' });

      const query = { sessionId };
      if (before) query.timestamp = { $lt: before };

      const messages = await ChatMessage.find(query)
        .sort({ timestamp: -1 })
        .limit(limit)
        .lean();

      safeAck(cb, { ok: true, messages: messages.reverse() });
    } catch (err) {
      safeAck(cb, { ok: false, error: err.message });
    }
  });

  // --- Per-service status toggle (chat / audio / video) ---
  socket.on('update-service-status', async (data) => {
    try {
      const { userId, service, isEnabled } = data || {};
      if (!userId || !service) return;

      const field = service === 'chat' ? 'isChatOnline' :
        service === 'audio' ? 'isAudioOnline' :
          service === 'video' ? 'isVideoOnline' : null;
      if (!field) return;

      const user = await User.findOne({ userId });
      if (!user) return;

      user[field] = !!isEnabled;
      user.isOnline = user.isChatOnline || user.isAudioOnline || user.isVideoOnline;
      await user.save();

      broadcastAstroUpdate();
    } catch (err) {
      console.error('[update-service-status]', err.message);
    }
  });

  // --- Withdrawal ---
  socket.on('request-withdrawal', async (data, cb) => {
    try {
      const userId = socketToUser.get(socket.id);
      if (!userId) return safeAck(cb, { ok: false, error: 'Not authenticated' });

      const { amount } = data || {};
      if (!amount || amount < 500) return safeAck(cb, { ok: false, error: 'Minimum withdrawal is ₹500' });

      const user = await User.findOne({ userId });
      if (!user) return safeAck(cb, { ok: false, error: 'User not found' });
      if (user.walletBalance < amount) return safeAck(cb, { ok: false, error: 'Insufficient balance' });

      const { Withdrawal, BillingLedger: BL } = require('../models');
      await Withdrawal.create({
        withdrawalId: crypto.randomUUID(),
        astroId: userId,
        amount,
        type: 'earnings',
        status: 'pending'
      });

      user.walletBalance -= amount;
      await user.save();

      socket.emit('wallet-update', { balance: user.walletBalance });
      safeAck(cb, { ok: true, message: 'Withdrawal request submitted' });
    } catch (err) {
      safeAck(cb, { ok: false, error: err.message });
    }
  });

  socket.on('get-my-withdrawals', async (_, cb) => {
    try {
      const userId = socketToUser.get(socket.id);
      if (!userId) return safeAck(cb, { ok: false, error: 'Not authenticated' });

      const { Withdrawal } = require('../models');
      const withdrawals = await Withdrawal.find({ astroId: userId })
        .sort({ requestedAt: -1 })
        .limit(20)
        .lean();

      safeAck(cb, { ok: true, withdrawals });
    } catch (err) {
      safeAck(cb, { ok: false, error: err.message });
    }
  });

  // --- Profile & Wallet ---
  socket.on('update-profile', async (data, cb) => {
    try {
      const userId = socketToUser.get(socket.id);
      if (!userId) return safeAck(cb, { ok: false, error: 'Not authenticated' });
      const allowed = ['name', 'image', 'skills', 'price', 'experience', 'about', 'languages', 'bankDetails', 'birthDetails'];
      const update = {};
      allowed.forEach(k => { if (data[k] !== undefined) update[k] = data[k]; });
      const user = await User.findOneAndUpdate({ userId }, { $set: update }, { returnDocument: 'after' });
      safeAck(cb, { ok: true, user });
      if (user && user.role === 'astrologer') broadcastAstroUpdate();
    } catch (err) { safeAck(cb, { ok: false, error: err.message }); }
  });

  socket.on('get-wallet', async (data, cb) => {
    try {
      const uid = (data && data.userId) || socketToUser.get(socket.id);
      if (!uid) return safeAck(cb, { ok: false, error: 'userId required' });
      const user = await User.findOne({ userId: uid }).select('walletBalance totalEarnings').lean();
      safeAck(cb, { ok: true, walletBalance: user?.walletBalance || 0, totalEarnings: user?.totalEarnings || 0 });
    } catch (err) { safeAck(cb, { ok: false, error: err.message }); }
  });

  socket.on('save-fcm-token', async (data) => {
    try {
      const userId = socketToUser.get(socket.id);
      if (!userId || !data?.fcmToken) return;
      await User.updateOne({ userId }, { fcmToken: data.fcmToken });
    } catch (err) { console.error('[save-fcm-token]', err.message); }
  });

  socket.on('save-intake-details', async (data, cb) => {
    try {
      const userId = socketToUser.get(socket.id);
      if (!userId) return safeAck(cb, { ok: false, error: 'Not authenticated' });
      await User.updateOne({ userId }, { $set: { intakeDetails: data } });
      safeAck(cb, { ok: true });
    } catch (err) { safeAck(cb, { ok: false, error: err.message }); }
  });

  // --- Message Delivery/Read Receipts ---
  socket.on('message-delivered', (data) => {
    const { toUserId, messageId } = data || {};
    const fromUserId = socketToUser.get(socket.id);
    if (toUserId && messageId) io.to(toUserId).emit('message-delivered', { fromUserId, messageId });
  });

  socket.on('message-read', (data) => {
    const { toUserId, messageId } = data || {};
    const fromUserId = socketToUser.get(socket.id);
    if (toUserId && messageId) io.to(toUserId).emit('message-read', { fromUserId, messageId });
  });

  // --- App lifecycle (no-op but prevents client errors) ---
  socket.on('app-background', () => { /* client went background — no action needed */ });
  socket.on('app-foreground', () => { /* client came back foreground — no action needed */ });

  // --- Payout Status ---
  socket.on('get-payout-status', async (_, cb) => {
    try {
      const userId = socketToUser.get(socket.id);
      if (!userId) return safeAck(cb, { ok: false });
      const { Withdrawal } = require('../models');
      const withdrawals = await Withdrawal.find({ astroId: userId }).sort({ requestedAt: -1 }).limit(10).lean();
      const pending = withdrawals.filter(w => w.status === 'pending').reduce((s, w) => s + w.amount, 0);
      const approved = withdrawals.filter(w => w.status === 'approved').reduce((s, w) => s + w.amount, 0);
      safeAck(cb, { ok: true, withdrawals, pending, approved });
    } catch (err) { safeAck(cb, { ok: false, error: err.message }); }
  });

  // --- Admin: Withdrawal Management ---
  socket.on('get-withdrawals', async (_, cb) => {
    try {
      if (!await checkAdmin(socket.id)) return safeAck(cb, { ok: false, error: 'Unauthorized' });
      const { Withdrawal } = require('../models');
      const withdrawals = await Withdrawal.find().sort({ requestedAt: -1 }).limit(100).lean();
      const populated = await Promise.all(withdrawals.map(async w => {
        const u = await User.findOne({ userId: w.astroId }).select('name phone').lean();
        return { ...w, astroName: u?.name || 'Unknown', phone: u?.phone || '' };
      }));
      safeAck(cb, { ok: true, withdrawals: populated });
    } catch (err) { safeAck(cb, { ok: false, error: err.message }); }
  });

  socket.on('approve-withdrawal', async (data, cb) => {
    try {
      if (!await checkAdmin(socket.id)) return safeAck(cb, { ok: false, error: 'Unauthorized' });
      const { Withdrawal } = require('../models');
      const w = await Withdrawal.findOneAndUpdate(
        { _id: data.withdrawalId },
        { status: 'approved', processedAt: new Date() },
        { returnDocument: 'after' }
      );
      safeAck(cb, { ok: true, withdrawal: w });
    } catch (err) { safeAck(cb, { ok: false, error: err.message }); }
  });

  socket.on('reject-withdrawal', async (data, cb) => {
    try {
      if (!await checkAdmin(socket.id)) return safeAck(cb, { ok: false, error: 'Unauthorized' });
      const { Withdrawal } = require('../models');
      const w = await Withdrawal.findOneAndUpdate(
        { _id: data.withdrawalId },
        { status: 'rejected', processedAt: new Date() },
        { returnDocument: 'after' }
      );
      // Refund wallet
      if (w) await User.updateOne({ userId: w.astroId }, { $inc: { walletBalance: w.amount } });
      safeAck(cb, { ok: true, withdrawal: w });
    } catch (err) { safeAck(cb, { ok: false, error: err.message }); }
  });

  // --- Admin: User Management ---
  socket.on('admin-add-wallet', async (data, cb) => {
    try {
      if (!await checkAdmin(socket.id)) return safeAck(cb, { ok: false, error: 'Unauthorized' });
      const { userId, amount } = data || {};
      if (!userId || !amount) return safeAck(cb, { ok: false, error: 'userId and amount required' });
      const user = await User.findOneAndUpdate({ userId }, { $inc: { walletBalance: amount } }, { returnDocument: 'after' });
      const sId = userSockets.get(userId);
      if (sId) io.to(sId).emit('wallet-update', { balance: user.walletBalance });
      safeAck(cb, { ok: true, walletBalance: user.walletBalance });
    } catch (err) { safeAck(cb, { ok: false, error: err.message }); }
  });

  socket.on('admin-update-user-details', async (data, cb) => {
    try {
      if (!await checkAdmin(socket.id)) return safeAck(cb, { ok: false, error: 'Unauthorized' });
      const { userId, updates } = data || {};
      if (!userId) return safeAck(cb, { ok: false, error: 'userId required' });
      const user = await User.findOneAndUpdate({ userId }, { $set: updates }, { returnDocument: 'after' });
      if (user && user.role === 'astrologer') broadcastAstroUpdate();
      safeAck(cb, { ok: true, user });
    } catch (err) { safeAck(cb, { ok: false, error: err.message }); }
  });

  socket.on('admin-edit-user', async (data, cb) => {
    try {
      if (!await checkAdmin(socket.id)) return safeAck(cb, { ok: false, error: 'Unauthorized' });
      const { userId, updates } = data || {};
      const user = await User.findOneAndUpdate({ userId }, { $set: updates }, { returnDocument: 'after' });
      if (user && user.role === 'astrologer') broadcastAstroUpdate();
      safeAck(cb, { ok: true, user });
    } catch (err) { safeAck(cb, { ok: false, error: err.message }); }
  });

  socket.on('admin-update-role', async (data, cb) => {
    try {
      if (!await checkAdmin(socket.id)) return safeAck(cb, { ok: false, error: 'Unauthorized' });
      const user = await User.findOneAndUpdate({ userId: data.userId }, { role: data.role }, { returnDocument: 'after' });
      broadcastAstroUpdate();
      safeAck(cb, { ok: true, user });
    } catch (err) { safeAck(cb, { ok: false, error: err.message }); }
  });

  socket.on('admin-toggle-ban', async (data, cb) => {
    try {
      if (!await checkAdmin(socket.id)) return safeAck(cb, { ok: false, error: 'Unauthorized' });
      const user = await User.findOne({ userId: data.userId });
      if (!user) return safeAck(cb, { ok: false, error: 'User not found' });
      user.isBanned = !user.isBanned;
      await user.save();
      // Force disconnect if banning
      if (user.isBanned) {
        const sId = userSockets.get(data.userId);
        if (sId) io.to(sId).emit('force-logout', { reason: 'banned' });
      }
      safeAck(cb, { ok: true, isBanned: user.isBanned });
    } catch (err) { safeAck(cb, { ok: false, error: err.message }); }
  });

  socket.on('admin-toggle-verification', async (data, cb) => {
    try {
      if (!await checkAdmin(socket.id)) return safeAck(cb, { ok: false, error: 'Unauthorized' });
      const user = await User.findOne({ userId: data.userId });
      if (!user) return safeAck(cb, { ok: false, error: 'User not found' });
      user.isVerified = !user.isVerified;
      await user.save();
      broadcastAstroUpdate();
      safeAck(cb, { ok: true, isVerified: user.isVerified });
    } catch (err) { safeAck(cb, { ok: false, error: err.message }); }
  });

  socket.on('admin-approve-astrologer', async (data, cb) => {
    try {
      if (!await checkAdmin(socket.id)) return safeAck(cb, { ok: false, error: 'Unauthorized' });
      await User.updateOne({ userId: data.userId }, { role: 'astrologer', isVerified: true, astrologerRequestStatus: 'approved' });
      broadcastAstroUpdate();
      safeAck(cb, { ok: true });
    } catch (err) { safeAck(cb, { ok: false, error: err.message }); }
  });

  socket.on('admin-reject-astrologer', async (data, cb) => {
    try {
      if (!await checkAdmin(socket.id)) return safeAck(cb, { ok: false, error: 'Unauthorized' });
      await User.updateOne({ userId: data.userId }, { astrologerRequestStatus: 'rejected' });
      safeAck(cb, { ok: true });
    } catch (err) { safeAck(cb, { ok: false, error: err.message }); }
  });

  socket.on('admin-get-ledger-stats', async (_, cb) => {
    try {
      if (!await checkAdmin(socket.id)) return safeAck(cb, { ok: false, error: 'Unauthorized' });
      const { BillingLedger } = require('../models');
      const ledger = await BillingLedger.find().sort({ createdAt: -1 }).limit(200).lean();
      const totalRevenue = ledger.reduce((s, l) => s + (l.adminAmount || 0), 0);
      const totalAstroEarnings = ledger.reduce((s, l) => s + (l.creditedToAstrologer || 0), 0);
      const totalCharged = ledger.reduce((s, l) => s + (l.chargedToClient || 0), 0);
      safeAck(cb, { ok: true, ledger, stats: { totalRevenue, totalAstroEarnings, totalCharged } });
    } catch (err) { safeAck(cb, { ok: false, error: err.message }); }
  });
};
