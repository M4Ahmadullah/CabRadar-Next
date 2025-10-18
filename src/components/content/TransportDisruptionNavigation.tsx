// components/content/TransportDisruptionNavigation.tsx
'use client';

import { useState, useEffect } from 'react';

interface TransportDisruptionNavigationProps {
  coordinates: [number, number];
  title: string;
  className?: string;
}

export const TransportDisruptionNavigation: React.FC<TransportDisruptionNavigationProps> = ({
  coordinates,
  title,
  className
}) => {
  const [routeData, setRouteData] = useState<{ distance: number; duration: number } | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  // Route calculation function
  const fetchRoute = async (userLat: number, userLon: number, destLat: number, destLon: number) => {
    try {
      setIsLoadingRoute(true);
      
      // Use Mapbox Directions API
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${userLon},${userLat};${destLon},${destLat}?steps=true&geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
      );
      
      if (!response.ok) {
        throw new Error('Route calculation failed');
      }
      
      const data = await response.json();
      
      const distance = (data.routes[0].distance / 1000) * 0.621371; // Convert to miles
      const duration = Math.round(data.routes[0].duration / 60); // Convert to minutes
      
      setRouteData({ distance, duration });
    } catch (error) {
      console.error('Route calculation error:', error);
      setRouteData(null);
    } finally {
      setIsLoadingRoute(false);
    }
  };

  // Calculate route when component mounts
  useEffect(() => {
    if (coordinates) {
      // Use London coordinates as default user location
      const defaultUserLat = 51.5074;
      const defaultUserLon = -0.1278;
      
      fetchRoute(defaultUserLat, defaultUserLon, coordinates[1], coordinates[0]);
    }
  }, [coordinates]);

  // Navigation function
  const handleNavigateToLocation = async () => {
    const destinationName = title || 'Transport Disruption Location';
    
    // Create Google Maps URL
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates[1]},${coordinates[0]}&travelmode=driving`;
    
    // Try to open in Google Maps
    try {
      window.open(googleMapsUrl, '_blank');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <div className={`transport-disruption-navigation-section ${className || ''}`}>
      {/* Distance and Time */}
      <div className="transport-disruption-distance-time-container">
        {isLoadingRoute ? (
          <div className="transport-disruption-distance-time-text">Calculating route...</div>
        ) : routeData ? (
          <div className="transport-disruption-distance-time-text">
            <span className="transport-disruption-distance-text">{routeData.distance.toFixed(1)} miles</span>
            <span className="transport-disruption-separator-text"> | </span>
            <span className="transport-disruption-time-text">{routeData.duration} mins</span>
          </div>
        ) : (
          <div className="transport-disruption-distance-time-text">Route unavailable</div>
        )}
      </div>
      
      {/* Navigate Button */}
      <button 
        className="transport-disruption-navigate-button"
        onClick={handleNavigateToLocation}
      >
        <img 
          src="/Icons/event_icons/navigate_icon.png" 
          alt="Navigate" 
          className="transport-disruption-navigate-button-icon"
        />
        <span className="transport-disruption-navigate-button-text">Navigate To</span>
      </button>
    </div>
  );
};
