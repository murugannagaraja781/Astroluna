const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { User, Payment } = require('../models');
const { logActivity } = require('../utils/logger');
const { callPhonePePayV2, checkPhonePeOrderStatus } = require('../utils/paymentHelpers');
const { userSockets } = require('../utils/socketRegistry');
const { paymentTokens } = require('../utils/registry');
const { sendFcmV1Push } = require('../services/fcmService');

// Token cleanup interval
setInterval(() => {
  const now = Date.now();
  const expiryTime = 10 * 60 * 1000;
  for (const [token, data] of paymentTokens) {
    if (now - data.createdAt > expiryTime) {
      paymentTokens.delete(token);
    }
  }
}, 5 * 60 * 1000);

// Helper: Process payment result
async function processPaymentResult(req, merchantTransactionId, isSuccess, providerReferenceId, isApp, res) {
  const payment = await Payment.findOne({
    $or: [
      { transactionId: merchantTransactionId },
      { merchantTransactionId: merchantTransactionId }
    ]
  });

  if (!payment) {
    console.error('Payment not found for:', merchantTransactionId);
    return res.redirect('/payment.html?status=fail&reason=not_found');
  }

  const redirectIsApp = isApp || payment.isApp;

  if (isSuccess) {
    if (payment.status !== 'success') {
      payment.status = 'success';
      payment.providerRefId = providerReferenceId || '';
      await payment.save();

      const user = await User.findOne({ userId: payment.userId });
      if (user) {
        const creditAmount = Math.round(payment.amount / 1.18);
        user.walletBalance += creditAmount;
        await user.save();

        const io = req.app.get('io');
        const sId = userSockets.get(user.userId);
        if (sId && io) {
          io.to(sId).emit('wallet-update', {
            balance: user.walletBalance,
            totalEarnings: user.totalEarnings
          });
          io.to(sId).emit('app-notification', { text: `✅ Recharge Successful! +₹${creditAmount} (Excl. 18% GST)` });
        }

        // Send FCM notification for deposit (red color big font on Android)
        if (user.fcmToken) {
          sendFcmV1Push(
            user.fcmToken,
            {
              type: 'DEPOSIT',
              amount: creditAmount.toString(),
              title: 'Deposit Successful',
              action: 'OPEN_WALLET'
            },
            {
              title: '💰 Deposit Successful!',
              body: `₹${creditAmount} has been added to your wallet`
            },
            user.userId
          );
        }
      }
    }

    if (redirectIsApp) {
      return res.redirect(`/payment.html?status=success&amount=${payment.amount || ''}&txnId=${merchantTransactionId || ''}`);
    }
    return res.redirect(`/payment.html?status=success&amount=${payment.amount}`);
  } else {
    if (payment.status !== 'success') {
      payment.status = 'failed';
      await payment.save();
    }
    if (redirectIsApp) return res.redirect('/payment.html?status=fail');
    return res.redirect(`/payment.html?status=failure`);
  }
}

// Routes
router.post('/token', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    if (!userId || !amount) return res.json({ ok: false, error: 'Missing userId or amount' });
    if (amount < 1) return res.json({ ok: false, error: 'Minimum amount is ₹1' });

    const user = await User.findOne({ userId });
    if (!user) return res.json({ ok: false, error: 'User not found' });

    const baseAmountValue = parseFloat(amount);
    const gstValue = Math.round(baseAmountValue * 0.18 * 100) / 100;
    const totalAmountValue = Math.round((baseAmountValue + gstValue) * 100) / 100;

    const token = crypto.randomBytes(32).toString('hex');
    paymentTokens.set(token, {
      userId,
      amount: totalAmountValue,
      baseAmount: baseAmountValue,
      gst: gstValue,
      createdAt: Date.now(),
      used: false,
      userName: user.name,
      userPhone: user.phone
    });

    res.json({ ok: true, token, baseAmount: baseAmountValue, totalAmount: totalAmountValue, gst: gstValue });
  } catch (e) {
    res.json({ ok: false, error: 'Failed to create payment token' });
  }
});

router.get('/verify-token', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.json({ valid: false, error: 'Token required' });

  const tokenData = paymentTokens.get(token);
  if (!tokenData) return res.json({ valid: false, error: 'Invalid or expired token' });

  const expiryTime = 10 * 60 * 1000;
  if (Date.now() - tokenData.createdAt > expiryTime) {
    paymentTokens.delete(token);
    return res.json({ valid: false, error: 'Token expired' });
  }
  if (tokenData.used) return res.json({ valid: false, error: 'Token already used' });

  res.json({
    valid: true,
    amount: tokenData.amount,
    baseAmount: tokenData.baseAmount,
    gst: tokenData.gst,
    userName: tokenData.userName,
    expiresIn: Math.floor((expiryTime - (Date.now() - tokenData.createdAt)) / 1000)
  });
});

router.post('/create', async (req, res) => {
  try {
    let { amount, userId, isApp, token } = req.body;
    if (token) {
      const tokenData = paymentTokens.get(token);
      if (!tokenData || tokenData.used || (Date.now() - tokenData.createdAt > 600000)) {
        return res.json({ ok: false, error: 'Token invalid or expired' });
      }
      tokenData.used = true;
      userId = tokenData.userId;
      amount = tokenData.amount;
    }

    if (!amount || !userId) return res.json({ ok: false, error: 'Missing Amount or User' });

    if (!token) {
      const baseAmt = parseFloat(amount);
      const gst = Math.round(baseAmt * 0.18 * 100) / 100;
      amount = Math.round((baseAmt + gst) * 100) / 100;
    }

    const userObj = await User.findOne({ userId });
    const userMobile = (userObj?.phone || "9999999999").replace(/[^0-9]/g, '').slice(-10);

    const merchantTransactionId = "MT" + Date.now() + Math.floor(Math.random() * 1000);
    const callbackRedirectUrl = `https://astroluna.in/api/payment/callback?txnId=${merchantTransactionId}${isApp ? '&isApp=true' : ''}`;

    await Payment.create({
      transactionId: merchantTransactionId,
      merchantTransactionId,
      userId,
      amount,
      status: 'pending',
      isApp: !!isApp
    });

    const phonepeResult = await callPhonePePayV2(merchantTransactionId, Math.round(amount * 100), callbackRedirectUrl, userMobile);

    if (phonepeResult.success) {
      res.json({ ok: true, payload: { ...phonepeResult.data, paymentUrl: phonepeResult.data.redirectUrl, useWebFlow: true } });
    } else {
      res.json({ ok: false, error: phonepeResult.data?.message || 'Payment Init Failed' });
    }
  } catch (e) {
    res.json({ ok: false, error: 'Internal Error' });
  }
});

router.all('/callback', async (req, res) => {
  try {
    const merchantTransactionId = req.query.txnId || req.body.merchantTransactionId;
    const isApp = req.query.isApp === 'true';

    if (merchantTransactionId) {
      const statusResult = await checkPhonePeOrderStatus(merchantTransactionId);
      const isSuccess = statusResult.state === 'COMPLETED';
      const providerRefId = statusResult.data?.paymentDetails?.[0]?.providerReferenceId || '';
      return await processPaymentResult(req, merchantTransactionId, isSuccess, providerRefId, isApp, res);
    }

    // Fallback for direct callback body (v1 logic if any remains)
    if (req.body.response) {
      const decoded = JSON.parse(Buffer.from(req.body.response, 'base64').toString('utf-8'));
      const isSuccess = decoded.code === 'PAYMENT_SUCCESS';
      return await processPaymentResult(req, decoded.data.merchantTransactionId, isSuccess, decoded.data.providerReferenceId, isApp, res);
    }

    res.status(200).json({ ok: true });
  } catch (e) {
    res.redirect('/?status=error');
  }
});

module.exports = router;
