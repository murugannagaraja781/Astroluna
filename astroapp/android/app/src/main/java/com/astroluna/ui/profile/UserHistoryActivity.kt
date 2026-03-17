package com.astroluna.ui.profile

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
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.astroluna.data.local.TokenManager
import com.astroluna.ui.theme.CosmicAppTheme
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.*

class UserHistoryActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val tokenManager = TokenManager(this)
        val session = tokenManager.getUserSession()
        val userId = session?.userId ?: ""

        setContent {
            CosmicAppTheme {
                UserHistoryScreen(userId = userId, onBack = { finish() })
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun UserHistoryScreen(userId: String, onBack: () -> Unit) {
    var sessions by remember { mutableStateOf<List<UserSessionHistoryItem>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var error by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(userId) {
        withContext(Dispatchers.IO) {
            try {
                val client = okhttp3.OkHttpClient()
                val request = okhttp3.Request.Builder()
                    .url("${com.astroluna.utils.Constants.SERVER_URL}/api/user/history/$userId")
                    .build()
                val response = client.newCall(request).execute()
                if (response.isSuccessful) {
                    val body = response.body?.string()
                    val json = JSONObject(body ?: "{}")
                    if (json.optBoolean("ok")) {
                        val array = json.optJSONArray("sessions") ?: JSONArray()
                        val list = mutableListOf<UserSessionHistoryItem>()
                        for (i in 0 until array.length()) {
                            val obj = array.getJSONObject(i)
                            list.add(
                                UserSessionHistoryItem(
                                    id = obj.optString("sessionId"),
                                    astrologerName = obj.optString("astrologerName", "Unknown Astrologer"),
                                    type = obj.optString("type", "call"),
                                    startTime = if (obj.has("actualBillingStart")) obj.optLong("actualBillingStart") else obj.optLong("startTime", 0),
                                    endTime = if (obj.has("sessionEndAt")) obj.optLong("sessionEndAt") else obj.optLong("endTime", 0),
                                    duration = obj.optInt("duration", 0),
                                    deducted = obj.optDouble("totalDeducted", 0.0)
                                )
                            )
                        }
                        sessions = list
                    } else {
                        error = "Failed to load history"
                    }
                } else {
                    error = "Server error: ${response.code}"
                }
            } catch (e: Exception) {
                error = e.message
            } finally {
                isLoading = false
            }
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Call History / அழைப்பு வரலாறு", color = Color.White) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color(0xFF004D40)
                )
            )
        }
    ) { padding ->
        Box(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .background(CosmicAppTheme.backgroundBrush)
        ) {
            if (isLoading) {
                CircularProgressIndicator(modifier = Modifier.align(Alignment.Center), color = Color(0xFF004D40))
            } else if (error != null) {
                Text(text = error!!, color = Color.Red, modifier = Modifier.align(Alignment.Center))
            } else if (sessions.isEmpty()) {
                Column(
                    modifier = Modifier.align(Alignment.Center),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Icon(
                        imageVector = Icons.Default.Phone,
                        contentDescription = null,
                        modifier = Modifier.size(64.dp),
                        tint = Color.Gray
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Text("No call history found", color = Color.Gray)
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(sessions) { session ->
                        UserHistoryCard(session)
                    }
                }
            }
        }
    }
}

@Composable
fun UserHistoryCard(item: UserSessionHistoryItem) {
    val colors = CosmicAppTheme.colors
    val dateFormat = SimpleDateFormat("dd MMM yyyy, hh:mm a", Locale.getDefault())
    val startTimeStr = if (item.startTime > 0) dateFormat.format(Date(item.startTime)) else "N/A"

    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(4.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.Phone,
                    contentDescription = null,
                    tint = Color(0xFF004D40),
                    modifier = Modifier.size(24.dp)
                )
                Spacer(modifier = Modifier.width(12.dp))
                Text(
                    text = item.astrologerName,
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp,
                    color = Color.Black,
                    modifier = Modifier.weight(1f)
                )
                Text(
                    text = "₹${String.format("%.2f", item.deducted)}",
                    fontWeight = FontWeight.ExtraBold,
                    fontSize = 18.sp,
                    color = Color.Red
                )
            }

            Spacer(modifier = Modifier.height(8.dp))
            HorizontalDivider(color = Color.LightGray.copy(alpha = 0.5f))
            Spacer(modifier = Modifier.height(8.dp))

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Column {
                    Text("Date & Time", fontSize = 12.sp, color = Color.Gray)
                    Text(startTimeStr, fontSize = 14.sp, color = Color.DarkGray)
                }
                Column(horizontalAlignment = Alignment.End) {
                    Text("Duration", fontSize = 12.sp, color = Color.Gray)
                    val totalSec = item.duration / 1000
                    val mins = totalSec / 60
                    val secs = totalSec % 60
                    val duraText = if (mins > 0) "${mins}m ${secs}s" else "${secs}s"
                    Text(duraText, fontSize = 14.sp, color = Color(0xFF039BE5), fontWeight = FontWeight.SemiBold)
                }
            }
        }
    }
}

data class UserSessionHistoryItem(
    val id: String,
    val astrologerName: String,
    val type: String,
    val startTime: Long,
    val endTime: Long,
    val duration: Int,
    val deducted: Double
)
