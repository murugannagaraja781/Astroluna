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

    // Base Premium Template - Celestial Dark (Kept for reference or future use)
    private val DarkTemplate = ThemeColors(
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

    // Base Light Template - Requested by referthecode standards
    private val LightTemplate = ThemeColors(
        bgStart = Color(0xFFFFFFFF), // Pure White top
        bgCenter = Color(0xFFF0FDF4), // Mint/Emerald White from referthecode
        bgEnd = Color(0xFFDCFCE7), // Soft premium green base
        headerStart = Color(0xFF059669), // Emerald Green (referthecode primary)
        headerEnd = Color(0xFF10B981),
        cardBg = Color(0xFFFFFFFF), // White Cards
        cardStroke = Color(0xFFD1FAE5), // Mint border
        textPrimary = Color(0xFF111827), // Deep Gray/Black
        textSecondary = Color(0xFF4B5563), // Muted Gray
        accent = Color(0xFFD97706) // Premium Gold Accent
    )

    // All themes are now forced to Light as requested
    val CosmicPurple = LightTemplate
    val MidnightIndigo = LightTemplate
    val RoyalBlue = LightTemplate
    val EmeraldNight = LightTemplate
    val CharcoalGold = LightTemplate
    val DeepAmethyst = LightTemplate
    val SunsetGlow = LightTemplate
    val OceanBreeze = LightTemplate
    val ForestMystic = LightTemplate
    val RubyPassion = LightTemplate

    // Helper to get colors by enum
    fun getColors(theme: AppTheme): ThemeColors = LightTemplate
}
