package com.astroluna.app;

/**
 * IncomingCallActivity - Full-screen incoming call UI
 */
@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000J\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0002\b\u0005\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000b\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0002\n\u0002\b\u0005\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\b\u0018\u0000 %2\u00020\u0001:\u0001%B\u0005\u00a2\u0006\u0002\u0010\u0002J\b\u0010\u0013\u001a\u00020\u0014H\u0002J\b\u0010\u0015\u001a\u00020\u0014H\u0017J\b\u0010\u0016\u001a\u00020\u0014H\u0002J\b\u0010\u0017\u001a\u00020\u0014H\u0002J\u0012\u0010\u0018\u001a\u00020\u00142\b\u0010\u0019\u001a\u0004\u0018\u00010\u001aH\u0014J\b\u0010\u001b\u001a\u00020\u0014H\u0014J\u0010\u0010\u001c\u001a\u00020\u00142\u0006\u0010\u001d\u001a\u00020\u001eH\u0014J\u0012\u0010\u001f\u001a\u00020\u00142\b\u0010\u001d\u001a\u0004\u0018\u00010\u001eH\u0002J\b\u0010 \u001a\u00020\u0014H\u0002J\b\u0010!\u001a\u00020\u0014H\u0002J\b\u0010\"\u001a\u00020\u0014H\u0002J\b\u0010#\u001a\u00020\u0014H\u0002J\b\u0010$\u001a\u00020\u0014H\u0002R\u0010\u0010\u0003\u001a\u0004\u0018\u00010\u0004X\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0005\u001a\u00020\u0004X\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0006\u001a\u00020\u0004X\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0007\u001a\u00020\u0004X\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\b\u001a\u00020\u0004X\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\t\u001a\u00020\nX\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u0010\u0010\u000b\u001a\u0004\u0018\u00010\fX\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\r\u001a\u00020\u000eX\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u000f\u001a\u00020\u0010X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u0010\u0010\u0011\u001a\u0004\u0018\u00010\u0012X\u0082\u000e\u00a2\u0006\u0002\n\u0000\u00a8\u0006&"}, d2 = {"Lcom/astroluna/app/IncomingCallActivity;", "Landroidx/activity/ComponentActivity;", "()V", "birthData", "", "callId", "callType", "callerId", "callerName", "handler", "Landroid/os/Handler;", "mediaPlayer", "Landroid/media/MediaPlayer;", "shouldStopServiceOnDestroy", "", "timeoutRunnable", "Ljava/lang/Runnable;", "vibrator", "Landroid/os/Vibrator;", "clearAllCallNotifications", "", "onBackPressed", "onCallAccepted", "onCallRejected", "onCreate", "savedInstanceState", "Landroid/os/Bundle;", "onDestroy", "onNewIntent", "intent", "Landroid/content/Intent;", "processIntent", "setupWindowFlags", "startCallForegroundService", "startRingtone", "startVibration", "stopRingtoneAndVibration", "Companion", "app_debug"})
public final class IncomingCallActivity extends androidx.activity.ComponentActivity {
    @org.jetbrains.annotations.NotNull()
    private static final java.lang.String TAG = "IncomingCallActivity";
    private static final long CALL_TIMEOUT_MS = 30000L;
    @org.jetbrains.annotations.Nullable()
    private android.media.MediaPlayer mediaPlayer;
    @org.jetbrains.annotations.Nullable()
    private android.os.Vibrator vibrator;
    @org.jetbrains.annotations.NotNull()
    private final android.os.Handler handler = null;
    private boolean shouldStopServiceOnDestroy = true;
    @org.jetbrains.annotations.NotNull()
    private java.lang.String callerId = "";
    @org.jetbrains.annotations.NotNull()
    private java.lang.String callerName = "";
    @org.jetbrains.annotations.NotNull()
    private java.lang.String callId = "";
    @org.jetbrains.annotations.NotNull()
    private java.lang.String callType = "audio";
    @org.jetbrains.annotations.Nullable()
    private java.lang.String birthData;
    @org.jetbrains.annotations.NotNull()
    private final java.lang.Runnable timeoutRunnable = null;
    @org.jetbrains.annotations.NotNull()
    public static final com.astroluna.app.IncomingCallActivity.Companion Companion = null;
    
    public IncomingCallActivity() {
        super(0);
    }
    
    private final void setupWindowFlags() {
    }
    
    @java.lang.Override()
    protected void onCreate(@org.jetbrains.annotations.Nullable()
    android.os.Bundle savedInstanceState) {
    }
    
    @java.lang.Override()
    protected void onNewIntent(@org.jetbrains.annotations.NotNull()
    android.content.Intent intent) {
    }
    
    private final void processIntent(android.content.Intent intent) {
    }
    
    private final void clearAllCallNotifications() {
    }
    
    private final void startCallForegroundService() {
    }
    
    private final void startRingtone() {
    }
    
    private final void startVibration() {
    }
    
    private final void stopRingtoneAndVibration() {
    }
    
    private final void onCallAccepted() {
    }
    
    private final void onCallRejected() {
    }
    
    @java.lang.Override()
    protected void onDestroy() {
    }
    
    @java.lang.Override()
    @java.lang.Deprecated()
    public void onBackPressed() {
    }
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\u0018\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0010\t\n\u0000\n\u0002\u0010\u000e\n\u0000\b\u0086\u0003\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002R\u000e\u0010\u0003\u001a\u00020\u0004X\u0082T\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0005\u001a\u00020\u0006X\u0082T\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u0007"}, d2 = {"Lcom/astroluna/app/IncomingCallActivity$Companion;", "", "()V", "CALL_TIMEOUT_MS", "", "TAG", "", "app_debug"})
    public static final class Companion {
        
        private Companion() {
            super();
        }
    }
}