package com.astroluna.app.ui.call;

@kotlin.Metadata(mv = {1, 9, 0}, k = 2, xi = 48, d1 = {"\u00000\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0002\b\u0003\n\u0002\u0010\u000b\n\u0002\b\u0007\n\u0002\u0018\u0002\n\u0002\b\u000b\n\u0002\u0010\u0000\n\u0002\b\u0003\u001a\u00e0\u0001\u0010\u0000\u001a\u00020\u00012\u0006\u0010\u0002\u001a\u00020\u00032\u0006\u0010\u0004\u001a\u00020\u00032\u0006\u0010\u0005\u001a\u00020\u00062\u0006\u0010\u0007\u001a\u00020\u00062\u0006\u0010\b\u001a\u00020\u00062\u0006\u0010\t\u001a\u00020\n2\u0006\u0010\u000b\u001a\u00020\u00062\u0006\u0010\f\u001a\u00020\n2\u0006\u0010\r\u001a\u00020\n2\u0006\u0010\u000e\u001a\u00020\n2\u0006\u0010\u000f\u001a\u00020\u00062\u0006\u0010\u0010\u001a\u00020\u00062\f\u0010\u0011\u001a\b\u0012\u0004\u0012\u00020\u00010\u00122\f\u0010\u0013\u001a\b\u0012\u0004\u0012\u00020\u00010\u00122\f\u0010\u0014\u001a\b\u0012\u0004\u0012\u00020\u00010\u00122\f\u0010\u0015\u001a\b\u0012\u0004\u0012\u00020\u00010\u00122\f\u0010\u0016\u001a\b\u0012\u0004\u0012\u00020\u00010\u00122\f\u0010\u0017\u001a\b\u0012\u0004\u0012\u00020\u00010\u00122\b\b\u0002\u0010\u0018\u001a\u00020\n2\u000e\b\u0002\u0010\u0019\u001a\b\u0012\u0004\u0012\u00020\u00010\u00122\b\b\u0002\u0010\u001a\u001a\u00020\nH\u0007\u001a.\u0010\u001b\u001a\u00020\u00012\f\u0010\u001c\u001a\b\u0012\u0004\u0012\u00020\u00010\u00122\u0006\u0010\u001d\u001a\u00020\u001e2\u0006\u0010\u001f\u001a\u00020\u00062\u0006\u0010 \u001a\u00020\nH\u0007\u00a8\u0006!"}, d2 = {"CallScreen", "", "remoteRenderer", "Lorg/webrtc/SurfaceViewRenderer;", "localRenderer", "partnerName", "", "duration", "statusText", "isBillingActive", "", "callType", "isMuted", "isVideoEnabled", "isSpeakerOn", "role", "remainingTime", "onToggleMic", "Lkotlin/Function0;", "onToggleCamera", "onToggleSpeaker", "onEndCall", "onEditIntake", "onShowRasi", "isRecording", "onToggleRecording", "isReady", "ControlBtnItem", "onClick", "icon", "", "label", "active", "app_release"})
public final class CallActivityKt {
    
    @androidx.compose.runtime.Composable()
    public static final void CallScreen(@org.jetbrains.annotations.NotNull()
    org.webrtc.SurfaceViewRenderer remoteRenderer, @org.jetbrains.annotations.NotNull()
    org.webrtc.SurfaceViewRenderer localRenderer, @org.jetbrains.annotations.NotNull()
    java.lang.String partnerName, @org.jetbrains.annotations.NotNull()
    java.lang.String duration, @org.jetbrains.annotations.NotNull()
    java.lang.String statusText, boolean isBillingActive, @org.jetbrains.annotations.NotNull()
    java.lang.String callType, boolean isMuted, boolean isVideoEnabled, boolean isSpeakerOn, @org.jetbrains.annotations.NotNull()
    java.lang.String role, @org.jetbrains.annotations.NotNull()
    java.lang.String remainingTime, @org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function0<kotlin.Unit> onToggleMic, @org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function0<kotlin.Unit> onToggleCamera, @org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function0<kotlin.Unit> onToggleSpeaker, @org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function0<kotlin.Unit> onEndCall, @org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function0<kotlin.Unit> onEditIntake, @org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function0<kotlin.Unit> onShowRasi, boolean isRecording, @org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function0<kotlin.Unit> onToggleRecording, boolean isReady) {
    }
    
    @androidx.compose.runtime.Composable()
    public static final void ControlBtnItem(@org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function0<kotlin.Unit> onClick, @org.jetbrains.annotations.NotNull()
    java.lang.Object icon, @org.jetbrains.annotations.NotNull()
    java.lang.String label, boolean active) {
    }
}