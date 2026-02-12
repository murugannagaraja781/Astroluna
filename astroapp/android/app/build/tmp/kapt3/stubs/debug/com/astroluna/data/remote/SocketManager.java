package com.astroluna.data.remote;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000f\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0002\b\u0002\n\u0002\u0010\u000b\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0005\n\u0002\u0018\u0002\n\u0002\u0010 \n\u0002\b\t\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0005\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u0006\n\u0002\b\u0002\n\u0002\u0010\b\n\u0002\b\u0013\b\u00c6\u0002\u0018\u00002\u00020\u0001:\u0001@B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002J\u0006\u0010\n\u001a\u00020\u000bJ\u000e\u0010\f\u001a\u00020\u000b2\u0006\u0010\r\u001a\u00020\u000eJ\u0010\u0010\u000f\u001a\u00020\u000b2\b\u0010\u0010\u001a\u0004\u0018\u00010\u0004J\u0006\u0010\u0011\u001a\u00020\u000bJ(\u0010\u0012\u001a\u00020\u000b2\u0006\u0010\u0010\u001a\u00020\u00042\u0018\u0010\u0013\u001a\u0014\u0012\n\u0012\b\u0012\u0004\u0012\u00020\u000e0\u0015\u0012\u0004\u0012\u00020\u000b0\u0014J \u0010\u0016\u001a\u00020\u000b2\u0018\u0010\u0013\u001a\u0014\u0012\n\u0012\b\u0012\u0004\u0012\u00020\u000e0\u0015\u0012\u0004\u0012\u00020\u000b0\u0014J\b\u0010\u0017\u001a\u0004\u0018\u00010\tJ\u0006\u0010\u0018\u001a\u00020\u000bJ\u000e\u0010\u0019\u001a\u00020\u000b2\u0006\u0010\u001a\u001a\u00020\u0004J\u0006\u0010\u001b\u001a\u00020\u000bJ\u001a\u0010\u001c\u001a\u00020\u000b2\u0012\u0010\u001d\u001a\u000e\u0012\u0004\u0012\u00020\u000e\u0012\u0004\u0012\u00020\u000b0\u0014J\u001a\u0010\u001e\u001a\u00020\u000b2\u0012\u0010\u001d\u001a\u000e\u0012\u0004\u0012\u00020\u001f\u0012\u0004\u0012\u00020\u000b0\u0014J\u0014\u0010 \u001a\u00020\u000b2\f\u0010\u001d\u001a\b\u0012\u0004\u0012\u00020\u000b0!J\u001a\u0010\"\u001a\u00020\u000b2\u0012\u0010\u001d\u001a\u000e\u0012\u0004\u0012\u00020\u000e\u0012\u0004\u0012\u00020\u000b0\u0014J\u001a\u0010#\u001a\u00020\u000b2\u0012\u0010\u001d\u001a\u000e\u0012\u0004\u0012\u00020\u000e\u0012\u0004\u0012\u00020\u000b0\u0014J\u001a\u0010$\u001a\u00020\u000b2\u0012\u0010\u001d\u001a\u000e\u0012\u0004\u0012\u00020\u000e\u0012\u0004\u0012\u00020\u000b0\u0014J\u0014\u0010%\u001a\u00020\u000b2\f\u0010\u001d\u001a\b\u0012\u0004\u0012\u00020\u000b0!Jh\u0010&\u001a\u00020\u000b2`\u0010\u001d\u001a\\\u0012\u0013\u0012\u00110\u0004\u00a2\u0006\f\b(\u0012\b\b)\u0012\u0004\b\b(*\u0012\u0013\u0012\u00110+\u00a2\u0006\f\b(\u0012\b\b)\u0012\u0004\b\b(,\u0012\u0013\u0012\u00110+\u00a2\u0006\f\b(\u0012\b\b)\u0012\u0004\b\b(-\u0012\u0013\u0012\u00110.\u00a2\u0006\f\b(\u0012\b\b)\u0012\u0004\b\b(/\u0012\u0004\u0012\u00020\u000b0\'J\u001a\u00100\u001a\u00020\u000b2\u0012\u0010\u001d\u001a\u000e\u0012\u0004\u0012\u00020\u000e\u0012\u0004\u0012\u00020\u000b0\u0014J\u001a\u00101\u001a\u00020\u000b2\u0012\u0010\u001d\u001a\u000e\u0012\u0004\u0012\u00020+\u0012\u0004\u0012\u00020\u000b0\u0014J&\u00102\u001a\u00020\u000b2\u0006\u00103\u001a\u00020\u00042\u0016\b\u0002\u0010\u0013\u001a\u0010\u0012\u0004\u0012\u00020\u0007\u0012\u0004\u0012\u00020\u000b\u0018\u00010\u0014J\u0006\u00104\u001a\u00020\u000bJ<\u00105\u001a\u00020\u000b2\u0006\u00106\u001a\u00020\u00042\u0006\u00107\u001a\u00020\u00042\n\b\u0002\u00108\u001a\u0004\u0018\u00010\u000e2\u0018\b\u0002\u0010\u0013\u001a\u0012\u0012\u0006\u0012\u0004\u0018\u00010\u000e\u0012\u0004\u0012\u00020\u000b\u0018\u00010\u0014J(\u00109\u001a\u00020\u000b2\u0006\u0010:\u001a\u00020+2\u0018\b\u0002\u0010\u0013\u001a\u0012\u0012\u0006\u0012\u0004\u0018\u00010\u000e\u0012\u0004\u0012\u00020\u000b\u0018\u00010\u0014J(\u0010;\u001a\u00020\u000b2\u0006\u0010<\u001a\u00020\u000e2\u0018\b\u0002\u0010\u0013\u001a\u0012\u0012\u0006\u0012\u0004\u0018\u00010\u000e\u0012\u0004\u0012\u00020\u000b\u0018\u00010\u0014J\u001e\u0010=\u001a\u00020\u000b2\u0006\u00103\u001a\u00020\u00042\u0006\u0010>\u001a\u00020\u00042\u0006\u0010?\u001a\u00020\u0007R\u000e\u0010\u0003\u001a\u00020\u0004X\u0082T\u00a2\u0006\u0002\n\u0000R\u0010\u0010\u0005\u001a\u0004\u0018\u00010\u0004X\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0006\u001a\u00020\u0007X\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u0010\u0010\b\u001a\u0004\u0018\u00010\tX\u0082\u000e\u00a2\u0006\u0002\n\u0000\u00a8\u0006A"}, d2 = {"Lcom/astroluna/data/remote/SocketManager;", "", "()V", "TAG", "", "currentUserId", "initialized", "", "socket", "Lio/socket/client/Socket;", "disconnect", "", "emitSignal", "data", "Lorg/json/JSONObject;", "endSession", "sessionId", "ensureConnection", "getHistory", "callback", "Lkotlin/Function1;", "", "getMyWithdrawals", "getSocket", "init", "off", "event", "offIncomingSession", "onAstrologerUpdate", "listener", "onBillingStarted", "Lcom/astroluna/data/remote/SocketManager$BillingInfo;", "onConnect", "Lkotlin/Function0;", "onIncomingSession", "onMessageStatus", "onSessionAnswered", "onSessionEnded", "onSessionEndedWithSummary", "Lkotlin/Function4;", "Lkotlin/ParameterName;", "name", "reason", "", "deducted", "earned", "", "duration", "onSignal", "onWalletUpdate", "registerUser", "userId", "removeChatListeners", "requestSession", "toUserId", "type", "birthData", "requestWithdrawal", "amount", "updateProfile", "updates", "updateServiceStatus", "service", "isEnabled", "BillingInfo", "app_debug"})
public final class SocketManager {
    @org.jetbrains.annotations.NotNull()
    private static final java.lang.String TAG = "SocketManager";
    @org.jetbrains.annotations.Nullable()
    private static io.socket.client.Socket socket;
    private static boolean initialized = false;
    @org.jetbrains.annotations.Nullable()
    private static java.lang.String currentUserId;
    @org.jetbrains.annotations.NotNull()
    public static final com.astroluna.data.remote.SocketManager INSTANCE = null;
    
    private SocketManager() {
        super();
    }
    
    public final void init() {
    }
    
    public final void ensureConnection() {
    }
    
    public final void registerUser(@org.jetbrains.annotations.NotNull()
    java.lang.String userId, @org.jetbrains.annotations.Nullable()
    kotlin.jvm.functions.Function1<? super java.lang.Boolean, kotlin.Unit> callback) {
    }
    
    @org.jetbrains.annotations.Nullable()
    public final io.socket.client.Socket getSocket() {
        return null;
    }
    
    public final void requestSession(@org.jetbrains.annotations.NotNull()
    java.lang.String toUserId, @org.jetbrains.annotations.NotNull()
    java.lang.String type, @org.jetbrains.annotations.Nullable()
    org.json.JSONObject birthData, @org.jetbrains.annotations.Nullable()
    kotlin.jvm.functions.Function1<? super org.json.JSONObject, kotlin.Unit> callback) {
    }
    
    public final void onSessionAnswered(@org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function1<? super org.json.JSONObject, kotlin.Unit> listener) {
    }
    
    public final void onSignal(@org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function1<? super org.json.JSONObject, kotlin.Unit> listener) {
    }
    
    public final void emitSignal(@org.jetbrains.annotations.NotNull()
    org.json.JSONObject data) {
    }
    
    public final void onMessageStatus(@org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function1<? super org.json.JSONObject, kotlin.Unit> listener) {
    }
    
    public final void endSession(@org.jetbrains.annotations.Nullable()
    java.lang.String sessionId) {
    }
    
    public final void getHistory(@org.jetbrains.annotations.NotNull()
    java.lang.String sessionId, @org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function1<? super java.util.List<? extends org.json.JSONObject>, kotlin.Unit> callback) {
    }
    
    public final void onSessionEnded(@org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function0<kotlin.Unit> listener) {
    }
    
    public final void onSessionEndedWithSummary(@org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function4<? super java.lang.String, ? super java.lang.Double, ? super java.lang.Double, ? super java.lang.Integer, kotlin.Unit> listener) {
    }
    
    public final void onBillingStarted(@org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function1<? super com.astroluna.data.remote.SocketManager.BillingInfo, kotlin.Unit> listener) {
    }
    
    public final void onWalletUpdate(@org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function1<? super java.lang.Double, kotlin.Unit> listener) {
    }
    
    public final void off(@org.jetbrains.annotations.NotNull()
    java.lang.String event) {
    }
    
    public final void onConnect(@org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function0<kotlin.Unit> listener) {
    }
    
    public final void updateServiceStatus(@org.jetbrains.annotations.NotNull()
    java.lang.String userId, @org.jetbrains.annotations.NotNull()
    java.lang.String service, boolean isEnabled) {
    }
    
    public final void onAstrologerUpdate(@org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function1<? super org.json.JSONObject, kotlin.Unit> listener) {
    }
    
    public final void onIncomingSession(@org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function1<? super org.json.JSONObject, kotlin.Unit> listener) {
    }
    
    public final void offIncomingSession() {
    }
    
    public final void updateProfile(@org.jetbrains.annotations.NotNull()
    org.json.JSONObject updates, @org.jetbrains.annotations.Nullable()
    kotlin.jvm.functions.Function1<? super org.json.JSONObject, kotlin.Unit> callback) {
    }
    
    public final void requestWithdrawal(double amount, @org.jetbrains.annotations.Nullable()
    kotlin.jvm.functions.Function1<? super org.json.JSONObject, kotlin.Unit> callback) {
    }
    
    public final void getMyWithdrawals(@org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function1<? super java.util.List<? extends org.json.JSONObject>, kotlin.Unit> callback) {
    }
    
    public final void disconnect() {
    }
    
    public final void removeChatListeners() {
    }
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000.\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010\t\n\u0000\n\u0002\u0010\u0006\n\u0002\b\u0002\n\u0002\u0010\b\n\u0002\b\u000e\n\u0002\u0010\u000b\n\u0002\b\u0003\n\u0002\u0010\u000e\n\u0000\b\u0086\b\u0018\u00002\u00020\u0001B%\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0005\u0012\u0006\u0010\u0006\u001a\u00020\u0005\u0012\u0006\u0010\u0007\u001a\u00020\b\u00a2\u0006\u0002\u0010\tJ\t\u0010\u0011\u001a\u00020\u0003H\u00c6\u0003J\t\u0010\u0012\u001a\u00020\u0005H\u00c6\u0003J\t\u0010\u0013\u001a\u00020\u0005H\u00c6\u0003J\t\u0010\u0014\u001a\u00020\bH\u00c6\u0003J1\u0010\u0015\u001a\u00020\u00002\b\b\u0002\u0010\u0002\u001a\u00020\u00032\b\b\u0002\u0010\u0004\u001a\u00020\u00052\b\b\u0002\u0010\u0006\u001a\u00020\u00052\b\b\u0002\u0010\u0007\u001a\u00020\bH\u00c6\u0001J\u0013\u0010\u0016\u001a\u00020\u00172\b\u0010\u0018\u001a\u0004\u0018\u00010\u0001H\u00d6\u0003J\t\u0010\u0019\u001a\u00020\bH\u00d6\u0001J\t\u0010\u001a\u001a\u00020\u001bH\u00d6\u0001R\u0011\u0010\u0007\u001a\u00020\b\u00a2\u0006\b\n\u0000\u001a\u0004\b\n\u0010\u000bR\u0011\u0010\u0004\u001a\u00020\u0005\u00a2\u0006\b\n\u0000\u001a\u0004\b\f\u0010\rR\u0011\u0010\u0006\u001a\u00020\u0005\u00a2\u0006\b\n\u0000\u001a\u0004\b\u000e\u0010\rR\u0011\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u000f\u0010\u0010\u00a8\u0006\u001c"}, d2 = {"Lcom/astroluna/data/remote/SocketManager$BillingInfo;", "", "startTime", "", "clientBalance", "", "ratePerMinute", "availableMinutes", "", "(JDDI)V", "getAvailableMinutes", "()I", "getClientBalance", "()D", "getRatePerMinute", "getStartTime", "()J", "component1", "component2", "component3", "component4", "copy", "equals", "", "other", "hashCode", "toString", "", "app_debug"})
    public static final class BillingInfo {
        private final long startTime = 0L;
        private final double clientBalance = 0.0;
        private final double ratePerMinute = 0.0;
        private final int availableMinutes = 0;
        
        public BillingInfo(long startTime, double clientBalance, double ratePerMinute, int availableMinutes) {
            super();
        }
        
        public final long getStartTime() {
            return 0L;
        }
        
        public final double getClientBalance() {
            return 0.0;
        }
        
        public final double getRatePerMinute() {
            return 0.0;
        }
        
        public final int getAvailableMinutes() {
            return 0;
        }
        
        public final long component1() {
            return 0L;
        }
        
        public final double component2() {
            return 0.0;
        }
        
        public final double component3() {
            return 0.0;
        }
        
        public final int component4() {
            return 0;
        }
        
        @org.jetbrains.annotations.NotNull()
        public final com.astroluna.data.remote.SocketManager.BillingInfo copy(long startTime, double clientBalance, double ratePerMinute, int availableMinutes) {
            return null;
        }
        
        @java.lang.Override()
        public boolean equals(@org.jetbrains.annotations.Nullable()
        java.lang.Object other) {
            return false;
        }
        
        @java.lang.Override()
        public int hashCode() {
            return 0;
        }
        
        @java.lang.Override()
        @org.jetbrains.annotations.NotNull()
        public java.lang.String toString() {
            return null;
        }
    }
}