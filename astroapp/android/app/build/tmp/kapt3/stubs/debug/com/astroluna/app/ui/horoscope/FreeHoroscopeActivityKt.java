package com.astroluna.app.ui.horoscope;

@kotlin.Metadata(mv = {1, 9, 0}, k = 2, xi = 48, d1 = {"\u0000.\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0006\n\u0000\n\u0002\u0010\u000e\n\u0002\b\t\n\u0002\u0010\u000b\n\u0002\b\u0005\u001a*\u0010\u0000\u001a\u00020\u00012\f\u0010\u0002\u001a\b\u0012\u0004\u0012\u00020\u00010\u00032\u0012\u0010\u0004\u001a\u000e\u0012\u0004\u0012\u00020\u0006\u0012\u0004\u0012\u00020\u00010\u0005H\u0007\u001aA\u0010\u0007\u001a\u0004\u0018\u00010\b2\b\u0010\t\u001a\u0004\u0018\u00010\n2\u0006\u0010\u000b\u001a\u00020\n2\u0006\u0010\f\u001a\u00020\n2\u0006\u0010\r\u001a\u00020\n2\u0006\u0010\u000e\u001a\u00020\n2\u0006\u0010\u000f\u001a\u00020\nH\u0002\u00a2\u0006\u0002\u0010\u0010\u001a\u0010\u0010\u0011\u001a\u00020\n2\u0006\u0010\u0012\u001a\u00020\bH\u0002\u001aO\u0010\u0013\u001a\u00020\u00142\u0006\u0010\u0015\u001a\u00020\n2\u0006\u0010\u000b\u001a\u00020\n2\u0006\u0010\f\u001a\u00020\n2\u0006\u0010\r\u001a\u00020\n2\u0006\u0010\u000e\u001a\u00020\n2\u0006\u0010\u000f\u001a\u00020\n2\u0006\u0010\u0016\u001a\u00020\n2\b\u0010\u0017\u001a\u0004\u0018\u00010\bH\u0002\u00a2\u0006\u0002\u0010\u0018\u00a8\u0006\u0019"}, d2 = {"FreeHoroscopeScreen", "", "onBackClick", "Lkotlin/Function0;", "onGenerateChart", "Lkotlin/Function1;", "Lcom/astroluna/app/ui/horoscope/BirthData;", "computeTimezoneOffsetHours", "", "timezoneId", "", "day", "month", "year", "hour", "minute", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/Double;", "formatUtcOffset", "offsetHours", "validateInputs", "", "name", "city", "timezone", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/Double;)Z", "app_debug"})
public final class FreeHoroscopeActivityKt {
    
    @kotlin.OptIn(markerClass = {androidx.compose.material3.ExperimentalMaterial3Api.class})
    @androidx.compose.runtime.Composable()
    public static final void FreeHoroscopeScreen(@org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function0<kotlin.Unit> onBackClick, @org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function1<? super com.astroluna.app.ui.horoscope.BirthData, kotlin.Unit> onGenerateChart) {
    }
    
    private static final boolean validateInputs(java.lang.String name, java.lang.String day, java.lang.String month, java.lang.String year, java.lang.String hour, java.lang.String minute, java.lang.String city, java.lang.Double timezone) {
        return false;
    }
    
    private static final java.lang.Double computeTimezoneOffsetHours(java.lang.String timezoneId, java.lang.String day, java.lang.String month, java.lang.String year, java.lang.String hour, java.lang.String minute) {
        return null;
    }
    
    private static final java.lang.String formatUtcOffset(double offsetHours) {
        return null;
    }
}