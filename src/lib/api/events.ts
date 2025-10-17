// lib/api/events.ts
import { EventData, EventResponse } from '@/lib/types/events';
import { createEventSlug, extractIdFromSlug } from '@/lib/utils/slugUtils';

const EXTERNAL_API_BASE_URL = 'https://list-api-service.hellocabradar.workers.dev';

export const getEvent = async (cleanName: string, lat?: number, lon?: number): Promise<EventData> => {
  try {
    // Use provided coordinates or fallback to Central London
    const searchLat = lat || 51.5074;
    const searchLon = lon || -0.1276;
    
    // Get all events from the specified location
    const response = await fetch(`/api/events?lat=${searchLat}&lon=${searchLon}&width=1000&height=1000`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CabRadar/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Events API error: ${response.status}`);
    }

    const data = await response.json();

        // Find the event by matching title (converted to clean name)
        for (const feature of data.features || []) {
          const props = feature.properties;
          
          // Extract event name from title field
          let eventName = '';
          
          if (props.title && props.title.trim()) {
            eventName = props.title.trim();
          } else if (props.venue_name && props.venue_name.trim()) {
            eventName = props.venue_name.trim();
          }
          
          const cleanEventName = eventName.toLowerCase()
            .replace(/[^a-z0-9]/g, ' ') // Replace special characters with spaces
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
          
          // Convert the incoming cleanName to lowercase for case-insensitive matching
          const normalizedCleanName = cleanName.toLowerCase();
          
          console.log('🔍 Event matching:', {
            originalTitle: props.title,
            eventName,
            cleanEventName,
            normalizedCleanName,
            match: cleanEventName === normalizedCleanName
          });
          
          if (cleanEventName === normalizedCleanName) {
        // Use the actual event coordinates for more accurate data
        const eventCoords = feature.geometry.coordinates || [51.5074, -0.1276];
        
        // Transform the API data to match our interface
        return {
          id: props.id,
          title: props.title,
          category: props.category || 'event',
          size: props.size,
          venue_name: props.venue_name,
          start_local: props.start_local,
          true_end: props.true_end,
          attendance: props.attendance,
          postcode: props.postcode,
          venue_formatted_address: props.venue_formatted_address,
          event_lat: props.event_lat,
          event_lon: props.event_lon,
          coordinates: eventCoords, // Use actual event coordinates
          distance_km: feature.distance_km,
          icon: props.icon,
          is_ending_soon: props.is_ending_soon,
          timeAgo: new Date(props.start_local).toLocaleString(),
          comment: props.comment,
          description: props.comment || `${props.category} event`,
          ticket_url: undefined,
          organizer: undefined
        };
      }
    }

    // If exact match not found, try fuzzy matching for common variations
    console.warn(`Exact match not found for "${cleanName}". Available events:`, 
      data.features?.map((f: any) => {
        const name = f.properties.title || f.properties.venue_name || 'unknown';
        return name.toLowerCase().replace(/\s+/g, '-');
      }).slice(0, 5)
    );
    
    throw new Error(`Event with name "${cleanName}" not found. Please check the event name spelling.`);
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

export const generateEventSlug = (title: string, eventId: string): string => {
  return createEventSlug(title, eventId);
};
