const fetch = require('node-fetch');
require('dotenv').config();

const CLIENT_ID = process.env.PHONEPE_CLIENT_ID || "SU2602141859249444980554";
const CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET || "07bad376-5933-41d1-9a54-4b926e23e672";
const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || "M23VW0EJ3IVEK";

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
    console.log("Token acquired.");

    const endpoints = [
        "https://api.phonepe.com/apis/hermes/v1/pay",
        "https://api.phonepe.com/apis/hermes/pg/v1/pay",
        "https://api.phonepe.com/apis/pg-sandbox/pg/v1/pay",
        "https://api-preprod.phonepe.com/apis/hermes/pg/v1/pay"
    ];

    for (const url of endpoints) {
        console.log(`\n--- Testing: ${url} ---`);
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

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-MERCHANT-ID': MERCHANT_ID,
                'accept': 'application/json'
            },
            body: JSON.stringify({ request: base64 })
        });
        const text = await res.text();
        console.log(`Status: ${res.status}`);
        console.log(`Body: ${text.substring(0, 200)}`);
    }
}

run();
