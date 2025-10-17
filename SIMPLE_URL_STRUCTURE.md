# CabRadar Android Share Button - SIMPLE URL STRUCTURE

## 🎯 **BOSS DECISION: SIMPLE URL STRUCTURE**

**Base URL:** `http://localhost:3000` (Development) / `https://yourdomain.com` (Production)

**URL Pattern:** `/routes/{content-type}/{street-name}-{id}`

---

## 📱 **ANDROID TEAM INSTRUCTIONS**

### **Road Disruptions**
```kotlin
fun generateRoadDisruptionUrl(streetName: String, disruptionId: String): String {
    val slug = "${streetName.lowercase().replace(" ", "-")}-$disruptionId"
    return "$baseUrl/routes/road-disruption/$slug"
}

// Example Usage
val url = generateRoadDisruptionUrl("Streatham Hill", "TIMS-213893")
// Result: "http://localhost:3000/routes/road-disruption/streatham-hill-TIMS-213893"
```

### **Events**
```kotlin
fun generateEventUrl(eventTitle: String, eventId: String): String {
    val slug = "${eventTitle.lowercase().replace(" ", "-")}-$eventId"
    return "$baseUrl/routes/event/$slug"
}

// Example Usage
val url = generateEventUrl("London Marathon 2024", "event123")
// Result: "http://localhost:3000/routes/event/london-marathon-2024-event123"
```

### **Transport Disruptions**
```kotlin
fun generateTransportDisruptionUrl(stationName: String, stationId: String): String {
    val slug = "${stationName.lowercase().replace(" ", "-")}-$stationId"
    return "$baseUrl/routes/transport-disruption/$slug"
}

// Example Usage
val url = generateTransportDisruptionUrl("Leicester Square", "940GZZLULSQ")
// Result: "http://localhost:3000/routes/transport-disruption/leicester-square-940GZZLULSQ"
```

### **Inspectors**
```kotlin
fun generateInspectorUrl(locationName: String, inspectorId: String): String {
    val slug = "${locationName.lowercase().replace(" ", "-")}-$inspectorId"
    return "$baseUrl/routes/inspector/$slug"
}

// Example Usage
val url = generateInspectorUrl("Oxford Circus", "inspector123")
// Result: "http://localhost:3000/routes/inspector/oxford-circus-inspector123"
```

---

## 🚨 **CRITICAL RULES FOR ANDROID TEAM**

### **⚠️ STOP! READ THIS CAREFULLY ⚠️**

**The Android team is currently using the WRONG field!**

**Current WRONG URL:** `http://localhost:3000/routes/road-disruption/[a3203]-lambeth-bridge-(se1-,sw1p-)-(lambeth,westminster)-TIMS-204461`

**This is WRONG because you're using `road_description` field!**

### **1. Road Disruptions - USE ONLY STREET NAME**
- ✅ **CORRECT:** Use `props.road_name` field only
- ❌ **WRONG:** Don't use `road_description` (contains technical details)
- ❌ **WRONG:** Don't include road codes like [A23], [M25]
- ❌ **WRONG:** Don't include postcodes like SW16, SW2
- ❌ **WRONG:** Don't include borough names like Lambeth, Westminster

### **API Data Structure:**
```json
{
  "road_name": "southern river route",           // ← USE THIS
  "road_description": "[A3203] LAMBETH BRIDGE (SE1 ,SW1P ) (Lambeth,Westminster)", // ← DON'T USE THIS
  "disruption_id": "TIMS-204461"
}
```

### **2. Data Mapping**
| Android Field | Use This Field | Example |
|---------------|----------------|---------|
| **Road Disruption** | `road_name` | "southern river route" |
| **Event** | `title` | "London Marathon 2024" |
| **Transport Disruption** | `commonName` | "Leicester Square" |
| **Inspector** | `locationName` | "Oxford Circus" |

### **3. URL Examples**
- **Road Disruption:** `http://localhost:3000/routes/road-disruption/southern-river-route-TIMS-204461`
- **Event:** `http://localhost:3000/routes/event/london-marathon-2024-event123`
- **Transport Disruption:** `http://localhost:3000/routes/transport-disruption/leicester-square-940GZZLULSQ`
- **Inspector:** `http://localhost:3000/routes/inspector/oxford-circus-inspector123`

---

## 🔧 **Complete Implementation**

```kotlin
// Share Button Implementation
class RoadDisruptionMessageContent {
    private fun setupShareButton() {
        val shareButton = findViewById<Button>(R.id.shareButton)
        shareButton.setOnClickListener {
            // ⚠️ CRITICAL: Use ONLY road_name field - NOT road_description!
            val streetName = disruptionData.road_name ?: "Unknown Street"
            val disruptionId = disruptionData.disruption_id ?: "unknown"
            
            // ❌ WRONG: val streetName = disruptionData.road_description  // DON'T DO THIS!
            
            val shareUrl = generateRoadDisruptionUrl(streetName, disruptionId)
            shareContent(shareUrl, "Road Disruption on $streetName")
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

## ⚙️ **Environment Configuration**

```kotlin
object Config {
    val WEB_BASE_URL: String
        get() = if (BuildConfig.DEBUG) {
            "http://localhost:3000"
        } else {
            "https://yourdomain.com" // Replace with actual production domain
        }
}
```

---

## ✅ **FINAL CHECKLIST**

- [ ] Use ONLY `road_name` field for road disruptions
- [ ] Use ONLY `title` field for events  
- [ ] Use ONLY `commonName` field for transport disruptions
- [ ] Use ONLY `locationName` field for inspectors
- [ ] Convert to lowercase and replace spaces with hyphens
- [ ] Append technical ID with hyphen
- [ ] Test URLs in browser

---

## 🎯 **BOSS'S FINAL WORD**

**The URL structure is SIMPLE:**
- Street name only (no technical details)
- Lowercase with hyphens
- Technical ID at the end
- Clean, user-friendly URLs

**Follow these instructions exactly. No exceptions.**

**Status: READY FOR IMPLEMENTATION** 🚀
