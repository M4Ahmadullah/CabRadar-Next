# 🎯 EVENTS URL FIX FOR ANDROID TEAM

## ⚠️ CRITICAL ISSUES IDENTIFIED

The Android team has **THREE major issues** when generating event URLs:

1. **❌ Case Sensitivity:** Using mixed case instead of lowercase
2. **❌ Special Character Handling:** Not properly removing apostrophes, parentheses, etc.
3. **❌ Title Truncation:** Not using the complete title from API

---

## 🔍 CURRENT PROBLEM

### ❌ What Android is doing:
```kotlin
// Issue 1: Mixed case
val url1 = "http://localhost:3000/routes/event/Disneys-THE-LION-KING"

// Issue 2: Special characters not handled properly
val url2 = "http://localhost:3000/routes/event/English-National-Opera-La-Cenerentola-Cinderella"
```

### ✅ What the API actually contains:
```json
{
  "title": "Disney's THE LION KING",
  "venue_name": "Lyceum Theatre, London"
}
```

```json
{
  "title": "English National Opera - La Cenerentola (Cinderella )",
  "venue_name": "London Coliseum"
}
```

### 🎯 Correct URLs should be:
```
http://localhost:3000/routes/event/disney-s-the-lion-king
http://localhost:3000/routes/event/english-national-opera-la-cenerentola-cinderella
```

---

## 📋 ANDROID TEAM FIX REQUIRED

### 1. **Use COMPLETE Title Field & Convert to Lowercase**
```kotlin
// ❌ WRONG - Mixed case and truncated
val eventTitle = "Disneys-THE-LION-KING" // Mixed case
val eventTitle2 = "English-National-Opera-La-Cenerentola-Cinderella" // Mixed case

// ✅ CORRECT - Use full title and convert to lowercase
val eventTitle = eventData.title.lowercase() // "disney's the lion king"
val eventTitle2 = eventData.title.lowercase() // "english national opera - la cenerentola (cinderella )"
```

### 2. **URL Generation Process**
```kotlin
fun generateEventUrl(eventData: EventData): String {
    // Extract FULL title from API
    val fullTitle = eventData.title
    
    // Convert to clean URL format - CRITICAL: Use lowercase!
    val cleanTitle = fullTitle
        .lowercase() // ← CRITICAL: Convert to lowercase first
        .replace(" ", "-")
        .replace("'", "") // Remove apostrophes
        .replace("[^a-z0-9-]".toRegex(), "") // Remove special characters
    
    // Generate URL with coordinates
    val url = "http://localhost:3000/routes/event/$cleanTitle?lat=${eventData.lat}&lon=${eventData.lon}"
    
    return url
}
```

### 3. **Real Examples from API**

| Event Title | Android Generated (❌) | Correct URL (✅) |
|-------------|----------------------|------------------|
| `"English National Opera - La Cenerentola (Cinderella )"` | `English-National-Opera-La-Cenerentola-Cinderella` | `english-national-opera-la-cenerentola-cinderella` |
| `"Disney's THE LION KING"` | `Disneys-THE-LION-KING` | `disney-s-the-lion-king` |
| `"Leading Practical AI for Business Transformation - Exec Masterclass"` | `leading-practical-ai` | `leading-practical-ai-for-business-transformation-exec-masterclass` |
| `"RITICS FEST 2025 , 2nd - 3rd September"` | `ritics-fest-2025` | `ritics-fest-2025-2nd-3rd-september` |

---

## 🔧 IMPLEMENTATION CHECKLIST

- [ ] **Extract FULL `title` field** from API response
- [ ] **Don't truncate** the title text
- [ ] **Convert to lowercase** and replace spaces with hyphens
- [ ] **Remove special characters** (parentheses, commas, etc.)
- [ ] **Include coordinates** in URL parameters
- [ ] **Test with real API data** to ensure exact matches

---

## 🧪 TESTING

### Test URLs that should work:
```
✅ http://localhost:3000/routes/event/disney-s-the-lion-king?lat=51.5117077&lon=-0.119996
✅ http://localhost:3000/routes/event/english-national-opera-la-cenerentola-cinderella?lat=51.509824169&lon=-0.1268975405
✅ http://localhost:3000/routes/event/leading-practical-ai-for-business-transformation-exec-masterclass?lat=51.5074&lon=-0.1276
✅ http://localhost:3000/routes/event/ritics-fest-2025-2nd-3rd-september?lat=51.5074&lon=-0.1276
```

### Current URLs (❌ NOT WORKING - Multiple issues):
```
❌ http://localhost:3000/routes/event/Disneys-THE-LION-KING?lat=51.5117077&lon=-0.119996
❌ http://localhost:3000/routes/event/English-National-Opera-La-Cenerentola-Cinderella?lat=51.509824169&lon=-0.1268975405
```

---

## 📞 CONTACT

If you need clarification on any part of this implementation, please reach out to the web team.

**Priority: HIGH** - This affects user experience and URL accuracy.

---

*Generated: $(date)*
*Status: Android team action required*
