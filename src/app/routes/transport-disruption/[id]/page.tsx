// app/(routes)/transport-disruption/[id]/page.tsx
'use client';

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { motion } from 'framer-motion';
// Custom header implementation
import { LiveIcon } from '@/components/ui/LiveIcon';
import { TransportDisruptionCard } from '@/components/content/TransportDisruptionCard';
import { TransportDisruptionInfo } from '@/components/content/TransportDisruptionInfo';
import { MapComponent } from '@/components/ui/MapComponent';
import { MapMaximizer } from '@/components/ui/MapMaximizer';
import { getTransportDisruption } from '@/lib/api/transportDisruptions';
import { isLive } from '@/lib/utils/timeUtils';
import { useState, useEffect } from 'react';

interface TransportDisruptionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function TransportDisruptionPage({ params }: TransportDisruptionPageProps) {
  const [disruptionData, setDisruptionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string>('');
  const [isMapMaximized, setIsMapMaximized] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedParams = await params;
        setId(resolvedParams.id);
        
        // Extract coordinates from URL parameters if available
        const urlParams = new URLSearchParams(window.location.search);
        const lat = urlParams.get('lat') ? parseFloat(urlParams.get('lat')!) : undefined;
        const lon = urlParams.get('lon') ? parseFloat(urlParams.get('lon')!) : undefined;
        
        const data = await getTransportDisruption(resolvedParams.id, lat, lon);
        setDisruptionData(data);
      } catch (err) {
        console.error('Error fetching transport disruption:', err);
        setError('Failed to load transport disruption data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  if (loading) {
    return (
      <div className="mobile-container">
        <div className="transport-disruption-header">
          <button 
            className="transport-disruption-back-button"
            onClick={() => window.history.back()}
          >
            <img src="/Icons/navigation_icons/Back.png" alt="Back" width={50} height={50} />
          </button>
          <button 
            className="transport-disruption-close-button"
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

  if (error || !disruptionData) {
    notFound();
  }

  const shareUrl = `/routes/transport-disruption/${id}`;
  const isLiveDisruption = isLive(new Date(disruptionData.lastUpdated));

  const mapMarkers = [
    {
      coordinates: disruptionData.coordinates,
      type: 'transport-disruption' as const,
      data: {
        service: disruptionData.service,
        status: disruptionData.status,
        commonName: disruptionData.commonName,
        description: disruptionData.description
      }
    }
  ];

  return (
    <>
      <div className="transport-disruption-container">
        <div className="transport-disruption-header" style={{ paddingTop: '25px' }}>
          <button 
            className="transport-disruption-back-button"
            onClick={() => window.history.back()}
          >
            <img src="/Icons/navigation_icons/Back.png" alt="Back" width={50} height={50} />
          </button>
          <button 
            className="transport-disruption-close-button"
            onClick={() => window.location.href = '/'}
          >
            <img src="/Icons/navigation_icons/Close.png" alt="Close" width={50} height={50} />
          </button>
        </div>
        
        <div className="transport-disruption-content">
          {/* Live Icon */}
          <div className="transport-disruption-live-icon-container">
            <LiveIcon 
              backgroundColor="white" 
              fontFamily="var(--font-hammersmith), 'Hammersmith One', sans-serif" 
              letterSpacing={1} 
              textMarginLeft={4} 
              textMarginTop={1} 
            />
          </div>

          {/* Disruption Card */}
          <div className="transport-disruption-card-container">
            <TransportDisruptionCard data={disruptionData} />
          </div>

          {/* Description, Last Updated, and Location Info */}
          <div className="transport-disruption-info-container">
            <TransportDisruptionInfo 
              description={disruptionData.description}
              lastUpdated={disruptionData.lastUpdated}
            />
          </div>

          {/* Map */}
          <div className="map-container" style={{ margin: '0 auto', width: '100%' }}>
            <MapComponent 
              coordinates={disruptionData.coordinates}
              zoom={15}
              className="map-rounded w-full h-[320px]"
              markers={mapMarkers}
              onMaximize={() => setIsMapMaximized(true)}
              showMaximizeButton={true}
            />
          </div>

          {/* Map Spacing */}
          <div className="map-spacing" />

          {/* Navigation Section */}
          <div className="transport-disruption-navigation-section">
            {/* Distance and Time */}
            <div className="transport-disruption-distance-time-container">
              <div className="transport-disruption-distance-time-text">
                <span className="transport-disruption-distance-text">2.1 miles</span>
                <span className="transport-disruption-separator-text"> | </span>
                <span className="transport-disruption-time-text">8 mins</span>
              </div>
            </div>
            
            {/* Navigate Button */}
            <button className="transport-disruption-navigate-button">
              <img 
                src="/Icons/event_icons/navigate_icon.png" 
                alt="Navigate" 
                className="transport-disruption-navigate-button-icon"
              />
              <span className="transport-disruption-navigate-button-text">Navigate To</span>
            </button>
          </div>

          {/* Bottom Spacer */}
          <div className="transport-disruption-bottom-spacer" />
        </div>
      </div>

      {/* Map Maximizer - Rendered outside mobile container for full screen */}
      <MapMaximizer
        isMaximized={isMapMaximized}
        onMinimize={() => setIsMapMaximized(false)}
        coordinates={disruptionData.coordinates}
        type="Moderate"
        locationName={disruptionData.commonName}
        markers={mapMarkers}
      />
    </>
  );
}
