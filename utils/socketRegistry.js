// Ephemeral in-memory registry for socket connections and sessions
const userSockets = new Map(); // userId -> socketId
const socketToUser = new Map(); // socketId -> userId
const userActiveSession = new Map(); // userId -> sessionId
const activeSessions = new Map(); // sessionId -> { type, users... }
const pendingMessages = new Map();

// Astrologer Status Persistence
const offlineTimeouts = new Map(); // userId -> timeoutId
const savedAstroStatus = new Map(); // userId -> { chat, audio, video, timestamp }

// Session Disconnect Persistence
const sessionDisconnectTimeouts = new Map(); // userId -> timeoutId

module.exports = {
    userSockets,
    socketToUser,
    userActiveSession,
    activeSessions,
    pendingMessages,
    offlineTimeouts,
    savedAstroStatus,
    sessionDisconnectTimeouts
};
