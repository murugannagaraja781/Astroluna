const crypto = require('crypto');
const dotenv = require('dotenv');
const path = require('path');
const fetch = require('node-fetch');

// Load .env
dotenv.config({ path: path.join(__dirname, '.env') });

const PHONEPE_CLIENT_ID = process.env.PHONEPE_CLIENT_ID;
const PHONEPE_CLIENT_VERSION = process.env.PHONEPE_CLIENT_VERSION;
const PHONEPE_CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET;
const PHONEPE_HOST_URL = process.env.PHONEPE_HOST_URL || "https://api-preprod.phonepe.com/apis/pg-sandbox";

async function testOAuth() {
    console.log("--- PhonePe OAuth Verification ---");
    console.log(`Client ID: ${PHONEPE_CLIENT_ID}`);
    console.log(`Version: ${PHONEPE_CLIENT_VERSION}`);
    console.log(`Secret: ${PHONEPE_CLIENT_SECRET ? "****" + PHONEPE_CLIENT_SECRET.slice(-4) : "MISSING"}`);
    console.log(`Host URL: ${PHONEPE_HOST_URL}`);
    console.log("----------------------------------\n");

    if (!PHONEPE_CLIENT_ID || !PHONEPE_CLIENT_SECRET) {
        console.error("❌ ERROR: Missing credentials in .env");
        return;
    }

    const isSandbox = PHONEPE_HOST_URL.includes("sandbox") || PHONEPE_HOST_URL.includes("preprod");
    const oauthUrl = isSandbox
        ? "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token"
        : "https://api.phonepe.com/apis/identity-manager/v1/oauth/token";

    console.log(`OAuth URL: ${oauthUrl}`);

    const params = new URLSearchParams();
    params.append('client_id', PHONEPE_CLIENT_ID);
    params.append('client_version', PHONEPE_CLIENT_VERSION);
    params.append('client_secret', PHONEPE_CLIENT_SECRET);
    params.append('grant_type', 'client_credentials');

    try {
        const response = await fetch(oauthUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        const status = response.status;
        const text = await response.text();
        console.log(`Response Status: ${status}`);

        try {
            const data = JSON.parse(text);
            if (response.ok && data.access_token) {
                console.log("✅ SUCCESS: Token generated!");
                console.log(`Access Token: ${data.access_token.substring(0, 20)}...`);
                console.log(`Expires At: ${new Date(data.expires_at * 1000).toISOString()}`);
            } else {
                console.error("❌ FAILED: Token generation failed.");
                console.error("Response Data:", JSON.stringify(data, null, 2));
                if (data.error === "invalid_client") {
                    console.error("\n💡 TIP: Check your client_id and client_secret.");
                }
            }
        } catch (e) {
            console.error("❌ ERROR: Non-JSON Response from server.");
            console.error("Response Text:", text);
        }
    } catch (err) {
        console.error("❌ FETCH ERROR:", err.message);
    }
}

testOAuth();
