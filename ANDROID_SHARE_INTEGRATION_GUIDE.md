# CabRadar Android Share Button Integration Guide

## 📱 Overview

This document provides detailed instructions for the Android team to implement share buttons that generate human-readable URLs for the CabRadar web application. The web app now uses slug-based URLs instead of technical IDs for better SEO and user experience.

---

## 🔗 URL Structure

### Base URL
- **Development:** `http://localhost:3000`
- **Production:** `https://yourdomain.com` (replace with actual production domain)

### URL Pattern
All URLs follow this pattern: `/routes/{content-type}/{human-readable-name}-{technical-id}`

---

## 📋 Content Types and URL Examples

### 1. Road Disruptions
**Route:** `/routes/road-disruption/{slug}`

**Examples:**
- `http://localhost:3000/routes/road-disruption/southern-river-route-TIMS-204461`
- `http://localhost:3000/routes/road-disruption/lambeth-bridge-TIMS-204462`
- `http://localhost:3000/routes/road-disruption/oxford-street-TIMS-204463`

**Slug Format:** `{road-name}-{disruption-id}`
- Road name: Cleaned, lowercase, hyphens instead of spaces
- Disruption ID: Technical ID from API (e.g., `TIMS-204461`)

### 2. Events
**Route:** `/routes/event/{slug}`

**Examples:**
- `http://localhost:3000/routes/event/leading-practical-ai-for-business-transformation-exec-masterclass-8ZEwBLVF8T5kKShbdQ`
- `http://localhost:3000/routes/event/london-marathon-2024-event123`
- `http://localhost:3000/routes/event/concert-at-royal-albert-hall-event456`

**Slug Format:** `{event-title}-{event-id}`
- Event title: Cleaned, lowercase, hyphens instead of spaces
- Event ID: Technical ID from API (e.g., `8ZEwBLVF8T5kKShbdQ`)

### 3. Transport Disruptions
**Route:** `/routes/transport-disruption/{slug}`

**Examples:**
- `http://localhost:3000/routes/transport-disruption/leicester-square-underground-station-940GZZLULSQ`
- `http://localhost:3000/routes/transport-disruption/kings-cross-station-940GZZLUKSX`
- `http://localhost:3000/routes/transport-disruption/victoria-station-940GZZLUVIC`

**Slug Format:** `{station-name}-{station-id}`
- Station name: Cleaned, lowercase, hyphens instead of spaces
- Station ID: Technical ID from API (e.g., `940GZZLULSQ`)

### 4. Inspectors (TfL Stop Checks)
**Route:** `/routes/inspector/{slug}`

**Examples:**
- `http://localhost:3000/routes/inspector/oxford-circus-check-inspector123`
- `http://localhost:3000/routes/inspector/piccadilly-circus-check-inspector456`
- `http://localhost:3000/routes/inspector/trafalgar-square-check-inspector789`

**Slug Format:** `{location-name}-{inspector-id}`
- Location name: Cleaned, lowercase, hyphens instead of spaces
- Inspector ID: Technical ID from API

---

## 🛠️ Implementation Guide

### Step 1: Create Slug Generation Function

```kotlin
fun createSlug(text: String): String {
    return text
        .lowercase()
        .replace(Regex("[^a-z0-9\\s-]"), "") // Remove special characters
        .replace(Regex("\\s+"), "-") // Replace spaces with hyphens
        .replace(Regex("-+"), "-") // Replace multiple hyphens with single
        .trim('-') // Remove leading/trailing hyphens
}
```

### Step 2: Generate URLs for Each Content Type

#### Road Disruptions
```kotlin
fun generateRoadDisruptionUrl(roadName: String, disruptionId: String): String {
    val baseUrl = "http://localhost:3000" // Use environment variable in production
    val slug = "${createSlug(roadName)}-$disruptionId"
    return "$baseUrl/routes/road-disruption/$slug"
}

// Usage:
val url = generateRoadDisruptionUrl("Southern River Route", "TIMS-204461")
// Result: "http://localhost:3000/routes/road-disruption/southern-river-route-TIMS-204461"
```

#### Events
```kotlin
fun generateEventUrl(eventTitle: String, eventId: String): String {
    val baseUrl = "http://localhost:3000"
    val slug = "${createSlug(eventTitle)}-$eventId"
    return "$baseUrl/routes/event/$slug"
}

// Usage:
val url = generateEventUrl("Leading Practical AI for Business Transformation - Exec Masterclass", "8ZEwBLVF8T5kKShbdQ")
// Result: "http://localhost:3000/routes/event/leading-practical-ai-for-business-transformation-exec-masterclass-8ZEwBLVF8T5kKShbdQ"
```

#### Transport Disruptions
```kotlin
fun generateTransportDisruptionUrl(stationName: String, stationId: String): String {
    val baseUrl = "http://localhost:3000"
    val slug = "${createSlug(stationName)}-$stationId"
    return "$baseUrl/routes/transport-disruption/$slug"
}

// Usage:
val url = generateTransportDisruptionUrl("Leicester Square Underground Station", "940GZZLULSQ")
// Result: "http://localhost:3000/routes/transport-disruption/leicester-square-underground-station-940GZZLULSQ"
```

#### Inspectors
```kotlin
fun generateInspectorUrl(locationName: String, inspectorId: String): String {
    val baseUrl = "http://localhost:3000"
    val slug = "${createSlug(locationName)}-$inspectorId"
    return "$baseUrl/routes/inspector/$slug"
}

// Usage:
val url = generateInspectorUrl("Oxford Circus Check", "inspector123")
// Result: "http://localhost:3000/routes/inspector/oxford-circus-check-inspector123"
```

### Step 3: Update Share Button Implementation

```kotlin
// Example for Road Disruption screen
class RoadDisruptionMessageContent {
    private fun setupShareButton() {
        val shareButton = findViewById<Button>(R.id.shareButton)
        shareButton.setOnClickListener {
            val roadName = getRoadName() // Get from your data model
            val disruptionId = getDisruptionId() // Get from your data model
            
            val shareUrl = generateRoadDisruptionUrl(roadName, disruptionId)
            shareContent(shareUrl, "Road Disruption on $roadName")
        }
    }
    
    private fun shareContent(url: String, title: String) {
        val intent = Intent(Intent.ACTION_SEND).apply {
            type = "text/plain"
            putExtra(Intent.EXTRA_TEXT, url)
            putExtra(Intent.EXTRA_SUBJECT, title)
        }
        startActivity(Intent.createChooser(intent, "Share via"))
    }
}
```

---

## 📊 Data Mapping

### Road Disruptions
| Android Field | Web URL Component | Example |
|---------------|-------------------|---------|
| `roadName` | Slug prefix | "Southern River Route" → "southern-river-route" |
| `disruptionId` | Slug suffix | "TIMS-204461" |
| **Result** | **Full URL** | `/routes/road-disruption/southern-river-route-TIMS-204461` |

### Events
| Android Field | Web URL Component | Example |
|---------------|-------------------|---------|
| `eventTitle` | Slug prefix | "Leading Practical AI..." → "leading-practical-ai..." |
| `eventId` | Slug suffix | "8ZEwBLVF8T5kKShbdQ" |
| **Result** | **Full URL** | `/routes/event/leading-practical-ai-for-business-transformation-exec-masterclass-8ZEwBLVF8T5kKShbdQ` |

### Transport Disruptions
| Android Field | Web URL Component | Example |
|---------------|-------------------|---------|
| `stationName` | Slug prefix | "Leicester Square Underground Station" → "leicester-square-underground-station" |
| `stationId` | Slug suffix | "940GZZLULSQ" |
| **Result** | **Full URL** | `/routes/transport-disruption/leicester-square-underground-station-940GZZLULSQ` |

### Inspectors
| Android Field | Web URL Component | Example |
|---------------|-------------------|---------|
| `locationName` | Slug prefix | "Oxford Circus Check" → "oxford-circus-check" |
| `inspectorId` | Slug suffix | "inspector123" |
| **Result** | **Full URL** | `/routes/inspector/oxford-circus-check-inspector123` |

---

## 🧪 Testing

### Test URLs (Development)
Use these URLs to test the web application:

1. **Road Disruption:** `http://localhost:3000/routes/road-disruption/southern-river-route-TIMS-204461`
2. **Event:** `http://localhost:3000/routes/event/leading-practical-ai-for-business-transformation-exec-masterclass-8ZEwBLVF8T5kKShbdQ`
3. **Transport Disruption:** `http://localhost:3000/routes/transport-disruption/leicester-square-underground-station-940GZZLULSQ`
4. **Inspector:** `http://localhost:3000/routes/inspector/test-location-inspector123`

### Validation Checklist
- [ ] URLs are generated correctly for all 4 content types
- [ ] Slugs are properly formatted (lowercase, hyphens, no special chars)
- [ ] Technical IDs are preserved at the end of slugs
- [ ] Share buttons open browser with correct URLs
- [ ] Web pages load correctly with shared URLs

---

## 🔧 Environment Configuration

### Development
```kotlin
object Config {
    const val WEB_BASE_URL = "http://localhost:3000"
}
```

### Production
```kotlin
object Config {
    const val WEB_BASE_URL = "https://yourdomain.com" // Replace with actual domain
}
```

### Dynamic Configuration
```kotlin
object Config {
    val WEB_BASE_URL: String
        get() = if (BuildConfig.DEBUG) {
            "http://localhost:3000"
        } else {
            "https://yourdomain.com"
        }
}
```

---

## 🚨 Important Notes

### 1. Slug Generation Rules
- **Always lowercase** the text before processing
- **Remove special characters** except letters, numbers, spaces, and hyphens
- **Replace spaces with hyphens**
- **Remove multiple consecutive hyphens**
- **Trim leading/trailing hyphens**
- **Preserve technical IDs exactly** (case-sensitive)

### 2. Error Handling
```kotlin
fun generateUrlSafely(name: String?, id: String?): String? {
    return try {
        if (name.isNullOrBlank() || id.isNullOrBlank()) {
            null
        } else {
            generateRoadDisruptionUrl(name, id)
        }
    } catch (e: Exception) {
        Log.e("ShareButton", "Error generating URL", e)
        null
    }
}
```

### 3. Fallback URLs
If slug generation fails, fall back to technical ID:
```kotlin
fun generateUrlWithFallback(name: String?, id: String?): String {
    return try {
        generateRoadDisruptionUrl(name ?: "unknown", id ?: "unknown")
    } catch (e: Exception) {
        // Fallback to technical ID only
        "$baseUrl/routes/road-disruption/$id"
    }
}
```

---

## 📱 Screen-Specific Implementation

### RoadDisruptionMessageContent
```kotlin
private fun generateShareUrl(): String {
    val roadName = disruptionData.roadName ?: "Unknown Road"
    val disruptionId = disruptionData.disruptionId ?: "unknown"
    return generateRoadDisruptionUrl(roadName, disruptionId)
}
```

### EventsMessageContent
```kotlin
private fun generateShareUrl(): String {
    val eventTitle = eventData.title ?: "Unknown Event"
    val eventId = eventData.id ?: "unknown"
    return generateEventUrl(eventTitle, eventId)
}
```

### DisruptionMessageContent (Transport)
```kotlin
private fun generateShareUrl(): String {
    val stationName = disruptionData.commonName ?: "Unknown Station"
    val stationId = disruptionData.id ?: "unknown"
    return generateTransportDisruptionUrl(stationName, stationId)
}
```

### TfLStopChecksMessageContent
```kotlin
private fun generateShareUrl(): String {
    val locationName = inspectorData.locationName ?: "Unknown Location"
    val inspectorId = inspectorData.id ?: "unknown"
    return generateInspectorUrl(locationName, inspectorId)
}
```

---

## ✅ Final Checklist

Before deploying:

- [ ] All 4 content types have share button implementations
- [ ] URLs are generated using the slug format
- [ ] Share buttons are positioned correctly (top-right area)
- [ ] Error handling is implemented for malformed data
- [ ] Environment configuration is set up correctly
- [ ] Test URLs work in browser
- [ ] Share functionality opens browser with correct URLs

---

## 🆘 Support

If you encounter issues:

1. **Check URL format:** Ensure slugs follow the pattern `{name}-{id}`
2. **Verify data:** Make sure `name` and `id` fields are not null/empty
3. **Test in browser:** Copy generated URL and test in web browser
4. **Check logs:** Look for error messages in Android logs
5. **Contact web team:** For web-specific issues

---

## 📞 Contact

For questions or issues with this implementation:
- **Web Team:** [Contact information]
- **Documentation:** This file will be updated as needed
- **Last Updated:** [Current Date]

---

*This documentation ensures seamless integration between the Android app and web application, providing users with meaningful, shareable URLs that enhance the overall user experience.*
