// lib/services/apiService.ts
export const API_CONFIG = {
  BASE_URL: typeof window !== 'undefined' 
    ? '' // Use relative URLs in browser
    : 'http://localhost:3000', // Use absolute URL for server-side calls
  TIMEOUT: 5000, // 5 seconds (same as mobile app)
  RETRY_ATTEMPTS: 3,
} as const;

const COMMON_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
} as const;

class ApiService {
  private baseURL = API_CONFIG.BASE_URL;

  async fetchAllData() {
    const [roads, inspectors, events, disruptions] = await Promise.all([
      this.getRoads(),
      this.getInspectors(), 
      this.getEvents(),
      this.getTransportDisruptions()
    ]);

    return {
      roads,
      inspectors,
      events,
      disruptions
    };
  }

  async getRoads(lat = 51.5074, lon = -0.1276) {
    try {
      console.log('Fetching roads from:', `${this.baseURL}/api/roads?lat=${lat}&lon=${lon}`);
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
      
      const response = await fetch(`${this.baseURL}/api/roads?lat=${lat}&lon=${lon}`, {
        headers: COMMON_HEADERS,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      console.log('Roads API response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Roads API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Roads API data received:', data);
      
      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format from roads API');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching roads:', error);
      // Return empty structure instead of throwing
      return { type: 'FeatureCollection', features: [] };
    }
  }

  async getInspectors(lat = 51.5074, lon = -0.1276) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
      
      const response = await fetch(`${this.baseURL}/api/inspectors?lat=${lat}&lon=${lon}`, {
        headers: COMMON_HEADERS,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Inspectors API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format from inspectors API');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching inspectors:', error);
      // Return empty structure instead of throwing
      return { type: 'FeatureCollection', features: [] };
    }
  }

  async getEvents(lat = 51.5074, lon = -0.1276, width = 1000, height = 1000) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
      
      const response = await fetch(`${this.baseURL}/api/events?lat=${lat}&lon=${lon}&width=${width}&height=${height}`, {
        headers: COMMON_HEADERS,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Events API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format from events API');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching events:', error);
      // Return empty structure instead of throwing
      return { type: 'FeatureCollection', features: [] };
    }
  }

  async getTransportDisruptions(lat = 51.5074, lon = -0.1276, width = 1000, height = 1000) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
      
      const response = await fetch(`${this.baseURL}/api/disruptions?lat=${lat}&lon=${lon}&width=${width}&height=${height}`, {
        headers: COMMON_HEADERS,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Transport disruptions API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format from transport disruptions API');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching transport disruptions:', error);
      // Return empty structure instead of throwing
      return { type: 'FeatureCollection', features: [] };
    }
  }
}

export const apiService = new ApiService();
