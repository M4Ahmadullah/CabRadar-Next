# CabRadar Web - Individual Route Pages Design Documentation

## Overview
This document provides **pixel-perfect** design specifications for all four individual route pages (`/road-disruption/[id]`, `/inspector/[id]`, `/event/[id]`, `/transport-disruption/[id]`). Every component, measurement, color, font, and spacing is defined with exact values to ensure 100% mobile app parity.

## 🎯 Screen Specifications

### Container Specifications
- **Width:** 375px (FIXED - no responsive behavior)
- **Height:** 100vh (full viewport height)
- **Background:** #FFFFFF (Pure white)
- **Position:** Centered horizontally on all screen sizes
- **Overflow:** Vertical scroll enabled
- **Margin:** 0 auto (horizontal centering)

### CSS Implementation
```css
.road-disruption-container {
  width: 375px !important;
  max-width: 375px !important;
  min-width: 375px !important;
  height: 100vh;
  background: #FFFFFF;
  margin: 0 auto;
  overflow-y: auto;
  overflow-x: hidden;
}
```

---

## 📐 Component Layout Structure

### Vertical Stack Order (Top to Bottom)
```
┌─────────────────────────────────────┐ ← 0px from top
│ 1. Header Component                 │ ← Height: 60px
├─────────────────────────────────────┤ ← 60px from top
│ 2. Live Icon (Conditional)          │ ← Height: 40px (if present)
├─────────────────────────────────────┤ ← 100px from top (if live icon)
│ 3. Road Disruption Card             │ ← Height: Variable (~200-300px)
├─────────────────────────────────────┤ ← Margin: 16px bottom
│ 4. Disruption Information           │ ← Height: Variable (~150-250px)
├─────────────────────────────────────┤ ← Margin: 16px bottom
│ 5. Location Map                     │ ← Height: 256px (16rem)
├─────────────────────────────────────┤ ← Margin: 16px bottom
│ 6. Share Button                     │ ← Height: 48px
└─────────────────────────────────────┘ ← Margin: 16px bottom
```

### Horizontal Spacing
- **Left Margin:** 16px (from container edge)
- **Right Margin:** 16px (from container edge)
- **Component Width:** 343px (375px - 32px margins)

---

## 🎨 Design System Values

### Typography Scale (EXACT Mobile App Values)
```css
.text-screen-title {
  font-family: 'Hammersmith One', sans-serif;
  font-size: 24px;
  line-height: 28px;
  font-weight: 400;
  color: #1F2937;
}

.text-message-title {
  font-family: 'Hammersmith One', sans-serif;
  font-size: 16px;
  line-height: 20px;
  font-weight: 400;
  color: #1F2937;
}

.text-message-body {
  font-family: 'Gill Sans MT', sans-serif;
  font-size: 14px;
  line-height: 18px;
  font-weight: 400;
  color: #374151;
}

.text-london-time {
  font-family: 'Gill Sans MT', sans-serif;
  font-size: 14px;
  line-height: 18px;
  font-weight: 400;
  color: #6B7280;
}

.text-small-label {
  font-family: 'Gill Sans MT', sans-serif;
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
  color: #6B7280;
}
```

### Color System (EXACT Mobile App Values)
```css
/* Primary Colors */
--color-primary: #3B82F6;
--color-primary-dark: #1D4ED8;
--color-background: #FFFFFF;
--color-background-secondary: #F9FAFB;

/* Text Colors */
--color-text-primary: #1F2937;
--color-text-secondary: #374151;
--color-text-muted: #6B7280;

/* Border Colors */
--color-border: #E5E7EB;
--color-border-light: #F3F4F6;

/* Road Disruption Severity Colors */
--color-serious: #EA580C;
--color-severe: #DC2626;
--color-closure: #991B1B;
--color-moderate: #D97706;

/* Road Badge Colors */
--color-road-a: #006C49;
--color-road-m: #007BC1;
--color-road-street: #6B7280;

/* Status Colors */
--color-live-red: #26D543;
--color-success: #10B981;
--color-warning: #F59E0B;
--color-error: #EF4444;

/* Shadow Colors */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
```

### Spacing System (EXACT Mobile App Values)
```css
/* Component Margins */
.margin-xs: 4px;
.margin-sm: 8px;
.margin-md: 12px;
.margin-lg: 16px;
.margin-xl: 20px;
.margin-2xl: 24px;

/* Component Padding */
.padding-xs: 4px;
.padding-sm: 8px;
.padding-md: 12px;
.padding-lg: 16px;
.padding-xl: 20px;
.padding-2xl: 24px;

/* Card Specifications */
.card-margin: 16px;
.card-padding: 16px;
.card-border-radius: 8px;
.card-border-width: 1px;
.card-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
```

---

## 🔧 Component Specifications Summary

## 1. Road Disruption Page (`/road-disruption/[id]`)

### Header Component
- **Position:** Fixed at top (0px from top)
- **Height:** 60px
- **Background:** #FFFFFF
- **Border:** Bottom 1px solid #E5E7EB
- **Padding:** 16px horizontal, 12px vertical
- **Back Button:** 32x32px, left-aligned
- **Close Button:** 32x32px, right-aligned
- **Title:** "Road Disruption", centered, text-screen-title

#### Header Layout Structure
```
┌─────────────────────────────────────┐
│ [Back]     Road Disruption     [X]  │
│ Button           Title         Button│
│ 32x32px         Centered       32x32px│
└─────────────────────────────────────┘
```

#### Header CSS Implementation
```css
.road-disruption-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 375px;
  height: 60px;
  background: #FFFFFF;
  border-bottom: 1px solid #E5E7EB;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
}

.header-back-button {
  position: absolute;
  left: 16px;
  top: 12px;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 200ms ease-in-out;
}

.header-back-button:hover {
  transform: scale(1.1);
}

.header-title {
  position: absolute;
  left: 50%;
  top: 12px;
  transform: translateX(-50%);
  font-family: 'Hammersmith One', sans-serif;
  font-size: 24px;
  line-height: 28px;
  font-weight: 400;
  color: #1F2937;
  text-align: center;
  letter-spacing: 0px;
}
```

### Live Icon (Conditional)
- **Position:** Below header, full width
- **Height:** 40px
- **Background:** Red gradient (#DC2626 to #B91C1C)
- **Animation:** Pulsing effect (scale 1.0 to 1.05)
- **Text:** "LIVE", white, font-hammersmith, 16px
- **Icon:** Red circle with white dot, 12px diameter

### Road Disruption Card
- **Container:** White background, rounded-lg (8px), shadow-sm
- **Margin:** 16px horizontal, 16px bottom
- **Padding:** 16px all sides
- **Border:** 1px solid #E5E7EB

#### Card Header
- **Severity Icon:** 24x24px, positioned left
- **Severity Text:** font-hammersmith, 18px, color based on severity:
  - Serious: #EA580C
  - Severe: #DC2626
  - Closure: #991B1B
  - Moderate: #D97706
- **Time Ago:** Right-aligned, text-london-time (14px), #6B7280

#### Road Information Section
- **Road Badge:** 
  - Type: A/M/Street
  - Size: road-disruption-message (27.1px height)
  - Colors: A=#006C49, M=#007BC1, Street=#6B7280
- **Road Name:** text-message-title (16px), #1F2937, margin-left 8px

#### Current Update Section
- **Label:** "Current Update", text-small-label (12px), #6B7280
- **Content:** text-message-body (14px), #374151, margin-top 4px

#### Affected Roads Section
- **Label:** "Affected Roads", text-small-label (12px), #6B7280
- **Road List:** Vertical list of road badges, each 25px height
- **Margin:** 8px between items

#### Time Information
- **From Date:** text-small-label (12px), #6B7280
- **To Date:** text-small-label (12px), #6B7280
- **Last Updated:** text-small-label (12px), #6B7280

### Disruption Information Component
- **Container:** White background, rounded-lg (8px)
- **Margin:** 16px horizontal, 16px bottom
- **Padding:** 16px all sides

#### Information Sections
- **Description:** text-message-body (14px), #374151
- **Category:** text-small-label (12px), #6B7280
- **Sub Category:** text-small-label (12px), #6B7280
- **Comments:** text-message-body (14px), #374151

### Location Map
- **Container:** White background, rounded-lg (8px)
- **Margin:** 16px horizontal, 16px bottom
- **Height:** 256px (16rem)
- **Mapbox Integration:**
  - Style: mapbox://styles/cabplusuk/cl44fmtk8000315ocun5m5u8m
  - Zoom: 14
  - Center: Disruption coordinates
  - Custom Marker: Red disruption icon, 32x32px

### Share Button
- **Position:** Bottom of page, centered
- **Width:** 200px
- **Height:** 48px
- **Background:** Blue gradient (#3B82F6 to #1D4ED8)
- **Border Radius:** 8px
- **Text:** "Share This Disruption", white, font-hammersmith, 16px
- **Animation:** Scale on hover (1.0 to 1.05)

---

## 2. Inspector Page (`/inspector/[id]`)

### Page Structure
```
┌─────────────────────────────────────┐
│ Header (Back/Close buttons)         │
├─────────────────────────────────────┤
│ Live Icon (if inspector is live)   │
├─────────────────────────────────────┤
│ Inspector Card                      │
├─────────────────────────────────────┤
│ Inspector Information               │
├─────────────────────────────────────┤
│ Location Map                        │
├─────────────────────────────────────┤
│ Share Button                        │
└─────────────────────────────────────┘
```

### Header Component
- **Height:** 60px
- **Background:** White (#FFFFFF)
- **Border:** Bottom border 1px solid #E5E7EB
- **Padding:** 16px horizontal, 12px vertical
- **Back Button:** 32x32px, positioned left
- **Close Button:** 32x32px, positioned right
- **Title:** "Inspector Check", centered, font-hammersmith, text-screen-title (24px)

### Live Icon (Conditional)
- **Position:** Below header, full width
- **Height:** 40px
- **Background:** Blue gradient (#0066CC to #004499)
- **Animation:** Pulsing effect (scale 1.0 to 1.05)
- **Text:** "LIVE", white, font-hammersmith, 16px
- **Icon:** Blue circle with white dot, 12px diameter

### Inspector Card
- **Container:** White background, rounded-lg (8px), shadow-sm
- **Margin:** 16px horizontal, 16px bottom
- **Padding:** 16px all sides
- **Border:** 1px solid #E5E7EB

#### Card Header
- **Inspector Icon:** 24x24px, positioned left (police badge icon)
- **Inspector Type:** font-hammersmith, 18px, color based on type:
  - TFL: #0066CC
  - Police Check: #DC2626
  - Other: #16A34A
- **Time Ago:** Right-aligned, text-london-time (14px), #6B7280

#### Location Information Section
- **Location Name:** text-message-title (16px), #1F2937
- **Formatted Address:** text-message-body (14px), #374151
- **Distance:** text-small-label (12px), #6B7280

#### Status Information
- **Status Badge:** 
  - Active: Green background (#10B981), white text
  - Clear: Gray background (#6B7280), white text
- **Status Text:** font-hammersmith, 14px

### Inspector Information Component
- **Container:** White background, rounded-lg (8px)
- **Margin:** 16px horizontal, 16px bottom
- **Padding:** 16px all sides

#### Information Sections
- **Original Message:** text-message-body (14px), #374151
- **Location Type:** text-small-label (12px), #6B7280
- **Match Type:** text-small-label (12px), #6B7280
- **Inspector ID:** text-small-label (12px), #6B7280

### Location Map
- **Container:** White background, rounded-lg (8px)
- **Margin:** 16px horizontal, 16px bottom
- **Height:** 256px (16rem)
- **Mapbox Integration:**
  - Style: mapbox://styles/cabplusuk/cl44fmtk8000315ocun5m5u8m
  - Zoom: 14
  - Center: Inspector coordinates
  - Custom Marker: Blue inspector icon, 32x32px

### Share Button
- **Position:** Bottom of page, centered
- **Width:** 200px
- **Height:** 48px
- **Background:** Blue gradient (#3B82F6 to #1D4ED8)
- **Border Radius:** 8px
- **Text:** "Share This Inspector Check", white, font-hammersmith, 16px
- **Animation:** Scale on hover (1.0 to 1.05)

---

## 3. Event Page (`/event/[id]`)

### Page Structure
```
┌─────────────────────────────────────┐
│ Header (Back/Close buttons)         │
├─────────────────────────────────────┤
│ Live Icon (if event is live)      │
├─────────────────────────────────────┤
│ Event Card                         │
├─────────────────────────────────────┤
│ Event Information                  │
├─────────────────────────────────────┤
│ Location Map                       │
├─────────────────────────────────────┤
│ Share Button                       │
└─────────────────────────────────────┘
```

### Header Component
- **Height:** 60px
- **Background:** White (#FFFFFF)
- **Border:** Bottom border 1px solid #E5E7EB
- **Padding:** 16px horizontal, 12px vertical
- **Back Button:** 32x32px, positioned left
- **Close Button:** 32x32px, positioned right
- **Title:** "Event", centered, font-hammersmith, text-screen-title (24px)

### Live Icon (Conditional)
- **Position:** Below header, full width
- **Height:** 40px
- **Background:** Purple gradient (#9333EA to #7C3AED)
- **Animation:** Pulsing effect (scale 1.0 to 1.05)
- **Text:** "LIVE", white, font-hammersmith, 16px
- **Icon:** Purple circle with white dot, 12px diameter

### Event Card
- **Container:** White background, rounded-lg (8px), shadow-sm
- **Margin:** 16px horizontal, 16px bottom
- **Padding:** 16px all sides
- **Border:** 1px solid #E5E7EB

#### Card Header
- **Event Icon:** 24x24px, positioned left, color based on category:
  - Sports: ⚽ (Green #22C55E)
  - Concerts: 🎵 (Purple #9333EA)
  - Festivals: 🎪 (Orange #EA580C)
  - Performing Arts: 🎭 (Pink #DB2777)
  - Conferences: 💼 (Blue #2563EB)
  - Other: 🏢 (Gray #4B5563)
- **Event Title:** font-hammersmith, 18px, #1F2937
- **Time Ago:** Right-aligned, text-london-time (14px), #6B7280

#### Event Information Section
- **Category:** text-small-label (12px), #6B7280
- **Size:** text-small-label (12px), #6B7280
- **Venue Name:** text-message-title (16px), #1F2937
- **Attendance:** text-small-label (12px), #6B7280

#### Time Information
- **Start Time:** text-message-body (14px), #374151
- **End Time:** text-message-body (14px), #374151
- **Is Ending Soon:** Red badge if true

### Event Information Component
- **Container:** White background, rounded-lg (8px)
- **Margin:** 16px horizontal, 16px bottom
- **Padding:** 16px all sides

#### Information Sections
- **Description:** text-message-body (14px), #374151
- **Comment:** text-message-body (14px), #374151
- **Postcode:** text-small-label (12px), #6B7280
- **Venue Address:** text-message-body (14px), #374151

### Location Map
- **Container:** White background, rounded-lg (8px)
- **Margin:** 16px horizontal, 16px bottom
- **Height:** 256px (16rem)
- **Mapbox Integration:**
  - Style: mapbox://styles/cabplusuk/cl44fmtk8000315ocun5m5u8m
  - Zoom: 14
  - Center: Event coordinates
  - Custom Marker: Purple event icon, 32x32px

### Share Button
- **Position:** Bottom of page, centered
- **Width:** 200px
- **Height:** 48px
- **Background:** Blue gradient (#3B82F6 to #1D4ED8)
- **Border Radius:** 8px
- **Text:** "Share This Event", white, font-hammersmith, 16px
- **Animation:** Scale on hover (1.0 to 1.05)

---

## 4. Transport Disruption Page (`/transport-disruption/[id]`)

### Page Structure
```
┌─────────────────────────────────────┐
│ Header (Back/Close buttons)         │
├─────────────────────────────────────┤
│ Live Icon (if disruption is live)   │
├─────────────────────────────────────┤
│ Transport Disruption Card           │
├─────────────────────────────────────┤
│ Disruption Information              │
├─────────────────────────────────────┤
│ Location Map                        │
├─────────────────────────────────────┤
│ Share Button                        │
└─────────────────────────────────────┘
```

### Header Component
- **Height:** 60px
- **Background:** White (#FFFFFF)
- **Border:** Bottom border 1px solid #E5E7EB
- **Padding:** 16px horizontal, 12px vertical
- **Back Button:** 32x32px, positioned left
- **Close Button:** 32x32px, positioned right
- **Title:** "Transport Disruption", centered, font-hammersmith, text-screen-title (24px)

### Live Icon (Conditional)
- **Position:** Below header, full width
- **Height:** 40px
- **Background:** Orange gradient (#EA580C to #C2410C)
- **Animation:** Pulsing effect (scale 1.0 to 1.05)
- **Text:** "LIVE", white, font-hammersmith, 16px
- **Icon:** Orange circle with white dot, 12px diameter

### Transport Disruption Card
- **Container:** White background, rounded-lg (8px), shadow-sm
- **Margin:** 16px horizontal, 16px bottom
- **Padding:** 16px all sides
- **Border:** 1px solid #E5E7EB

#### Card Header
- **Service Icon:** 24x24px, positioned left, based on service:
  - Tube: 🚇 (Blue #0066CC)
  - Bus: 🚌 (Red #DC2626)
  - Train: 🚂 (Green #16A34A)
  - DLR: 🚈 (Teal #0891B2)
  - Tram: 🚋 (Purple #9333EA)
  - Other: 🚆 (Gray #6B7280)
- **Service Name:** font-hammersmith, 18px, #1F2937
- **Status:** font-hammersmith, 16px, color based on status:
  - Disruption: #EA580C
  - Closure: #DC2626
  - Suspension: #991B1B
  - Other: #D97706

#### Service Information Section
- **Common Name:** text-message-title (16px), #1F2937
- **Service Type:** text-small-label (12px), #6B7280
- **Distance:** text-small-label (12px), #6B7280

#### Disruption Details
- **Description:** text-message-body (14px), #374151
- **From Date:** text-small-label (12px), #6B7280
- **To Date:** text-small-label (12px), #6B7280

### Transport Disruption Information Component
- **Container:** White background, rounded-lg (8px)
- **Margin:** 16px horizontal, 16px bottom
- **Padding:** 16px all sides

#### Information Sections
- **Description:** text-message-body (14px), #374151
- **Affected Lines:** Vertical list of affected lines
- **Affected Stations:** Vertical list of affected stations
- **Last Updated:** text-small-label (12px), #6B7280

### Location Map
- **Container:** White background, rounded-lg (8px)
- **Margin:** 16px horizontal, 16px bottom
- **Height:** 256px (16rem)
- **Mapbox Integration:**
  - Style: mapbox://styles/cabplusuk/cl44fmtk8000315ocun5m5u8m
  - Zoom: 14
  - Center: Disruption coordinates
  - Custom Marker: Orange transport disruption icon, 32x32px

### Share Button
- **Position:** Bottom of page, centered
- **Width:** 200px
- **Height:** 48px
- **Background:** Blue gradient (#3B82F6 to #1D4ED8)
- **Border Radius:** 8px
- **Text:** "Share This Disruption", white, font-hammersmith, 16px
- **Animation:** Scale on hover (1.0 to 1.05)

---

## Common Design Elements

### Typography
- **Primary Font:** Hammersmith One (font-hammersmith)
- **Secondary Font:** Gill Sans MT (font-gill-sans)
- **Screen Title:** 24px, font-hammersmith, #1F2937
- **Message Title:** 16px, font-hammersmith, #1F2937
- **Message Body:** 14px, font-gill-sans, #374151
- **Small Label:** 12px, font-gill-sans, #6B7280
- **London Time:** 14px, font-gill-sans, #6B7280

### Colors
- **Primary Background:** #FFFFFF
- **Secondary Background:** #F9FAFB
- **Border Color:** #E5E7EB
- **Text Primary:** #1F2937
- **Text Secondary:** #374151
- **Text Muted:** #6B7280

### Animations
- **Page Load:** Fade in (opacity 0 to 1) over 300ms
- **Card Load:** Slide up (y: 20 to 0) over 400ms with 100ms delay
- **Live Icon:** Pulsing scale (1.0 to 1.05) every 2 seconds
- **Hover Effects:** Scale (1.0 to 1.01) on cards, (1.0 to 1.05) on buttons
- **Tap Effects:** Scale (1.0 to 0.99) on interactive elements

### Spacing
- **Container Width:** 375px (fixed)
- **Horizontal Margins:** 16px
- **Vertical Margins:** 16px
- **Card Padding:** 16px
- **Section Spacing:** 16px between major sections

### Responsive Behavior
- **Fixed Width:** 375px on all screen sizes
- **Centered:** Horizontally centered on larger screens
- **No Desktop Adaptations:** Mobile-only design
- **Touch Targets:** Minimum 44px for interactive elements

---

## Technical Implementation Notes

### Component Structure
- All pages use `'use client'` directive for client-side rendering
- Framer Motion for animations
- Error boundaries for graceful error handling
- Loading states with skeleton components
- Dynamic metadata generation for SEO

### API Integration
- Server-side data fetching for initial load
- Client-side state management with React hooks
- Error handling with fallback UI
- Timeout handling (5 seconds)
- CORS handling through internal API routes

### Performance Considerations
- Lazy loading of map components
- Optimized image loading with Next.js Image
- Minimal JavaScript bundle size
- Efficient re-rendering with React.memo where appropriate

---

## Design Issues & Recommendations

### Current Issues
1. **Fixed Width Limitation:** 375px width may not be optimal for all devices
2. **No Desktop Experience:** No responsive design for larger screens
3. **Limited Accessibility:** Could benefit from better ARIA labels and keyboard navigation
4. **Loading States:** Could be more sophisticated with skeleton screens

### Recommended Improvements
1. **Responsive Design:** Add breakpoints for tablet and desktop views
2. **Accessibility:** Implement proper ARIA labels, focus management, and screen reader support
3. **Enhanced Loading:** Add skeleton screens and progressive loading
4. **Better Error States:** More informative error messages and recovery options
5. **Performance:** Implement virtual scrolling for long lists
6. **Offline Support:** Add service worker for offline functionality

### Mobile App Parity
- ✅ Exact color matching
- ✅ Typography consistency
- ✅ Component sizing
- ✅ Animation timing
- ✅ Layout structure
- ⚠️ Touch interactions (could be enhanced)
- ⚠️ Gesture support (not implemented)
