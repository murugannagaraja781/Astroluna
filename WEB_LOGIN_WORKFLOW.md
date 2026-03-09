# 🌐 Web — After Login Workflow

> Complete step-by-step flow after a user logs in on the web browser.

---

## 🔁 Overall Flow Diagram

```
User Opens Website
      │
      ▼
 Page Load → checkSession()
      │
      ├── localStorage has valid session?
      │         YES ──────────────────────────────────────────────────────┐
      │         NO                                                        │
      ▼                                                                   │
 loadGuestMode()           ┌────────────────────────────────────────────┘
      │                    │     Auto-Login (Returning User)
      ▼                    ▼
 Show Login Screen  socket.emit('register', {name, phone, userId})
      │                    │
      ▼              ack.ok? ─── NO ──→ clearSession() → Login Screen
 User enters Phone         │
      │                   YES
      │                    ▼
      ▼            Route by Role (same as below)
 POST /api/send-otp
      │
      ▼
 User enters OTP
      │
      ▼
 POST /api/verify-otp
      │
      ├── res.ok = false → alert('Invalid Login')
      │
      └── res.ok = true
                │
                ▼
          state.me = res         ← Store user in memory
          saveSession(res)       ← Save to localStorage
                │
                ▼
          socket.emit('register', {name, phone})
          socket.emit('save-fcm-token', {fcmToken})  ← If available
                │
                ▼
          ┌──────────────────────────────────────────────────┐
          │               ROUTE BY ROLE                      │
          └──────────────────────────────────────────────────┘
                │               │                │
         role='client'   role='astrologer'  role='superadmin'
                │               │                │
                ▼               ▼                ▼
        loadClientDash()  loadAstroDash()  loadAdminDash()
```

---

## 👤 Path 1: CLIENT Dashboard

```javascript
loadClientDash(user)
```

### Steps in order:

| Step | Action | Detail |
|------|--------|--------|
| 1 | Hide all screens | `hideAllScreens()` |
| 2 | Show `#screen-client` | Client dashboard visible |
| 3 | Show global app header | `#globalAppHeader` display: flex |
| 4 | Show desktop topbar | `syncDesktopWallet(walletBalance)` |
| 5 | Set wallet balance | `#clientWallet`, `#dashWalletBalance` |
| 6 | Show bottom nav | `.doc-bottom-nav` display: flex |
| 7 | Set user name | `#homeUserName` |
| 8 | Start time display | `updateHomeTime()` every 60s |
| 9 | Switch to Home tab | `navSwitch('home')` |
| 10 | Fetch astrologers | `fetchAstrologers()` → `socket.emit('get-astrologers')` |
| 11 | Listen: wallet updates | `socket.on('wallet-update')` |
| 12 | Listen: astrologer updates | `socket.on('astrologer-update')` |
| 13 | Fetch payment history | `window.fetchTransactionHistory()` |

### Client Dashboard Sections (Bottom Nav):

```
🏠 Home      →  Astrologer list (Chat / Call / Video buttons)
📞 Call      →  Audio call astrologers
💬 Chat      →  Chat with astrologers  
👤 Profile   →  User profile, birth details
📖 History   →  Session history, payments
```

---

## 🔮 Path 2: ASTROLOGER Dashboard

```javascript
loadAstroDash(user)
```

### Steps in order:

| Step | Action | Detail |
|------|--------|--------|
| 1 | Hide all screens | `hideAllScreens()` |
| 2 | Show `#screen-astro` | Astrologer dashboard visible |
| 3 | Show global header with balance | `#globalAppHeader` |
| 4 | Set astrologer name | `#astroName` |
| 5 | Set astrologer ID | `#astroId` (first 6 chars) |
| 6 | Set avatar image | `#astroAvatar` (ui-avatars fallback) |
| 7 | Setup service toggles | Chat / Audio / Video on/off toggles |
| 8 | Init toggle UI state | Based on `isChatOnline`, `isAudioOnline`, `isVideoOnline` |
| 9 | Hide bottom nav | `.doc-bottom-nav` display: none |
| 10 | Show earnings | `#astroLifetimeDisplay`, `#astroWalletDisplay` |
| 11 | Load withdrawals | `loadAstroWithdrawals()` |
| 12 | Listen: incoming-session | Show incoming call overlay |
| 13 | Listen: wallet-update | Real-time earnings update |

### Astrologer Dashboard Sections:

```
💼 Status Panel  →  Online/Offline toggle + Chat/Audio/Video toggles
💰 Earnings      →  Wallet balance + Lifetime earnings
📞 Incoming Call →  screen-incoming overlay when client calls
📋 History       →  Past sessions
💸 Withdrawal    →  Request payout to UPI
```

---

## 🛡️ Path 3: SUPER ADMIN Dashboard

```javascript
loadAdminDash(user)
```

### Steps in order:

| Step | Action | Detail |
|------|--------|--------|
| 1 | `enterApp()` | Ensure mobile-view displayed |
| 2 | Hide all screens | `hideAllScreens()` |
| 3 | Show `#screen-admin` | Admin dashboard visible |
| 4 | Hide client bottom nav | `.doc-bottom-nav` display: none |
| 5 | Show admin sidebar | `.admin-nav` display: flex |
| 6 | Show admin footer | `.admin-footer` add class 'show' |
| 7 | Load default tab | `navAdmin('home')` |
| 8 | Load withdrawal requests | `loadAdminWithdrawals()` |
| 9 | Fetch all users | `socket.emit('get-all-users')` |
| 10 | Load ledger stats | `loadAdminLedgerStats()` |
| 11 | Start footer clock | `updateAdminFooterTime()` every 60s |

### Admin Dashboard Tabs (Sidebar Nav):

```
🏠 Home         →  Stats cards (Users, Sessions, Revenue)
👥 Users        →  All users list, ban/unban, role change
🔮 Astrologers  →  Approve/reject astrologer requests
💰 Payouts      →  Approve/reject withdrawal requests
📣 Banners      →  Manage home screen banners
🎓 Academy      →  Manage learning videos
⚙️  Settings     →  Slab rates, bulk notifications
```

---

## 🔄 Session Restore (Returning User)

When user revisits the site, `checkSession()` is called automatically:

```
Page Load
    │
    ▼
localStorage.getItem('astro_session')
    │
    ├── No session  →  loadGuestMode()
    │
    ├── Session expired (expiresAt < now)  →  clearSession() → loadGuestMode()
    │
    └── Valid session
            │
            ▼
       socket.emit('register', {name, phone, userId})
            │
            ├── ack.ok = false  →  clearSession()
            │
            └── ack.ok = true
                    │
                    ▼
               state.me = {...oldSession, ...serverAck}
               saveSession(state.me)  ← Refresh session
                    │
                    ▼
               Route by role (same flow as fresh login)
```

---

## 💾 Session Storage Structure

```json
{
  "userId": "abc-123-...",
  "name": "Ravi Kumar",
  "phone": "9876543210",
  "role": "client",
  "walletBalance": 250.00,
  "totalEarnings": 0,
  "referralCode": "RAVI123",
  "image": "https://...",
  "expiresAt": 1741234567890
}
```

> Stored in `localStorage` key: `astro_session`

---

## 📡 Socket Events After Login

```
Login Success
     │
     ├── emit: register         → Server stores userId ↔ socketId mapping
     ├── emit: save-fcm-token   → Server stores push token
     ├── emit: get-astrologers  → Server sends astrologer list
     │
     │── listen: astrologer-update  → Refresh astrologer cards in real-time
     │── listen: wallet-update      → Refresh wallet balance in real-time
     │── listen: incoming-session   → Show incoming call overlay
     │── listen: session-answered   → Call accepted/rejected response
     └── listen: session-ended      → Session ended notification
```

---

## 🚪 Logout Flow

```javascript
clearSession()
    │
    ├── localStorage.removeItem('astro_session')
    ├── state.me = null
    ├── socket.disconnect()
    └── window.location.reload()  ← Fresh page load → Guest mode
```

---

## ⚡ Quick Role Summary

| Role | Screen Shown | Nav Type | Key Feature |
|------|-------------|----------|-------------|
| `guest` | Client Dash (limited) | Bottom nav hidden | Browse only, no calls |
| `client` | `screen-client` | Bottom nav (5 tabs) | Book sessions, chat |
| `astrologer` | `screen-astro` | No nav | Toggle online, receive calls |
| `superadmin` | `screen-admin` | Sidebar nav | Full management |

---

*Generated: 2026-03-09*
