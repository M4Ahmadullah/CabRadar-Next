// lib/api/roadDisruptions.ts
import { RoadDisruptionData, RoadDisruptionResponse } from '@/lib/types/roadDisruptions';

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

export const getRoadDisruption = async (id: string): Promise<RoadDisruptionData> => {
  try {
    // Use internal API route to avoid CORS issues
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

    // Find the disruption by ID
    for (const feature of data.features || []) {
      const props = feature.properties;
      
      if (props.disruption_id === id) {
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
          coordinates: feature.geometry.coordinates || [51.5074, -0.1276],
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

    throw new Error(`Road disruption with ID ${id} not found`);
  } catch (error) {
    console.error('Error fetching road disruption:', error);
    throw error;
  }
};

