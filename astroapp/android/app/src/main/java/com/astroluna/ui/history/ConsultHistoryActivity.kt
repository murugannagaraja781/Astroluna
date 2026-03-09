package com.astroluna.ui.history

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Chat
import androidx.compose.material.icons.filled.Videocam
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.astroluna.data.local.TokenManager
import com.astroluna.data.remote.SocketManager
import com.astroluna.ui.theme.CosmicAppTheme
import org.json.JSONArray
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.*

class ConsultHistoryActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            CosmicAppTheme {
                ConsultHistoryScreen(onBack = { finish() })
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ConsultHistoryScreen(onBack: () -> Unit) {
    var sessions by remember { mutableStateOf<List<HistorySession>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var error by remember { mutableStateOf<String?>(null) }
    val isAstro = remember { false } // Default to client for now, could fetch from session

    LaunchedEffect(Unit) {
        val socket = SocketManager.getSocket()
        socket.emit("get-history", object : io.socket.emitter.Emitter.Listener {
            override fun call(vararg args: Any?) {
                val res = args[0] as? JSONObject ?: return
                if (res.optBoolean("ok")) {
                    val array = res.optJSONArray("sessions") ?: JSONArray()
                    val list = mutableListOf<HistorySession>()
                    for (i in 0 until array.length()) {
                        val s = array.getJSONObject(i)
                        list.add(
                            HistorySession(
                                id = s.optString("sessionId"),
                                type = s.optString("type", "chat"),
                                startTime = s.optLong("startTime"),
                                duration = s.optLong("duration"),
                                partnerName = s.optString("partnerName", "Counselor"),
                                partnerImage = s.optString("partnerImage", ""),
                                amount = if (isAstro) s.optDouble("totalEarned") else s.optDouble("totalCharged"),
                                status = s.optString("status", "completed")
                            )
                        )
                    }
                    sessions = list
                    isLoading = false
                } else {
                    error = "Failed to load history"
                    isLoading = false
                }
            }
        })

        // Timeout if no response
        kotlinx.coroutines.delay(8000)
        if (isLoading) {
            isLoading = false
            if (sessions.isEmpty()) error = "Connection timeout"
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Consult History", color = Color.White, fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, "Back", tint = Color.White)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = CosmicAppTheme.colors.headerStart)
            )
        }
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .background(CosmicAppTheme.backgroundBrush)
        ) {
            if (isLoading) {
                CircularProgressIndicator(modifier = Modifier.align(Alignment.Center), color = CosmicAppTheme.colors.accent)
            } else if (error != null && sessions.isEmpty()) {
                Text(error!!, modifier = Modifier.align(Alignment.Center), color = Color.Gray)
            } else if (sessions.isEmpty()) {
                Text("No consultation history found.", modifier = Modifier.align(Alignment.Center), color = Color.Gray)
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(sessions) { session ->
                        HistoryItemCard(session)
                    }
                }
            }
        }
    }
}

@Composable
fun HistoryItemCard(session: HistorySession) {
    val colors = CosmicAppTheme.colors
    val dateFormat = SimpleDateFormat("dd MMM, hh:mm a", Locale.getDefault())
    val dateStr = if (session.startTime > 0) dateFormat.format(Date(session.startTime)) else "Recently"

    val icon = when(session.type) {
        "video" -> Icons.Default.Videocam
        "audio" -> Icons.Default.Call
        else -> Icons.Default.Chat
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = colors.cardBg),
        elevation = CardDefaults.cardElevation(2.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, colors.cardStroke.copy(alpha = 0.5f))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = colors.accent.copy(alpha = 0.1f),
                    modifier = Modifier.size(40.dp)
                ) {
                    Icon(
                        imageVector = icon,
                        contentDescription = null,
                        modifier = Modifier.padding(8.dp),
                        tint = colors.accent
                    )
                }

                Spacer(modifier = Modifier.width(12.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = session.partnerName,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary
                    )
                    Text(
                        text = session.type.replaceFirstChar { it.uppercase() },
                        style = MaterialTheme.typography.labelSmall,
                        color = colors.textSecondary
                    )
                }

                Column(horizontalAlignment = Alignment.End) {
                    Text(
                        text = "₹${session.amount.toInt()}",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Black,
                        color = colors.accent
                    )
                    Text(
                        text = dateStr,
                        style = MaterialTheme.typography.labelSmall,
                        color = Color.Gray
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))
            HorizontalDivider(color = colors.cardStroke.copy(alpha = 0.3f))
            Spacer(modifier = Modifier.height(12.dp))

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                val duration = session.duration / 1000
                val min = duration / 60
                val sec = duration % 60
                Text(
                    text = "Duration: ${min}m ${sec}s",
                    style = MaterialTheme.typography.bodySmall,
                    color = colors.textSecondary
                )

                Text(
                    text = session.status.uppercase(),
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = FontWeight.Bold,
                    color = if (session.status == "completed") Color(0xFF10B981) else Color.Gray
                )
            }
        }
    }
}

data class HistorySession(
    val id: String,
    val type: String,
    val startTime: Long,
    val duration: Long,
    val partnerName: String,
    val partnerImage: String,
    val amount: Double,
    val status: String
)
