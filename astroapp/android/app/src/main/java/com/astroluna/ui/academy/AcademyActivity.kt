package com.astroluna.ui.academy

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.PauseCircle
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import com.astroluna.data.api.ApiClient
import com.astroluna.ui.theme.CosmicAppTheme
import com.pierfrancescosoffritti.androidyoutubeplayer.core.player.YouTubePlayer
import com.pierfrancescosoffritti.androidyoutubeplayer.core.player.listeners.AbstractYouTubePlayerListener
import com.pierfrancescosoffritti.androidyoutubeplayer.core.player.views.YouTubePlayerView
import kotlinx.coroutines.launch
import org.json.JSONObject
import java.util.regex.Pattern

class AcademyActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            CosmicAppTheme {
                AcademyScreen(onBack = { finish() })
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AcademyScreen(onBack: () -> Unit) {
    val scope = rememberCoroutineScope()
    var videos by remember { mutableStateOf<List<VideoItem>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var showComingSoon by remember { mutableStateOf(false) }
    var selectedVideo by remember { mutableStateOf<VideoItem?>(null) }

    LaunchedEffect(Unit) {
        scope.launch {
            try {
                val response = ApiClient.api.getAcademyVideos()
                if (response.isSuccessful && response.body() != null) {
                    val root = JSONObject(response.body().toString())
                    val arr = root.optJSONArray("videos")
                    if (arr != null && arr.length() > 0) {
                        val list = mutableListOf<VideoItem>()
                        for (i in 0 until arr.length()) {
                            val obj = arr.getJSONObject(i)
                            list.add(VideoItem(
                                title = obj.optString("title", "Video"),
                                url = obj.optString("youtubeUrl", ""),
                                category = obj.optString("category", "General")
                            ))
                        }
                        videos = list
                    } else {
                        showComingSoon = true
                    }
                } else {
                    showComingSoon = true
                }
            } catch (e: Exception) {
                e.printStackTrace()
                showComingSoon = true
            } finally {
                isLoading = false
            }
        }
    }

    // Coming Soon Dialog
    if (showComingSoon) {
        AlertDialog(
            onDismissRequest = {
                showComingSoon = false
                onBack()
            },
            icon = {
                Icon(
                    Icons.Default.PlayArrow,
                    contentDescription = null,
                    tint = Color(0xFF6200EE),
                    modifier = Modifier.size(48.dp)
                )
            },
            title = {
                Text(
                    "Astro Academy",
                    style = MaterialTheme.typography.headlineSmall,
                    color = Color(0xFF6200EE)
                )
            },
            text = {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        "🚀 விரைவில் வருகிறது!",
                        style = MaterialTheme.typography.titleLarge,
                        color = Color(0xFF333333)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        "ஜோதிட பாடங்கள் மற்றும் வீடியோக்கள் விரைவில் கிடைக்கும்.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Color.Gray
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        showComingSoon = false
                        onBack()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF6200EE))
                ) {
                    Text("OK", color = Color.White)
                }
            }
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("🎓 Astro Academy", color = Color.White) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color(0xFF6200EE))
            )
        }
    ) { padding ->
        Column(modifier = Modifier.fillMaxSize().padding(padding)) {
            // Video Player Section
            if (selectedVideo != null) {
                YouTubePlayerComposable(
                    videoId = extractYoutubeId(selectedVideo!!.url) ?: "",
                    modifier = Modifier
                        .fillMaxWidth()
                        .aspectRatio(16f / 9f)
                        .background(Color.Black)
                )
                
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    color = Color(0xFF6200EE).copy(alpha = 0.05f),
                    shadowElevation = 2.dp
                ) {
                    Column(Modifier.padding(16.dp)) {
                        Text(selectedVideo!!.title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                        Text(selectedVideo!!.category, style = MaterialTheme.typography.bodySmall, color = Color.Gray)
                    }
                }
            }

            Box(modifier = Modifier.weight(1f)) {
                if (isLoading) {
                    CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
                } else if (videos.isNotEmpty()) {
                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        contentPadding = PaddingValues(16.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        items(videos) { video ->
                            VideoCard(video, isSelected = selectedVideo == video) {
                                selectedVideo = video
                            }
                        }
                    }
                } else {
                    Text(
                        "வீடியோக்கள் எதுவும் இல்லை\nNo videos available",
                        modifier = Modifier.align(Alignment.Center),
                        color = Color.Gray
                    )
                }
            }
        }
    }
}

@Composable
fun YouTubePlayerComposable(videoId: String, modifier: Modifier = Modifier) {
    val lifecycleOwner = LocalLifecycleOwner.current
    var player by remember { mutableStateOf<YouTubePlayer?>(null) }

    // Use a key to re-trigger effect when videoId changes
    LaunchedEffect(videoId) {
        player?.loadVideo(videoId, 0f)
    }

    AndroidView(
        modifier = modifier,
        factory = { context ->
            YouTubePlayerView(context).apply {
                lifecycleOwner.lifecycle.addObserver(this)
                addYouTubePlayerListener(object : AbstractYouTubePlayerListener() {
                    override fun onReady(youTubePlayer: YouTubePlayer) {
                        player = youTubePlayer
                        youTubePlayer.loadVideo(videoId, 0f)
                    }
                })
            }
        }
    )
}

@Composable
fun VideoCard(video: VideoItem, isSelected: Boolean, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        elevation = CardDefaults.cardElevation(defaultElevation = if (isSelected) 8.dp else 4.dp),
        border = if (isSelected) BorderStroke(2.dp, Color(0xFF6200EE)) else null,
        colors = CardDefaults.cardColors(
            containerColor = if (isSelected) Color(0xFF6200EE).copy(alpha = 0.1f) else MaterialTheme.colorScheme.surface
        )
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                if (isSelected) Icons.Default.PauseCircle else Icons.Default.PlayArrow,
                contentDescription = "Play",
                modifier = Modifier.size(48.dp),
                tint = if (isSelected) Color(0xFF6200EE) else Color.Red
            )
            Spacer(modifier = Modifier.width(16.dp))
            Column {
                Text(video.title, style = MaterialTheme.typography.titleMedium, fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal)
                Text(video.category, style = MaterialTheme.typography.bodySmall, color = Color.Gray)
            }
        }
    }
}

fun extractYoutubeId(url: String): String? {
    val pattern = "(?<=watch\\?v=|/videos/|embed/|youtu.be/|/v/|/e/|watch\\?v%3D|watch\\?feature=player_embedded&v=|%2Fvideos%2F|embed%\u200C\u200B2F|youtu.be%2F|%2Fv%2F)[^#&?\\n]*"
    val compiledPattern = Pattern.compile(pattern)
    val matcher = compiledPattern.matcher(url)
    return if (matcher.find()) matcher.group() else null
}

data class VideoItem(val title: String, val url: String, val category: String)
