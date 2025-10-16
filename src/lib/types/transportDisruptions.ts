// lib/types/transportDisruptions.ts
export interface TransportDisruptionData {
  id: string;
  service: string;
  commonName: string;
  lat: number;
  long: number;
  coordinates: [number, number];
  disruptions: Record<string, DisruptionInfo>;
  distance_km: number;
  airport_tag?: boolean;
  status: 'Disruption' | 'Closure' | 'Suspension' | 'Delay';
  description: string;
  fromDate: string;
  toDate?: string;
  lastUpdated: string;
  affectedLines?: string[];
  affectedStations?: string[];
}

export interface DisruptionInfo {
  line: string | null;
  fromDate: string;
  description: string;
  type: 'Disruption' | 'Closure' | 'Suspension' | 'Delay';
}

export interface TransportDisruptionResponse {
  data: TransportDisruptionData;
  success: boolean;
  message?: string;
}
