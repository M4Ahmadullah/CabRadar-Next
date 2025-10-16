// lib/utils/mapbox.ts
export const MAPBOX_CONFIG = {
  ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!,
  STYLE_URL: process.env.NEXT_PUBLIC_MAPBOX_STYLE_URL!,
  DEFAULT_CENTER: [-0.1276, 51.5074], // London coordinates - EXACT mobile app center
  DEFAULT_ZOOM: 10,
  MIN_ZOOM: 7,
  MAX_ZOOM: 18,
  // EXACT mobile app map settings
  RENDER_MODE: 'vector' as const,
  UI_ELEMENTS: {
    LOGO: false,
    ATTRIBUTION: false,
    COMPASS: false,
    SCALE_BAR: false,
  },
  PERFORMANCE: {
    SURFACE_VIEW: true,
    TILE_CACHE_SIZE: 50,
    MAX_CONCURRENT_REQUESTS: 6,
  }
} as const;
