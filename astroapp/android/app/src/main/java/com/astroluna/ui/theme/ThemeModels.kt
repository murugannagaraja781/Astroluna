package com.astroluna.ui.theme

import androidx.compose.ui.graphics.Color

enum class AppTheme(val title: String) {
    CosmicPurple("Cosmic Purple"),
    MidnightIndigo("Midnight Indigo"),
    RoyalBlue("Royal Blue Mystic"),
    EmeraldNight("Emerald Night"),
    CharcoalGold("Charcoal Gold"),
    DeepAmethyst("Deep Amethyst"),
    SunsetGlow("Sunset Glow"),
    OceanBreeze("Ocean Breeze"),
    ForestMystic("Forest Mystic"),
    RubyPassion("Ruby Passion")
}

data class ThemeColors(
    val bgStart: Color,
    val bgCenter: Color,
    val bgEnd: Color,
    val headerStart: Color,
    val headerEnd: Color,
    val cardBg: Color,
    val cardStroke: Color,
    val textPrimary: Color,
    val textSecondary: Color,
    val accent: Color
)

object ThemePalette {

    // Base Premium Template - Celestial Dark
    private val PremiumTemplate = ThemeColors(
        bgStart = Color(0xFF0B0F1A), // Deep Cosmic Dark
        bgCenter = Color(0xFF161B2E), // Secondary Deep Blue
        bgEnd = Color(0xFF0B0F1A),
        headerStart = Color(0xFF7C3AED), // Premium Purple
        headerEnd = Color(0xFFC026D3), // Vibrant Magenta
        cardBg = Color(0xFF161B2E), // Surface Blue
        cardStroke = Color(0xFF2E344E), // Subtle Glass Border
        textPrimary = Color(0xFFFFFFFF), // Pure White
        textSecondary = Color(0xFF94A3B8), // Muted Slate
        accent = Color(0xFFF59E0B) // Celestial Gold
    )

    // All themes are now forced to Premium as requested
    val CosmicPurple = PremiumTemplate
    val MidnightIndigo = PremiumTemplate
    val RoyalBlue = PremiumTemplate
    val EmeraldNight = PremiumTemplate
    val CharcoalGold = PremiumTemplate
    val DeepAmethyst = PremiumTemplate
    val SunsetGlow = PremiumTemplate
    val OceanBreeze = PremiumTemplate
    val ForestMystic = PremiumTemplate
    val RubyPassion = PremiumTemplate

    // Helper to get colors by enum
    fun getColors(theme: AppTheme): ThemeColors = PremiumTemplate
}
