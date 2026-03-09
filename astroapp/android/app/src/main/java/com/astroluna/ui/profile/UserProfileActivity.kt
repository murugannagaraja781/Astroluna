package com.astroluna.ui.profile

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Place
import androidx.compose.material3.*
import androidx.compose.runtime.*
import java.util.Calendar
import java.util.TimeZone
import kotlin.math.abs
import kotlin.math.roundToInt
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.astroluna.R
import com.astroluna.data.local.TokenManager
import com.astroluna.data.remote.SocketManager
import com.astroluna.ui.theme.CosmicAppTheme
import com.astroluna.utils.Constants
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import org.json.JSONObject
import java.io.File
import java.io.FileOutputStream

class UserProfileActivity : ComponentActivity() {
    private lateinit var tokenManager: TokenManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        tokenManager = TokenManager(this)

        setContent {
            CosmicAppTheme {
                UserProfileScreen(
                    tokenManager = tokenManager,
                    onBack = { finish() }
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun UserProfileScreen(
    tokenManager: TokenManager,
    onBack: () -> Unit
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val session = tokenManager.getUserSession()

    var name by remember { mutableStateOf(session?.name ?: "") }
    var imageUrl by remember { mutableStateOf(session?.image ?: "") }
    var dob by remember { mutableStateOf(session?.dob ?: "") }
    var tob by remember { mutableStateOf(session?.tob ?: "") }
    var pob by remember { mutableStateOf(session?.pob ?: "") }

    var isUploading by remember { mutableStateOf(false) }

    val pickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        uri?.let {
            isUploading = true
            uploadImage(context, it) { success, url ->
                isUploading = false
                if (success && url != null) {
                    imageUrl = url
                    Toast.makeText(context, "Photo Uploaded!", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(context, "Upload Failed", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Edit Profile", color = Color.White) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, "Back", tint = Color.White)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = CosmicAppTheme.colors.headerStart)
            )
        }
    ) { padding ->
        val cityLauncher = rememberLauncherForActivityResult(
            contract = ActivityResultContracts.StartActivityForResult()
        ) { result ->
            if (result.resultCode == android.app.Activity.RESULT_OK && result.data != null) {
                pob = result.data?.getStringExtra("name") ?: ""
            }
        }
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(24.dp)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Profile Photo
            Box(
                modifier = Modifier
                    .size(120.dp)
                    .clip(CircleShape)
                    .background(Color.LightGray)
                    .clickable { pickerLauncher.launch("image/*") },
                contentAlignment = Alignment.Center
            ) {
                if (imageUrl.isNotEmpty()) {
                    // In a real app we'd use Coil/Glide. Since we don't have it here,
                    // we'll show a placeholder but simulate the URL storage.
                    Icon(Icons.Default.Person, null, modifier = Modifier.size(60.dp), tint = Color.Gray)
                } else {
                    Icon(Icons.Default.Person, null, modifier = Modifier.size(60.dp), tint = Color.Gray)
                }

                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color.Black.copy(alpha = 0.3f)),
                    contentAlignment = Alignment.Center
                ) {
                    if (isUploading) {
                        CircularProgressIndicator(color = Color.White)
                    } else {
                        Icon(Icons.Default.Edit, "Change", tint = Color.White)
                    }
                }
            }

            Spacer(modifier = Modifier.height(32.dp))

            // Name Field
            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                label = { Text("Display Name") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = CosmicAppTheme.colors.accent)
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Date of Birth
            OutlinedTextField(
                value = dob,
                onValueChange = { dob = it },
                label = { Text("Date of Birth (DD-MM-YYYY)") },
                modifier = Modifier.fillMaxWidth().clickable {
                    val cal = Calendar.getInstance()
                    android.app.DatePickerDialog(context, { _, y, m, d ->
                        dob = "$d-${m+1}-$y"
                    }, cal.get(Calendar.YEAR), cal.get(Calendar.MONTH), cal.get(Calendar.DAY_OF_MONTH)).show()
                },
                enabled = false,
                colors = OutlinedTextFieldDefaults.colors(
                    disabledTextColor = CosmicAppTheme.colors.textPrimary,
                    disabledBorderColor = Color.Gray,
                    disabledLabelColor = CosmicAppTheme.colors.textSecondary,
                    disabledContainerColor = Color.Transparent
                )
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Time of Birth
            OutlinedTextField(
                value = tob,
                onValueChange = { tob = it },
                label = { Text("Time of Birth (HH:MM)") },
                modifier = Modifier.fillMaxWidth().clickable {
                    val cal = Calendar.getInstance()
                    android.app.TimePickerDialog(context, { _, h, min ->
                        tob = String.format("%02d:%02d", h, min)
                    }, cal.get(Calendar.HOUR_OF_DAY), cal.get(Calendar.MINUTE), true).show()
                },
                enabled = false,
                colors = OutlinedTextFieldDefaults.colors(
                    disabledTextColor = CosmicAppTheme.colors.textPrimary,
                    disabledBorderColor = Color.Gray,
                    disabledLabelColor = CosmicAppTheme.colors.textSecondary,
                    disabledContainerColor = Color.Transparent
                )
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Place of Birth
            OutlinedTextField(
                value = pob,
                onValueChange = { pob = it },
                label = { Text("Place of Birth") },
                modifier = Modifier.fillMaxWidth().clickable {
                    cityLauncher.launch(Intent(context, com.astroluna.ui.city.CitySearchActivity::class.java))
                },
                enabled = false,
                trailingIcon = { Icon(Icons.Default.Place, null, tint = CosmicAppTheme.colors.accent) },
                colors = OutlinedTextFieldDefaults.colors(
                    disabledTextColor = CosmicAppTheme.colors.textPrimary,
                    disabledBorderColor = Color.Gray,
                    disabledLabelColor = CosmicAppTheme.colors.textSecondary,
                    disabledContainerColor = Color.Transparent
                )
            )

            // Save Button
            Button(
                onClick = {
                    val updates = JSONObject().apply {
                        put("name", name)
                        put("image", imageUrl)
                        put("dob", dob)
                        put("tob", tob)
                        put("pob", pob)
                    }
                    SocketManager.updateProfile(updates) { res ->
                        if (res?.optBoolean("ok") == true) {
                            // Update local session
                            val updatedUser = session?.copy(
                                name = name,
                                image = imageUrl,
                                dob = dob,
                                tob = tob,
                                pob = pob
                            )
                            if (updatedUser != null) {
                                tokenManager.saveUserSession(updatedUser)
                            }
                            scope.launch(Dispatchers.Main) {
                                Toast.makeText(context, "Profile Updated!", Toast.LENGTH_SHORT).show()
                                onBack()
                            }
                        } else {
                            scope.launch(Dispatchers.Main) {
                                Toast.makeText(context, "Update Failed", Toast.LENGTH_SHORT).show()
                            }
                        }
                    }
                },
                modifier = Modifier.fillMaxWidth().height(56.dp),
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(containerColor = CosmicAppTheme.colors.headerStart)
            ) {
                Text("Save Profile", fontWeight = FontWeight.Bold, fontSize = 16.sp)
            }
        }
    }
}

private fun uploadImage(context: android.content.Context, uri: Uri, callback: (Boolean, String?) -> Unit) {
    val client = OkHttpClient()
    val file = getFileFromUri(context, uri) ?: return callback(false, null)

    val requestBody = MultipartBody.Builder()
        .setType(MultipartBody.FORM)
        .addFormDataPart("file", file.name, RequestBody.create("image/*".toMediaTypeOrNull(), file))
        .build()

    val request = Request.Builder()
        .url("${Constants.SERVER_URL}/upload")
        .post(requestBody)
        .build()

    client.newCall(request).enqueue(object : Callback {
        override fun onFailure(call: Call, e: java.io.IOException) {
            callback(false, null)
        }
        override fun onResponse(call: Call, response: Response) {
            if (response.isSuccessful) {
                val json = JSONObject(response.body?.string() ?: "{}")
                if (json.optBoolean("ok")) {
                    callback(true, json.optString("url"))
                } else {
                    callback(false, null)
                }
            } else {
                callback(false, null)
            }
        }
    })
}

private fun getFileFromUri(context: android.content.Context, uri: Uri): File? {
    val inputStream = context.contentResolver.openInputStream(uri) ?: return null
    val file = File(context.cacheDir, "temp_profile_pic.jpg")
    val outputStream = FileOutputStream(file)
    inputStream.copyTo(outputStream)
    outputStream.close()
    inputStream.close()
    return file
}
