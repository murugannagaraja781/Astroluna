const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const FCM_PROJECT_ID = 'astroluna-76da1';
let callApp = null;

try {
  const serviceAccountPath = path.join(__dirname, '../firebase-service-account.json');

  if (fs.existsSync(serviceAccountPath)) {
    const firebaseServiceAccount = require(serviceAccountPath);
    callApp = admin.initializeApp({
      credential: admin.credential.cert(firebaseServiceAccount)
    }, 'callApp');
    console.log('✓ FCM Service: Firebase Admin SDK initialized');
  } else {
    console.warn('✗ FCM Service: Service account file not found');
  }
} catch (error) {
  console.warn('✗ FCM Service: Failed to initialize Firebase Admin SDK', error.message);
}

async function sendFcmV1Push(fcmToken, data, notification) {
  if (!callApp) {
    console.warn('[FCM] Firebase Admin not initialized');
    return { success: false, error: 'Firebase not initialized' };
  }

  try {
    const stringData = {};
    if (data) {
      for (const [key, value] of Object.entries(data)) {
        stringData[key] = String(value || '');
      }
    }
    if (notification) {
      stringData.title = notification.title || '';
      stringData.body = notification.body || '';
    }

    const message = {
      token: fcmToken,
      data: stringData,
      android: {
        priority: 'high',
        ttl: 0
      }
    };

    const result = await callApp.messaging().send(message);
    return { success: true, result };
  } catch (err) {
    console.error('[FCM] Send Error:', err.message);
    return { success: false, error: err.message };
  }
}

const { User } = require('../models');

async function sendChatMessagePush(toUserId, fromUserId, messageText, sessionId, messageId) {
  try {
    const toUser = await User.findOne({ userId: toUserId });
    const fromUser = await User.findOne({ userId: fromUserId });

    if (toUser?.fcmToken) {
      const payload = {
        type: 'CHAT_MESSAGE',
        sessionId: sessionId || '',
        callerName: fromUser?.name || 'Astrologer',
        callerId: fromUserId,
        text: (messageText || 'New message').substring(0, 200),
        messageId: messageId || Date.now().toString(),
        timestamp: Date.now().toString()
      };
      await sendFcmV1Push(toUser.fcmToken, payload, null);
    }
  } catch (e) {
    console.error('Chat Push Error:', e);
  }
}

async function sendChatPush(toUserId, fromUserId, messageText, sessionId) {
  try {
    const toUser = await User.findOne({ userId: toUserId });
    const fromUser = await User.findOne({ userId: fromUserId });

    if (toUser?.fcmToken) {
       const payload = {
          type: 'INCOMING_CALL',
          callType: 'chat',
          sessionId: sessionId || `chat_${Date.now()}`,
          callerName: fromUser?.name || 'Client',
          callerId: fromUserId,
          body: messageText.substring(0, 100),
          timestamp: Date.now().toString()
       };
       const notification = { title: `Message from ${fromUser?.name}`, body: messageText.substring(0, 100) };
       await sendFcmV1Push(toUser.fcmToken, payload, notification);
    }
  } catch (e) { console.error('Chat Push Error:', e); }
}

module.exports = { sendFcmV1Push, sendChatMessagePush, sendChatPush };
