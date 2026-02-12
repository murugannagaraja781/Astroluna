package com.astroluna.app.ui.intake;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u00006\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000b\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0000\u0018\u00002\u00020\u0001B\u0005\u00a2\u0006\u0002\u0010\u0002J\u0018\u0010\u000f\u001a\u00020\u00102\u0006\u0010\u0011\u001a\u00020\b2\u0006\u0010\u000e\u001a\u00020\bH\u0002J\u0012\u0010\u0012\u001a\u00020\u00102\b\u0010\u0013\u001a\u0004\u0018\u00010\u0014H\u0014R\u0010\u0010\u0003\u001a\u0004\u0018\u00010\u0004X\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0005\u001a\u00020\u0006X\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u0010\u0010\u0007\u001a\u0004\u0018\u00010\bX\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u0010\u0010\t\u001a\u0004\u0018\u00010\bX\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u0010\u0010\n\u001a\u0004\u0018\u00010\bX\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u0010\u0010\u000b\u001a\u0004\u0018\u00010\bX\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\f\u001a\u00020\rX\u0082.\u00a2\u0006\u0002\n\u0000R\u0010\u0010\u000e\u001a\u0004\u0018\u00010\bX\u0082\u000e\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u0015"}, d2 = {"Lcom/astroluna/app/ui/intake/IntakeActivity;", "Landroidx/activity/ComponentActivity;", "()V", "existingData", "Lorg/json/JSONObject;", "isEditMode", "", "partnerId", "", "partnerImage", "partnerName", "targetUserId", "tokenManager", "Lcom/astroluna/app/data/local/TokenManager;", "type", "navigateToSession", "", "sessionId", "onCreate", "savedInstanceState", "Landroid/os/Bundle;", "app_debug"})
public final class IntakeActivity extends androidx.activity.ComponentActivity {
    @org.jetbrains.annotations.Nullable()
    private java.lang.String partnerId;
    @org.jetbrains.annotations.Nullable()
    private java.lang.String type;
    @org.jetbrains.annotations.Nullable()
    private java.lang.String partnerName;
    @org.jetbrains.annotations.Nullable()
    private java.lang.String partnerImage;
    private boolean isEditMode = false;
    @org.jetbrains.annotations.Nullable()
    private org.json.JSONObject existingData;
    @org.jetbrains.annotations.Nullable()
    private java.lang.String targetUserId;
    private com.astroluna.app.data.local.TokenManager tokenManager;
    
    public IntakeActivity() {
        super(0);
    }
    
    @java.lang.Override()
    protected void onCreate(@org.jetbrains.annotations.Nullable()
    android.os.Bundle savedInstanceState) {
    }
    
    private final void navigateToSession(java.lang.String sessionId, java.lang.String type) {
    }
}