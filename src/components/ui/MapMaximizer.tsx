/**
 * MapMaximizer - Full-Screen Map Overlay Component
 * 
 * This component provides a full-screen map overlay with floating content,
 * designed to match the Android app's maximized map experience.
 * 
 * Features:
 * - Full-screen map display with overlay content
 * - Floating message header with content information
 * - Minimize button to return to normal view
 * - Dynamic content based on map type
 * - Proper coordinate handling and marker display
 * 
 * Content Types Supported:
 * - Road Disruptions: Shows severity, road name, and last updated
 * - Inspectors: Shows type (TfL/Police), location, and time ago
 * - Events: Shows event type, venue name, and timing
 * - Transport Disruptions: Shows disruption type and location
 * 
 * Features:
 * - Responsive design with mobile-optimized layout
 * - Custom severity icons based on content type
 * - Time formatting (X mins ago, X hr ago, etc.)
 * - Proper marker handling for different content types
 * - Smooth transitions and animations
 * 
 * Dependencies:
 * - MapComponent for map rendering
 * - Custom CSS classes for styling
 * - Icon assets for severity indicators
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isMaximized - Whether the map is currently maximized
 * @param {Function} props.onMinimize - Callback to minimize the map
 * @param {[number, number]} props.coordinates - Map center coordinates
 * @param {string} props.type - Content type for styling and icons
 * @param {string} [props.roadName] - Road name for road disruptions
 * @param {string} [props.locationName] - Location name for other content types
 * @param {string} [props.lastUpdated] - Last updated timestamp
 * @param {string} [props.timeAgo] - Formatted time ago string
 * @param {Array} [props.markers] - Array of marker objects to display
 * @returns {JSX.Element} Full-screen map overlay component
 */
// components/ui/MapMaximizer.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapComponent } from './MapComponent';
import { RoadBadge } from './RoadBadge';
import { formatRelativeTime } from '@/lib/utils/timeUtils';

interface MapMaximizerProps {
  isMaximized: boolean;
  onMinimize: () => void;
  coordinates: [number, number];
  type: 'Serious' | 'Severe' | 'Closure' | 'Moderate' | 'tfl' | 'police-check' | 'clear' | 'event' | 'transport-disruption';
  roadName?: string;
  roadType?: 'A' | 'M' | 'Street';
  roadNumber?: string;
  lastUpdated?: string;
  timeAgo?: string;
  locationName?: string;
  userLocation?: [number, number];
  markers?: Array<{
    coordinates: [number, number];
    type: 'disruption' | 'inspector' | 'event' | 'transport-disruption';
    data: any;
  }>;
}

export const MapMaximizer: React.FC<MapMaximizerProps> = ({
  isMaximized,
  onMinimize,
  coordinates,
  type,
  roadName,
  roadType,
  roadNumber,
  lastUpdated,
  timeAgo,
  locationName,
  userLocation,
  markers = []
}) => {
  const [mapCenter, setMapCenter] = useState(coordinates);
  const [currentZoom, setCurrentZoom] = useState(14);

  useEffect(() => {
    if (coordinates) {
      setMapCenter(coordinates);
      setCurrentZoom(14);
    }
  }, [coordinates]);

  const getSeverityIcon = (type: string) => {
    switch (type) {
      case 'Serious': return '/Icons/message_status_icons/serious.png';
      case 'Severe': return '/Icons/message_status_icons/severe.png';
      case 'Closure': return '/Icons/message_status_icons/closure.png';
      case 'Moderate': return '/Icons/message_status_icons/moderate.png';
      case 'tfl': return '/Icons/inpectors_icons/police.png';
      case 'police-check': return '/Icons/inpectors_icons/alert.png';
      case 'clear': return '/Icons/inpectors_icons/white_like.png';
      case 'event': return '/Icons/message_status_icons/moderate.png';
      case 'transport-disruption': return '/Icons/message_status_icons/moderate.png';
      default: return '/Icons/message_status_icons/moderate.png';
    }
  };

  const handleLocate = () => {
    if (coordinates) {
      setMapCenter(coordinates);
      setCurrentZoom(14);
    }
  };

  // Clean road name by removing brackets and road codes (matching mobile app logic)
  const cleanRoadName = (name: string) => {
    if (roadType === 'Street') {
      return name;
    }
    
    let cleanName = name.replace(/[\[\]]/g, '');
    const roadCode = `${roadType}${roadNumber}`;
    
    if (cleanName.startsWith(roadCode)) {
      cleanName = cleanName.substring(roadCode.length).trim();
    } else if (cleanName.startsWith(roadCode + ' ')) {
      cleanName = cleanName.substring(roadCode.length + 1).trim();
    }
    
    if (!cleanName) {
      cleanName = name;
    }
    
    // Add space padding for badge alignment (matching mobile app exactly)
    let spacePadding = '';
    const badgeWidth = roadNumber?.length || 0;
    
    if (badgeWidth === 1) {
      spacePadding = roadType === 'M' ? '       ' : '      '; // 6 spaces for M roads, 5 for A roads
    } else if (badgeWidth === 2) {
      spacePadding = roadType === 'M' ? '         ' : '        '; // 8 spaces for M roads, 7 for A roads
    } else if (badgeWidth === 3) {
      spacePadding = roadType === 'M' ? '          ' : '         '; // 10 spaces for M roads, 9 for A roads
    } else {
      spacePadding = roadType === 'M' ? '            ' : '           '; // 12 spaces for M roads, 11 for A roads
    }
    
    return spacePadding + cleanName;
  };

  return (
    <AnimatePresence>
      {isMaximized && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="map-maximizer-overlay"
        >
          {/* Full screen map */}
          <div className="maximized-map-container">
            <MapComponent
              coordinates={mapCenter}
              zoom={currentZoom}
              className="maximized-map"
              markers={markers}
            />
          </div>

          {/* Floating message card */}
          <div className="floating-message-card">
            {/* Header with icon, type, and time */}
            <div className="message-header">
              <div className="message-type-info">
                <img 
                  src={getSeverityIcon(type)} 
                  alt={type} 
                  className="message-type-icon"
                />
                <span className="message-type-heading">
                  {type === 'tfl' ? 'TfL Stop Check' : 
                   type === 'police-check' ? 'Police Stop Check' : 
                   type === 'clear' ? 'Clear (No TfL / police)' :
                   type === 'event' ? 'Event' :
                   type === 'transport-disruption' ? 'Transport Disruption' :
                   type === 'Closure' ? 'Closure' : 
                   type === 'Moderate' ? 'Moderate Delays' : 
                   `${type} Delays`}
                </span>
              </div>
              <span className="message-time-ago">
                {timeAgo || formatRelativeTime(new Date(lastUpdated || ''))}
              </span>
            </div>

            {/* Road name with badge */}
            <div className="road-name-container">
              {roadType && roadType !== 'Street' && (
                <div className="absolute-badge">
                  <RoadBadge 
                    type={roadType} 
                    number={roadNumber || ''}
                    size="road-disruption-message"
                  />
                </div>
              )}
              <span className="message-road-name">
                {roadType === 'Street' ? roadName : 
                 roadType && roadNumber ? cleanRoadName(roadName || '') :
                 locationName || roadName || 'Unknown Location'}
              </span>
            </div>
          </div>

          {/* Locate button */}
          <button 
            className="locate-button"
            onClick={handleLocate}
            aria-label="Locate disruption"
          >
            <img src="/Icons/navigation_icons/locate.png" alt="Locate" className="button-icon" />
          </button>

          {/* Minimize button */}
          <button 
            className="minimize-button"
            onClick={onMinimize}
            aria-label="Minimize map"
          >
            <img src="/Icons/navigation_icons/minimize.png" alt="Minimize" className="button-icon" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
