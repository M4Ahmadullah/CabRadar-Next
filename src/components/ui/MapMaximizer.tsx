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
  type: 'Serious' | 'Severe' | 'Closure' | 'Moderate' | 'tfl' | 'police-check' | 'clear';
  roadName?: string;
  roadType?: 'A' | 'M' | 'Street';
  roadNumber?: string;
  lastUpdated?: string;
  timeAgo?: string;
  locationName?: string;
  userLocation?: [number, number];
  markers?: Array<{
    coordinates: [number, number];
    type: 'disruption' | 'inspector';
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
