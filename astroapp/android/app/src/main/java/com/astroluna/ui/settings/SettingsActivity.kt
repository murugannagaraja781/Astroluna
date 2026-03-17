package com.astroluna.ui.settings

import android.content.Context
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.astroluna.data.local.ThemeManager
import com.astroluna.ui.theme.CosmicAppTheme

class SettingsActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            CosmicAppTheme {
                ThemeSelectionScreen(
                    onBack = { finish() }
                )
            }
        }
    }
}

@Composable
fun ThemeSelectionScreen(onBack: () -> Unit) {
    val context = LocalContext.current
    val customBgColor by ThemeManager.customBgColor.collectAsState()

    // Predefined Custom Colors for selection
    val customColors = listOf(
        Color(0xFF000000), // Pure Black
        Color(0xFF0F0B1F), // Default Navy
        Color(0xFF031405), // Dark Green
        Color(0xFF1A0005), // Dark Red
        Color(0xFF00101A), // Dark Cyan
        Color(0xFF1A051A), // Dark Purple
        Color(0xFF212121), // Dark Gray
        Color(0xFF263238)  // Blue Gray
    )

    Scaffold(
        containerColor = CosmicAppTheme.colors.bgStart,
        topBar = {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(CosmicAppTheme.headerBrush)
                    .padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onBack) {
                    Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = CosmicAppTheme.colors.accent)
                }
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Appearance Settings",
                    style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                    color = CosmicAppTheme.colors.textPrimary
                )
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .background(CosmicAppTheme.backgroundBrush)
                .padding(16.dp)
        ) {

            // 1. Custom Background Override
            Text(
                "Customize Background Color",
                style = MaterialTheme.typography.titleMedium,
                color = CosmicAppTheme.colors.textSecondary,
                modifier = Modifier.padding(bottom = 12.dp)
            )

            Row(
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                // "None" option (Use Theme Default)
                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .clip(CircleShape)
                        .background(Color.Transparent)
                        .border(2.dp, if (customBgColor == 0) CosmicAppTheme.colors.accent else Color.Gray, CircleShape)
                        .clickable { ThemeManager.setCustomBackground(context, 0) },
                    contentAlignment = Alignment.Center
                ) {
                    if (customBgColor == 0) {
                         Icon(Icons.Default.Check, null, tint = CosmicAppTheme.colors.accent)
                    } else {
                        Text("X", color = Color.Gray, fontWeight = FontWeight.Bold)
                    }
                }

                // Color Options
                customColors.forEach { color ->
                    val colorInt = color.toArgb()
                    val isSelected = customBgColor == colorInt
                    Box(
                        modifier = Modifier
                            .size(48.dp)
                            .clip(CircleShape)
                            .background(color)
                            .border(2.dp, if (isSelected) Color.White else Color.Transparent, CircleShape)
                            .clickable { ThemeManager.setCustomBackground(context, colorInt) },
                        contentAlignment = Alignment.Center
                    ) {
                        if (isSelected) {
                            Icon(Icons.Default.Check, null, tint = Color.White)
                        }
                    }
                }
            }
            Spacer(modifier = Modifier.height(32.dp))
            
            Text(
                "More settings will be available in future updates.",
                style = MaterialTheme.typography.bodySmall,
                color = CosmicAppTheme.colors.textSecondary.copy(alpha=0.6f)
            )
        }
    }
}
