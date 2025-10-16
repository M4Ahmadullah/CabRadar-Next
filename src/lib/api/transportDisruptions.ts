// lib/api/transportDisruptions.ts
import { TransportDisruptionData, TransportDisruptionResponse } from '@/lib/types/transportDisruptions';

const EXTERNAL_API_BASE_URL = 'https://list-api-service.hellocabradar.workers.dev';

export const getTransportDisruption = async (id: string): Promise<TransportDisruptionData> => {
  try {
    // Use internal API route to avoid CORS issues
    const response = await fetch(`/api/disruptions?lat=51.5074&lon=-0.1276&width=1000&height=1000`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CabRadar/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Transport disruptions API error: ${response.status}`);
    }

    const data = await response.json();

    // Find the disruption by ID
    for (const feature of data.features || []) {
      if (feature.properties.id === id) {
        const props = feature.properties;

        // Get the first disruption info to determine status
        const firstDisruption = Object.values(props.disruptions || {})[0] as any;

        // Transform the API data to match our interface
        return {
          id: props.id,
          service: props.service,
          commonName: props.commonName,
          lat: props.lat,
          long: props.long,
          coordinates: [props.long, props.lat], // [lon, lat] format
          disruptions: props.disruptions,
          distance_km: feature.distance_km,
          airport_tag: props.airport_tag,
          status: firstDisruption?.type || 'Disruption',
          description: firstDisruption?.description || `${props.service} disruption`,
          fromDate: firstDisruption?.fromDate || new Date().toISOString(),
          toDate: undefined,
          lastUpdated: firstDisruption?.fromDate || new Date().toISOString(),
          affectedLines: Object.keys(props.disruptions || {}),
          affectedStations: [props.commonName]
        };
      }
    }

    throw new Error(`Transport disruption with ID ${id} not found`);
  } catch (error) {
    console.error('Error fetching transport disruption:', error);
    throw error;
  }
};
