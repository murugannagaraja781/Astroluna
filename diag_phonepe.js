
const crypto = require('crypto');
const dotenv = require('dotenv');
const path = require('path');

// Load .env
dotenv.config({ path: path.join(__dirname, '.env') });

const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY;
const PHONEPE_SALT_INDEX = process.env.PHONEPE_SALT_INDEX;
const PHONEPE_HOST_URL = process.env.PHONEPE_HOST_URL || "https://api-preprod.phonepe.com/apis/pg-sandbox";

console.log("--- CONFIG ---");
console.log("Merchant ID:", PHONEPE_MERCHANT_ID);
console.log("Salt Key:", PHONEPE_SALT_KEY ? "EXISTS" : "MISSING");
console.log("Salt Index:", PHONEPE_SALT_INDEX);
console.log("Host URL:", PHONEPE_HOST_URL);
console.log("--------------\n");

const endpoints = [
    { name: "Hermes Live", url: "https://api.phonepe.com/apis/hermes/pg/v1/pay" },
    { name: "PG Live", url: "https://api.phonepe.com/apis/pg/v1/pay" },
    { name: "Global Live", url: "https://api.phonepe.com/pg/v1/pay" },
    { name: "Sandbox", url: "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay" }
];

const saltKeys = [
    { name: "User Provided (Decoded)", key: "fa9c8ed5-c266-4b51-bb40-7eff4e0e6fb1" },
    { name: "User Provided (Literal)", key: "ZmE5YzhlZDUtYzI2Ni00YjUxLWJiNDAtN2VmZjRlMGU2ZmIx" },
    { name: "From test_alt_key.js", key: "07bad376-5933-41d1-9a54-4b926e23e672" }
];

async function runTests() {
    console.log(`Merchant ID: ${PHONEPE_MERCHANT_ID}`);
    for (const sk of saltKeys) {
        console.log(`\n\n=== Testing Salt Key: ${sk.name} (${sk.key}) ===`);
        for (const ep of endpoints) {
            console.log(`\n--- ${ep.name}: ${ep.url} ---`);
            const result = await callPhonePePayInternal(ep.url, sk.key);
            if (result.error) {
                console.log("Error:", result.error);
            } else {
                console.log("Status:", result.status);
                console.log("Success:", result.success);
                console.log("Data:", JSON.stringify(result.data, null, 2));
            }
            if (result.success) {
                console.log(`\n✅ WORKING CONFIG FOUND!`);
                console.log(`Endpoint: ${ep.name}`);
                console.log(`Salt Key: ${sk.name}`);
                return;
            }
        }
    }
}

async function callPhonePePayInternal(fullUrl, saltKey) {
    const endpoint = "/pg/v1/pay";
    const testPayload = {
        merchantId: PHONEPE_MERCHANT_ID,
        merchantTransactionId: "DIAG_" + Date.now(),
        merchantUserId: "DIAG_USER",
        amount: 100,
        redirectUrl: "https://astroluna.in/api/payment/callback",
        redirectMode: "POST",
        callbackUrl: "https://astroluna.in/api/payment/callback",
        mobileNumber: "9999999999",
        paymentInstrument: { type: "PAY_PAGE" }
    };

    const base64Payload = Buffer.from(JSON.stringify(testPayload)).toString('base64');
    const stringToSign = base64Payload + endpoint + saltKey;
    const sha256 = crypto.createHash('sha256').update(stringToSign).digest('hex');
    const checksum = sha256 + "###" + PHONEPE_SALT_INDEX;

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': PHONEPE_MERCHANT_ID,
            'accept': 'application/json'
        },
        body: JSON.stringify({ request: base64Payload })
    };

    try {
        const response = await fetch(fullUrl, options);
        const data = await response.json();
        return { success: response.ok && data.success, data, status: response.status };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

runTests().then(() => process.exit(0));
