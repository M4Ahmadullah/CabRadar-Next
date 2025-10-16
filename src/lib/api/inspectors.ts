// lib/api/inspectors.ts
import { InspectorData, InspectorsResponse } from '@/lib/types/inspectors';

const EXTERNAL_API_BASE_URL = 'https://list-api-service.hellocabradar.workers.dev';

export const getInspector = async (id: string): Promise<InspectorData> => {
  try {
    // Use internal API route to avoid CORS issues
    const response = await fetch(`/api/inspectors?lat=51.5074&lon=-0.1276`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch inspectors: ${response.statusText}`);
    }

    const data: InspectorsResponse = await response.json();
    
    // Find the specific inspector by ID
    const feature = data.features.find(f => f.properties.id === id);
    
    if (feature) {
      const props = feature.properties;
      const inspectorData = props.data;
      
      // Transform the API data to match our interface
      return {
        id: props.id,
        type: inspectorData.type,
        locationName: props.id, // Use ID as location name
        coordinates: feature.geometry.coordinates || [51.5074, -0.1276],
        originalMessage: inspectorData.originalMessage,
        formattedAddress: inspectorData.formattedAddress,
        locationType: inspectorData.locationType,
        matchType: inspectorData.matchType,
        time: inspectorData.time,
        distance_km: props.distance_km,
        lastUpdatedTimestamp: inspectorData.time,
        inspectorId: props.id
      };
    }

    throw new Error(`Inspector with ID ${id} not found`);
  } catch (error) {
    console.error('Error fetching inspector:', error);
    throw error;
  }
};