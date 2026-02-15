const crypto = require('crypto');
require('dotenv').config();

/**
 * 1 Rs Payment Test Script (All Scenarios)
 */

const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || "M23VW0EJ3IVEK";
const SALT_KEY = process.env.PHONEPE_SALT_KEY;
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || "1";

const amount = 100; // 100 Paise = 1 Rupee

const scenarios = [
    { name: "Hermes Cluster (Standard)", host: "https://api.phonepe.com/apis/hermes" },
    { name: "PG Cluster (Newer accounts)", host: "https://api.phonepe.com/apis/pg" },
    { name: "Sandbox Cluster (Testing)", host: "https://api-preprod.phonepe.com/apis/pg-sandbox" }
];

async function tryPayment(scenario) {
    console.log(`\n--- Trying Scenario: ${scenario.name} ---`);
    const endpoint = "/pg/v1/pay";
    const txnId = "TEST_" + Date.now();

    const payload = {
        merchantId: MERCHANT_ID,
        merchantTransactionId: txnId,
        merchantUserId: "TEST_USER_1",
        amount: amount,
        redirectUrl: "https://astroluna.in/wallet",
        redirectMode: "POST",
        callbackUrl: "https://astroluna.in/api/payment/callback",
        mobileNumber: "9999999999",
        paymentInstrument: { type: "PAY_PAGE" }
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const stringToSign = base64Payload + endpoint + SALT_KEY;
    const sha256 = crypto.createHash('sha256').update(stringToSign).digest('hex');
    const checksum = sha256 + "###" + SALT_INDEX;

    const fullUrl = `${scenario.host}${endpoint}`;

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

        if (response.ok && data.success) {
            console.log(`✅ SUCCESS! Found a working path.`);
            console.log(`URL for 1 Rs Payment: ${data.data.instrumentResponse.redirectInfo.url}`);
            return true;
        } else {
            console.log(`❌ FAILED: ${scenario.name}`);
            console.log(`Status: ${response.status}`);
            console.log(`Code: ${data.code || "N/A"}`);
            console.log(`Msg: ${data.message || "N/A"}`);
            return false;
        }
    } catch (err) {
        console.log(`⚠️ ERROR: ${err.message}`);
        return false;
    }
}

async function runAll() {
    console.log("Starting 1 Rs PhonePe Test...");
    console.log(`MID: ${MERCHANT_ID}`);
    console.log(`Salt Key (Length): ${SALT_KEY ? SALT_KEY.length : 0} chars`);

    let success = false;

    // Try Scenario 1
    success = await tryPayment(scenarios[0]);

    if (!success) {
        // Try Scenario 2
        success = await tryPayment(scenarios[1]);
    }

    if (!success) {
        // Try Scenario 3
        success = await tryPayment(scenarios[2]);
    }

    if (success) {
        console.log("\n==============================================");
        console.log("FINAL RESULT: Payment Link Generated Successfully!");
        console.log("==============================================\n");
    } else {
        console.log("\n==============================================");
        console.log("FINAL RESULT: All scenarios failed.");
        console.log("Please check if SALT_KEY and MERCHANT_ID are valid Live credentials.");
        console.log("==============================================\n");
    }
}

runAll();
