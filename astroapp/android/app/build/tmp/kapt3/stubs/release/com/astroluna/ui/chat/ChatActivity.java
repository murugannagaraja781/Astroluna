package com.astroluna.ui.chat;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000X\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\b\n\u0000\n\u0002\u0018\u0002\n\u0002\b\b\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000b\n\u0000\n\u0002\u0010\u000e\n\u0002\b\f\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0005\n\u0002\u0010\u0002\n\u0002\b\u0005\n\u0002\u0018\u0002\n\u0002\b\u0006\u0018\u00002\u00020\u0001B\u0005\u00a2\u0006\u0002\u0010\u0002J\b\u0010+\u001a\u00020,H\u0002J\b\u0010-\u001a\u00020,H\u0016J\u0012\u0010.\u001a\u00020,2\b\u0010/\u001a\u0004\u0018\u00010\u0010H\u0002J\u0012\u00100\u001a\u00020,2\b\u00101\u001a\u0004\u0018\u000102H\u0014J\b\u00103\u001a\u00020,H\u0014J\u0010\u00104\u001a\u00020,2\u0006\u0010/\u001a\u00020\u0010H\u0014J\b\u00105\u001a\u00020,H\u0014J\b\u00106\u001a\u00020,H\u0014J\b\u00107\u001a\u00020,H\u0002R\u000e\u0010\u0003\u001a\u00020\u0004X\u0082\u000e\u00a2\u0006\u0002\n\u0000R/\u0010\u0007\u001a\u0004\u0018\u00010\u00062\b\u0010\u0005\u001a\u0004\u0018\u00010\u00068B@BX\u0082\u008e\u0002\u00a2\u0006\u0012\n\u0004\b\f\u0010\r\u001a\u0004\b\b\u0010\t\"\u0004\b\n\u0010\u000bR\u0014\u0010\u000e\u001a\b\u0012\u0004\u0012\u00020\u00100\u000fX\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0011\u001a\u00020\u0012X\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0013\u001a\u00020\u0004X\u0082\u000e\u00a2\u0006\u0002\n\u0000R+\u0010\u0015\u001a\u00020\u00142\u0006\u0010\u0005\u001a\u00020\u00148B@BX\u0082\u008e\u0002\u00a2\u0006\u0012\n\u0004\b\u001a\u0010\r\u001a\u0004\b\u0016\u0010\u0017\"\u0004\b\u0018\u0010\u0019R+\u0010\u001b\u001a\u00020\u00142\u0006\u0010\u0005\u001a\u00020\u00148B@BX\u0082\u008e\u0002\u00a2\u0006\u0012\n\u0004\b\u001e\u0010\r\u001a\u0004\b\u001c\u0010\u0017\"\u0004\b\u001d\u0010\u0019R\u0010\u0010\u001f\u001a\u0004\u0018\u00010\u0014X\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010 \u001a\u00020!X\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\"\u001a\u00020#X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u0010\u0010$\u001a\u0004\u0018\u00010\u0014X\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u001b\u0010%\u001a\u00020&8BX\u0082\u0084\u0002\u00a2\u0006\f\n\u0004\b)\u0010*\u001a\u0004\b\'\u0010(\u00a8\u00068"}, d2 = {"Lcom/astroluna/ui/chat/ChatActivity;", "Landroidx/activity/ComponentActivity;", "()V", "chatDurationSeconds", "", "<set-?>", "Lorg/json/JSONObject;", "clientBirthData", "getClientBirthData", "()Lorg/json/JSONObject;", "setClientBirthData", "(Lorg/json/JSONObject;)V", "clientBirthData$delegate", "Landroidx/compose/runtime/MutableState;", "editIntakeLauncher", "Landroidx/activity/result/ActivityResultLauncher;", "Landroid/content/Intent;", "pendingAccept", "", "remainingSeconds", "", "remainingTime", "getRemainingTime", "()Ljava/lang/String;", "setRemainingTime", "(Ljava/lang/String;)V", "remainingTime$delegate", "sessionDuration", "getSessionDuration", "setSessionDuration", "sessionDuration$delegate", "sessionId", "timerHandler", "Landroid/os/Handler;", "timerRunnable", "Ljava/lang/Runnable;", "toUserId", "viewModel", "Lcom/astroluna/ui/chat/ChatViewModel;", "getViewModel", "()Lcom/astroluna/ui/chat/ChatViewModel;", "viewModel$delegate", "Lkotlin/Lazy;", "endChat", "", "finish", "handleIntent", "intent", "onCreate", "savedInstanceState", "Landroid/os/Bundle;", "onDestroy", "onNewIntent", "onPause", "onResume", "setupObservers", "app_release"})
public final class ChatActivity extends androidx.activity.ComponentActivity {
    @org.jetbrains.annotations.NotNull()
    private final kotlin.Lazy viewModel$delegate = null;
    @org.jetbrains.annotations.Nullable()
    private java.lang.String toUserId;
    @org.jetbrains.annotations.Nullable()
    private java.lang.String sessionId;
    @org.jetbrains.annotations.NotNull()
    private final androidx.compose.runtime.MutableState clientBirthData$delegate = null;
    @org.jetbrains.annotations.NotNull()
    private final androidx.compose.runtime.MutableState sessionDuration$delegate = null;
    @org.jetbrains.annotations.NotNull()
    private final androidx.compose.runtime.MutableState remainingTime$delegate = null;
    private int chatDurationSeconds = 0;
    private int remainingSeconds = 0;
    @org.jetbrains.annotations.NotNull()
    private android.os.Handler timerHandler;
    @org.jetbrains.annotations.NotNull()
    private final java.lang.Runnable timerRunnable = null;
    @org.jetbrains.annotations.NotNull()
    private final androidx.activity.result.ActivityResultLauncher<android.content.Intent> editIntakeLauncher = null;
    private boolean pendingAccept = false;
    
    public ChatActivity() {
        super(0);
    }
    
    private final com.astroluna.ui.chat.ChatViewModel getViewModel() {
        return null;
    }
    
    private final org.json.JSONObject getClientBirthData() {
        return null;
    }
    
    private final void setClientBirthData(org.json.JSONObject p0) {
    }
    
    private final java.lang.String getSessionDuration() {
        return null;
    }
    
    private final void setSessionDuration(java.lang.String p0) {
    }
    
    private final java.lang.String getRemainingTime() {
        return null;
    }
    
    private final void setRemainingTime(java.lang.String p0) {
    }
    
    @java.lang.Override()
    protected void onCreate(@org.jetbrains.annotations.Nullable()
    android.os.Bundle savedInstanceState) {
    }
    
    @java.lang.Override()
    protected void onNewIntent(@org.jetbrains.annotations.NotNull()
    android.content.Intent intent) {
    }
    
    private final void handleIntent(android.content.Intent intent) {
    }
    
    private final void setupObservers() {
    }
    
    private final void endChat() {
    }
    
    @java.lang.Override()
    protected void onResume() {
    }
    
    @java.lang.Override()
    protected void onPause() {
    }
    
    @java.lang.Override()
    public void finish() {
    }
    
    @java.lang.Override()
    protected void onDestroy() {
    }
}