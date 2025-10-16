// lib/types/roadDisruptions.ts
export interface RoadDisruptionData {
  id: string;
  type: 'Serious' | 'Severe' | 'Closure' | 'Moderate';
  timeAgo: string;
  roadName: string;
  roadType: 'A' | 'M' | 'Street';
  roadNumber: string;
  coordinates: [number, number];
  category: string;
  subCategory: string;
  fromDate: string;
  toDate: string;
  currentUpdate: string;
  comments: string;
  lastUpdated: string;
  affectedRoads: Array<{
    type: 'A' | 'M' | 'Street';
    number: string;
  }>;
  severity: 'Serious' | 'Severe' | 'Closure' | 'Moderate';
  description: string;
  estimatedDuration?: string;
  alternativeRoutes?: string[];
}

export interface RoadDisruptionResponse {
  data: RoadDisruptionData;
  success: boolean;
  message?: string;
}
