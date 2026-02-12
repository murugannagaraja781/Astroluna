package com.astroluna.app.ui.city;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000:\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0006\u0018\u00002\u00020\u0001B\r\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\u0002\u0010\u0004J\b\u0010\u000e\u001a\u00020\u000fH\u0002J\u000e\u0010\u0010\u001a\u00020\u000f2\u0006\u0010\u0011\u001a\u00020\u0012J\u000e\u0010\u0013\u001a\u00020\u000f2\u0006\u0010\u0014\u001a\u00020\u0012J\u000e\u0010\u0015\u001a\u00020\u000f2\u0006\u0010\u0016\u001a\u00020\u0012J\u0010\u0010\u0017\u001a\u00020\u000f2\u0006\u0010\u0014\u001a\u00020\u0012H\u0002R\u0014\u0010\u0005\u001a\b\u0012\u0004\u0012\u00020\u00070\u0006X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\b\u001a\u00020\tX\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u0017\u0010\n\u001a\b\u0012\u0004\u0012\u00020\u00070\u000b\u00a2\u0006\b\n\u0000\u001a\u0004\b\f\u0010\r\u00a8\u0006\u0018"}, d2 = {"Lcom/astroluna/app/ui/city/CityViewModel;", "Landroidx/lifecycle/AndroidViewModel;", "application", "Landroid/app/Application;", "(Landroid/app/Application;)V", "_uiState", "Lkotlinx/coroutines/flow/MutableStateFlow;", "Lcom/astroluna/app/ui/city/CSCUiState;", "repository", "Lcom/astroluna/app/data/repository/CSCRepository;", "uiState", "Lkotlinx/coroutines/flow/StateFlow;", "getUiState", "()Lkotlinx/coroutines/flow/StateFlow;", "loadCountries", "", "onCitySelected", "city", "Lcom/astroluna/app/ui/city/LocationItem;", "onCountrySelected", "country", "onStateSelected", "state", "selectDefaultCountryAndState", "app_debug"})
public final class CityViewModel extends androidx.lifecycle.AndroidViewModel {
    @org.jetbrains.annotations.NotNull()
    private final com.astroluna.app.data.repository.CSCRepository repository = null;
    @org.jetbrains.annotations.NotNull()
    private final kotlinx.coroutines.flow.MutableStateFlow<com.astroluna.app.ui.city.CSCUiState> _uiState = null;
    @org.jetbrains.annotations.NotNull()
    private final kotlinx.coroutines.flow.StateFlow<com.astroluna.app.ui.city.CSCUiState> uiState = null;
    
    public CityViewModel(@org.jetbrains.annotations.NotNull()
    android.app.Application application) {
        super(null);
    }
    
    @org.jetbrains.annotations.NotNull()
    public final kotlinx.coroutines.flow.StateFlow<com.astroluna.app.ui.city.CSCUiState> getUiState() {
        return null;
    }
    
    private final void loadCountries() {
    }
    
    private final void selectDefaultCountryAndState(com.astroluna.app.ui.city.LocationItem country) {
    }
    
    public final void onCountrySelected(@org.jetbrains.annotations.NotNull()
    com.astroluna.app.ui.city.LocationItem country) {
    }
    
    public final void onStateSelected(@org.jetbrains.annotations.NotNull()
    com.astroluna.app.ui.city.LocationItem state) {
    }
    
    public final void onCitySelected(@org.jetbrains.annotations.NotNull()
    com.astroluna.app.ui.city.LocationItem city) {
    }
}