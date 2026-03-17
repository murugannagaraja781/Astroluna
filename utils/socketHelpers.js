function safeAck(cb, data) {
  if (typeof cb === 'function') {
    try {
      cb(data);
    } catch (e) {
      console.error('Ack error', e);
    }
  }
}

function getOtherUserIdFromSession(sessionId, myUserId, activeSessions) {
  const s = activeSessions.get(sessionId);
  if (!s || !s.users) return null;
  return s.users.find(u => u !== myUserId);
}

module.exports = { safeAck, getOtherUserIdFromSession };
