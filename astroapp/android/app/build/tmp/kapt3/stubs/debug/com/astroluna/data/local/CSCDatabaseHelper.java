package com.astroluna.data.local;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000@\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u000b\n\u0000\n\u0002\u0010\u0002\n\u0002\b\u0003\n\u0002\u0010 \n\u0002\u0010$\n\u0002\u0010\u000e\n\u0002\b\u0006\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\b\n\u0002\b\u0003\u0018\u0000 \u001a2\u00020\u0001:\u0001\u001aB\r\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\u0002\u0010\u0004J\b\u0010\u0005\u001a\u00020\u0006H\u0002J\b\u0010\u0007\u001a\u00020\bH\u0002J\b\u0010\t\u001a\u00020\bH\u0002J\b\u0010\n\u001a\u00020\bH\u0002J \u0010\u000b\u001a\u0014\u0012\u0010\u0012\u000e\u0012\u0004\u0012\u00020\u000e\u0012\u0004\u0012\u00020\u000e0\r0\f2\u0006\u0010\u000f\u001a\u00020\u000eJ\u0018\u0010\u0010\u001a\u0014\u0012\u0010\u0012\u000e\u0012\u0004\u0012\u00020\u000e\u0012\u0004\u0012\u00020\u000e0\r0\fJ \u0010\u0011\u001a\u0014\u0012\u0010\u0012\u000e\u0012\u0004\u0012\u00020\u000e\u0012\u0004\u0012\u00020\u000e0\r0\f2\u0006\u0010\u0012\u001a\u00020\u000eJ\u0012\u0010\u0013\u001a\u00020\b2\b\u0010\u0014\u001a\u0004\u0018\u00010\u0015H\u0016J\"\u0010\u0016\u001a\u00020\b2\b\u0010\u0014\u001a\u0004\u0018\u00010\u00152\u0006\u0010\u0017\u001a\u00020\u00182\u0006\u0010\u0019\u001a\u00020\u0018H\u0016R\u000e\u0010\u0002\u001a\u00020\u0003X\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u001b"}, d2 = {"Lcom/astroluna/data/local/CSCDatabaseHelper;", "Landroid/database/sqlite/SQLiteOpenHelper;", "context", "Landroid/content/Context;", "(Landroid/content/Context;)V", "checkDataBase", "", "copyDBFile", "", "copyDataBase", "createEmptyTables", "getCities", "", "", "", "stateId", "getCountries", "getStates", "countryId", "onCreate", "db", "Landroid/database/sqlite/SQLiteDatabase;", "onUpgrade", "oldVersion", "", "newVersion", "Companion", "app_debug"})
public final class CSCDatabaseHelper extends android.database.sqlite.SQLiteOpenHelper {
    @org.jetbrains.annotations.NotNull()
    private final android.content.Context context = null;
    @org.jetbrains.annotations.NotNull()
    public static final java.lang.String DB_NAME = "csc.db";
    public static final int DB_VERSION = 1;
    @org.jetbrains.annotations.NotNull()
    private static java.lang.String DB_PATH = "";
    @org.jetbrains.annotations.NotNull()
    public static final com.astroluna.data.local.CSCDatabaseHelper.Companion Companion = null;
    
    public CSCDatabaseHelper(@org.jetbrains.annotations.NotNull()
    android.content.Context context) {
        super(null, null, null, 0);
    }
    
    private final boolean checkDataBase() {
        return false;
    }
    
    private final void copyDataBase() {
    }
    
    @kotlin.jvm.Throws(exceptionClasses = {java.io.IOException.class})
    private final void copyDBFile() throws java.io.IOException {
    }
    
    private final void createEmptyTables() {
    }
    
    @java.lang.Override()
    public void onCreate(@org.jetbrains.annotations.Nullable()
    android.database.sqlite.SQLiteDatabase db) {
    }
    
    @java.lang.Override()
    public void onUpgrade(@org.jetbrains.annotations.Nullable()
    android.database.sqlite.SQLiteDatabase db, int oldVersion, int newVersion) {
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.util.List<java.util.Map<java.lang.String, java.lang.String>> getCountries() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.util.List<java.util.Map<java.lang.String, java.lang.String>> getStates(@org.jetbrains.annotations.NotNull()
    java.lang.String countryId) {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.util.List<java.util.Map<java.lang.String, java.lang.String>> getCities(@org.jetbrains.annotations.NotNull()
    java.lang.String stateId) {
        return null;
    }
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\u001a\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0002\b\u0002\n\u0002\u0010\b\n\u0000\b\u0086\u0003\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002R\u000e\u0010\u0003\u001a\u00020\u0004X\u0086T\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0005\u001a\u00020\u0004X\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0006\u001a\u00020\u0007X\u0086T\u00a2\u0006\u0002\n\u0000\u00a8\u0006\b"}, d2 = {"Lcom/astroluna/data/local/CSCDatabaseHelper$Companion;", "", "()V", "DB_NAME", "", "DB_PATH", "DB_VERSION", "", "app_debug"})
    public static final class Companion {
        
        private Companion() {
            super();
        }
    }
}