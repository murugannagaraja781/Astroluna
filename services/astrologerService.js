const { User } = require('../models');

let ioInstance = null;

function setIo(io) {
    ioInstance = io;
}

async function broadcastAstroUpdate() {
  try {
    const astros = await User.find(
      { role: 'astrologer' },
      'userId name isOnline isChatOnline isAudioOnline isVideoOnline isAvailable isBusy price image skills experience rating isVerified phone'
    ).lean();

    if (ioInstance) ioInstance.emit('astrologer-update', astros);
  } catch (e) {
    console.error('Error broadcasting astro updates:', e);
  }
}

module.exports = { setIo, broadcastAstroUpdate };
