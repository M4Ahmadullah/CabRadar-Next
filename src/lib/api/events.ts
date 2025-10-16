// lib/api/events.ts
import { EventData, EventResponse } from '@/lib/types/events';

const EXTERNAL_API_BASE_URL = 'https://list-api-service.hellocabradar.workers.dev';

export const getEvent = async (id: string): Promise<EventData> => {
  try {
    console.log(`Fetching event with ID: ${id}`);

    // Use internal API route to avoid CORS issues
    const response = await fetch(`/api/events?lat=51.5074&lon=-0.1276&width=1000&height=1000`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CabRadar/1.0',
      },
    });

    console.log(`API response status: ${response.status}`);

    if (!response.ok) {
      throw new Error(`Events API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Found ${data.features?.length || 0} events`);

    // Find the event by ID
    for (const feature of data.features || []) {
      if (feature.properties.id === id) {
        console.log(`Found event: ${feature.properties.title}`);
        const eventData = feature.properties;

        // Transform the API data to match our interface
        return {
          id: eventData.id,
          title: eventData.title,
          category: eventData.category || 'event',
          size: eventData.size,
          venue_name: eventData.venue_name,
          start_local: eventData.start_local,
          true_end: eventData.true_end,
          attendance: eventData.attendance,
          postcode: eventData.postcode,
          venue_formatted_address: eventData.venue_formatted_address,
          event_lat: eventData.event_lat,
          event_lon: eventData.event_lon,
          coordinates: feature.geometry.coordinates,
          distance_km: feature.distance_km,
          icon: eventData.icon,
          is_ending_soon: eventData.is_ending_soon,
          timeAgo: new Date(eventData.start_local).toLocaleString(),
          comment: eventData.comment,
          description: eventData.comment || `${eventData.category} event`,
          ticket_url: undefined,
          organizer: undefined
        };
      }
    }

    console.log(`Event with ID ${id} not found in ${data.features?.length || 0} events`);
    throw new Error(`Event with ID ${id} not found`);
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};
