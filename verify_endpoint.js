
const fetch = require('node-fetch');

async function testInit() {
    console.log("Testing /api/phonepe/init locally...");
    try {
        const response = await fetch('http://localhost:3000/api/phonepe/init', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: 'DEMO_USER_123', amount: 1 })
        });

        console.log("Status:", response.status);
        const data = await response.json();
        console.log("Response data:", data);
    } catch (err) {
        console.error("Test failed:", err.message);
    }
}

testInit();
