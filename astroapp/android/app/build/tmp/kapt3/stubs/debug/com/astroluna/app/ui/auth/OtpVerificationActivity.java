package com.astroluna.app.ui.auth;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000.\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0002\b\u0002\u0018\u00002\u00020\u0001B\u0005\u00a2\u0006\u0002\u0010\u0002J\u0012\u0010\u0007\u001a\u00020\b2\b\u0010\t\u001a\u0004\u0018\u00010\nH\u0014J\u0018\u0010\u000b\u001a\u00020\b2\u0006\u0010\f\u001a\u00020\r2\u0006\u0010\u000e\u001a\u00020\rH\u0002R\u000e\u0010\u0003\u001a\u00020\u0004X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0005\u001a\u00020\u0006X\u0082.\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u000f"}, d2 = {"Lcom/astroluna/app/ui/auth/OtpVerificationActivity;", "Landroidx/appcompat/app/AppCompatActivity;", "()V", "repository", "Lcom/astroluna/app/data/repository/AuthRepository;", "tokenManager", "Lcom/astroluna/app/data/local/TokenManager;", "onCreate", "", "savedInstanceState", "Landroid/os/Bundle;", "verifyOtp", "phone", "", "otp", "app_debug"})
public final class OtpVerificationActivity extends androidx.appcompat.app.AppCompatActivity {
    @org.jetbrains.annotations.NotNull()
    private final com.astroluna.app.data.repository.AuthRepository repository = null;
    private com.astroluna.app.data.local.TokenManager tokenManager;
    
    public OtpVerificationActivity() {
        super();
    }
    
    @java.lang.Override()
    protected void onCreate(@org.jetbrains.annotations.Nullable()
    android.os.Bundle savedInstanceState) {
    }
    
    private final void verifyOtp(java.lang.String phone, java.lang.String otp) {
    }
}