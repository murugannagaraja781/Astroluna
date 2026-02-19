
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

async function callPhonePePay(payload) {
    const endpoint = "/pg/v1/pay";
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    let host = PHONEPE_HOST_URL.trim().replace(/\/$/, "");
    const fullUrl = `${host}${endpoint}`;

    const stringToSign = base64Payload + endpoint + PHONEPE_SALT_KEY;
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

    console.log(`[PhonePe] Standard Init: ${fullUrl}`);

    try {
        const response = await fetch(fullUrl, options);
        const data = await response.json();
        return { success: response.ok && data.success, data, status: response.status };
    } catch (err) {
        console.error("Fetch Error:", err);
        return { success: false, error: err.message };
    }
}

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

callPhonePePay(testPayload).then(res => {
    console.log("\n--- RESULT ---");
    console.log("Status:", res.status);
    console.log("Success:", res.success);
    console.log("Data:", JSON.stringify(res.data, null, 2));
    if (res.error) console.log("Error:", res.error);
    process.exit(0);
}).catch(err => {
    console.error("Fatal Error:", err);
    process.exit(1);
});
