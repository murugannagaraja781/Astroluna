const fs = require('fs');
const config = require('../config/phonepe');

let phonepeTokenStore = {
  accessToken: null,
  expiresAt: 0
};

async function getPhonePeOAuthToken() {
  try {
    let oauthUrl = "https://api.phonepe.com/apis/identity-manager/v1/oauth/token";
    if (config.HOST_URL.includes("sandbox") && !config.HOST_URL.includes("hermes")) {
      oauthUrl = "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token";
    }

    const params = new URLSearchParams();
    params.append('client_id', config.CLIENT_ID);
    params.append('client_version', config.CLIENT_VERSION);
    params.append('client_secret', config.CLIENT_SECRET);
    params.append('grant_type', 'client_credentials');

    const response = await fetch(oauthUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("[PhonePe OAuth] Non-JSON Response:", text.substring(0, 500));
      return null;
    }

    if (response.ok && data.access_token) {
      phonepeTokenStore = {
        accessToken: data.access_token,
        expiresAt: data.expires_at || (Math.floor(Date.now() / 1000) + 3600)
      };
      return data.access_token;
    } else {
      console.error("[PhonePe OAuth] Token Generation Failed:", data);
      return null;
    }
  } catch (err) {
    console.error("[PhonePe OAuth] Error:", err.message);
    return null;
  }
}

async function getValidPhonePeToken() {
  const now = Math.floor(Date.now() / 1000);
  if (!phonepeTokenStore.accessToken || phonepeTokenStore.expiresAt < (now + 300)) {
    return await getPhonePeOAuthToken();
  }
  return phonepeTokenStore.accessToken;
}

async function callPhonePePayV2(merchantOrderId, amount, redirectUrl, userMobile) {
  const endpoint = "https://api.phonepe.com/apis/pg/checkout/v2/pay";
  const oauthToken = await getValidPhonePeToken();
  if (!oauthToken) {
    return { success: false, data: { message: "OAuth token generation failed" }, status: 401 };
  }

  const payload = {
    merchantOrderId: merchantOrderId,
    amount: amount,
    expireAfter: 1200,
    metaInfo: {
      udf1: userMobile || "9999999999"
    },
    paymentFlow: {
      type: "PG_CHECKOUT",
      merchantUrls: {
        redirectUrl: redirectUrl
      }
    }
  };

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `O-Bearer ${oauthToken}`,
    'accept': 'application/json'
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });
    const text = await response.text();
    const data = JSON.parse(text);
    
    const isSuccess = response.ok && data.orderId && data.redirectUrl;
    return { success: isSuccess, data, status: response.status };
  } catch (err) {
    console.error("[PhonePe v2] Fetch Error:", err.message);
    return { success: false, data: { message: "Failed to connect to PhonePe" }, status: 500 };
  }
}

async function checkPhonePeOrderStatus(merchantOrderId) {
  const endpoint = `https://api.phonepe.com/apis/pg/checkout/v2/order/${merchantOrderId}/status?details=true`;

  const oauthToken = await getValidPhonePeToken();
  if (!oauthToken) {
    console.error("[PhonePe Status] No OAuth token");
    return { success: false, state: 'ERROR' };
  }

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `O-Bearer ${oauthToken}`,
        'accept': 'application/json'
      }
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("[PhonePe Status] Non-JSON Response:", text.substring(0, 500));
      return { success: false, state: 'ERROR' };
    }

    return { success: true, data, state: data.state || 'UNKNOWN' };
  } catch (err) {
    console.error("[PhonePe Status] Error:", err.message);
    return { success: false, state: 'ERROR' };
  }
}

module.exports = { callPhonePePayV2, checkPhonePeOrderStatus };
