const fetch = require('node-fetch');
require('dotenv').config();

// Production Credentials from your .env
const CLIENT_ID = process.env.PHONEPE_CLIENT_ID || "SU2602141859249444980554";
const CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET || "07bad376-5933-41d1-9a54-4b926e23e672";
const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || "M23VW0EJ3IVEK";

const oauthUrl = "https://api.phonepe.com/apis/identity-manager/v1/oauth/token";

const clusters = [
    "https://api.phonepe.com/apis/hermes",
    "https://api.phonepe.com/apis/pg",
    "https://api.phonepe.com/apis/v1",
    "https://api.phonepe.com/apis/prod",
    "https://api-preprod.phonepe.com/apis/hermes",
    "https://api-preprod.phonepe.com/apis/pg-sandbox"
];

async function runTest() {
    console.log("1. Fetching OAuth Token...");
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

    if (!token) {
        console.error("❌ Failed to get OAuth token:", authData);
        return;
    }
    console.log("✅ GOT TOKEN:", token.substring(0, 20) + "...");

    console.log("\n2. Testing Clusters...");
    for (const cluster of clusters) {
        const fullUrl = `${cluster}/pg/v1/pay`;
        console.log(`\nTesting Cluster: ${fullUrl}`);

        const payload = {
            merchantId: MERCHANT_ID,
            merchantTransactionId: "TEST_" + Date.now(),
            merchantUserId: "USER_123",
            amount: 100, // 1 Rupee
            redirectUrl: "https://astroluna.in/callback",
            redirectMode: "REDIRECT",
            callbackUrl: "https://astroluna.in/callback",
            mobileNumber: "9999999999",
            paymentInstrument: { type: "PAY_PAGE" }
        };

        const base64 = Buffer.from(JSON.stringify(payload)).toString('base64');

        try {
            const res = await fetch(fullUrl, {
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
            try {
                const data = JSON.parse(text);
                console.log(`Response: ${JSON.stringify(data)}`);
                if (data.success) {
                    console.log("⭐⭐⭐⭐ WORKING CLUSTER FOUND! ⭐⭐⭐⭐");
                    console.log(`URL: ${cluster}`);
                }
            } catch (e) {
                console.log(`Response is NOT JSON (HTML Error Page). First 100 chars: ${text.substring(0, 100).replace(/\n/g, '')}`);
            }
        } catch (err) {
            console.error(`Error: ${err.message}`);
        }
    }
}

runTest();
