const crypto = require('crypto');
const { User, Session, PairMonth, BillingLedger, Notification } = require('../models');
const { activeSessions, userActiveSession, userSockets, sessionDisconnectTimeouts } = require('../utils/socketRegistry');
const { SLAB_RATES, COMMISSION_L1, COMMISSION_L2, COMMISSION_L3, CASHBACK_CLIENT } = require('../config/billing');
const { broadcastAstroUpdate } = require('./astrologerService');
const { sendFcmV1Push } = require('./fcmService');

let ioInstance = null;
function setIo(io) { ioInstance = io; }

function getSlabBySeconds(seconds) {
  if (seconds <= 300) return 1;
  if (seconds <= 600) return 2;
  if (seconds <= 900) return 3;
  return 4;
}

async function processBillingCharge(sessionId, durationSeconds, minuteIndex, type) {
  try {
    const session = await Session.findOne({ sessionId });
    if (!session || !session.astrologerId || !session.clientId) return;

    const astro = await User.findOne({ userId: session.astrologerId });
    const client = await User.findOne({ userId: session.clientId });
    if (!astro || !client) return;

    let pricePerMin = parseInt(astro.price) || 10;
    let amountToCharge = 0, adminShare = 0, astroShare = 0, reason = '';

    if (type === 'first_60_full') {
      amountToCharge = pricePerMin;
      adminShare = amountToCharge;
      reason = 'first_60';
    } else if (type === 'slab') {
      const activeSess = activeSessions.get(sessionId);
      const currentSlab = activeSess?.currentSlab || 3;
      const rate = SLAB_RATES[currentSlab] || 0.30;
      amountToCharge = pricePerMin;
      astroShare = amountToCharge * rate;
      adminShare = amountToCharge - astroShare;
      reason = `slab_${currentSlab}`;
    } else if (type === 'fraction') {
      amountToCharge = pricePerMin;
      adminShare = amountToCharge;
      reason = 'fraction_admin';
    } else return;

    if (client.walletBalance >= amountToCharge) {
      client.walletBalance -= amountToCharge;
      await client.save();

      if (astroShare > 0) {
        astro.walletBalance += astroShare;
        astro.totalEarnings = (astro.totalEarnings || 0) + astroShare;
        await astro.save();
      }

      // Referral Logic
      if (client.referredBy && client.hasRecharged) {
        const clientCashback = amountToCharge * CASHBACK_CLIENT;
        client.walletBalance += clientCashback;
        await client.save();
        adminShare -= clientCashback;

        const l1 = await User.findOne({ userId: client.referredBy });
        if (l1) {
          const l1Com = amountToCharge * COMMISSION_L1;
          l1.walletBalance += l1Com;
          l1.referralEarnings = (l1.referralEarnings || 0) + l1Com;
          await l1.save();
          adminShare -= l1Com;
          if (ioInstance) {
            const l1sId = userSockets.get(l1.userId);
            if (l1sId) ioInstance.to(l1sId).emit('wallet-update', { balance: l1.walletBalance });
          }
        }
      }

      await BillingLedger.create({ billingId: crypto.randomUUID(), sessionId, minuteIndex, chargedToClient: amountToCharge, creditedToAstrologer: astroShare, adminAmount: adminShare, reason });

      const activeSess = activeSessions.get(sessionId);
      if (activeSess) {
        activeSess.totalDeducted = (activeSess.totalDeducted || 0) + amountToCharge;
        activeSess.totalEarned = (activeSess.totalEarned || 0) + astroShare;
      }
    } else {
      console.log(`[Billing] Insufficient funds for ${client.userId}. Ending session.`);
      endSessionRecord(sessionId);
    }
  } catch (e) { console.error('Billing error:', e); }
}

async function endSessionRecord(sessionId) {
  const s = activeSessions.get(sessionId);
  if (!s) return;

  const endTime = Date.now();
  const wallClockSeconds = Math.floor((endTime - (s.startTime || endTime)) / 1000);
  const billableSeconds = s.elapsedBillableSeconds || 0;
  const displayDuration = billableSeconds > 0 ? billableSeconds : wallClockSeconds;

  await Session.updateOne({ sessionId }, { endTime, duration: displayDuration * 1000, totalEarned: s.totalEarned || 0, totalDeducted: s.totalDeducted || 0, status: 'ended' });

  if (s.pairMonthId) {
    await PairMonth.updateOne({ _id: s.pairMonthId }, { $inc: { slabLockedAt: billableSeconds } });
  }

  if (billableSeconds > 0 && billableSeconds < 60) {
    await processBillingCharge(sessionId, 60, 1, 'first_60_full');
  } else if (billableSeconds >= 60) {
    const lastBilled = s.lastBilledMinute || 1;
    const totalMinutes = Math.ceil(billableSeconds / 60);
    for (let i = lastBilled + 1; i <= totalMinutes; i++) {
        await processBillingCharge(sessionId, 60, i, (i === totalMinutes && (billableSeconds % 60) !== 0) ? 'fraction' : 'slab');
    }
  }

  activeSessions.delete(sessionId);
  if (s.users) {
    s.users.forEach(u => {
      if (userActiveSession.get(u) === sessionId) userActiveSession.delete(u);
      if (sessionDisconnectTimeouts.has(u)) {
        clearTimeout(sessionDisconnectTimeouts.get(u));
        sessionDisconnectTimeouts.delete(u);
      }
    });
  }

  const payload = { reason: 'ended', summary: { deducted: s.totalDeducted || 0, earned: s.totalEarned || 0, duration: displayDuration } };
  if (s.clientId && ioInstance) ioInstance.to(s.clientId).emit('session-ended', payload);
  if (s.astrologerId && ioInstance) ioInstance.to(s.astrologerId).emit('session-ended', payload);

  s.users.forEach(async uid => {
    const u = await User.findOne({ userId: uid });
    if (u?.fcmToken) sendFcmV1Push(u.fcmToken, { type: 'CALL_ENDED', sessionId }, null);
  });

  User.updateMany({ userId: { $in: s.users }, role: 'astrologer' }, { isBusy: false }).then(() => broadcastAstroUpdate());
}

function tickSessions() {
  const now = Date.now();
  for (const [sessionId, session] of activeSessions) {
    if (!session.actualBillingStart || now < session.actualBillingStart) continue;

    const isClientConnected = userSockets.has(session.clientId);
    const isAstroConnected = userSockets.has(session.astrologerId);

    if (isClientConnected && isAstroConnected) {
      session.elapsedBillableSeconds = (session.elapsedBillableSeconds || 0) + 1;
      if (session.elapsedBillableSeconds === 60) processBillingCharge(sessionId, 60, 1, 'first_60_full');

      if (session.pairMonthId) {
        const calculatedSlab = getSlabBySeconds((session.initialPairSeconds || 0) + session.elapsedBillableSeconds);
        const effectiveSlab = Math.max(calculatedSlab, session.currentSlab || 0);
        if (effectiveSlab > session.currentSlab) {
          session.currentSlab = effectiveSlab;
          PairMonth.updateOne({ _id: session.pairMonthId }, { currentSlab: effectiveSlab }).exec();
        }
      }

      if (session.elapsedBillableSeconds > 60) {
        const totalShouldBeBilled = 1 + Math.floor((session.elapsedBillableSeconds - 60) / 60);
        if (totalShouldBeBilled > (session.lastBilledMinute || 1)) {
          processBillingCharge(sessionId, 60, totalShouldBeBilled, 'slab');
          session.lastBilledMinute = totalShouldBeBilled;
        }
      }
    }
  }
}

let tickInterval = null;
function startTicker() {
    if (tickInterval) clearInterval(tickInterval);
    tickInterval = setInterval(tickSessions, 1000);
}

async function handleUserConnection(sessionId, userId) {
  const session = await Session.findOne({ sessionId });
  if (!session) return;
  const now = Date.now();
  let updated = false;

  if (userId === session.clientId) {
    if (!session.clientConnectedAt) {
      session.clientConnectedAt = now;
      updated = true;
    }
  } else if (userId === session.astrologerId) {
    if (!session.astrologerConnectedAt) {
      session.astrologerConnectedAt = now;
      updated = true;
    }
  }

  if (updated) await session.save();

  if (session.clientConnectedAt && session.astrologerConnectedAt && !session.actualBillingStart) {
    const billingStart = Math.max(session.clientConnectedAt, session.astrologerConnectedAt) + 2000;
    session.actualBillingStart = billingStart;
    await session.save();

    const activeSession = activeSessions.get(sessionId);
    if (activeSession) {
      activeSession.actualBillingStart = billingStart;
      if (typeof activeSession.elapsedBillableSeconds === 'undefined') {
        activeSession.elapsedBillableSeconds = 0;
        activeSession.lastBilledMinute = 1;
        activeSession.clientId = session.clientId;
        activeSession.astrologerId = session.astrologerId;
        activeSession.currentSlab = 3;
        activeSession.totalDeducted = 0;
        activeSession.totalEarned = 0;
      }

      try {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const pairId = `${session.clientId}_${session.astrologerId}`;
        let pairRec = await PairMonth.findOne({ pairId, yearMonth: currentMonth });
        if (!pairRec) {
          pairRec = await PairMonth.create({ pairId, clientId: session.clientId, astrologerId: session.astrologerId, yearMonth: currentMonth, currentSlab: 3, slabLockedAt: 0 });
        }
        activeSession.pairMonthId = pairRec._id;
        activeSession.currentSlab = pairRec.currentSlab;
        activeSession.initialPairSeconds = pairRec.slabLockedAt || 0;
      } catch (e) { console.error('PairMonth Init Error', e); }
    }

    const client = await User.findOne({ userId: session.clientId });
    const astro = await User.findOne({ userId: session.astrologerId });
    const clientBalance = client?.walletBalance || 0;
    const ratePerMinute = astro?.price || 10;
    const availableMinutes = Math.floor(clientBalance / ratePerMinute);

    if (ioInstance) {
        ioInstance.to(session.clientId).emit('billing-started', { startTime: billingStart, clientBalance, availableMinutes });
        ioInstance.to(session.astrologerId).emit('billing-started', { startTime: billingStart, clientBalance, ratePerMinute, availableMinutes });
    }
  }
}

module.exports = { setIo, processBillingCharge, endSessionRecord, startTicker, handleUserConnection };
