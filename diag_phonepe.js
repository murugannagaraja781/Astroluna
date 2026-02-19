const crypto = require('crypto');
const dotenv = require('dotenv');
const path = require('path');
const fetch = require('node-fetch');

// Load .env
dotenv.config({ path: path.join(__dirname, '.env') });

const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;

console.log("--- CONFIG ---");
console.log("Merchant ID:", PHONEPE_MERCHANT_ID);
console.log("--------------\n");

const endpoints = [
    { name: "Hermes", url: "https://api.phonepe.com/apis/hermes/pg/v1/pay" },
    { name: "Standard PG", url: "https://api.phonepe.com/apis/pg/v1/pay" },
    { name: "Standard Cluster", url: "https://api.phonepe.com/apis/standard/pg/v1/pay" },
    { name: "Standard Prod", url: "https://api.phonepe.com/apis/standard-prod/pg/v1/pay" },
    { name: "Prod-App", url: "https://api.phonepe.com/apis/prod-app/pg/v1/pay" }
];

const saltKeys = [
    { name: "Decoded GUID", key: "fa9c8ed5-c266-4b51-bb40-7eff4e0e6fb1" },
    { name: "GUID No Dashes", key: "fa9c8ed5c2664b51bb407eff4e0e6fb1" }
];

async function runTests() {
    console.log(`Merchant ID: ${PHONEPE_MERCHANT_ID}`);
    console.log("Starting Exhaustive Hardware/Cluster Mapping Check...");

    for (const sk of saltKeys) {
        for (const idx of [1, 2]) {
            console.log(`\n--- Testing Salt Key: ${sk.name} | Index: ${idx} ---`);
            for (const ep of endpoints) {
                const result = await callPhonePePayInternal(ep.url, sk.key, idx);

                let statusStr = result.status || "ERROR";
                let errorMsg = result.error || (result.data ? (result.data.message || result.data.code) : "Unknown");

                if (result.success) {
                    console.log(`\n✅ SUCCESS FOUND!`);
                    console.log(`Endpoint: ${ep.name} (${ep.url})`);
                    console.log(`Salt Index: ${idx}`);
                    console.log(`Salt Key: ${sk.name}`);
                    return;
                } else {
                    console.log(`  [${ep.name}] ${statusStr}: ${errorMsg}`);
                }
            }
        }
    }
    console.log("\n⚠️ No working combination found. Account might not be active or needs a custom cluster URL.");
}

async function callPhonePePayInternal(fullUrl, saltKey, saltIndex) {
    const endpointPath = "/pg/v1/pay";
    const testPayload = {
        merchantId: PHONEPE_MERCHANT_ID,
        merchantTransactionId: "DIAG_" + Date.now(),
        merchantUserId: "DIAG_USER",
        amount: 100, // 1 Rupee
        redirectUrl: "https://astroluna.in/api/payment/callback",
        redirectMode: "POST",
        callbackUrl: "https://astroluna.in/api/payment/callback",
        mobileNumber: "9999999999",
        paymentInstrument: { type: "PAY_PAGE" }
    };

    const base64Payload = Buffer.from(JSON.stringify(testPayload)).toString('base64');
    const stringToSign = base64Payload + endpointPath + saltKey;
    const sha256 = crypto.createHash('sha256').update(stringToSign).digest('hex');
    const checksum = sha256 + "###" + saltIndex;

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
        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            return { success: false, status: response.status, error: "Non-JSON response" };
        }
        return { success: response.ok && data.success, data, status: response.status };
    } catch (err) {
        return { success: false, error: err.message, status: "FETCH_ERROR" };
    }
}

runTests().then(() => process.exit(0));
