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
import { ShareButton } from '@/components/ui/ShareButton';
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedParams = await params;
        setId(resolvedParams.id);
        const data = await getInspector(resolvedParams.id);
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
            <img src="/Icons/navigation_icons/Back.png" alt="Back" width={32} height={32} />
          </button>
          <button 
            className="inspector-close-button"
            onClick={() => window.location.href = '/'}
          >
            <img src="/Icons/navigation_icons/Close.png" alt="Close" width={32} height={32} />
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

  const shareUrl = `/inspector/${id}`;
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
    <motion.div 
      className="mobile-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="inspector-header">
        <button 
          className="inspector-back-button"
          onClick={() => window.history.back()}
        >
          <img src="/Icons/navigation_icons/Back.png" alt="Back" width={32} height={32} />
        </button>
        <button 
          className="inspector-close-button"
          onClick={() => window.location.href = '/'}
        >
          <img src="/Icons/navigation_icons/Close.png" alt="Close" width={32} height={32} />
        </button>
      </div>
      
      <motion.div 
        className="inspector-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {isLiveInspector && <LiveIcon />}
        
        <InspectorCard data={inspectorData} />
        
        <InspectorInfo 
          originalMessage={inspectorData.originalMessage}
          formattedAddress={inspectorData.formattedAddress}
          locationType={inspectorData.locationType}
          lastUpdated={inspectorData.time}
          matchType="Exact Match"
        />
        
        <motion.div 
          className="px-4 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.4 }}
        >
          <h3 className="text-message-title mb-3">Location</h3>
          <MapComponent 
            coordinates={inspectorData.coordinates}
            zoom={15}
            className="w-full h-64 rounded-lg"
            markers={mapMarkers}
          />
        </motion.div>
        
        <ShareButton 
          url={shareUrl}
          title={`${inspectorData.type} check at ${inspectorData.locationName}`}
          buttonText="Share This Check"
        />
      </motion.div>
    </motion.div>
  );
}
