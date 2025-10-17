# 🎯 SIMPLE URL STRUCTURE - ANDROID TEAM

## **BOSS DECISION: SIMPLE URL STRUCTURE**

**URL Pattern:** `http://localhost:3000/routes/{type}/{cleanName}`

**That's it. Nothing more. This is unique enough to differentiate.**

---

## 📱 **ANDROID IMPLEMENTATION**

### **1. Road Disruptions**
```kotlin
fun generateRoadDisruptionUrl(roadName: String): String {
    val cleanName = roadName.lowercase().replace(" ", "-")
    return "http://localhost:3000/routes/road-disruption/$cleanName"
}

// Usage:
val roadName = disruptionData.road_name ?: "unknown-road"
val url = generateRoadDisruptionUrl(roadName)
// Result: "http://localhost:3000/routes/road-disruption/southern-river-route"
```

### **2. Events**
```kotlin
fun generateEventUrl(eventTitle: String): String {
    val cleanName = eventTitle.lowercase().replace(" ", "-")
    return "http://localhost:3000/routes/event/$cleanName"
}

// Usage:
val eventTitle = eventData.title ?: "unknown-event"
val url = generateEventUrl(eventTitle)
// Result: "http://localhost:3000/routes/event/leading-practical-ai-for-business-transformation-exec-masterclass"
```

### **3. Transport Disruptions**
```kotlin
fun generateTransportDisruptionUrl(stationName: String): String {
    val cleanName = stationName.lowercase().replace(" ", "-")
    return "http://localhost:3000/routes/transport-disruption/$cleanName"
}

// Usage:
val stationName = disruptionData.commonName ?: "unknown-station"
val url = generateTransportDisruptionUrl(stationName)
// Result: "http://localhost:3000/routes/transport-disruption/leicester-square-underground-station"
```

### **4. Inspectors**
```kotlin
fun generateInspectorUrl(locationName: String): String {
    val cleanName = locationName.lowercase().replace(" ", "-")
    return "http://localhost:3000/routes/inspector/$cleanName"
}

// Usage:
val locationName = inspectorData.locationName ?: "unknown-location"
val url = generateInspectorUrl(locationName)
// Result: "http://localhost:3000/routes/inspector/oxford-circus"
```

---

## 🔧 **COMPLETE IMPLEMENTATION**

```kotlin
class ShareButtonHelper {
    companion object {
        private const val BASE_URL = "http://localhost:3000"
        
        fun generateRoadDisruptionUrl(roadName: String): String {
            val cleanName = roadName.lowercase().replace(" ", "-")
            return "$BASE_URL/routes/road-disruption/$cleanName"
        }
        
        fun generateEventUrl(eventTitle: String): String {
            val cleanName = eventTitle.lowercase().replace(" ", "-")
            return "$BASE_URL/routes/event/$cleanName"
        }
        
        fun generateTransportDisruptionUrl(stationName: String): String {
            val cleanName = stationName.lowercase().replace(" ", "-")
            return "$BASE_URL/routes/transport-disruption/$cleanName"
        }
        
        fun generateInspectorUrl(locationName: String): String {
            val cleanName = locationName.lowercase().replace(" ", "-")
            return "$BASE_URL/routes/inspector/$cleanName"
        }
    }
}
```

---

## 📊 **DATA MAPPING**

| Content Type | Use This Field | Example URL |
|--------------|----------------|-------------|
| **Road Disruption** | `road_name` | `http://localhost:3000/routes/road-disruption/southern-river-route` |
| **Event** | `title` | `http://localhost:3000/routes/event/london-marathon-2024` |
| **Transport Disruption** | `commonName` | `http://localhost:3000/routes/transport-disruption/leicester-square-underground-station` |
| **Inspector** | `locationName` | `http://localhost:3000/routes/inspector/oxford-circus` |

---

## ✅ **WORKING EXAMPLES**

These URLs are tested and working:

1. **Road Disruption:** `http://localhost:3000/routes/road-disruption/southern-river-route`
2. **Event:** `http://localhost:3000/routes/event/leading-practical-ai-for-business-transformation-exec-masterclass`
3. **Transport Disruption:** `http://localhost:3000/routes/transport-disruption/leicester-square-underground-station`
4. **Inspector:** `http://localhost:3000/routes/inspector/test-location`

---

## 🚨 **RULES**

1. **Use only the name field** (no IDs, no technical details)
2. **Convert to lowercase**
3. **Replace spaces with hyphens**
4. **That's it!**

---

## 🎯 **BOSS'S FINAL WORD**

**URL Structure:** `http://localhost:3000/routes/{type}/{cleanName}`

**No IDs. No technical details. Just clean names.**

**Follow this exactly. No exceptions.**

**Status: READY FOR IMPLEMENTATION** 🚀
