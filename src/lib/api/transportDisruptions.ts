// lib/api/transportDisruptions.ts
import { TransportDisruptionData, TransportDisruptionResponse } from '@/lib/types/transportDisruptions';
import { createTransportDisruptionSlug, extractIdFromSlug } from '@/lib/utils/slugUtils';

const EXTERNAL_API_BASE_URL = 'https://list-api-service.hellocabradar.workers.dev';

export const getTransportDisruption = async (cleanName: string, lat?: number, lon?: number): Promise<TransportDisruptionData> => {
  try {
    // Use provided coordinates or fallback to Central London
    const searchLat = lat || 51.5074;
    const searchLon = lon || -0.1276;
    
    // Get all transport disruptions from the specified location
    const response = await fetch(`/api/disruptions?lat=${searchLat}&lon=${searchLon}&width=1000&height=1000`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CabRadar/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Transport disruptions API error: ${response.status}`);
    }

    const data = await response.json();

    // Find the disruption by matching commonName (converted to clean name)
    for (const feature of data.features || []) {
      const props = feature.properties;
      
      // Extract transport disruption name from commonName field
      let disruptionName = '';
      
      if (props.commonName && props.commonName.trim()) {
        disruptionName = props.commonName.trim();
      }
      
      const cleanDisruptionName = disruptionName.toLowerCase().replace(/\s+/g, '-');
      
      if (cleanDisruptionName === cleanName) {
        // Use the actual disruption coordinates for more accurate data
        const disruptionCoords: [number, number] = [props.long, props.lat]; // [lon, lat] format
        
        // Get the first disruption info to determine status
        const firstDisruption = Object.values(props.disruptions || {})[0] as any;

        // Transform the API data to match our interface
        return {
          id: props.id,
          service: props.service,
          commonName: props.commonName,
          lat: props.lat,
          long: props.long,
          coordinates: disruptionCoords, // Use actual disruption coordinates
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

    // If exact match not found, try fuzzy matching for common variations
    console.warn(`Exact match not found for "${cleanName}". Available transport disruptions:`, 
      data.features?.map((f: any) => {
        const name = f.properties.commonName || 'unknown';
        return name.toLowerCase().replace(/\s+/g, '-');
      }).slice(0, 5)
    );
    
    throw new Error(`Transport disruption with name "${cleanName}" not found. Please check the disruption name spelling.`);
  } catch (error) {
    console.error('Error fetching transport disruption:', error);
    throw error;
  }
};

export const generateTransportDisruptionSlug = (commonName: string, disruptionId: string): string => {
  return createTransportDisruptionSlug(commonName, disruptionId);
};
