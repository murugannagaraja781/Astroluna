package com.astroluna.app.data.repository;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000(\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010 \n\u0002\u0010$\n\u0002\u0010\u000e\n\u0002\b\u0007\u0018\u00002\u00020\u0001B\r\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\u0002\u0010\u0004J(\u0010\u0007\u001a\u0014\u0012\u0010\u0012\u000e\u0012\u0004\u0012\u00020\n\u0012\u0004\u0012\u00020\n0\t0\b2\u0006\u0010\u000b\u001a\u00020\nH\u0086@\u00a2\u0006\u0002\u0010\fJ \u0010\r\u001a\u0014\u0012\u0010\u0012\u000e\u0012\u0004\u0012\u00020\n\u0012\u0004\u0012\u00020\n0\t0\bH\u0086@\u00a2\u0006\u0002\u0010\u000eJ(\u0010\u000f\u001a\u0014\u0012\u0010\u0012\u000e\u0012\u0004\u0012\u00020\n\u0012\u0004\u0012\u00020\n0\t0\b2\u0006\u0010\u0010\u001a\u00020\nH\u0086@\u00a2\u0006\u0002\u0010\fR\u000e\u0010\u0005\u001a\u00020\u0006X\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u0011"}, d2 = {"Lcom/astroluna/app/data/repository/CSCRepository;", "", "context", "Landroid/content/Context;", "(Landroid/content/Context;)V", "dbHelper", "Lcom/astroluna/app/data/local/CSCDatabaseHelper;", "getCities", "", "", "", "stateId", "(Ljava/lang/String;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "getCountries", "(Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "getStates", "countryId", "app_release"})
public final class CSCRepository {
    @org.jetbrains.annotations.NotNull()
    private final com.astroluna.app.data.local.CSCDatabaseHelper dbHelper = null;
    
    public CSCRepository(@org.jetbrains.annotations.NotNull()
    android.content.Context context) {
        super();
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Object getCountries(@org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super java.util.List<? extends java.util.Map<java.lang.String, java.lang.String>>> $completion) {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Object getStates(@org.jetbrains.annotations.NotNull()
    java.lang.String countryId, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super java.util.List<? extends java.util.Map<java.lang.String, java.lang.String>>> $completion) {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Object getCities(@org.jetbrains.annotations.NotNull()
    java.lang.String stateId, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super java.util.List<? extends java.util.Map<java.lang.String, java.lang.String>>> $completion) {
        return null;
    }
}