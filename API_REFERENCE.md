# 📡 AstroLuna — API Reference

> **Base URL:** `http://localhost:3000`
> **Total REST APIs:** 55 | **Socket Events:** 45 | **Grand Total: 100**

---

## 📋 Table of Contents

| # | Category | REST Count | Socket Count |
|---|----------|-----------|-------------|
| 1 | [🔐 Authentication](#-authentication) | 2 | — |
| 2 | [👤 User](#-user) | 5 | 4 |
| 3 | [🔮 Astrologer](#-astrologer) | 5 | 5 |
| 4 | [📞 Session / Call](#-session--call) | 4 | 9 |
| 5 | [💬 Chat](#-chat) | 1 | 4 |
| 6 | [🌟 Astrology Engine (rasi-eng)](#-astrology-engine-rasi-eng) | 17 | — |
| 7 | [📅 Horoscope & Rasipalan](#-horoscope--rasipalan) | 3 | — |
| 8 | [💰 Payment & Wallet](#-payment--wallet) | 12 | 6 |
| 9 | [🛡️ Admin](#-admin) | 8 | 9 |
| 10 | [📁 Upload & Media](#-upload--media) | 1 | — |
| 11 | [🗺️ Geo / City](#-geo--city) | 2 | — |
| 12 | [📜 Static Pages](#-static-pages) | 7 | — |
| 13 | [🔔 Notifications](#-notifications) | 2 | 1 |
| 14 | [🔌 Socket System](#-socket-system-events) | — | 7 |

---

## 🔐 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/send-otp` | Send OTP to phone number |
| `POST` | `/api/verify-otp` | Verify OTP and login (returns user session) |

### Special Bypass Accounts (Dev/Test)
| Phone | OTP | Role |
|-------|-----|------|
| `9876543210` | `1369` | Super Admin |
| `8000000001` | `0101` | Test Astrologer |
| `9000000001` | `0101` | Test Client |

---

## 👤 User

### REST APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/user/:userId` | Get user profile by ID |
| `GET` | `/api/user/:userId/intake` | Get user birth/intake details |
| `POST` | `/api/user/intake` | Save user birth/intake details |
| `GET` | `/api/referral/stats/:userId` | Get referral earnings & stats |
| `POST` | `/api/withdraw-referral` | Withdraw referral earnings |

### Socket Events

| Event (emit) | Payload | Description |
|--------------|---------|-------------|
| `register` | `{ phone, userId, role }` | Register/reconnect user to socket |
| `rejoin-session` | `{ userId }` | Rejoin active session after reconnect |
| `update-profile` | `{ name, image, dob, tob, pob }` | Update user profile |
| `save-intake-details` | `{ name, year, month, day, hour, minute, city, lat, lon, gender, marital, occupation, topic }` | Save birth & intake details |

---

## 🔮 Astrologer

### REST APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/astrologer/register` | Register new astrologer (with skills, price) |
| `GET` | `/api/astrology/astrologers` | Get all astrologers list |
| `GET` | `/api/astrology/history/:userId` | Get session history for user |
| `POST` | `/api/astrologer/online` | Toggle astrologer online status |
| `POST` | `/api/astrologer/service-toggle` | Toggle chat/audio/video service |

### Socket Events

| Event (emit) | Payload | Description |
|--------------|---------|-------------|
| `get-astrologers` | — | Fetch live astrologer list |
| `toggle-status` | `{ userId, isOnline }` | Toggle online/offline |
| `update-service-status` | `{ userId, service, isOn }` | Toggle chat/audio/video individually |
| `update-status` | `{ userId, status }` | Update availability status |
| `app-background` / `app-foreground` | — | App lifecycle events (auto-offline) |

---

## 📞 Session / Call

### REST APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/call/initiate` | Initiate a call to astrologer |
| `POST` | `/api/call/accept` | Accept an incoming call |
| `POST` | `/api/native/accept-call` | Native Android call accept handler |
| `POST` | `/register` | Push notification device register |

### Socket Events

| Event (emit) | Payload | Description |
|--------------|---------|-------------|
| `request-session` | `{ toUserId, type: 'audio'/'video'/'chat', birthData? }` | Request a session |
| `answer-session` | `{ sessionId, toUserId, type, accept: bool }` | Accept or reject session |
| `answer-session-native` | `{ sessionId, accept, callType }` | Android native call accept |
| `signal` | `{ sessionId, toUserId, signal }` | WebRTC signaling (offer/answer/ICE) |
| `session-connect` | `{ sessionId }` | Confirm WebRTC connected, start billing |
| `end-session` | `{ sessionId }` | End active session |
| `session-ended` | *(receive)* `{ sessionId, reason }` | Session ended notification |
| `incoming-session` | *(receive)* `{ sessionId, fromUserId, callerName, type }` | Incoming call notification |
| `session-answered` | *(receive)* `{ sessionId, fromUserId, type, accept }` | Call accepted/rejected response |

---

## 💬 Chat

### REST APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/chat/history/:sessionId` | Get chat message history |

### Socket Events

| Event (emit) | Payload | Description |
|--------------|---------|-------------|
| `chat-message` | `{ sessionId, toUserId, message, type }` | Send chat message |
| `typing` | `{ sessionId, toUserId, isTyping }` | Typing indicator |
| `message-delivered` | `{ messageId, toUserId }` | Mark message delivered |
| `message-read` | `{ messageId, toUserId }` | Mark message read |

---

## 🌟 Astrology Engine (rasi-eng)

> **Base Path:** `/api/rasi-eng/`

### Charts

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/rasi-eng/charts/full` | Full birth chart (Rasi, Navamsa, all planets) |
| `POST` | `/api/rasi-eng/charts/quick` | Quick chart summary |

### Dasha (Planetary Periods)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/rasi-eng/dasha` | Current dasha/antardasha |
| `POST` | `/api/rasi-eng/dasha/subperiods` | Sub-period breakdown |
| `POST` | `/api/rasi-eng/dasha/full` | Full dasha timeline |

### Houses

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/rasi-eng/houses` | House cusp calculations |
| `POST` | `/api/rasi-eng/houses/compare` | Compare two charts (synastry houses) |

### KP (Krishnamurti Paddhati)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/rasi-eng/kp` | KP chart analysis |
| `POST` | `/api/rasi-eng/kp/ruling` | KP ruling planets |
| `POST` | `/api/rasi-eng/kp/analyze` | KP deep analysis |

### Matching (Porutham)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/rasi-eng/matching` | Horoscope compatibility (10 porutham) |
| `POST` | `/api/match/porutham` | Alias — same as above |

### Panchanga

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/rasi-eng/panchanga` | Daily panchang (tithi, nakshatra, yoga, karana, vara) |

### Planets

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/rasi-eng/planets` | Planet positions (longitude, sign, house) |

### Tamil Date

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/rasi-eng/tamil-date` | Convert to Tamil calendar date |
| `POST` | `/api/rasi-eng/tamil-date/boundaries` | Tamil month boundaries |

### Horoscope (under rasi-eng)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/rasi-eng/horoscope/daily` | Daily horoscope for all signs |
| `POST` | `/api/rasi-eng/horoscope/daily` | Daily horoscope for specific sign |

---

## 📅 Horoscope & Rasipalan

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/daily-horoscope` | Today's horoscope for all 12 signs |
| `GET` | `/api/horoscope/rasi` | Rasi (zodiac) details |
| `GET` | `/api/rasipalan` | Rasipalan (weekly/monthly forecast) |
| `POST` | `/api/horoscope/generate-chart` | Free horoscope chart generation |

---

## 💰 Payment & Wallet

### REST APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/phonepe/init` | Initialize PhonePe payment |
| `GET` | `/api/phonepe/status/:transactionId` | Check PhonePe payment status |
| `POST` | `/api/phonepe/callback` | PhonePe payment callback webhook |
| `POST` | `/api/phonepe/sign` | Generate PhonePe signature |
| `POST` | `/api/payment/create` | Create payment order |
| `POST` | `/api/payment/token` | Generate payment token |
| `GET` | `/api/verify-payment-token` | Verify payment token |
| `GET` | `/api/payment/callback` | Payment callback (GET) |
| `POST` | `/api/payment/callback` | Payment callback (POST) |
| `GET` | `/api/payment/history/:userId` | Payment transaction history |
| `GET` | `/payment-success` | Payment success redirect page |
| `GET` | `/payment-failed` | Payment failure redirect page |

### Socket Events

| Event (emit) | Payload | Description |
|--------------|---------|-------------|
| `get-wallet` | — | Get current wallet balance |
| `request-withdrawal` | `{ amount, upiId }` | Request earnings withdrawal |
| `approve-withdrawal` | `{ withdrawalId }` | Admin approve withdrawal |
| `reject-withdrawal` | `{ withdrawalId, reason }` | Admin reject withdrawal |
| `get-withdrawals` | — | Admin — get all withdrawals |
| `get-my-withdrawals` | — | Get own withdrawal history |

---

## 🛡️ Admin

### REST APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/astrologer-requests` | Pending astrologer approval requests |
| `GET` | `/api/admin/banners` | Get all home banners |
| `POST` | `/api/admin/banners` | Add new banner |
| `PUT` | `/api/admin/banners/:id` | Update banner |
| `DELETE` | `/api/admin/banners/:id` | Delete banner |
| `POST` | `/api/admin/academy/videos` | Add academy video |
| `PUT` | `/api/admin/academy/videos/:id` | Update academy video |
| `DELETE` | `/api/admin/academy/videos/:id` | Delete academy video |

### Account Deletion Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/delete-account-request` | User request for account deletion |
| `GET` | `/api/admin/deletion-requests` | Get all pending deletion requests |
| `POST` | `/api/admin/process-deletion` | Approve/Reject deletion request |

### Socket Events

| Event (emit) | Payload | Description |
|--------------|---------|-------------|
| `get-all-users` | — | Fetch all users list |
| `get-slab-rates` | — | Get billing slab rates |
| `update-slab-rates` | `{ rates }` | Update billing slab rates |
| `admin-send-bulk-fcm` | `{ title, body, target }` | Send bulk push notifications |
| `admin-edit-user` | `{ userId, ...fields }` | Edit user fields |
| `admin-update-user-details` | `{ userId, ...details }` | Update user account details |
| `admin-update-role` | `{ userId, role }` | Change user role |
| `admin-approve-astrologer` | `{ userId }` | Approve astrologer registration |
| `admin-reject-astrologer` | `{ userId, reason }` | Reject astrologer with reason |
| `admin-add-wallet` | `{ userId, amount }` | Manually add wallet balance |
| `admin-toggle-ban` | `{ userId, ban: bool }` | Ban / unban a user |
| `admin-get-ledger-stats` | `{ startDate, endDate }` | Get billing ledger statistics |

---

## 📁 Upload & Media

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/upload` | Upload image/file (multipart form) |
| `GET` | `/uploads/:filename` | Serve uploaded file |

---

## 🗺️ Geo / City

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/city-autocomplete` | Search cities by name (autocomplete) |
| `POST` | `/api/city-timezone` | Get timezone for city coordinates |

---

## 📜 Static Pages

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Main web app (index.html) |
| `GET` | `/wallet` | Wallet redirect page |
| `GET` | `/privacy-policy` | Privacy policy page |
| `GET` | `/terms-condition` | Terms & conditions page |
| `GET` | `/refund-cancellation-policy` | Refund policy page |
| `GET` | `/return-policy` | Return policy page |
| `GET` | `/shipping-policy` | Shipping policy page |

---

## 🔔 Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/test-fcm` | Test FCM push notification |
| `POST` | `/api/academy/videos` | Get academy learning videos |

### Socket Events

| Event (emit) | Payload | Description |
|--------------|---------|-------------|
| `save-fcm-token` | `{ fcmToken }` | Save device FCM token for push |

---

## 🔌 Socket System Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `connect` | Server → Client | Socket connected |
| `disconnect` | Client → Server | Socket disconnected (auto-offline) |
| `get-history` | Client → Server | Fetch session history |
| `get-payout-status` | Client → Server | Check withdrawal payout status |
| `client-birth-chart` | Client → Server | Share birth chart with astrologer |
| `wallet-update` | Server → Client | Real-time wallet balance update |
| `astrologer-update` | Server → Client | Real-time astrologer list update |

---

## 📊 API Count Summary

| Category | REST | Socket | Total |
|----------|------|--------|-------|
| Authentication | 2 | 0 | **2** |
| User | 5 | 4 | **9** |
| Astrologer | 5 | 5 | **10** |
| Session / Call | 4 | 9 | **13** |
| Chat | 1 | 4 | **5** |
| Astrology Engine | 17 | 0 | **17** |
| Horoscope & Rasipalan | 4 | 0 | **4** |
| Payment & Wallet | 12 | 6 | **18** |
| Admin | 11 | 10 | **21** |
| Upload & Media | 2 | 0 | **2** |
| Geo / City | 2 | 0 | **2** |
| Static Pages | 7 | 0 | **7** |
| Notifications | 2 | 1 | **3** |
| Socket System | 0 | 7 | **7** |
| **TOTAL** | **74** | **46** | **🔥 120** |

---

> 📌 **Note:** All API calls require server running at port 3000.
> MongoDB required for all user/session data APIs.
> Astrology Engine (rasi-eng) works offline — no DB needed.

*Generated: 2026-03-09*
