// lib/api/roadDisruptions.ts
import { RoadDisruptionData, RoadDisruptionResponse } from '@/lib/types/roadDisruptions';
import { createRoadDisruptionSlug, extractIdFromSlug } from '@/lib/utils/slugUtils';

// Road parsing functions (same as mobile app)
interface ParsedRoad {
  type: 'A' | 'M' | 'Street';
  number: string;
  fullCode: string;
}

function parseRoadCodes(roadDescription: string): ParsedRoad[] {
  const roadCodes: ParsedRoad[] = [];
  
  // Extract road codes like [A302], [M25], etc.
  const roadCodeRegex = /\[([AM])(\d+[A-Z]*)\]/g;
  let match;
  
  while ((match = roadCodeRegex.exec(roadDescription)) !== null) {
    const [, roadType, roadNumber] = match;
    roadCodes.push({
      type: roadType as 'A' | 'M',
      number: roadNumber,
      fullCode: `[${roadType}${roadNumber}]`
    });
  }
  
  return roadCodes;
}

function sortRoads(roads: ParsedRoad[]): ParsedRoad[] {
  return roads.sort((a, b) => {
    // M-roads first
    if (a.type === 'M' && b.type !== 'M') return -1;
    if (b.type === 'M' && a.type !== 'M') return 1;
    
    // A-roads second
    if (a.type === 'A' && b.type !== 'A') return -1;
    if (b.type === 'A' && a.type !== 'A') return 1;
    
    // If both are same type, sort by number
    if (a.type === b.type) {
      return a.number.localeCompare(b.number, undefined, { numeric: true });
    }
    
    return 0;
  });
}

function extractStreetNames(roadDescription: string): string[] {
  // Remove all road codes in brackets and split by common separators
  const cleanDescription = roadDescription
    .replace(/\[[AM]\d+[A-Z]*\]/g, '') // Remove road codes
    .replace(/\([^)]*\)/g, '') // Remove text in parentheses
    .trim();
  
  // Split by common separators and filter out empty strings
  return cleanDescription
    .split(/[,;]/)
    .map(part => part.trim())
    .filter(part => part.length > 0 && !part.match(/^[AM]\d+[A-Z]*$/));
}

const EXTERNAL_API_BASE_URL = 'https://list-api-service.hellocabradar.workers.dev';

export const getRoadDisruption = async (cleanName: string): Promise<RoadDisruptionData> => {
  try {
    // Get all disruptions from Central London first
    const response = await fetch(`/api/roads?lat=51.5074&lon=-0.1276`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CabRadar/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Roads API error: ${response.status}`);
    }

    const data = await response.json();

    // Find the disruption by matching road_name or road_description (converted to clean name)
    for (const feature of data.features || []) {
      const props = feature.properties;
      
      // Extract road name from road_description first (Android team's approach)
      let roadName = '';
      
      // First try to extract from road_description (Android team's approach)
      if (props.road_description) {
        // Extract road name from road_description like "[A200] EVELYN STREET (SE8 ) (Lewisham)"
        const roadMatch = props.road_description.match(/\[[AM]\d+[A-Z]*\]\s*([^(]+)/);
        if (roadMatch) {
          roadName = roadMatch[1].trim();
        } else {
          // If no road code pattern, use the whole description before parentheses
          const descMatch = props.road_description.match(/^([^(]+)/);
          if (descMatch) {
            roadName = descMatch[1].trim();
          }
        }
      }
      
      // Fallback to road_name if road_description extraction failed
      if (!roadName && props.road_name) {
        roadName = props.road_name;
      }
      
      const cleanRoadName = roadName.toLowerCase().replace(/\s+/g, '-');
      
      if (cleanRoadName === cleanName) {
        // Use the actual disruption coordinates for more accurate data
        const disruptionCoords = feature.geometry.coordinates || [51.5074, -0.1276];
        const [lat, lon] = disruptionCoords;
        
        // Extract road type and number using mobile app's exact regex pattern
        const roadDescription = props.road_description || props.road_name || '';
        const comments = props.comments || '';
        
        // Use mobile app's exact regex: /\[([AM])(\d+[A-Z]*)\]/g
        const roadCodeRegex = /\[([AM])(\d+[A-Z]*)\]/g;
        const roadMatch = roadCodeRegex.exec(roadDescription) || roadCodeRegex.exec(comments);
        
        let roadType = 'Street';
        let roadNumber = 'Unknown';
        
        if (roadMatch) {
          const [, extractedRoadType, extractedRoadNumber] = roadMatch;
          roadType = extractedRoadType as 'A' | 'M';
          roadNumber = extractedRoadNumber; // This is just the number part (e.g., "400")
        }
        
        // Extract proper road name from comments (mobile app logic)
        let properRoadName = props.road_name || props.road_description || 'Unknown Road';
        
        // If we found a road code in comments, try to extract the road name from comments
        if (comments && roadMatch) {
          const [, extractedRoadType, extractedRoadNumber] = roadMatch;
          const roadCode = `[${extractedRoadType}${extractedRoadNumber}]`;
          
          // Look for road name after the road code in comments
          const roadNameMatch = comments.match(new RegExp(`\\${roadCode}\\s*([^(]+)`));
          if (roadNameMatch) {
            properRoadName = roadNameMatch[1].trim();
          }
        }
        
        // Parse affected roads from road_description (same as mobile app)
        const roadCodes = parseRoadCodes(props.road_description);
        const sortedRoadCodes = sortRoads(roadCodes);
        const streetNames = extractStreetNames(props.road_description);
        
        const affectedRoads = [
          ...sortedRoadCodes.map(road => ({
            type: road.type,
            number: road.number
          })),
          ...streetNames.map(street => ({
            type: 'Street' as const,
            number: street
          }))
        ];

        // Transform the API data to match our interface
        return {
          id: props.disruption_id,
          type: props.severity || 'Moderate',
          roadName: properRoadName,
          currentUpdate: props.current_update || props.category || 'Road disruption reported',
          severity: props.severity || 'Moderate',
          coordinates: disruptionCoords, // Use actual disruption coordinates
          category: props.category || 'Road Works',
          subCategory: props.sub_category || 'Maintenance',
          fromDate: props.from_date || new Date().toISOString(),
          toDate: props.to_date || new Date().toISOString(),
          comments: props.comments || '',
          lastUpdated: props.last_updated || new Date().toISOString(),
          timeAgo: new Date(props.last_updated || new Date()).toLocaleString(),
          affectedRoads: affectedRoads,
          roadType: roadType as 'A' | 'M' | 'Street',
          roadNumber: roadNumber,
          description: props.current_update || props.category || 'Road disruption reported'
        };
      }
    }

    // If exact match not found, try fuzzy matching for common variations
    console.warn(`Exact match not found for "${cleanName}". Available roads:`, 
      data.features?.map((f: any) => f.properties.road_name?.toLowerCase().replace(/\s+/g, '-')).slice(0, 5)
    );
    
    throw new Error(`Road disruption with name "${cleanName}" not found. Please check the road name spelling.`);
  } catch (error) {
    console.error('Error fetching road disruption:', error);
    throw error;
  }
};

export const generateRoadDisruptionSlug = (roadName: string, disruptionId: string): string => {
  return createRoadDisruptionSlug(roadName, disruptionId);
};

