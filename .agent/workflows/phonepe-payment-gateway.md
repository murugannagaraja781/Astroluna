---
description: PhonePe Payment Gateway Integration - How it works (Standard Checkout v2)
---

# PhonePe Payment Gateway - AstroLuna

## Overview

AstroLuna uses **PhonePe Standard Checkout v2** for wallet recharge payments. The old v1 API (`/pg/v1/pay`) is deprecated. The new v2 flow uses **OAuth Bearer tokens** and the `/checkout/v2/pay` endpoint.

---

## Environment Variables (`.env`)

```env
PHONEPE_MERCHANT_ID=M23VW0EJ3IVEK
PHONEPE_SALT_KEY=07bad376-5933-41d1-9a54-4b926e23e672
PHONEPE_SALT_INDEX=1
PHONEPE_CLIENT_ID=SU2602141859249444980554
PHONEPE_CLIENT_VERSION=1
PHONEPE_CLIENT_SECRET=07bad376-5933-41d1-9a54-4b926e23e672
PHONEPE_HOST_URL=https://api.phonepe.com/apis/hermes
```

> **Note:** `PHONEPE_HOST_URL` is legacy. The v2 code uses hardcoded production URLs:
> - OAuth: `https://api.phonepe.com/apis/identity-manager/v1/oauth/token`
> - Pay: `https://api.phonepe.com/apis/pg/checkout/v2/pay`
> - Status: `https://api.phonepe.com/apis/pg/checkout/v2/order/{orderId}/status`

---

## Complete Payment Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PAYMENT FLOW                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. User clicks "Add Money" on Wallet                               │
│     ↓                                                               │
│  2. Frontend calls POST /api/payment/token                          │
│     (sends userId + amount)                                         │
│     ↓                                                               │
│  3. Server returns secure { token }                                 │
│     ↓                                                               │
│  4. Frontend redirects to /payment.html?token=xxx                   │
│     ↓                                                               │
│  5. payment.html calls GET /api/verify-payment-token?token=xxx      │
│     (verifies token, shows amount)                                  │
│     ↓                                                               │
│  6. User clicks "Pay Now" → POST /api/payment/create                │
│     (sends { token, isApp })                                        │
│     ↓                                                               │
│  7. Server:                                                         │
│     a. Gets OAuth token (getValidPhonePeToken)                      │
│     b. Calls PhonePe v2: POST /checkout/v2/pay                      │
│     c. Gets back { orderId, redirectUrl }                           │
│     d. Saves Payment record in MongoDB (status: 'pending')          │
│     e. Returns { paymentUrl } to frontend                           │
│     ↓                                                               │
│  8. Frontend redirects to PhonePe payment page (paymentUrl)         │
│     ↓                                                               │
│  9. User completes payment on PhonePe                               │
│     ↓                                                               │
│  10. PhonePe redirects to:                                          │
│      GET /api/payment/callback?txnId=MT...&isApp=true/false         │
│     ↓                                                               │
│  11. Server:                                                        │
│      a. Calls checkPhonePeOrderStatus(txnId)                        │
│      b. Gets state: COMPLETED / FAILED / PENDING                    │
│      c. If COMPLETED → credits wallet (amount / 1.18 for GST)       │
│      d. Emits socket 'wallet-update' to user                        │
│      e. Redirects to /wallet?status=success or /payment-success     │
│                                                                     │
│  ALSO: PhonePe sends POST /api/payment/callback (S2S webhook)       │
│  → Server verifies & processes same way                             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Key Functions in `server.js`

### 1. OAuth Token Management

**Location:** Lines 35-98

```
getPhonePeOAuthToken()  → Fetches new token from PhonePe identity-manager
getValidPhonePeToken()  → Returns cached token or refreshes if expiring within 5 min
```

- **OAuth URL (Production):** `https://api.phonepe.com/apis/identity-manager/v1/oauth/token`
- **OAuth URL (Sandbox):** `https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token`
- **Auth Type:** `O-Bearer` (not regular `Bearer`)
- **Token Store:** In-memory (`phonepeTokenStore.accessToken`, `phonepeTokenStore.expiresAt`)
- **Request:** POST with `application/x-www-form-urlencoded` body:
  - `client_id`, `client_version`, `client_secret`, `grant_type=client_credentials`

### 2. Payment Initiation

**Location:** Lines 100-166

```
callPhonePePayV2(merchantOrderId, amount, redirectUrl, userMobile)
```

- **Endpoint:** `POST https://api.phonepe.com/apis/pg/checkout/v2/pay`
- **Auth Header:** `Authorization: O-Bearer <token>`
- **Payload:**
  ```json
  {
    "merchantOrderId": "MT1771607671503931",
    "amount": 10000,           // ← IN PAISA (₹100 = 10000)
    "expireAfter": 1200,       // 20 minutes
    "metaInfo": { "udf1": "9999999999" },
    "paymentFlow": {
      "type": "PG_CHECKOUT",
      "merchantUrls": {
        "redirectUrl": "https://astroluna.in/api/payment/callback?txnId=MT..."
      }
    }
  }
  ```
- **Success Response:** `{ orderId, redirectUrl, state: "PENDING" }`
- **The `redirectUrl` is the PhonePe payment page URL** — user is redirected here

### 3. Order Status Check

**Location:** Lines 4027-4070

```
checkPhonePeOrderStatus(merchantOrderId)
```

- **Endpoint:** `GET https://api.phonepe.com/apis/pg/checkout/v2/order/{merchantOrderId}/status?details=true`
- **Auth Header:** `Authorization: O-Bearer <token>`
- **Response States:**
  - `COMPLETED` → Payment successful
  - `FAILED` → Payment failed
  - `PENDING` → Payment still in progress

### 4. Payment Callback Handlers

**Location:** Lines 4136-4260+

**GET `/api/payment/callback`** (User redirect from PhonePe)
- Reads `txnId` and `isApp` from query params
- Calls `checkPhonePeOrderStatus(txnId)` to verify
- Calls `processPaymentResult()` to credit wallet

**POST `/api/payment/callback`** (S2S webhook from PhonePe)
- Handles 3 formats:
  1. Base64 encoded JSON (`req.body.response`)
  2. Direct form POST (`req.body.code` or `req.body.state`)
  3. txnId in query → checks status via API
- Always returns HTTP 200 to PhonePe

### 5. Wallet Credit Logic

**Location:** Lines 4072-4134

```
processPaymentResult(merchantTransactionId, isSuccess, providerReferenceId, isApp, res)
```

- Finds Payment record by `transactionId` or `merchantTransactionId`
- If success and not already credited:
  - Credits wallet: `creditAmount = Math.round(payment.amount / 1.18)` (18% GST deduction)
  - Emits socket events: `wallet-update` and `app-notification`
- Redirects user:
  - App: `/payment-success?amount=...&txnId=...` or `/payment-failed`
  - Web: `/wallet?status=success&amount=...` or `/wallet?status=failure`

---

## API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/payment/token` | Generate secure payment token |
| GET | `/api/verify-payment-token` | Verify token before payment |
| POST | `/api/payment/create` | Create PhonePe payment order |
| GET | `/api/payment/callback` | Handle user redirect from PhonePe |
| POST | `/api/payment/callback` | Handle S2S webhook from PhonePe |
| GET | `/api/payment/history/:userId` | Get user's transaction history |

---

## Frontend Files

| File | Purpose |
|------|---------|
| `public/index.html` | Main app — wallet UI, `initiateRecharge()`, `submitRecharge()`, `processRecharge()` |
| `public/payment.html` | Secure payment page — verifies token, calls `/api/payment/create`, redirects to PhonePe |
| `public/test_payment.html` | Test page — direct payment test (no token needed) |

### Frontend Payment Flow (`index.html`)

1. **`initiateRecharge(amountStr)`** — Main entry point
   - Calls `POST /api/payment/token` with `{ userId, amount }`
   - Redirects to `/payment.html?token=xxx`

2. **`submitRecharge()`** — Called from recharge modal
   - Reads amount from `#rechargeInput`
   - Calls `initiateRecharge(amtVal)`

3. **`processRecharge(amount)`** — Direct flow (legacy fallback)
   - Calls `POST /api/payment/create` directly
   - Redirects to `paymentUrl`

### Frontend Payment Flow (`payment.html`)

1. On load → `verifyToken()` → `GET /api/verify-payment-token?token=xxx`
2. User clicks Pay → `initiatePayment()` → `POST /api/payment/create` with `{ token, isApp }`
3. Receives `paymentUrl` → `window.location.href = paymentUrl`
4. After payment → redirected back with `?status=success/fail`
5. `checkPaymentStatus()` shows result and triggers `AndroidBridge.onPaymentComplete()`

---

## v1 vs v2 Comparison

| Feature | v1 (DEPRECATED ❌) | v2 (CURRENT ✅) |
|---------|-------------------|-----------------|
| Endpoint | `/pg/v1/pay` | `/checkout/v2/pay` |
| Base URL | `apis/hermes` | `apis/pg` |
| Auth | Checksum (`X-VERIFY` header) | OAuth Bearer (`O-Bearer` token) |
| Payload | Base64 encoded JSON | Direct JSON |
| Amount | Raw value (rupees) | Paisa (₹1 = 100) |
| Response | `instrumentResponse.redirectInfo.url` | `redirectUrl` directly |
| Callback | Data in POST body | Must check Order Status API |
| Status Check | Checksum-based | OAuth + `/checkout/v2/order/{id}/status` |

---

## Debugging

### Log File
Payments are logged to `phonepe_debug.log` in the project root.

### Test via curl

```bash
# 1. Test OAuth Token
curl -s -X POST https://api.phonepe.com/apis/identity-manager/v1/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=SU2602141859249444980554&client_version=1&client_secret=07bad376-5933-41d1-9a54-4b926e23e672&grant_type=client_credentials"

# 2. Test Payment Create (via server)
curl -s -X POST http://localhost:3000/api/payment/create \
  -H "Content-Type: application/json" \
  -d '{"userId":"testuser","amount":1,"isApp":false}' | python3 -m json.tool

# 3. Test Payment Page
open http://localhost:3000/test_payment.html
```

### Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| 404 Not Found | Using old `/pg/v1/pay` endpoint | Switch to `/checkout/v2/pay` |
| `Api Mapping Not Found` | Merchant not whitelisted on correct cluster | Contact PhonePe support |
| `AUTHORIZATION_FAILED` | Wrong OAuth token or expired | Check `client_id`, `client_secret` |
| `BAD_REQUEST` | Wrong payload format or amount not in paisa | Ensure amount × 100 |
| `keystore password was incorrect` | Wrong keystore password for APK signing | Regenerate keystore or fix password |

---

## MongoDB Payment Schema

```javascript
const paymentSchema = new mongoose.Schema({
  transactionId: String,
  merchantTransactionId: String,
  userId: String,
  amount: Number,
  status: { type: String, default: 'pending' }, // pending, success, failed
  isApp: Boolean,
  providerRefId: String,
  createdAt: { type: Date, default: Date.now }
});
```

---

## Important Notes

1. **Amount is in PAISA** for v2 API: `amountInPaisa = Math.round(amount * 100)`
2. **Auth header is `O-Bearer`** not `Bearer` — PhonePe specific
3. **Callback URL must be HTTPS** and publicly accessible: `https://astroluna.in/api/payment/callback`
4. **Always verify payment via Order Status API** — don't trust redirect params alone
5. **GST Deduction:** 18% GST is deducted. If user pays ₹118, wallet gets ₹100
6. **Token store is in-memory** — tokens are refreshed if expiring within 5 minutes
7. **Debug log:** All PhonePe API calls are logged to `phonepe_debug.log`
