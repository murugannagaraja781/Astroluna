const crypto = require('crypto');
const fetch = require('node-fetch');

const MERCHANT_ID = "PGTESTPAYUAT";
const SALT_KEY = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
const SALT_INDEX = "1";
const fullUrl = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

const testPayload = {
    merchantId: MERCHANT_ID,
    merchantTransactionId: "TXN_" + Date.now(),
    merchantUserId: "TEST_USER",
    amount: 100,
    redirectUrl: "https://astroluna.in/",
    redirectMode: "REDIRECT",
    callbackUrl: "https://astroluna.in/",
    mobileNumber: "9999999999",
    paymentInstrument: { type: "PAY_PAGE" }
};

const base64Payload = Buffer.from(JSON.stringify(testPayload)).toString('base64');
const stringToSign = base64Payload + "/pg/v1/pay" + SALT_KEY;
const checksum = crypto.createHash('sha256').update(stringToSign).digest('hex') + "###" + SALT_INDEX;

async function test() {
    console.log("Testing with PHONEPE TEST MID...");
    try {
        const res = await fetch(fullUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
                'X-MERCHANT-ID': MERCHANT_ID,
                'accept': 'application/json'
            },
            body: JSON.stringify({ request: base64Payload })
        });
        const data = await res.json();
        console.log(`Status: ${res.status}`);
        console.log(`Result: ${JSON.stringify(data)}`);

        if (data.success) {
            console.log("\n✅ CODE LOGIC IS CORRECT! Payment URL:");
            console.log(data.data.instrumentResponse.redirectInfo.url);
        }
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
}

test();
