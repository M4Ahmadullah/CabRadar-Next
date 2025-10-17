# 🎯 COORDINATE-BASED API CALLS - ANDROID IMPLEMENTATION GUIDE

## ✅ CURRENT STATUS: ALL CONTENT TYPES WORKING

All 4 content types now support coordinate-based API calls and proper name extraction:

- ✅ **Road Disruptions** - Working perfectly
- ✅ **Events** - Working perfectly  
- ✅ **Transport Disruptions** - Working perfectly
- ✅ **Inspectors** - Working perfectly

## 🔍 COORDINATE-BASED API CALLS

The web app now uses the **actual coordinates** of each content item instead of Central London, providing more accurate and relevant data.

### How It Works:

1. **Android team generates URL** with clean name
2. **Web app finds the content** by name matching
3. **Web app uses actual coordinates** of that content for API calls
4. **More accurate data** is returned based on the actual location

## 📋 ANDROID IMPLEMENTATION REQUIREMENTS

### 1. Extract Coordinates from API Data

For each content type, extract the coordinates from the API response:

#### Road Disruptions:
```kotlin
// Extract coordinates from road disruption data
val coordinates = disruptionData.geometry.coordinates // [lon, lat]
val lat = coordinates[1]
val lon = coordinates[0]
```

#### Events:
```kotlin
// Extract coordinates from event data
val lat = eventData.event_lat
val lon = eventData.event_lon
// OR from geometry
val coordinates = eventData.geometry.coordinates // [lon, lat]
```

#### Transport Disruptions:
```kotlin
// Extract coordinates from transport disruption data
val lat = disruptionData.lat
val lon = disruptionData.long
```

#### Inspectors:
```kotlin
// Extract coordinates from inspector data
val coordinates = inspectorData.geometry.coordinates // [lon, lat]
val lat = coordinates[1]
val lon = coordinates[0]
```

### 2. Include Coordinates in Share URLs

**OPTIONAL ENHANCEMENT:** You can include coordinates in the share URLs for even more accurate data:

```kotlin
// Enhanced URL with coordinates (optional)
fun generateEnhancedUrl(contentType: String, cleanName: String, lat: Double, lon: Double): String {
    return "http://localhost:3000/routes/$contentType/$cleanName?lat=$lat&lon=$lon"
}

// Examples:
// http://localhost:3000/routes/road-disruption/eastern-avenue-east?lat=51.5074&lon=-0.1276
// http://localhost:3000/routes/event/ritics-fest-2025-2nd-3rd-september?lat=51.5074&lon=-0.1276
// http://localhost:3000/routes/transport-disruption/leicester-square-underground-station?lat=51.5074&lon=-0.1276
```

### 3. Current Working URL Structure

**Pattern:** `http://localhost:3000/routes/{type}/{cleanName}`

#### Road Disruptions:
- Extract from `road_description` first (Android team's approach)
- Fallback to `road_name` if needed
- Example: `eastern-avenue-east`, `greenford-road`, `evelyn-street`

#### Events:
- Extract from `title` field
- Fallback to `venue_name` if needed
- Example: `leading-practical-ai-for-business-transformation-exec-masterclass`, `ritics-fest-2025-2nd-3rd-september`

#### Transport Disruptions:
- Extract from `commonName` field
- Example: `leicester-square-underground-station`, `piccadilly-circus-underground-station`

#### Inspectors:
- Extract from `id` field first (Android team's approach)
- Fallback to `location` or `name` if needed
- Example: `victoria-embankment`, `test-location`

## 🎯 BENEFITS OF COORDINATE-BASED APPROACH

1. **More Accurate Data**: API returns data relevant to the actual location
2. **Better User Experience**: Users see data for their specific area
3. **Consistent Performance**: All content types work the same way
4. **Future-Proof**: Easy to enhance with coordinate parameters

## 📊 VERIFICATION

All URLs are tested and working:

### Road Disruptions:
- ✅ `eastern-avenue-east`
- ✅ `greenford-road`
- ✅ `evelyn-street`
- ✅ `north-hyde-road`
- ✅ `hanger-lane`

### Events:
- ✅ `leading-practical-ai-for-business-transformation-exec-masterclass`
- ✅ `ritics-fest-2025-2nd-3rd-september`

### Transport Disruptions:
- ✅ `leicester-square-underground-station`
- ✅ `piccadilly-circus-underground-station`
- ✅ `covent-garden-underground-station`

### Inspectors:
- ✅ `victoria-embankment`
- ✅ `test-location`

## 🚀 IMPLEMENTATION SUMMARY

**Current Status:** ✅ **COMPLETE**

The Android team can continue using the existing URL generation approach. The web app now:

1. **Matches content by name** (Android team's approach)
2. **Uses actual coordinates** for more accurate API calls
3. **Handles all content types** consistently
4. **Provides better data** based on actual locations

**No changes required from Android team** - everything is working perfectly!

---

**All content types are now fully functional with coordinate-based API calls! 🎉**
