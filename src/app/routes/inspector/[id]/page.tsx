// app/(routes)/inspector/[id]/page.tsx
'use client';

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { motion } from 'framer-motion';
// Custom header implementation
import { LiveIcon } from '@/components/ui/LiveIcon';
import { InspectorCard } from '@/components/content/InspectorCard';
import { InspectorInfo } from '@/components/content/InspectorInfo';
import { MapComponent } from '@/components/ui/MapComponent';
import { MapMaximizer } from '@/components/ui/MapMaximizer';
import { getInspector } from '@/lib/api/inspectors';
import { isLive } from '@/lib/utils/timeUtils';
import { useState, useEffect } from 'react';

interface InspectorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function InspectorPage({ params }: InspectorPageProps) {
  const [inspectorData, setInspectorData] = useState<any>(null);
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
        
        const data = await getInspector(resolvedParams.id, lat, lon);
        setInspectorData(data);
      } catch (err) {
        console.error('Error fetching inspector:', err);
        setError('Failed to load inspector data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  if (loading) {
    return (
      <div className="mobile-container">
        <div className="inspector-header">
          <button 
            className="inspector-back-button"
            onClick={() => window.history.back()}
          >
            <img src="/Icons/navigation_icons/Back.png" alt="Back" width={50} height={50} />
          </button>
          <button 
            className="inspector-close-button"
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

  if (error || !inspectorData) {
    notFound();
  }

  const isLiveInspector = isLive(new Date(inspectorData.time));

  const mapMarkers = [
    {
      coordinates: inspectorData.coordinates,
      type: 'inspector' as const,
      data: {
        type: inspectorData.type,
        status: inspectorData.status,
        locationName: inspectorData.locationName
      }
    }
  ];

  return (
    <>
      <div className="inspector-container">
        <div className="inspector-header" style={{ paddingTop: '50px' }}>
          <button 
            className="inspector-back-button"
            onClick={() => window.history.back()}
          >
            <img src="/Icons/navigation_icons/Back.png" alt="Back" width={50} height={50} />
          </button>
          <button 
            className="inspector-close-button"
            onClick={() => window.location.href = '/'}
          >
            <img src="/Icons/navigation_icons/Close.png" alt="Close" width={50} height={50} />
          </button>
        </div>
        
        <div className="inspector-content">
        {/* Title Section */}
        <div className="inspector-title-section">
          <div className="inspector-title">{inspectorData.locationName}</div>
        </div>

        {/* Live Icon Section */}
        <div className="inspector-live-icon-section">
          <div className="inspector-live-icon-row">
            <div className="inspector-live-icon-container">
              <LiveIcon 
                backgroundColor="gray" 
                fontFamily="var(--font-hammersmith), 'Hammersmith One', sans-serif"
                letterSpacing={1}
                textMarginLeft={3.5}
                textMarginTop={2}
                outerCircleSizeMultiplier={1.1}
                innerWhiteCircleSizeMultiplier={1.1}
                centerCircleSizeMultiplier={1.2}
              />
            </div>
          </div>
        </div>

        {/* Type Section */}
        <div className="inspector-type-section">
          <div className="inspector-type-content">
            <div className="inspector-type-icon-container">
              <img 
                src={`/Icons/inpectors_icons/${inspectorData.type === 'tfl' ? 'police.png' : inspectorData.type === 'police-check' ? 'alert.png' : 'white_like.png'}`}
                alt="Inspector Type" 
                className="inspector-type-icon"
              />
            </div>
            <div className="inspector-type-text">
              {inspectorData.type === 'tfl' ? 'TfL Stop Check' : 
               inspectorData.type === 'police-check' ? 'Police Stop Check' : 
               'Clear (No TfL / police)'}
            </div>
          </div>
          <div className="inspector-time-text">
            {new Date(inspectorData.time).toLocaleTimeString('en-GB', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            })}
          </div>
        </div>
        
        {/* Location Text */}
        <div className="location-text">Location</div>
        
        {/* Map */}
        <div className="map-container" style={{ margin: '0 auto', width: '100%' }}>
          <MapComponent 
            coordinates={inspectorData.coordinates}
            zoom={15}
            className="map-rounded w-full h-[320px]"
            markers={mapMarkers}
            onMaximize={() => setIsMapMaximized(true)}
            showMaximizeButton={true}
          />
        </div>
        
        {/* Map Spacing */}
        <div className="map-spacing" />
        
        <InspectorInfo 
          originalMessage={inspectorData.originalMessage}
          formattedAddress={inspectorData.formattedAddress}
          locationType={inspectorData.locationType}
          lastUpdated={inspectorData.time}
          matchType="Exact Match"
        />
        </div>
      </div>

      {/* Map Maximizer - Rendered outside mobile container for full screen */}
      <MapMaximizer
        isMaximized={isMapMaximized}
        onMinimize={() => setIsMapMaximized(false)}
        coordinates={inspectorData.coordinates}
        type={inspectorData.type}
        locationName={inspectorData.locationName}
        markers={mapMarkers}
      />
    </>
  );
}
