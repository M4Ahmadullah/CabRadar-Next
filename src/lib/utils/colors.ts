// lib/utils/colors.ts
export const COLORS = {
  // EXACT colors from mobile app config/colors.ts
  
  // Primary Colors
  PRIMARY: '#3B82F6',
  PRIMARY_DARK: '#1D4ED8',
  PRIMARY_LIGHT: '#60A5FA',
  
  // Background Colors - EXACT mobile app colors
  BACKGROUND_PRIMARY: '#FFFFFF',
  BACKGROUND_SECONDARY: '#FAFAFA',
  BACKGROUND_TERTIARY: '#F6F6F6',
  BACKGROUND_CARD: '#FFFFFF',
  
  // Text Colors - EXACT mobile app colors
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#1F2937',
  TEXT_TERTIARY: '#374151',
  TEXT_MUTED: '#6B7280',
  
  // Border Colors - EXACT mobile app colors
  BORDER_PRIMARY: '#E5E7EB',
  BORDER_SECONDARY: '#D1D5DB',
  
  // Road Badge Colors - EXACT mobile app colors
  ROAD_TYPE_A: {
    BORDER: '#006C49',
    BACKGROUND: '#006C49',
    TEXT: '#F8E027',
  },
  ROAD_TYPE_M: {
    BORDER: '#007BC1',
    BACKGROUND: '#007BC1',
    TEXT: '#FFFFFF',
  },
  ROAD_TYPE_STREET: {
    BORDER: '#6B7280',
    BACKGROUND: '#6B7280',
    TEXT: '#FFFFFF',
  },
  
  // Status Colors - EXACT mobile app colors
  STATUS_SUCCESS: '#26D543',
  STATUS_WARNING: '#EA580C',
  STATUS_ERROR: '#DC2626',
  STATUS_INFO: '#3B82F6',
  
  // Live Icon Colors - EXACT mobile app colors
  LIVE_ICON: {
    BACKGROUND: '#26D543',
    BORDER: '#000000',
    WHITE: '#FFFFFF',
    GRAY: '#F7F7F7',
  },
  
  // Shadow Colors - EXACT mobile app colors
  SHADOW_PRIMARY: '#0000001A', // 10% opacity
  SHADOW_SECONDARY: '#0000000D', // 5% opacity
  
  // Inspector Colors - EXACT mobile app colors
  INSPECTOR_TFL: '#0066CC',
  INSPECTOR_POLICE: '#DC2626',
  INSPECTOR_CLEAR: '#16A34A',
  
  // Event Category Colors - EXACT mobile app colors
  EVENT_SPORTS: '#22C55E',
  EVENT_CONCERTS: '#9333EA',
  EVENT_FESTIVALS: '#EA580C',
  EVENT_PERFORMING_ARTS: '#DB2777',
  EVENT_CONFERENCES: '#2563EB',
  EVENT_EXPOS: '#4B5563',
  
  // Transport Disruption Colors - EXACT mobile app colors
  TRANSPORT_DISRUPTION: '#EA580C',
  TRANSPORT_CLOSURE: '#DC2626',
  TRANSPORT_SUSPENSION: '#991B1B',
  TRANSPORT_DELAY: '#D97706',
} as const;
