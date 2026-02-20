const fetch = require('node-fetch');
const crypto = require('crypto');
require('dotenv').config();

const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || "M23VW0EJ3IVEK";
const SALT_KEY = process.env.PHONEPE_SALT_KEY || "07bad376-5933-41d1-9a54-4b926e23e672";
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || "1";

const clusters = [
    "https://api.phonepe.com/apis/hermes",
    "https://api.phonepe.com/apis/pg",
    "https://api.phonepe.com/shasta" // Another common one
];

async function runTest() {
    console.log("Testing Checksum-ONLY Flow (Standard Production)...");
    for (const cluster of clusters) {
        const path = "/pg/v1/pay";
        const fullUrl = `${cluster}${path}`;
        console.log(`\nTesting URL: ${fullUrl}`);

        const payload = {
            merchantId: MERCHANT_ID,
            merchantTransactionId: "TXN_" + Date.now(),
            merchantUserId: "USER_123",
            amount: 100,
            redirectUrl: "https://astroluna.in/callback",
            redirectMode: "POST", // Many prod clusters prefer POST
            callbackUrl: "https://astroluna.in/callback",
            mobileNumber: "9999999999",
            paymentInstrument: { type: "PAY_PAGE" }
        };

        const base64 = Buffer.from(JSON.stringify(payload)).toString('base64');
        const stringToSign = base64 + path + SALT_KEY;
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

            const text = await res.text();
            console.log(`Status: ${res.status}`);
            try {
                const data = JSON.parse(text);
                console.log(`Response: ${JSON.stringify(data)}`);
            } catch (e) {
                console.log(`Not JSON: ${text.substring(0, 100)}`);
            }
        } catch (err) {
            console.log(`Error: ${err.message}`);
        }
    }
}

runTest();
