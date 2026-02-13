package com.astroluna.data.api;

@kotlin.Metadata(mv = { 1, 9, 0 }, k = 1, xi = 48, d1 = {
        "\u0000\\\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0007\n\u0002\u0018\u0002\n\u0002\b\u0006\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0010 \n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\bf\u0018\u00002\u00020\u0001J\u001e\u0010\u0002\u001a\b\u0012\u0004\u0012\u00020\u00040\u00032\b\b\u0001\u0010\u0005\u001a\u00020\u0006H\u00a7@\u00a2\u0006\u0002\u0010\u0007J\u001e\u0010\b\u001a\b\u0012\u0004\u0012\u00020\u00040\u00032\b\b\u0001\u0010\t\u001a\u00020\u0004H\u00a7@\u00a2\u0006\u0002\u0010\nJ\u0014\u0010\u000b\u001a\b\u0012\u0004\u0012\u00020\u00040\u0003H\u00a7@\u00a2\u0006\u0002\u0010\fJ\u0014\u0010\r\u001a\b\u0012\u0004\u0012\u00020\u000e0\u0003H\u00a7@\u00a2\u0006\u0002\u0010\fJ\u001e\u0010\u000f\u001a\b\u0012\u0004\u0012\u00020\u00040\u00032\b\b\u0001\u0010\t\u001a\u00020\u0004H\u00a7@\u00a2\u0006\u0002\u0010\nJ\u001e\u0010\u0010\u001a\b\u0012\u0004\u0012\u00020\u00040\u00032\b\b\u0001\u0010\u0011\u001a\u00020\u0006H\u00a7@\u00a2\u0006\u0002\u0010\u0007J\u001e\u0010\u0012\u001a\b\u0012\u0004\u0012\u00020\u00040\u00032\b\b\u0001\u0010\t\u001a\u00020\u0004H\u00a7@\u00a2\u0006\u0002\u0010\nJ\u001e\u0010\u0013\u001a\b\u0012\u0004\u0012\u00020\u00040\u00032\b\b\u0001\u0010\t\u001a\u00020\u0004H\u00a7@\u00a2\u0006\u0002\u0010\nJ\u001e\u0010\u0014\u001a\b\u0012\u0004\u0012\u00020\u00040\u00032\b\b\u0001\u0010\t\u001a\u00020\u0015H\u00a7@\u00a2\u0006\u0002\u0010\u0016J\u001e\u0010\u0017\u001a\b\u0012\u0004\u0012\u00020\u00040\u00032\b\b\u0001\u0010\t\u001a\u00020\u0004H\u00a7@\u00a2\u0006\u0002\u0010\nJ\u001e\u0010\u0018\u001a\b\u0012\u0004\u0012\u00020\u00040\u00032\b\b\u0001\u0010\t\u001a\u00020\u0004H\u00a7@\u00a2\u0006\u0002\u0010\nJ\u001a\u0010\u0019\u001a\u000e\u0012\n\u0012\b\u0012\u0004\u0012\u00020\u001b0\u001a0\u0003H\u00a7@\u00a2\u0006\u0002\u0010\fJ\u001e\u0010\u001c\u001a\b\u0012\u0004\u0012\u00020\u00040\u00032\b\b\u0001\u0010\u001d\u001a\u00020\u0006H\u00a7@\u00a2\u0006\u0002\u0010\u0007J\u001e\u0010\u001e\u001a\b\u0012\u0004\u0012\u00020\u001f0\u00032\b\b\u0001\u0010\u001d\u001a\u00020\u0006H\u00a7@\u00a2\u0006\u0002\u0010\u0007J\u001e\u0010 \u001a\b\u0012\u0004\u0012\u00020!0\u00032\b\b\u0001\u0010\t\u001a\u00020\u0015H\u00a7@\u00a2\u0006\u0002\u0010\u0016J\u001e\u0010\"\u001a\b\u0012\u0004\u0012\u00020\u00040\u00032\b\b\u0001\u0010\t\u001a\u00020\u0004H\u00a7@\u00a2\u0006\u0002\u0010\nJ\u001e\u0010#\u001a\b\u0012\u0004\u0012\u00020\u00040\u00032\b\b\u0001\u0010\t\u001a\u00020\u0004H\u00a7@\u00a2\u0006\u0002\u0010\nJ\u001e\u0010$\u001a\b\u0012\u0004\u0012\u00020\u00040\u00032\b\b\u0001\u0010\t\u001a\u00020%H\u00a7@\u00a2\u0006\u0002\u0010&J\u001e\u0010\'\u001a\b\u0012\u0004\u0012\u00020(0\u00032\b\b\u0001\u0010\t\u001a\u00020\u0015H\u00a7@\u00a2\u0006\u0002\u0010\u0016J\u001e\u0010)\u001a\b\u0012\u0004\u0012\u00020\u001f0\u00032\b\b\u0001\u0010\t\u001a\u00020*H\u00a7@\u00a2\u0006\u0002\u0010+\u00a8\u0006," }, d2 = {
                "Lcom/astroluna/data/api/ApiInterface;", "", "checkPaymentStatus", "Lretrofit2/Response;",
                "Lcom/google/gson/JsonObject;", "transactionId", "",
                "(Ljava/lang/String;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "generateRasiChart",
                "request", "(Lcom/google/gson/JsonObject;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;",
                "getAcademyVideos", "(Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "getBanners",
                "Lcom/astroluna/data/model/BannerResponse;", "getBirthChart", "getChatHistory", "sessionId",
                "getCityTimezone", "getMatchPorutham", "getPaymentToken",
                "Lcom/astroluna/data/model/PaymentInitiateRequest;",
                "(Lcom/astroluna/data/model/PaymentInitiateRequest;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;",
                "getRasiEngBirthChart", "getRasiEngMatching", "getRasipalan", "",
                "Lcom/astroluna/data/model/RasipalanItem;", "getUserIntake", "userId", "getUserProfile",
                "Lcom/astroluna/data/model/AuthResponse;", "initiatePayment",
                "Lcom/astroluna/data/model/PaymentInitiateResponse;", "saveUserIntake", "searchCity", "sendOtp",
                "Lcom/astroluna/data/model/SendOtpRequest;",
                "(Lcom/astroluna/data/model/SendOtpRequest;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;",
                "signPhonePe", "Lcom/astroluna/data/model/PhonePeSignResponse;", "verifyOtp",
                "Lcom/astroluna/data/model/VerifyOtpRequest;",
                "(Lcom/astroluna/data/model/VerifyOtpRequest;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;",
                "app_debug" })
public abstract interface ApiInterface {

    @retrofit2.http.POST(value = "api/send-otp")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object sendOtp(
            @retrofit2.http.Body() @org.jetbrains.annotations.NotNull() com.astroluna.data.model.SendOtpRequest request,
            @org.jetbrains.annotations.NotNull() kotlin.coroutines.Continuation<? super retrofit2.Response<com.google.gson.JsonObject>> $completion);

    @retrofit2.http.POST(value = "api/verify-otp")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object verifyOtp(
            @retrofit2.http.Body() @org.jetbrains.annotations.NotNull() com.astroluna.data.model.VerifyOtpRequest request,
            @org.jetbrains.annotations.NotNull() kotlin.coroutines.Continuation<? super retrofit2.Response<com.astroluna.data.model.AuthResponse>> $completion);

    @retrofit2.http.POST(value = "api/payment/create")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object initiatePayment(
            @retrofit2.http.Body() @org.jetbrains.annotations.NotNull() com.astroluna.data.model.PaymentInitiateRequest request,
            @org.jetbrains.annotations.NotNull() kotlin.coroutines.Continuation<? super retrofit2.Response<com.astroluna.data.model.PaymentInitiateResponse>> $completion);

    @retrofit2.http.POST(value = "api/phonepe/sign")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object signPhonePe(
            @retrofit2.http.Body() @org.jetbrains.annotations.NotNull() com.astroluna.data.model.PaymentInitiateRequest request,
            @org.jetbrains.annotations.NotNull() kotlin.coroutines.Continuation<? super retrofit2.Response<com.astroluna.data.model.PhonePeSignResponse>> $completion);

    @retrofit2.http.GET(value = "api/phonepe/status/{transactionId}")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object checkPaymentStatus(
            @retrofit2.http.Path(value = "transactionId") @org.jetbrains.annotations.NotNull() java.lang.String transactionId,
            @org.jetbrains.annotations.NotNull() kotlin.coroutines.Continuation<? super retrofit2.Response<com.google.gson.JsonObject>> $completion);

    @retrofit2.http.POST(value = "api/payment/token")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object getPaymentToken(
            @retrofit2.http.Body() @org.jetbrains.annotations.NotNull() com.astroluna.data.model.PaymentInitiateRequest request,
            @org.jetbrains.annotations.NotNull() kotlin.coroutines.Continuation<? super retrofit2.Response<com.google.gson.JsonObject>> $completion);

    @retrofit2.http.GET(value = "api/user/{userId}")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object getUserProfile(
            @retrofit2.http.Path(value = "userId") @org.jetbrains.annotations.NotNull() java.lang.String userId,
            @org.jetbrains.annotations.NotNull() kotlin.coroutines.Continuation<? super retrofit2.Response<com.astroluna.data.model.AuthResponse>> $completion);

    @retrofit2.http.POST(value = "api/city-autocomplete")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object searchCity(
            @retrofit2.http.Body() @org.jetbrains.annotations.NotNull() com.google.gson.JsonObject request,
            @org.jetbrains.annotations.NotNull() kotlin.coroutines.Continuation<? super retrofit2.Response<com.google.gson.JsonObject>> $completion);

    @retrofit2.http.POST(value = "api/city-timezone")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object getCityTimezone(
            @retrofit2.http.Body() @org.jetbrains.annotations.NotNull() com.google.gson.JsonObject request,
            @org.jetbrains.annotations.NotNull() kotlin.coroutines.Continuation<? super retrofit2.Response<com.google.gson.JsonObject>> $completion);

    @retrofit2.http.GET(value = "api/home/banners")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object getBanners(
            @org.jetbrains.annotations.NotNull() kotlin.coroutines.Continuation<? super retrofit2.Response<com.astroluna.data.model.BannerResponse>> $completion);

    @retrofit2.http.POST(value = "api/charts/birth-chart")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object getBirthChart(
            @retrofit2.http.Body() @org.jetbrains.annotations.NotNull() com.google.gson.JsonObject request,
            @org.jetbrains.annotations.NotNull() kotlin.coroutines.Continuation<? super retrofit2.Response<com.google.gson.JsonObject>> $completion);

    @retrofit2.http.POST(value = "api/match/porutham")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object getMatchPorutham(
            @retrofit2.http.Body() @org.jetbrains.annotations.NotNull() com.google.gson.JsonObject request,
            @org.jetbrains.annotations.NotNull() kotlin.coroutines.Continuation<? super retrofit2.Response<com.google.gson.JsonObject>> $completion);

    @retrofit2.http.POST(value = "api/rasi-eng/charts/full")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object getRasiEngBirthChart(
            @retrofit2.http.Body() @org.jetbrains.annotations.NotNull() com.google.gson.JsonObject request,
            @org.jetbrains.annotations.NotNull() kotlin.coroutines.Continuation<? super retrofit2.Response<com.google.gson.JsonObject>> $completion);

    @retrofit2.http.POST(value = "api/rasi-eng/matching")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object getRasiEngMatching(
            @retrofit2.http.Body() @org.jetbrains.annotations.NotNull() com.google.gson.JsonObject request,
            @org.jetbrains.annotations.NotNull() kotlin.coroutines.Continuation<? super retrofit2.Response<com.google.gson.JsonObject>> $completion);

    @retrofit2.http.GET(value = "api/academy/videos")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object getAcademyVideos(
            @org.jetbrains.annotations.NotNull() kotlin.coroutines.Continuation<? super retrofit2.Response<com.google.gson.JsonObject>> $completion);

    @retrofit2.http.GET(value = "api/user/{userId}/intake")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object getUserIntake(
            @retrofit2.http.Path(value = "userId") @org.jetbrains.annotations.NotNull() java.lang.String userId,
            @org.jetbrains.annotations.NotNull() kotlin.coroutines.Continuation<? super retrofit2.Response<com.google.gson.JsonObject>> $completion);

    @retrofit2.http.POST(value = "api/user/intake")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object saveUserIntake(
            @retrofit2.http.Body() @org.jetbrains.annotations.NotNull() com.google.gson.JsonObject request,
            @org.jetbrains.annotations.NotNull() kotlin.coroutines.Continuation<? super retrofit2.Response<com.google.gson.JsonObject>> $completion);

    @retrofit2.http.GET(value = "api/chat/history/{sessionId}")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object getChatHistory(
            @retrofit2.http.Path(value = "sessionId") @org.jetbrains.annotations.NotNull() java.lang.String sessionId,
            @org.jetbrains.annotations.NotNull() kotlin.coroutines.Continuation<? super retrofit2.Response<com.google.gson.JsonObject>> $completion);

    @retrofit2.http.GET(value = "https://astroluna.com/api/horoscope/rasi-palan")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object getRasipalan(
            @org.jetbrains.annotations.NotNull() kotlin.coroutines.Continuation<? super retrofit2.Response<java.util.List<com.astroluna.data.model.RasipalanItem>>> $completion);

    @retrofit2.http.POST(value = "api/horoscope/generate-chart")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object generateRasiChart(
            @retrofit2.http.Body() @org.jetbrains.annotations.NotNull() com.google.gson.JsonObject request,
            @org.jetbrains.annotations.NotNull() kotlin.coroutines.Continuation<? super retrofit2.Response<com.google.gson.JsonObject>> $completion);
}