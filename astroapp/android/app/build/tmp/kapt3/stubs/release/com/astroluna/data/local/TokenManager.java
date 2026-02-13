package com.astroluna.data.local;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000D\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0010\b\n\u0000\n\u0002\u0010\u000e\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000b\n\u0002\b\b\n\u0002\u0010\u0006\n\u0000\u0018\u00002\u00020\u0001B\r\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\u0002\u0010\u0004J\u0006\u0010\t\u001a\u00020\nJ\u0006\u0010\u000b\u001a\u00020\fJ\u0006\u0010\r\u001a\u00020\u000eJ\b\u0010\u000f\u001a\u0004\u0018\u00010\u0010J\u0006\u0010\u0011\u001a\u00020\u0012J\u000e\u0010\u0013\u001a\u00020\n2\u0006\u0010\u0014\u001a\u00020\u0010J\u000e\u0010\u0015\u001a\u00020\n2\u0006\u0010\u0016\u001a\u00020\fJ\u000e\u0010\u0017\u001a\u00020\n2\u0006\u0010\u0018\u001a\u00020\u000eJ\u000e\u0010\u0019\u001a\u00020\n2\u0006\u0010\u001a\u001a\u00020\u001bR\u000e\u0010\u0005\u001a\u00020\u0006X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0007\u001a\u00020\bX\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u001c"}, d2 = {"Lcom/astroluna/data/local/TokenManager;", "", "context", "Landroid/content/Context;", "(Landroid/content/Context;)V", "masterKey", "Landroidx/security/crypto/MasterKey;", "sharedPreferences", "Landroid/content/SharedPreferences;", "clearSession", "", "getDailyProgress", "", "getLastDate", "", "getUserSession", "Lcom/astroluna/data/model/AuthResponse;", "isLoggedIn", "", "saveUserSession", "auth", "setDailyProgress", "value", "setLastDate", "date", "updateWalletBalance", "balance", "", "app_release"})
public final class TokenManager {
    @org.jetbrains.annotations.NotNull()
    private final androidx.security.crypto.MasterKey masterKey = null;
    @org.jetbrains.annotations.NotNull()
    private final android.content.SharedPreferences sharedPreferences = null;
    
    public TokenManager(@org.jetbrains.annotations.NotNull()
    android.content.Context context) {
        super();
    }
    
    public final void saveUserSession(@org.jetbrains.annotations.NotNull()
    com.astroluna.data.model.AuthResponse auth) {
    }
    
    @org.jetbrains.annotations.Nullable()
    public final com.astroluna.data.model.AuthResponse getUserSession() {
        return null;
    }
    
    public final void clearSession() {
    }
    
    public final boolean isLoggedIn() {
        return false;
    }
    
    public final void updateWalletBalance(double balance) {
    }
    
    public final int getDailyProgress() {
        return 0;
    }
    
    public final void setDailyProgress(int value) {
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.lang.String getLastDate() {
        return null;
    }
    
    public final void setLastDate(@org.jetbrains.annotations.NotNull()
    java.lang.String date) {
    }
}