package com.astroluna.app.utils;

/**
 * CallState - Global state to prevent duplicate call handling and crashes
 */
@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\u001c\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0002\b\u0005\n\u0002\u0010\u000b\n\u0002\b\u0006\b\u00c6\u0002\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002J\u0010\u0010\u000e\u001a\u00020\n2\b\u0010\u000f\u001a\u0004\u0018\u00010\u0004R\u001c\u0010\u0003\u001a\u0004\u0018\u00010\u0004X\u0086\u000e\u00a2\u0006\u000e\n\u0000\u001a\u0004\b\u0005\u0010\u0006\"\u0004\b\u0007\u0010\bR\u001a\u0010\t\u001a\u00020\nX\u0086\u000e\u00a2\u0006\u000e\n\u0000\u001a\u0004\b\t\u0010\u000b\"\u0004\b\f\u0010\r\u00a8\u0006\u0010"}, d2 = {"Lcom/astroluna/app/utils/CallState;", "", "()V", "currentSessionId", "", "getCurrentSessionId", "()Ljava/lang/String;", "setCurrentSessionId", "(Ljava/lang/String;)V", "isCallActive", "", "()Z", "setCallActive", "(Z)V", "canReceiveCall", "newSessionId", "app_release"})
public final class CallState {
    @kotlin.jvm.Volatile()
    private static volatile boolean isCallActive = false;
    @kotlin.jvm.Volatile()
    @org.jetbrains.annotations.Nullable()
    private static volatile java.lang.String currentSessionId;
    @org.jetbrains.annotations.NotNull()
    public static final com.astroluna.app.utils.CallState INSTANCE = null;
    
    private CallState() {
        super();
    }
    
    public final boolean isCallActive() {
        return false;
    }
    
    public final void setCallActive(boolean p0) {
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String getCurrentSessionId() {
        return null;
    }
    
    public final void setCurrentSessionId(@org.jetbrains.annotations.Nullable()
    java.lang.String p0) {
    }
    
    /**
     * Determines if a new call/chat session can be received.
     * Block if a session is already active (CallActivity/ChatActivity).
     */
    public final boolean canReceiveCall(@org.jetbrains.annotations.Nullable()
    java.lang.String newSessionId) {
        return false;
    }
}