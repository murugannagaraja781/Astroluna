const fetch = require('node-fetch');
require('dotenv').config();

const CLIENT_ID = "SU2602141859249444980554";
const CLIENT_SECRET = "07bad376-5933-41d1-9a54-4b926e23e672";
const VERSION = "1";

const oauthEndpoints = [
    "https://api-preprod.phonepe.com/apis/hermes/v1/oauth/token",
    "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token",
    "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/oauth/token",
    "https://api.phonepe.com/apis/identity-manager/v1/oauth/token", // Prod path
    "https://api-preprod.phonepe.com/apis/identity-manager/v1/oauth/token" // Pre-prod identity manager
];

async function testOAuth(url) {
    console.log(`\nChecking OAuth URL: ${url}`);

    const params = new URLSearchParams();
    params.append('client_id', CLIENT_ID);
    params.append('client_version', VERSION);
    params.append('client_secret', CLIENT_SECRET);
    params.append('grant_type', 'client_credentials');

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        const text = await response.text();
        console.log(`Status: ${response.status}`);
        console.log(`Response: ${text}`);

        if (response.ok) {
            console.log("✅ SUCCESS! Found working OAuth endpoint.");
            return true;
        }
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
    return false;
}

async function run() {
    console.log("Starting OAuth Discovery for PhonePe Pre-prod...");
    for (const url of oauthEndpoints) {
        const success = await testOAuth(url);
        if (success) break;
    }
}

run();
