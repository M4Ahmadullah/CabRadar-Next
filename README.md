# CabRadar Web Project

A Next.js application that provides web views of the mobile app's MessageContent screens for CabRadar's disruption and event information.

## 🎯 Project Purpose

The web project serves as a shareable web interface for CabRadar's disruption and event information. Users can share URLs that lead directly to specific disruption/event details, allowing others to view the same information without needing the mobile app.

## 🏗️ Architecture

- **Framework**: Next.js 15.5.5 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Maps**: Mapbox GL JS
- **TypeScript**: Full type safety
- **ESLint**: Code quality and consistency

## 📱 Design Philosophy

**CRITICAL**: The web app matches the mobile app design 100%:
- **Fixed width**: 375px (iPhone standard) - NOT responsive web width
- **Exact pixel measurements** from mobile app
- **Same fonts, colors, spacing, and layout**
- **Mobile viewport only** - no desktop/tablet adaptations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Mapbox account and access token

### Installation

1. **Clone and install dependencies**
   ```bash
   cd CabRadar-Next
   npm install
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your actual values:
   ```bash
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
   NEXT_PUBLIC_MAPBOX_STYLE_URL=your_mapbox_style_url
   NEXT_PUBLIC_API_BASE_URL=https://your-api-base-url.com
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
src/
├── app/
│   ├── (routes)/
│   │   ├── road-disruption/[id]/page.tsx
│   │   ├── inspector/[id]/page.tsx
│   │   ├── event/[id]/page.tsx
│   │   └── transport-disruption/[id]/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── RoadBadge.tsx
│   │   ├── LiveIcon.tsx
│   │   ├── MapComponent.tsx
│   │   └── ShareButton.tsx
│   ├── layouts/
│   │   ├── MessageContentLayout.tsx
│   │   └── Header.tsx
│   └── content/
│       ├── RoadDisruptionContent.tsx
│       ├── InspectorContent.tsx
│       ├── EventContent.tsx
│       └── TransportDisruptionContent.tsx
├── lib/
│   ├── api/
│   │   ├── roadDisruptions.ts
│   │   ├── inspectors.ts
│   │   ├── events.ts
│   │   └── transportDisruptions.ts
│   ├── utils/
│   │   ├── fonts.ts
│   │   ├── colors.ts
│   │   ├── timeUtils.ts
│   │   └── mapbox.ts
│   └── types/
│       ├── roadDisruptions.ts
│       ├── inspectors.ts
│       ├── events.ts
│       └── transportDisruptions.ts
└── public/
    ├── fonts/
    └── icons/
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🗺️ Routes

The application provides 4 main dynamic routes:

1. **Road Disruption**: `/road-disruption/[id]`
   - Displays road disruption information with map
   - Shows severity, affected roads, and impact details

2. **Inspector**: `/inspector/[id]`
   - Shows inspector check information
   - Displays type (TfL, Police, Clear) and location

3. **Event**: `/event/[id]`
   - Displays event information
   - Shows category, venue, timing, and impact

4. **Transport Disruption**: `/transport-disruption/[id]`
   - Shows transport disruption details
   - Displays affected stations and alternative routes

## 🎨 Design System

### Typography
- **Primary Font**: Hammersmith One (for titles)
- **Secondary Font**: Gill Sans MT (for body text)
- **Exact font sizes and spacing** from mobile app

### Colors
- **Primary**: #3B82F6 (Blue)
- **Road Types**: A roads (#006C49), M roads (#007BC1), Streets (#6B7280)
- **Status Colors**: Success (#26D543), Warning (#EA580C), Error (#DC2626)
- **Live Indicator**: #26D543 with pulse animation

### Components
- **RoadBadge**: Displays road type and number with exact mobile styling
- **LiveIcon**: Animated live indicator for real-time updates
- **MapComponent**: Mapbox integration with custom markers
- **ShareButton**: Native sharing with clipboard fallback

## 🔧 Configuration

### Mapbox Setup
1. Create a Mapbox account
2. Get your access token
3. Create or use a custom style
4. Update environment variables

### API Integration
The app expects API endpoints that return data in the following format:
```typescript
{
  data: {
    id: string;
    title: string;
    description: string;
    // ... other fields
  },
  success: boolean;
  message?: string;
}
```

## 📱 Mobile-First Design

The application is designed to look exactly like the mobile app:
- Fixed 375px width container
- No responsive breakpoints
- Exact pixel measurements
- Mobile-optimized touch targets
- Native mobile sharing capabilities

## 🚀 Deployment

The application is optimized for deployment on Vercel:

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

## 📋 Next Steps

1. **Add real font files** to `public/fonts/`
2. **Add icon assets** to `public/icons/`
3. **Configure API endpoints** in environment variables
4. **Test with real data** from your API
5. **Customize Mapbox style** for your brand

## 🤝 Contributing

1. Follow the exact design specifications
2. Maintain mobile-first approach
3. Use TypeScript for all new code
4. Run linting before committing
5. Test all routes with real data

## 📄 License

This project is proprietary to CabRadar.
