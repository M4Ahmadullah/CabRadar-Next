/**
 * Event Page Component
 * 
 * This page displays comprehensive information about events, including:
 * - Event details with venue information
 * - Interactive map with event markers
 * - Real-time route calculation and navigation
 * - Map maximizer for full-screen viewing
 * - Event attendance and timing information
 * 
 * Features:
 * - Real-time event data display
 * - Event icon mapping from emojis to PNG files
 * - Route calculation with distance and duration
 * - Navigation integration with Google Maps
 * - Major event badges and attendance display
 * - Event timing and address information
 * 
 * Data Sources:
 * - Event API with coordinate-based filtering
 * - URL parameters for lat/lon coordinates
 * - Mapbox Directions API for route calculation
 * - Event icon mapping system
 * 
 * Interactive Elements:
 * - Map with event markers and maximize functionality
 * - Navigation button with route calculation
 * - Back/Close navigation buttons
 * - Event icon display with category mapping
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Promise<{id: string}>} props.params - Route parameters containing event ID
 * @returns {JSX.Element} Complete event page with interactive features
 */
// app/(routes)/event/[id]/page.tsx
'use client';

import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapComponent } from '@/components/ui/MapComponent';
import { MapMaximizer } from '@/components/ui/MapMaximizer';
import { EventsNavigation } from '@/components/content/EventsNavigation';
import { getEvent } from '@/lib/api/events';
import { useState, useEffect } from 'react';

interface EventPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Map emoji icons to PNG filenames
const getEventIconFilename = (icon: string, category: string | null): string => {
  // Map common event emojis to PNG filenames
  const emojiToIcon: { [key: string]: string } = {
    '🎭': 'performing-arts',
    '🎪': 'event',
    '🎵': 'concert',
    '🎤': 'concert',
    '⚽': 'football',
    '🏉': 'rugby',
    '🏀': 'event',
    '🎾': 'event',
    '🏈': 'event',
    '🎸': 'concert',
    '🎹': 'concert',
    '🎺': 'concert',
    '🎻': 'performing-arts',
    '📊': 'conference',
    '💼': 'conference',
    '🎨': 'event',
    '🎬': 'event',
  };
  
  // First try to use the emoji mapping
  if (icon && emojiToIcon[icon]) {
    return emojiToIcon[icon];
  }
  
  // Then try to use the category
  if (category) {
    return category;
  }
  
  // Default to 'event'
  return 'event';
};

export default function EventPage({ params }: EventPageProps) {
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string>('');
  const [isMapMaximized, setIsMapMaximized] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedParams = await params;
        setId(resolvedParams.id);
        
        console.log('🔍 Fetching event with ID:', resolvedParams.id);
        
        // Extract coordinates from URL parameters if available
        const urlParams = new URLSearchParams(window.location.search);
        const lat = urlParams.get('lat') ? parseFloat(urlParams.get('lat')!) : undefined;
        const lon = urlParams.get('lon') ? parseFloat(urlParams.get('lon')!) : undefined;
        
        console.log('🔍 Coordinates:', { lat, lon });
        
        const data = await getEvent(resolvedParams.id, lat, lon);
        console.log('🔍 Event data received:', data);
        console.log('🔍 Event category:', data.category);
        console.log('🔍 Event coordinates:', data.coordinates);
        console.log('🔍 Event icon path:', `/Icons/event_icons/${data.category || 'event'}.png`);
        setEventData(data);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  if (loading) {
    return (
      <div className="mobile-container">
        <div className="event-header">
          <button 
            className="event-back-button"
            onClick={() => window.history.back()}
          >
            <img src="/Icons/navigation_icons/Back.png" alt="Back" width={50} height={50} />
          </button>
          <button 
            className="event-close-button"
            onClick={() => window.location.href = '/'}
          >
            <img src="/Icons/navigation_icons/Close.png" alt="Close" width={50} height={50} />
          </button>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-4xl">⏳</div>
        </div>
      </div>
    );
  }

  if (error || !eventData) {
    notFound();
  }

  const mapMarkers = [
    {
      coordinates: eventData.coordinates,
      type: 'event' as const,
      data: {
        title: eventData.title,
        category: eventData.category,
        venue: eventData.venue_name,
        startTime: eventData.start_local
      }
    }
  ];

  return (
    <>
      <div className="event-container">
        <div className="event-header" style={{ paddingTop: '50px' }}>
          <button 
            className="event-back-button"
            onClick={() => window.history.back()}
          >
            <img src="/Icons/navigation_icons/Back.png" alt="Back" width={50} height={50} />
          </button>
          <button 
            className="event-close-button"
            onClick={() => window.location.href = '/'}
          >
            <img src="/Icons/navigation_icons/Close.png" alt="Close" width={50} height={50} />
          </button>
        </div>
        
        <div className="event-content">
        {/* Event Title and Attendance Section */}
        <div className="event-title-section">
          <div className="event-header-title">
            {eventData.size === 'major' ? 'Major Event' : 'Event'}
          </div>
          {eventData.attendance && (
            <div className="event-attendance-container">
              <div className="event-attendance-text">{eventData.attendance.toLocaleString('en-US')}</div>
              <img 
                src="/Icons/event_icons/attendance.png" 
                alt="Attendance" 
                className="event-attendance-icon"
              />
            </div>
          )}
        </div>

        {/* Event Message Card - Matching Android Design */}
        <div className="event-message-container">
          <div className={`event-message-card ${eventData.size !== 'major' ? 'normal-event' : ''}`}>
            {/* Header Row: Icon, Venue Name, Major Badge */}
            <div className="event-message-header-row">
              <div className="event-message-title-section">
                {/* Event Icon */}
                <img 
                  src={`/Icons/event_icons/${getEventIconFilename(eventData.icon, eventData.category)}.png`} 
                  alt="Event Icon" 
                  className="event-message-icon"
                />
                
                {/* Venue Name */}
                <div className="event-message-venue-name">
                  {eventData.venue_name || 'Unknown Venue'}
                </div>
              </div>
              
              {/* Major Badge */}
              {eventData.size === 'major' && (
                <div className="event-message-major-badge">
                  <div className="event-message-major-badge-text">Major</div>
                </div>
              )}
            </div>

            {/* Category Row: Display Text and Time */}
            <div className="event-message-category-row">
              <div className={`event-message-display-text ${eventData.size === 'major' ? 'major-event' : 'normal-event'}`}>
                {eventData.size === 'major' 
                  ? eventData.title || 'Event'
                  : `${(eventData.distance_km * 0.621371).toFixed(1)} miles away`
                }
              </div>
              
              {/* Time */}
              <div className="event-message-time-text">
                {new Date(eventData.start_local).toLocaleTimeString('en-GB', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: false 
                })} - {new Date(eventData.true_end).toLocaleTimeString('en-GB', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: false 
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Comment Section - Only show if comment exists */}
        {eventData.comment && (
          <div className="event-comment-container">
            <div className="event-comment-text">{eventData.comment}</div>
          </div>
        )}

        {/* Location Text */}
        <div className="location-text">Location</div>
        
        {/* Map */}
        <div className="map-container" style={{ margin: '0 auto', width: '100%' }}>
          <MapComponent 
            coordinates={eventData.coordinates}
            zoom={15}
            className="map-rounded w-full h-[320px]"
            markers={mapMarkers}
            onMaximize={() => setIsMapMaximized(true)}
            showMaximizeButton={true}
          />
        </div>
        
        {/* Map Spacing */}
        <div className="map-spacing" />
        
        {/* Distance and Time */}
        <EventsNavigation 
          coordinates={eventData.coordinates}
          title={eventData.venue_name || eventData.title}
        />

        {/* Horizontal Rule */}
        <div className="event-horizontal-rule" />

        {/* Full Address Section */}
        <div className="event-address-section">
          <div className="event-address-label">Full Address</div>
          <div className="event-address-value">
            {eventData.venue_formatted_address || eventData.venue_name || 'Address not available'}
            {eventData.postcode && `\n${eventData.postcode}`}
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="event-bottom-spacer" />
        </div>
      </div>

      {/* Map Maximizer - Rendered outside mobile container for full screen */}
      <MapMaximizer
        isMaximized={isMapMaximized}
        onMinimize={() => setIsMapMaximized(false)}
        coordinates={eventData.coordinates}
        type="Moderate"
        locationName={eventData.venue_name}
        markers={mapMarkers}
      />
    </>
  );
}
