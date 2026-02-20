const crypto = require('crypto');
const fetch = require('node-fetch');
require('dotenv').config();

const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const SALT_KEY = process.env.PHONEPE_SALT_KEY;
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX;

const endpoints = [
    "https://api-preprod.phonepe.com/apis/hermes",
    "https://api-preprod.phonepe.com/apis/pg-sandbox",
    "https://api.phonepe.com/apis/pg",
    "https://api.phonepe.com/apis/hermes",
    "https://api-preprod.phonepe.com/pg/v1/pay", // Testing if it should be prepended
    "https://mercury-uat.phonepe.com/enterprise-api" // Some UATs
];

async function check(url) {
    const signingPath = "/pg/v1/pay";
    const fullUrl = url.endsWith("/pg/v1/pay") ? url : `${url}${signingPath}`;

    const payload = {
        merchantId: MERCHANT_ID,
        merchantTransactionId: "TXN_" + Date.now(),
        merchantUserId: "USER_123",
        amount: 100,
        redirectUrl: "https://astroluna.in/callback",
        redirectMode: "POST",
        callbackUrl: "https://astroluna.in/callback",
        mobileNumber: "9999999999",
        paymentInstrument: { type: "PAY_PAGE" }
    };

    const base64 = Buffer.from(JSON.stringify(payload)).toString('base64');
    const stringToSign = base64 + signingPath + SALT_KEY;
    const checksum = crypto.createHash('sha256').update(stringToSign).digest('hex') + "###" + SALT_INDEX;

    try {
        const res = await fetch(fullUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
                'X-MERCHANT-ID': MERCHANT_ID,
                'accept': 'application/json'
            },
            body: JSON.stringify({ request: base64 })
        });
        const data = await res.json();
        console.log(`[${url}] Status: ${res.status}, Code: ${data.code}, Msg: ${data.message}`);
        return data.success;
    } catch (e) {
        console.log(`[${url}] Error: ${e.message}`);
    }
}

async function run() {
    console.log("Starting Exhaustive URL Check...");
    for (const ep of endpoints) {
        await check(ep);
    }
}

run();
