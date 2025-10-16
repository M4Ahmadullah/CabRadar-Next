// lib/api/navigation.ts
import { apiService } from '@/lib/services/apiService';

export interface NavigationItem {
  id: string;
  type: 'road-disruption' | 'inspector' | 'event' | 'transport-disruption';
  title: string;
  description: string;
  icon: string;
  color: string;
  count?: number;
  lastUpdated?: string;
}

export interface NavigationData {
  roadDisruptions: NavigationItem[];
  inspectors: NavigationItem[];
  events: NavigationItem[];
  transportDisruptions: NavigationItem[];
}

// Fetch available road disruptions for navigation
export const getAvailableRoadDisruptions = async (limit: number = 5): Promise<NavigationItem[]> => {
  try {
    const data = await apiService.getRoads();
    
    const disruptions: NavigationItem[] = [];
    
    data.features?.forEach((feature: any) => {
      if (disruptions.length >= limit) return;
      
      const props = feature.properties;
      
      disruptions.push({
        id: props.disruption_id,
        type: 'road-disruption' as const,
        title: `${props.severity} on ${props.road_name || props.road_description}`,
        description: props.current_update || props.category || 'Road disruption reported',
        icon: '🚧',
        color: props.severity === 'Serious' ? '#DC2626' : 
               props.severity === 'Severe' ? '#EA580C' : 
               props.severity === 'Closure' ? '#991B1B' : '#D97706',
        lastUpdated: props.last_updated
      });
    });
    
    return disruptions;
  } catch (error) {
    console.error('Error fetching road disruptions:', error);
    return [];
  }
};

// Fetch available inspectors for navigation
export const getAvailableInspectors = async (limit: number = 5): Promise<NavigationItem[]> => {
  try {
    const data = await apiService.getInspectors();
    
    const inspectors: NavigationItem[] = [];
    
    data.features?.forEach((feature: any) => {
      if (inspectors.length >= limit) return;
      
      const props = feature.properties;
      const inspectorData = props.data;
      
      inspectors.push({
        id: props.id,
        type: 'inspector' as const,
        title: `${inspectorData.type} check at ${inspectorData.formattedAddress?.split(',')[0] || 'Unknown location'}`,
        description: inspectorData.originalMessage,
        icon: '👮',
        color: inspectorData.type === 'tfl' ? '#0066CC' : 
               inspectorData.type === 'police-check' ? '#DC2626' : '#16A34A',
        lastUpdated: inspectorData.time
      });
    });
    
    return inspectors;
  } catch (error) {
    console.error('Error fetching inspectors:', error);
    return [];
  }
};

// Fetch available events for navigation
export const getAvailableEvents = async (limit: number = 5): Promise<NavigationItem[]> => {
  try {
    const data = await apiService.getEvents();
    
    const events: NavigationItem[] = [];
    
    data.features?.forEach((feature: any) => {
      if (events.length >= limit) return;
      
      const eventData = feature.properties;
      
      events.push({
        id: eventData.id,
        type: 'event' as const,
        title: eventData.title,
        description: `${eventData.category || 'Event'} at ${eventData.venue_name || 'Unknown venue'}`,
        icon: eventData.icon || (eventData.category === 'sports' ? '⚽' : 
              eventData.category === 'concerts' ? '🎵' : 
              eventData.category === 'festivals' ? '🎪' : 
              eventData.category === 'performing-arts' ? '🎭' : 
              eventData.category === 'conferences' ? '💼' : '🏢'),
        color: eventData.category === 'sports' ? '#22C55E' : 
               eventData.category === 'concerts' ? '#9333EA' : 
               eventData.category === 'festivals' ? '#EA580C' : 
               eventData.category === 'performing-arts' ? '#DB2777' : 
               eventData.category === 'conferences' ? '#2563EB' : '#4B5563',
        lastUpdated: eventData.start_local
      });
    });
    
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

// Fetch available transport disruptions for navigation
export const getAvailableTransportDisruptions = async (limit: number = 5): Promise<NavigationItem[]> => {
  try {
    const data = await apiService.getTransportDisruptions();
    
    const disruptions: NavigationItem[] = [];
    
    data.features?.forEach((feature: any) => {
      if (disruptions.length >= limit) return;
      
      const props = feature.properties;
      
      // Get the first disruption info to determine status
      const firstDisruption = Object.values(props.disruptions || {})[0] as any;
      const status = firstDisruption?.type || 'Disruption';
      
      disruptions.push({
        id: props.id,
        type: 'transport-disruption' as const,
        title: `${status} on ${props.service}`,
        description: `${props.service} at ${props.commonName}`,
        icon: props.service.toLowerCase() === 'tube' ? '🚇' : 
              props.service.toLowerCase() === 'bus' ? '🚌' : 
              props.service.toLowerCase() === 'train' ? '🚂' : 
              props.service.toLowerCase() === 'dlr' ? '🚈' : 
              props.service.toLowerCase() === 'tram' ? '🚋' : '🚆',
        color: status === 'Disruption' ? '#EA580C' : 
               status === 'Closure' ? '#DC2626' : 
               status === 'Suspension' ? '#991B1B' : '#D97706',
        lastUpdated: firstDisruption?.fromDate || new Date().toISOString()
      });
    });
    
    return disruptions;
  } catch (error) {
    console.error('Error fetching transport disruptions:', error);
    return [];
  }
};

// Fetch all navigation data
export const getNavigationData = async (): Promise<NavigationData> => {
  try {
    
    const [roadDisruptions, inspectors, events, transportDisruptions] = await Promise.all([
      getAvailableRoadDisruptions(),
      getAvailableInspectors(),
      getAvailableEvents(),
      getAvailableTransportDisruptions()
    ]);


    return {
      roadDisruptions,
      inspectors,
      events,
      transportDisruptions
    };
  } catch (error) {
    console.error('Error in getNavigationData:', error);
    throw error;
  }
};
