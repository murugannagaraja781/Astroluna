const crypto = require('crypto');
const fetch = require('node-fetch');
require('dotenv').config();

// Use credentials from updated .env
const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const SALT_KEY = process.env.PHONEPE_SALT_KEY;
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX;
const API_URL = process.env.PHONEPE_HOST_URL; // This is https://api-preprod.phonepe.com/apis/hermes

const testPayload = {
    merchantId: MERCHANT_ID,
    merchantTransactionId: "TXN_" + Math.floor(Math.random() * 1000000),
    merchantUserId: "USER_" + Math.floor(Math.random() * 1000),
    amount: 100, // 100 paise = 1 INR
    redirectUrl: "https://yourdomain.com/callback",
    redirectMode: "REDIRECT",
    callbackUrl: "https://yourdomain.com/callback",
    mobileNumber: "9999999999",
    paymentInstrument: {
        type: "PAY_PAGE"
    }
};

const base64Payload = Buffer.from(JSON.stringify(testPayload)).toString('base64');
const signingPath = "/pg/v1/pay";

async function testPayment(url) {
    const fullUrl = `${url}${signingPath}`;
    const stringToSign = base64Payload + signingPath + SALT_KEY;
    const sha256 = crypto.createHash('sha256').update(stringToSign).digest('hex');
    const checksum = sha256 + "###" + SALT_INDEX;

    console.log(`Checking URL: ${fullUrl}`);

    try {
        const response = await fetch(fullUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
                'X-MERCHANT-ID': MERCHANT_ID,
                'accept': 'application/json'
            },
            body: JSON.stringify({ request: base64Payload })
        });

        const data = await response.json();
        console.log("Response Data:", JSON.stringify(data));

        if (data.success) {
            console.log("✅ SUCCESS!");
            return true;
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
    return false;
}

async function testOAuth(url) {
    console.log(`\n--- Testing OAuth on: ${url} ---`);
    const oauthUrl = `${url}/v1/oauth/token`;
    const params = new URLSearchParams();
    params.append('client_id', process.env.PHONEPE_CLIENT_ID);
    params.append('client_version', process.env.PHONEPE_CLIENT_VERSION);
    params.append('client_secret', process.env.PHONEPE_CLIENT_SECRET);
    params.append('grant_type', 'client_credentials');

    try {
        const response = await fetch(oauthUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        });
        const text = await response.text();
        console.log("Status:", response.status);
        console.log("Data:", text);
        if (response.ok) return true;
    } catch (e) {
        console.error("OAuth Error:", e.message);
    }
    return false;
}

async function runTests() {
    console.log("--- TRYING CHECKSUM METHOD ---");
    await testPayment("https://api-preprod.phonepe.com/apis/hermes");
    await testPayment("https://api-preprod.phonepe.com/apis/pg-sandbox");

    console.log("\n--- TRYING OAUTH METHOD ---");
    await testOAuth("https://api-preprod.phonepe.com/apis/hermes");
    await testOAuth("https://api-preprod.phonepe.com/apis/pg-sandbox");
}

runTests();
