package com.astroluna.app.ui.intake;

@kotlin.Metadata(mv = {1, 9, 0}, k = 2, xi = 48, d1 = {"\u0000P\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0004\n\u0002\u0010\u000b\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0005\n\u0002\u0010 \n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0005\n\u0002\u0010\u0006\n\u0002\b\n\n\u0002\u0018\u0002\n\u0002\b\u0002\u001a\u0088\u0001\u0010\u0000\u001a\u00020\u00012\b\u0010\u0002\u001a\u0004\u0018\u00010\u00032\u0006\u0010\u0004\u001a\u00020\u00032\b\u0010\u0005\u001a\u0004\u0018\u00010\u00032\b\u0010\u0006\u001a\u0004\u0018\u00010\u00032\u0006\u0010\u0007\u001a\u00020\b2\b\u0010\t\u001a\u0004\u0018\u00010\n2\b\u0010\u000b\u001a\u0004\u0018\u00010\u00032\u0006\u0010\f\u001a\u00020\r2\f\u0010\u000e\u001a\b\u0012\u0004\u0012\u00020\u00010\u000f2\u0018\u0010\u0010\u001a\u0014\u0012\u0004\u0012\u00020\u0003\u0012\u0004\u0012\u00020\u0003\u0012\u0004\u0012\u00020\u00010\u00112\f\u0010\u0012\u001a\b\u0012\u0004\u0012\u00020\u00010\u000fH\u0007\u001a:\u0010\u0013\u001a\u00020\u00012\u0006\u0010\u0014\u001a\u00020\u00032\u0006\u0010\u0015\u001a\u00020\u00032\f\u0010\u0016\u001a\b\u0012\u0004\u0012\u00020\u00030\u00172\u0012\u0010\u0018\u001a\u000e\u0012\u0004\u0012\u00020\u0003\u0012\u0004\u0012\u00020\u00010\u0019H\u0007\u001a \u0010\u001a\u001a\u00020\u00032\u0006\u0010\u001b\u001a\u00020\u00032\u0006\u0010\u001c\u001a\u00020\u00032\u0006\u0010\u001d\u001a\u00020\u0003H\u0002\u001aA\u0010\u001e\u001a\u0004\u0018\u00010\u001f2\b\u0010 \u001a\u0004\u0018\u00010\u00032\u0006\u0010!\u001a\u00020\u00032\u0006\u0010\"\u001a\u00020\u00032\u0006\u0010#\u001a\u00020\u00032\u0006\u0010$\u001a\u00020\u00032\u0006\u0010%\u001a\u00020\u0003H\u0002\u00a2\u0006\u0002\u0010&\u001a\u0010\u0010\'\u001a\u00020\u00032\u0006\u0010(\u001a\u00020\u001fH\u0002\u001a\"\u0010)\u001a\u0014\u0012\u0004\u0012\u00020\u0003\u0012\u0004\u0012\u00020\u0003\u0012\u0004\u0012\u00020\u00030*2\u0006\u0010+\u001a\u00020\u0003H\u0002\u00a8\u0006,"}, d2 = {"IntakeScreen", "", "partnerId", "", "partnerName", "partnerImage", "callType", "isEditMode", "", "existingData", "Lorg/json/JSONObject;", "targetUserId", "tokenManager", "Lcom/astroluna/app/data/local/TokenManager;", "onClose", "Lkotlin/Function0;", "onSessionConnected", "Lkotlin/Function2;", "onUnanswered", "SpinnerDropdown", "label", "selected", "items", "", "onSelect", "Lkotlin/Function1;", "buildPlaceName", "city", "state", "country", "computeTimezoneOffsetHours", "", "timezoneId", "day", "month", "year", "hour", "minute", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/Double;", "formatUtcOffset", "offsetHours", "parsePlaceName", "Lkotlin/Triple;", "place", "app_debug"})
public final class IntakeActivityKt {
    
    @kotlin.OptIn(markerClass = {androidx.compose.material3.ExperimentalMaterial3Api.class})
    @androidx.compose.runtime.Composable()
    public static final void IntakeScreen(@org.jetbrains.annotations.Nullable()
    java.lang.String partnerId, @org.jetbrains.annotations.NotNull()
    java.lang.String partnerName, @org.jetbrains.annotations.Nullable()
    java.lang.String partnerImage, @org.jetbrains.annotations.Nullable()
    java.lang.String callType, boolean isEditMode, @org.jetbrains.annotations.Nullable()
    org.json.JSONObject existingData, @org.jetbrains.annotations.Nullable()
    java.lang.String targetUserId, @org.jetbrains.annotations.NotNull()
    com.astroluna.app.data.local.TokenManager tokenManager, @org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function0<kotlin.Unit> onClose, @org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function2<? super java.lang.String, ? super java.lang.String, kotlin.Unit> onSessionConnected, @org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function0<kotlin.Unit> onUnanswered) {
    }
    
    @androidx.compose.runtime.Composable()
    public static final void SpinnerDropdown(@org.jetbrains.annotations.NotNull()
    java.lang.String label, @org.jetbrains.annotations.NotNull()
    java.lang.String selected, @org.jetbrains.annotations.NotNull()
    java.util.List<java.lang.String> items, @org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function1<? super java.lang.String, kotlin.Unit> onSelect) {
    }
    
    private static final java.lang.String buildPlaceName(java.lang.String city, java.lang.String state, java.lang.String country) {
        return null;
    }
    
    private static final kotlin.Triple<java.lang.String, java.lang.String, java.lang.String> parsePlaceName(java.lang.String place) {
        return null;
    }
    
    private static final java.lang.Double computeTimezoneOffsetHours(java.lang.String timezoneId, java.lang.String day, java.lang.String month, java.lang.String year, java.lang.String hour, java.lang.String minute) {
        return null;
    }
    
    private static final java.lang.String formatUtcOffset(double offsetHours) {
        return null;
    }
}