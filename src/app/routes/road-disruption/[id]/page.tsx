// app/(routes)/road-disruption/[id]/page.tsx
'use client';

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { motion } from 'framer-motion';
import { Header } from '@/components/layouts/Header';
import { LiveIcon } from '@/components/ui/LiveIcon';
import { RoadDisruptionCard } from '@/components/content/RoadDisruptionCard';
import { DisruptionInfo } from '@/components/content/DisruptionInfo';
import { MapComponent } from '@/components/ui/MapComponent';
import { MapMaximizer } from '@/components/ui/MapMaximizer';
import { getRoadDisruption } from '@/lib/api/roadDisruptions';
import { isLive } from '@/lib/utils/timeUtils';
import { useState, useEffect } from 'react';

interface RoadDisruptionPageProps {
  params: Promise<{
    id: string; // This is now a slug like "lambeth-bridge-TIMS-204461"
  }>;
}

export default function RoadDisruptionPage({ params }: RoadDisruptionPageProps) {
  const [disruptionData, setDisruptionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string>(''); // Store the slug
  const [isMapMaximized, setIsMapMaximized] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedParams = await params;
        setId(resolvedParams.id); // Store the slug
        const data = await getRoadDisruption(resolvedParams.id); // Pass slug to API
        setDisruptionData(data);
      } catch (err) {
        console.error('Error fetching road disruption:', err);
        setError('Failed to load road disruption data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  if (loading) {
    return (
      <div className="mobile-container">
        <Header
          title="Road Disruption"
          onBack={() => window.history.back()}
          onClose={() => window.location.href = '/'}
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-4xl">⏳</div>
        </div>
      </div>
    );
  }

  if (error || !disruptionData) {
    notFound();
  }

  const isLiveDisruption = isLive(new Date(disruptionData.lastUpdated));

  const mapMarkers = [
    {
      coordinates: disruptionData.coordinates,
      type: 'disruption' as const,
      data: {
        severity: disruptionData.type,
        roadName: disruptionData.roadName,
        description: disruptionData.currentUpdate
      }
    }
  ];

  return (
    <>
      <div className="road-disruption-container">
        <Header 
          title="Road Disruption"
          onBack={() => window.history.back()}
          onClose={() => window.location.href = '/'}
        />
        
        {isLiveDisruption && <LiveIcon />}
        
        <div className={`road-disruption-content ${isLiveDisruption ? 'with-live-icon' : ''}`}>
          <RoadDisruptionCard data={disruptionData} />
          
          {/* Location Text */}
          <div className="location-text">Location</div>
          
          {/* Map */}
          <div className="map-container" style={{ margin: '0 auto', width: '100%' }}>
            <MapComponent 
              coordinates={disruptionData.coordinates}
              zoom={14}
              className="map-rounded w-full h-[320px]"
              markers={mapMarkers}
              onMaximize={() => setIsMapMaximized(true)}
              showMaximizeButton={true}
            />
          </div>
          
          {/* Map Spacing */}
          <div className="map-spacing" />
          
          <DisruptionInfo 
            description={disruptionData.currentUpdate}
            lastUpdated={disruptionData.lastUpdated}
            affectedRoads={disruptionData.affectedRoads}
            category={disruptionData.category}
            subCategory={disruptionData.subCategory}
            fromDate={disruptionData.fromDate}
            toDate={disruptionData.toDate}
            comments={disruptionData.comments}
          />
        </div>
      </div>

      {/* Map Maximizer - Rendered outside mobile container for full screen */}
      <MapMaximizer
        isMaximized={isMapMaximized}
        onMinimize={() => setIsMapMaximized(false)}
        coordinates={disruptionData.coordinates}
        type={disruptionData.type}
        roadName={disruptionData.roadName}
        roadType={disruptionData.roadType}
        roadNumber={disruptionData.roadNumber}
        lastUpdated={disruptionData.lastUpdated}
        markers={mapMarkers}
      />
    </>
  );
}
