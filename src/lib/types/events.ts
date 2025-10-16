// lib/types/events.ts
export interface EventData {
  id: string;
  title: string;
  category: 'sports' | 'expos' | 'performing-arts' | 'concerts' | 'conferences' | 'festivals';
  size: 'major' | 'main' | 'event' | 'local' | string;
  venue_name: string | null;
  start_local: string;
  true_end: string;
  attendance: number | null;
  postcode: string | null;
  venue_formatted_address: string | null;
  event_lat: number;
  event_lon: number;
  coordinates: [number, number];
  distance_km: number;
  icon: string;
  is_ending_soon?: boolean;
  timeAgo: string;
  comment?: string | null;
  description?: string;
  ticket_url?: string;
  organizer?: string;
}

export interface EventResponse {
  data: EventData;
  success: boolean;
  message?: string;
}
