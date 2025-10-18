/**
 * EventsNavigation Component
 * 
 * This component provides navigation functionality for event pages, including:
 * - Real-time route calculation using Mapbox Directions API
 * - Distance and duration display
 * - Navigation button that opens Google Maps
 * 
 * Features:
 * - Automatically calculates route from default London location to event coordinates
 * - Displays distance in miles and duration in minutes
 * - Handles loading states and error scenarios
 * - Opens Google Maps for navigation when button is clicked
 * 
 * @component
 * @param {Object} props - Component props
 * @param {[number, number]} props.coordinates - Event coordinates [longitude, latitude]
 * @param {string} props.title - Event title for navigation context
 * @param {string} [props.className] - Optional CSS class name
 * @returns {JSX.Element} Navigation component with route info and navigate button
 */
'use client';

import { useState, useEffect } from 'react';

interface EventsNavigationProps {
  coordinates: [number, number];
  title: string;
  className?: string;
}

export const EventsNavigation: React.FC<EventsNavigationProps> = ({
  coordinates,
  title,
  className
}) => {
  // State for storing calculated route data
  const [routeData, setRouteData] = useState<{ distance: number; duration: number } | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  /**
   * Fetches route information from Mapbox Directions API
   * Calculates driving route from user location to event destination
   * 
   * @param {number} userLat - User's latitude
   * @param {number} userLon - User's longitude  
   * @param {number} destLat - Destination latitude
   * @param {number} destLon - Destination longitude
   */
  const fetchRoute = async (userLat: number, userLon: number, destLat: number, destLon: number) => {
    try {
      setIsLoadingRoute(true);
      
      // Use Mapbox Directions API to get driving route
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${userLon},${userLat};${destLon},${destLat}?steps=true&geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
      );
      
      if (!response.ok) {
        throw new Error('Route calculation failed');
      }
      
      const data = await response.json();
      
      // Convert distance from meters to miles
      const distance = (data.routes[0].distance / 1000) * 0.621371;
      // Convert duration from seconds to minutes
      const duration = Math.round(data.routes[0].duration / 60);
      
      setRouteData({ distance, duration });
    } catch (error) {
      console.error('Route calculation error:', error);
      setRouteData(null);
    } finally {
      setIsLoadingRoute(false);
    }
  };

  /**
   * Effect hook to calculate route when component mounts or coordinates change
   * Uses default London coordinates as user location for route calculation
   */
  useEffect(() => {
    if (coordinates) {
      // Default user location (London coordinates)
      const defaultUserLat = 51.5074;
      const defaultUserLon = -0.1278;
      
      fetchRoute(defaultUserLat, defaultUserLon, coordinates[1], coordinates[0]);
    }
  }, [coordinates]);

  /**
   * Handles navigation button click
   * Opens Google Maps with driving directions to the event location
   */
  const handleNavigateToEvent = async () => {
    const destinationName = title || 'Event Location';
    
    // Create Google Maps URL with driving directions
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates[1]},${coordinates[0]}&travelmode=driving`;
    
    // Try to open in Google Maps
    try {
      window.open(googleMapsUrl, '_blank');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <div className={`event-navigation-section ${className || ''}`}>
      {/* Distance and Time Display */}
      <div className="event-distance-time-container">
        {isLoadingRoute ? (
          <div className="event-distance-time-text">Calculating route...</div>
        ) : routeData ? (
          <div className="event-distance-time-text">
            <span className="event-distance-text">{routeData.distance.toFixed(1)} miles</span>
            <span className="event-separator-text"> | </span>
            <span className="event-time-text">{routeData.duration} mins</span>
          </div>
        ) : (
          <div className="event-distance-time-text">Route unavailable</div>
        )}
      </div>
      
      {/* Navigate Button */}
      <button 
        className="event-navigate-button"
        onClick={handleNavigateToEvent}
      >
        <img 
          src="/Icons/event_icons/navigate_icon.png" 
          alt="Navigate" 
          className="event-navigate-button-icon"
        />
        <span className="event-navigate-button-text">Navigate To</span>
      </button>
    </div>
  );
};
