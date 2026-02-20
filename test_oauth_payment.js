const fetch = require('node-fetch');
require('dotenv').config();

const CLIENT_ID = "SU2602141859249444980554";
const CLIENT_SECRET = "07bad376-5933-41d1-9a54-4b926e23e672";
const VERSION = "1";
const MERCHANT_ID = "M23VW0EJ3IVEK";

async function getAccessToken() {
    console.log("Getting OAuth Token...");
    const url = "https://api.phonepe.com/apis/identity-manager/v1/oauth/token";
    const params = new URLSearchParams();
    params.append('client_id', CLIENT_ID);
    params.append('client_version', VERSION);
    params.append('client_secret', CLIENT_SECRET);
    params.append('grant_type', 'client_credentials');

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
    });
    const data = await res.json();
    return data.access_token;
}

async function initiatePayment(token) {
    console.log("\nInitiating Payment with Token...");
    // Using the user-requested hermes URL
    const url = "https://api-preprod.phonepe.com/apis/hermes/pg/v1/pay";

    const payload = {
        merchantId: MERCHANT_ID,
        merchantTransactionId: "TXN_" + Date.now(),
        merchantUserId: "USER_TEST_99",
        amount: 100,
        redirectUrl: "https://astroluna.in/callback",
        redirectMode: "POST",
        callbackUrl: "https://astroluna.in/callback",
        mobileNumber: "9999999999",
        paymentInstrument: { type: "PAY_PAGE" }
    };

    const base64 = Buffer.from(JSON.stringify(payload)).toString('base64');

    try {
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

        const data = await res.json();
        console.log(`Status: ${res.status}`);
        console.log(`Data: ${JSON.stringify(data, null, 2)}`);

        if (data.success && data.data && data.data.instrumentResponse) {
            console.log("\n✅ SUCCESS! Payment URL:");
            console.log(data.data.instrumentResponse.redirectInfo.url);
        }
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
}

async function run() {
    const token = await getAccessToken();
    if (token) {
        await initiatePayment(token);
    } else {
        console.log("Failed to get token.");
    }
}

run();
