const crypto = require('crypto');
const fetch = require('node-fetch');
require('dotenv').config();

const MERCHANT_ID = "M23VW0EJ3IVEK";
const SALT_KEY = "07bad376-5933-41d1-9a54-4b926e23e672";
const SALT_INDEX = "1";

console.log("Testing with Salt Key from test_phonepe.js:", SALT_KEY);

const testPayload = {
    merchantId: MERCHANT_ID,
    merchantTransactionId: "TEST_" + Date.now(),
    merchantUserId: "TEST_USER",
    amount: 100, // 1 Re
    redirectUrl: "https://astroluna.in/api/callback",
    redirectMode: "POST",
    callbackUrl: "https://astroluna.in/api/callback",
    mobileNumber: "9999999999",
    paymentInstrument: { type: "PAY_PAGE" }
};

const base64Payload = Buffer.from(JSON.stringify(testPayload)).toString('base64');

async function testUrl(fullUrl, signingPath) {
    const stringToSign = base64Payload + signingPath + SALT_KEY;
    const sha256 = crypto.createHash('sha256').update(stringToSign).digest('hex');
    const checksum = sha256 + "###" + SALT_INDEX;

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
        console.log(`URL: ${fullUrl}`);
        console.log(`SignPath: ${signingPath}`);
        console.log(`Status: ${response.status}`);
        console.log(`Result: ${JSON.stringify(data)}`);
        console.log('---');
        return data.success;
    } catch (e) {
        console.log(`FAILED: ${fullUrl} - ${e.message}`);
        return false;
    }
}

async function runTests() {
    // Test 1: Standard Migrated (Probable)
    await testUrl("https://api.phonepe.com/apis/pg/v1/pay", "/pg/v1/pay");

    // Test 3: Hermes (Classic)
    await testUrl("https://api.phonepe.com/apis/hermes/pg/v1/pay", "/pg/v1/pay");
}

runTests();
