package com.astroluna.ui.payment;

/**
 * PaymentActivity - Handles PhonePe Native SDK Payment
 * Uses programmatic UI to avoid layout confusion.
 */
@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000L\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0010\u000b\n\u0002\b\u0007\n\u0002\u0018\u0002\n\u0002\b\u0006\n\u0002\u0010\u0006\n\u0002\b\u0005\u0018\u0000 $2\u00020\u0001:\u0002#$B\u0005\u00a2\u0006\u0002\u0010\u0002J\b\u0010\u000e\u001a\u00020\u000fH\u0002J\u0010\u0010\u0010\u001a\u00020\u00112\u0006\u0010\u0012\u001a\u00020\u0004H\u0002J\u0010\u0010\u0013\u001a\u00020\u000f2\u0006\u0010\u0014\u001a\u00020\u0004H\u0002J\u0010\u0010\u0015\u001a\u00020\u000f2\u0006\u0010\u0016\u001a\u00020\u0004H\u0002J\u0012\u0010\u0017\u001a\u00020\u000f2\b\u0010\u0018\u001a\u0004\u0018\u00010\u0019H\u0014J\u0010\u0010\u001a\u001a\u00020\u000f2\u0006\u0010\u001b\u001a\u00020\u0007H\u0014J\u0010\u0010\u001c\u001a\u00020\u000f2\u0006\u0010\u001d\u001a\u00020\u0004H\u0002J\u0010\u0010\u001e\u001a\u00020\u000f2\u0006\u0010\u001f\u001a\u00020 H\u0002J\u0010\u0010!\u001a\u00020\u000f2\u0006\u0010\"\u001a\u00020 H\u0002R\u0010\u0010\u0003\u001a\u0004\u0018\u00010\u0004X\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u0014\u0010\u0005\u001a\b\u0012\u0004\u0012\u00020\u00070\u0006X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\b\u001a\u00020\tX\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\n\u001a\u00020\u000bX\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\f\u001a\u00020\rX\u0082.\u00a2\u0006\u0002\n\u0000\u00a8\u0006%"}, d2 = {"Lcom/astroluna/ui/payment/PaymentActivity;", "Landroidx/appcompat/app/AppCompatActivity;", "()V", "pendingTransactionId", "", "phonePeLauncher", "Landroidx/activity/result/ActivityResultLauncher;", "Landroid/content/Intent;", "statusText", "Landroid/widget/TextView;", "tokenManager", "Lcom/astroluna/data/local/TokenManager;", "webView", "Landroid/webkit/WebView;", "checkPaymentStatus", "", "handleDeepLink", "", "url", "handlePaymentResult", "status", "monitorWebPayment", "txnId", "onCreate", "savedInstanceState", "Landroid/os/Bundle;", "onNewIntent", "intent", "showError", "message", "startPayment", "amountRupees", "", "startWebPayment", "amount", "AndroidBridge", "Companion", "app_debug"})
public final class PaymentActivity extends androidx.appcompat.app.AppCompatActivity {
    @org.jetbrains.annotations.NotNull()
    private static final java.lang.String TAG = "PaymentActivity";
    @org.jetbrains.annotations.NotNull()
    private static final java.lang.String MERCHANT_ID = "M22LBBWEJKI6A";
    private static final int B2B_PG_REQUEST_CODE = 777;
    private static final boolean USE_NATIVE_SDK = false;
    @org.jetbrains.annotations.NotNull()
    private static final java.lang.String SERVER_URL = "https://astro5star.com";
    private com.astroluna.data.local.TokenManager tokenManager;
    private android.widget.TextView statusText;
    private android.webkit.WebView webView;
    @org.jetbrains.annotations.NotNull()
    private final androidx.activity.result.ActivityResultLauncher<android.content.Intent> phonePeLauncher = null;
    @org.jetbrains.annotations.Nullable()
    private java.lang.String pendingTransactionId;
    @org.jetbrains.annotations.NotNull()
    public static final com.astroluna.ui.payment.PaymentActivity.Companion Companion = null;
    
    public PaymentActivity() {
        super();
    }
    
    @java.lang.Override()
    protected void onCreate(@org.jetbrains.annotations.Nullable()
    android.os.Bundle savedInstanceState) {
    }
    
    private final void startWebPayment(double amount) {
    }
    
    private final void monitorWebPayment(java.lang.String txnId) {
    }
    
    private final void startPayment(double amountRupees) {
    }
    
    private final boolean handleDeepLink(java.lang.String url) {
        return false;
    }
    
    private final void showError(java.lang.String message) {
    }
    
    private final void checkPaymentStatus() {
    }
    
    @java.lang.Override()
    protected void onNewIntent(@org.jetbrains.annotations.NotNull()
    android.content.Intent intent) {
    }
    
    private final void handlePaymentResult(java.lang.String status) {
    }
    
    /**
     * JavaScript Interface for communication from WebView
     */
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\u0018\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0010\u0002\n\u0000\n\u0002\u0010\u000e\n\u0000\b\u0086\u0004\u0018\u00002\u00020\u0001B\u0005\u00a2\u0006\u0002\u0010\u0002J\u0010\u0010\u0003\u001a\u00020\u00042\u0006\u0010\u0005\u001a\u00020\u0006H\u0007\u00a8\u0006\u0007"}, d2 = {"Lcom/astroluna/ui/payment/PaymentActivity$AndroidBridge;", "", "(Lcom/astroluna/ui/payment/PaymentActivity;)V", "onPaymentComplete", "", "status", "", "app_debug"})
    public final class AndroidBridge {
        
        public AndroidBridge() {
            super();
        }
        
        @android.webkit.JavascriptInterface()
        public final void onPaymentComplete(@org.jetbrains.annotations.NotNull()
        java.lang.String status) {
        }
    }
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000 \n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0010\b\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0003\n\u0002\u0010\u000b\n\u0000\b\u0086\u0003\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002R\u000e\u0010\u0003\u001a\u00020\u0004X\u0082T\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0005\u001a\u00020\u0006X\u0082T\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0007\u001a\u00020\u0006X\u0082T\u00a2\u0006\u0002\n\u0000R\u000e\u0010\b\u001a\u00020\u0006X\u0082T\u00a2\u0006\u0002\n\u0000R\u000e\u0010\t\u001a\u00020\nX\u0082T\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u000b"}, d2 = {"Lcom/astroluna/ui/payment/PaymentActivity$Companion;", "", "()V", "B2B_PG_REQUEST_CODE", "", "MERCHANT_ID", "", "SERVER_URL", "TAG", "USE_NATIVE_SDK", "", "app_debug"})
    public static final class Companion {
        
        private Companion() {
            super();
        }
    }
}