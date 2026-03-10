
package com.astroluna.ui.rasipalan

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.Alignment
import androidx.compose.ui.graphics.vector.ImageVector
import com.astroluna.data.api.ApiClient
import com.astroluna.data.model.RasipalanItem
import com.astroluna.ui.theme.CosmicAppTheme
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

// PREMIUM BLUE THEME TOKENS
private val DeepSpaceNavy = Color(0xFF000B18)
private val PremiumBlue = Color(0xFF001F3F)
private val ElectricBlue = Color(0xFF0074D9)
private val NeonCyan = Color(0xFF7FDBFF)
private val GlassWhite = Color.White.copy(alpha = 0.1f)
private val TextPrimary = Color(0xFFF2F4FF)
private val TextSecondary = Color(0xFFA8B3AF)

// Status Colors
private val GoodGlow = Color(0xFF00FF9F) // Neon Green
private val ModerateAmber = Color(0xFFFFB347)
private val WeakRed = Color(0xFFFF4B2B)

class RasipalanActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val signId = intent.getIntExtra("signId", -1)
        val signName = intent.getStringExtra("signName") ?: "Daily Rasi Palan"

        setContent {
            CosmicAppTheme {
                RasipalanScreen(
                    targetSignId = signId,
                    displayTitle = signName,
                    onBack = { finish() }
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RasipalanScreen(targetSignId: Int, displayTitle: String, onBack: () -> Unit) {
    var dataList by remember { mutableStateOf<List<RasipalanItem>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        try {
            val response = withContext(Dispatchers.IO) {
                ApiClient.api.getRasipalan()
            }
            if (response.isSuccessful && response.body() != null) {
                val fullList = response.body()!!
                // Filter if targetSignId is valid
                dataList = if (targetSignId != -1) {
                    fullList.filter { it.signId == targetSignId }
                } else {
                    fullList
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
            android.util.Log.e("Rasipalan", "Error fetching data", e)
        } finally {
            isLoading = false
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = displayTitle,
                            style = MaterialTheme.typography.titleLarge.copy(
                                fontWeight = FontWeight.ExtraBold,
                                color = NeonCyan,
                                letterSpacing = 1.sp
                            )
                        )
                        Text(
                            text = "Daily Spiritual Insights",
                            style = MaterialTheme.typography.labelSmall,
                            color = NeonCyan.copy(alpha = 0.6f)
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = NeonCyan)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                     containerColor = Color.Transparent,
                     titleContentColor = NeonCyan
                )
            )
        },
        containerColor = DeepSpaceNavy
    ) { padding ->
        Box(modifier = Modifier.padding(padding).fillMaxSize().background(
            Brush.verticalGradient(listOf(DeepSpaceNavy, PremiumBlue))
        )) {
            if (isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.align(Alignment.Center),
                    color = NeonCyan
                )
            } else {
                LazyColumn(
                    contentPadding = PaddingValues(bottom = 32.dp, start = 16.dp, end = 16.dp, top = 8.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    items(dataList) { item ->
                        PremiumRasipalanCard(item)
                    }

                    item {
                        Text(
                            text = "Future Insights",
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                            color = NeonCyan,
                            modifier = Modifier.padding(top = 16.dp, bottom = 8.dp)
                        )
                    }

                    // Coming Soon Sections
                    item { ComingSoonCard("Weekly Rasi") }
                    item { ComingSoonCard("Monthly Rasi") }
                    item { ComingSoonCard("Yearly Rasi") }
                }
            }
        }
    }
}

@Composable
fun PremiumRasipalanCard(item: RasipalanItem) {
    var expanded by remember { mutableStateOf(false) }
    val predictionText = item.prediction?.ta ?: ""
    val hasMore = predictionText.length > 250

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp), // Box model as requested
        colors = CardDefaults.cardColors(containerColor = PremiumBlue.copy(alpha = 0.6f)),
        border = BorderStroke(1.dp, NeonCyan.copy(alpha = 0.2f))
    ) {
        Column(
            modifier = Modifier
                .padding(20.dp)
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = item.signNameTa ?: item.signNameEn ?: "",
                    style = MaterialTheme.typography.titleLarge.copy(
                        fontWeight = FontWeight.ExtraBold,
                        color = NeonCyan
                    )
                )
                Text(
                    text = item.date ?: "",
                    style = MaterialTheme.typography.labelSmall,
                    color = TextSecondary
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Prediction Text with "Read More" logic
            Text(
                text = predictionText,
                style = MaterialTheme.typography.bodyMedium.copy(
                    lineHeight = 24.sp,
                    color = TextPrimary
                ),
                maxLines = if (expanded) Int.MAX_VALUE else 5,
                overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis
            )

            if (hasMore) {
                Text(
                    text = if (expanded) "Read Less" else "...Read More",
                    color = ElectricBlue,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier
                        .padding(top = 8.dp)
                        .clickable { expanded = !expanded },
                    style = MaterialTheme.typography.labelMedium
                )
            }

            Spacer(modifier = Modifier.height(16.dp))
            Divider(color = NeonCyan.copy(alpha = 0.1f), thickness = 1.dp)
            Spacer(modifier = Modifier.height(16.dp))

            // Status Indicators
            StatusIndicatorRow("தொழில் (Career)", item.details?.career)
            StatusIndicatorRow("நிதி (Finance)", item.details?.finance)
            StatusIndicatorRow("ஆரோக்கியம் (Health)", item.details?.health)

            Spacer(modifier = Modifier.height(20.dp))

            // Lucky Stats Section (Glass Box)
            Surface(
                color = Color.White.copy(alpha = 0.05f),
                shape = RoundedCornerShape(8.dp),
                border = BorderStroke(0.5.dp, NeonCyan.copy(alpha = 0.1f))
            ) {
                Row(
                    modifier = Modifier.padding(12.dp).fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceAround
                ) {
                    LuckyStat("அதிர்ஷ்ட எண்", item.lucky?.number ?: "-")
                    LuckyStat("நிறம்", item.lucky?.color?.ta ?: "-")
                }
            }
        }
    }
}

@Composable
fun StatusIndicatorRow(label: String, status: String?) {
    Column(
        modifier = Modifier
            .padding(vertical = 10.dp)
            .fillMaxWidth()
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.ExtraBold),
            color = NeonCyan,
            modifier = Modifier.padding(bottom = 8.dp)
        )

        StatusBox(status ?: "Moderate")
    }
}

@Composable
fun StatusBox(status: String) {
    val (color, _) = when {
        status.contains("Good", ignoreCase = true) ||
        status.contains("Active", ignoreCase = true) ||
        status.contains("Excellent", ignoreCase = true) ||
        status.contains("நன்று", ignoreCase = true) ||
        status.contains("சிறப்பு", ignoreCase = true) ||
        status.contains("மேன்மை", ignoreCase = true) -> GoodGlow to status

        status.contains("Weak", ignoreCase = true) ||
        status.contains("Low", ignoreCase = true) ||
        status.contains("Bad", ignoreCase = true) ||
        status.contains("Critical", ignoreCase = true) ||
        status.contains("கவனம்", ignoreCase = true) ||
        status.contains("பாதிப்பு", ignoreCase = true) -> WeakRed to status

        else -> ModerateAmber to status
    }

    Surface(
        color = color.copy(alpha = 0.1f),
        shape = RoundedCornerShape(12.dp),
        border = BorderStroke(1.dp, color.copy(alpha = 0.3f)),
        modifier = Modifier.fillMaxWidth()
    ) {
        Text(
            text = status,
            modifier = Modifier.padding(14.dp),
            style = MaterialTheme.typography.bodyMedium.copy(
                lineHeight = 20.sp,
                fontWeight = FontWeight.Medium
            ),
            color = TextPrimary
        )
    }
}

@Composable
fun LuckyStat(label: String, value: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(text = label, style = MaterialTheme.typography.labelSmall, color = TextSecondary)
        Text(text = value, style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.ExtraBold), color = NeonCyan)
    }
}

@Composable
fun ComingSoonCard(title: String) {
    Card(
        modifier = Modifier.fillMaxWidth().height(90.dp),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White.copy(alpha = 0.03f)),
        border = BorderStroke(0.5.dp, NeonCyan.copy(alpha = 0.1f))
    ) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Icon(Icons.Default.Lock, contentDescription = null, tint = NeonCyan.copy(alpha = 0.3f), modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.height(4.dp))
                Text(text = title, style = MaterialTheme.typography.labelLarge, color = TextPrimary.copy(alpha = 0.7f))
                Text(text = "Unlocking Soon", style = MaterialTheme.typography.labelSmall, color = TextSecondary.copy(alpha = 0.5f))
            }
        }
    }
}
