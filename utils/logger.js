const fs = require('fs');

function logActivity(type, message, details = null) {
  const timestamp = new Date().toISOString();
  let logStr = `\n[${timestamp}] [ACTIVITY] [${type.toUpperCase()}] ${message}`;
  if (details) {
    if (typeof details === 'object') {
      logStr += ` | Data: ${JSON.stringify(details)}`;
    } else {
      logStr += ` | Data: ${details} `;
    }
  }
  console.log(logStr);

  try {
    fs.appendFileSync('activity.log', logStr + '\n');
  } catch (err) {
    // console.error('Failed to write to activity.log');
  }
}

module.exports = { logActivity };
