// lib/types/inspectors.ts
export interface InspectorFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number]; // [lon, lat]
  };
  properties: {
    id: string;
    value: number; // 1 for active, 0 for clear
    data: {
      type: 'tfl' | 'police-check' | 'clear';
      originalMessage: string;
      formattedAddress: string;
      locationType: 'Fixed' | 'Loose';
      matchType: 'Exact Match' | 'OSM lookup';
      time: string;
    };
    distance_km: number;
  };
}

export interface InspectorsResponse {
  type: string;
  features: InspectorFeature[];
}

export interface InspectorData {
  id: string;
  type: 'tfl' | 'police-check' | 'clear';
  locationName: string;
  coordinates: [number, number];
  originalMessage: string;
  formattedAddress: string;
  locationType: 'Fixed' | 'Loose';
  matchType: 'Exact Match' | 'OSM lookup';
  time: string; // Raw timestamp from API
  distance_km: number;
  lastUpdatedTimestamp: string; // Required timestamp for auto-updating
  inspectorId?: string;
}