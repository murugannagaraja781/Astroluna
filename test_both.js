const fetch = require('node-fetch');
const crypto = require('crypto');
require('dotenv').config();

const CLIENT_ID = process.env.PHONEPE_CLIENT_ID || "SU2602141859249444980554";
const CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET || "07bad376-5933-41d1-9a54-4b926e23e672";
const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || "M23VW0EJ3IVEK";
const SALT_KEY = process.env.PHONEPE_SALT_KEY || "07bad376-5933-41d1-9a54-4b926e23e672";
const SALT_INDEX = "1";

const oauthUrl = "https://api.phonepe.com/apis/identity-manager/v1/oauth/token";

async function run() {
    console.log("Fetching token...");
    const params = new URLSearchParams();
    params.append('client_id', CLIENT_ID);
    params.append('client_version', '1');
    params.append('client_secret', CLIENT_SECRET);
    params.append('grant_type', 'client_credentials');

    const authRes = await fetch(oauthUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
    });
    const authData = await authRes.json();
    const token = authData.access_token;

    const url = "https://api-preprod.phonepe.com/apis/hermes/pg/v1/pay";
    const path = "/pg/v1/pay";

    console.log(`\nTesting: ${url} with BOTH Hash and Token...`);
    const payload = {
        merchantId: MERCHANT_ID,
        merchantTransactionId: "TXN" + Date.now(),
        merchantUserId: "U123",
        amount: 100,
        redirectUrl: "https://astroluna.in",
        redirectMode: "REDIRECT",
        callbackUrl: "https://astroluna.in",
        mobileNumber: "9999999999",
        paymentInstrument: { type: "PAY_PAGE" }
    };
    const base64 = Buffer.from(JSON.stringify(payload)).toString('base64');
    const stringToSign = base64 + path + SALT_KEY;
    const checksum = crypto.createHash('sha256').update(stringToSign).digest('hex') + "###" + SALT_INDEX;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': MERCHANT_ID,
            'accept': 'application/json'
        },
        body: JSON.stringify({ request: base64 })
    });
    const text = await res.text();
    console.log(`Status: ${res.status}`);
    console.log(`Body: ${text}`);
}

run();
