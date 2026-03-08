package com.astroluna.utils

/**
 * CallState - Global state to prevent duplicate call handling and crashes
 */
object CallState {
    @Volatile
    var isCallActive = false

    @Volatile
    var currentSessionId: String? = null

    private var lastActiveTimestamp: Long = 0

    fun canReceiveCall(newSessionId: String?): Boolean {
        val now = System.currentTimeMillis()

        // Safety: If no activity for 30 mins, reset stuck state
        if (isCallActive && (now - lastActiveTimestamp > 30 * 60 * 1000L)) {
            isCallActive = false
            currentSessionId = null
        }

        // Allow if not active
        if (!isCallActive) return true

        // Allow if it's the SAME session (Re-entry or Duplicate FCM)
        if (newSessionId != null && newSessionId == currentSessionId) return true

        return false
    }

    fun markActive(sessionId: String?) {
        isCallActive = true
        currentSessionId = sessionId
        lastActiveTimestamp = System.currentTimeMillis()
    }

    fun markInactive() {
        isCallActive = false
        currentSessionId = null
    }

    fun updateActivity() {
        if (isCallActive) lastActiveTimestamp = System.currentTimeMillis()
    }
}
