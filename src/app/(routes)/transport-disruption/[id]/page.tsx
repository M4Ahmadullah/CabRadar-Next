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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedParams = await params;
        setId(resolvedParams.id);
        const data = await getTransportDisruption(resolvedParams.id);
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

  const shareUrl = `/transport-disruption/${id}`;
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
    <div className="mobile-container">
      {/* Header with Back and Close - EXACT mobile app positioning */}
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
      
      <div className="transport-disruption-scroll-container">
        <div className="transport-disruption-scroll-content">
          {/* Live Icon */}
          <div className="transport-disruption-live-icon-container" style={{ marginTop: '20px', marginBottom: '10px', marginLeft: '30px' }}>
            <LiveIcon 
              backgroundColor="white" 
              fontFamily="var(--font-hammersmith), 'Hammersmith One', sans-serif" 
              letterSpacing={1} 
              textMarginLeft={4} 
              textMarginTop={1} 
            />
          </div>

          {/* Disruption Card */}
          <div className="transport-disruption-card-container" style={{ marginBottom: '30px', paddingTop: '8px' }}>
            <TransportDisruptionCard data={disruptionData} />
          </div>

          {/* Description, Last Updated, and Location Info */}
          <div style={{ marginBottom: '20px' }}>
            <TransportDisruptionInfo 
              description={disruptionData.description}
              lastUpdated={disruptionData.lastUpdated}
            />
          </div>

          {/* Map - Using same approach as RoadDisruption */}
          <div className="map-container" style={{ margin: '0 auto', width: '100%', marginBottom: '20px' }}>
            <MapComponent 
              coordinates={disruptionData.coordinates}
              zoom={15}
              className="map-rounded w-full h-[320px]"
              markers={mapMarkers}
              showMaximizeButton={true}
            />
          </div>

          {/* Navigation Section */}
          <div className="transport-disruption-navigation-section" style={{ marginTop: '20px', marginBottom: '40px' }}>
            {/* Distance and Time */}
            <div className="transport-disruption-distance-time-container" style={{ marginBottom: '15px' }}>
              <div className="transport-disruption-distance-time-text">
                <span className="transport-disruption-distance-text">2.1 miles</span>
                <span className="transport-disruption-separator-text"> | </span>
                <span className="transport-disruption-time-text">8 mins</span>
              </div>
            </div>
            
            {/* Navigate Button */}
            <button className="transport-disruption-navigate-button">
              <img 
                src="/Icons/navigation_icons/Navigate.png" 
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
    </div>
  );
}
