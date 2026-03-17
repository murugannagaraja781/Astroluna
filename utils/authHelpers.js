const crypto = require('crypto');
const https = require('https');
const { User } = require('../models');

async function generateReferralCode(userName) {
  const prefix = userName.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'A');
  const random = crypto.randomBytes(2).toString('hex').toUpperCase();
  const code = `${prefix}${random}`;

  const exists = await User.findOne({ referralCode: code });
  if (exists) return generateReferralCode(userName);
  return code;
}

function sendMsg91(phoneNumber, otp) {
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const mobile = `91${cleanPhone}`;
  const authKey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_TEMPLATE_ID;

  const path = `/api/v5/otp?otp_expiry=5&template_id=${templateId}&mobile=${mobile}&authkey=${authKey}&realTimeResponse=1&otp=${otp}`;

  const options = {
    method: 'POST',
    hostname: 'control.msg91.com',
    path: path,
    headers: {
      'content-type': 'application/json'
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => console.log('MSG91 Result:', data));
  });

  req.on('error', (e) => console.error('MSG91 Error:', e));
  req.write('{}');
  req.end();
}

module.exports = { generateReferralCode, sendMsg91 };
