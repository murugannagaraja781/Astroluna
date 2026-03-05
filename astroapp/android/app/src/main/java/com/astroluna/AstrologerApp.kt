package com.astroluna

import android.app.Application

class AstrologerApp : Application() {
    override fun onCreate() {
        super.onCreate()

        try {
            com.google.firebase.FirebaseApp.initializeApp(this)
            com.google.firebase.crashlytics.FirebaseCrashlytics.getInstance().setCrashlyticsCollectionEnabled(true)
        } catch (e: Exception) {
            e.printStackTrace()
        }

        com.astroluna.data.remote.SocketManager.init()
    }
}
