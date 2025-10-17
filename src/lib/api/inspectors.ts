// lib/api/inspectors.ts
import { InspectorData, InspectorsResponse } from '@/lib/types/inspectors';
import { createInspectorSlug, extractIdFromSlug } from '@/lib/utils/slugUtils';

const EXTERNAL_API_BASE_URL = 'https://list-api-service.hellocabradar.workers.dev';

export const getInspector = async (cleanName: string, lat?: number, lon?: number): Promise<InspectorData> => {
  try {
    // Use provided coordinates or fallback to Central London
    const searchLat = lat || 51.5074;
    const searchLon = lon || -0.1276;
    
    // Get all inspectors from the specified location
    const response = await fetch(`/api/inspectors?lat=${searchLat}&lon=${searchLon}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CabRadar/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Inspectors API error: ${response.status}`);
    }

    const data = await response.json();

    // Find the inspector by matching location name (converted to clean name)
    for (const feature of data.features || []) {
      const props = feature.properties;
      
      // Extract inspector name from available fields
      let inspectorName = '';
      
      // Try different possible name fields - prioritize id since that's what Android team uses
      if (props.id && props.id.trim()) {
        inspectorName = props.id.trim();
      } else if (props.location && props.location.trim()) {
        inspectorName = props.location.trim();
      } else if (props.name && props.name.trim()) {
        inspectorName = props.name.trim();
      }
      
      const cleanInspectorName = inspectorName.toLowerCase().replace(/\s+/g, '-');
      
      if (cleanInspectorName === cleanName) {
        // Use the actual inspector coordinates for more accurate data
        const inspectorCoords = feature.geometry.coordinates || [51.5074, -0.1276];
        
        // Transform the API data to match our interface
        return {
          id: props.id || 'unknown',
          type: props.data?.type || 'tfl', // Use actual type from API data
          locationName: inspectorName,
          coordinates: inspectorCoords, // Use actual inspector coordinates
          originalMessage: props.data?.originalMessage || props.originalMessage || 'Inspector check reported',
          formattedAddress: props.data?.formattedAddress || props.formattedAddress || inspectorName,
          locationType: props.data?.locationType || props.locationType || 'Fixed',
          matchType: props.data?.matchType || props.matchType || 'Exact Match',
          time: props.data?.time || props.time || new Date().toISOString(),
          distance_km: props.distance_km || 0,
          lastUpdatedTimestamp: props.data?.time || props.time || new Date().toISOString(),
          inspectorId: props.id || 'unknown'
        };
      }
    }

    // If exact match not found, try fuzzy matching for common variations
    console.warn(`Exact match not found for "${cleanName}". Available inspectors:`, 
      data.features?.map((f: any) => {
        const name = f.properties.id || f.properties.location || f.properties.name || 'unknown';
        return name.toLowerCase().replace(/\s+/g, '-');
      }).slice(0, 5)
    );
    
    throw new Error(`Inspector with name "${cleanName}" not found. Please check the inspector name spelling.`);
  } catch (error) {
    console.error('Error fetching inspector:', error);
    throw error;
  }
};

export const generateInspectorSlug = (locationName: string, inspectorId: string): string => {
  return createInspectorSlug(locationName, inspectorId);
};