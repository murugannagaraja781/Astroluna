---
description: Billing Workflow and Slab Rate Calculation
---

# Billing & Slab Rate Workflow

This document outlines the logic for session billing, astrologer revenue shares (slabs), and administrative deductions.

## 1. Slab Rate Structure
Revenue sharing is based on the cumulative duration of calls between a specific Client and Astrologer within a calendar month.

| Slab | Cumulative Duration | Astro Share | Admin Share |
| :--- | :--- | :--- | :--- |
| **Slab 1** | 0s - 300s (0-5m) | 30% | 70% |
| **Slab 2** | 301s - 600s (5-10m) | 35% | 65% |
| **Slab 3** | 601s - 900s (10-15m) | 40% | 60% |
| **Slab 4** | 901s+ (15m+) | 50% | 50% |

## 2. Minute 1 Rule
- **The first 60 seconds of every session are 100% credited to the Admin.**
- The Astrologer earns **₹0** for the first minute.
- If a session lasts less than 60 seconds, the full 1-minute price is still charged to the client (entirely to Admin).

## 3. Standard Minute Billing (Minute 2+)
- Starting from index 2, billing follows the current **Slab Rate**.
- The system checks the `PairMonth` record for the specific pair to determine the active slab.
- **Slab Upgrades**: If a call crosses a time threshold (e.g., 300s), the slab is upgraded in real-time for the current and future minutes within that session.

## 4. Final Fractional Minute Rule
- If a session terminates mid-minute (e.g., at 08:35), it is rounded up (to 9m).
- The final fractional minute is **100% credited to the Admin**.
- Astrologers receive slab-based shares only for **completed full minutes** (after the first full admin minute).

## 5. Referral & Cashback Deductions
Deductions for referrals are taken from the **Admin's share**:
- **Sub-Referral (L1, L2, L3)**: Totaling up to 5% (2+2+1).
- **Client Cashback**: 2%.

## 6. Implementation Reference
- **Ticker**: `tickSessions()` in `server.js` manages the 1-second increment and boundary checks.
- **Ledger**: `BillingLedger` entries are created for every minute charged.
- **Safety**: `forceEndSession` triggers if `walletBalance < nextMinutePrice`.
