/**
 * Inspector Page Component
 * 
 * This page displays detailed information about TfL Stop Checks and Police Checkpoints,
 * providing users with real-time inspector status and interactive report updating.
 * 
 * Features:
 * - Real-time inspector data display with live status
 * - Interactive report update functionality
 * - Map integration with inspector markers
 * - Map maximizer for full-screen viewing
 * - Time formatting (X mins ago, X hr ago, etc.)
 * - Coordinate-based data fetching from URL parameters
 * 
 * Data Sources:
 * - Inspector API with coordinate-based filtering
 * - URL parameters for lat/lon coordinates
 * - Real-time status updates through interactive buttons
 * 
 * Interactive Elements:
 * - Update Report Container with dynamic buttons
 * - Map with inspector markers and maximize functionality
 * - Live icon display for active inspectors
 * - Back/Close navigation buttons
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Promise<{id: string}>} props.params - Route parameters containing inspector ID
 * @returns {JSX.Element} Complete inspector page with interactive features
 */
// app/(routes)/inspector/[id]/page.tsx
'use client';

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { motion } from 'framer-motion';
// Custom header implementation
import { LiveIcon } from '@/components/ui/LiveIcon';
import { InspectorCard } from '@/components/content/InspectorCard';
import { InspectorInfo } from '@/components/content/InspectorInfo';
import { UpdateReportContainer } from '@/components/content/UpdateReportContainer';
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
  // State management for inspector data and UI interactions
  const [inspectorData, setInspectorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string>('');
  const [isMapMaximized, setIsMapMaximized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentReportType, setCurrentReportType] = useState<'tfl' | 'police-check' | 'clear'>('tfl');

  /**
   * Effect hook to fetch inspector data when component mounts
   * Extracts coordinates from URL parameters for coordinate-based API calls
   */
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
        setCurrentReportType(data.type || 'tfl');
      } catch (err) {
        console.error('Error fetching inspector:', err);
        setError('Failed to load inspector data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  // Loading state display
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

  // Error state - redirect to 404 page
  if (error || !inspectorData) {
    notFound();
  }

  /**
   * Formats time difference to human-readable format
   * Shows "X mins ago", "X hr ago", or "X hr Y mins ago"
   * 
   * @param {string} timeString - ISO timestamp string
   * @returns {string} Formatted time ago string
   */
  const formatTimeAgo = (timeString: string) => {
    const now = Date.now();
    const time = new Date(timeString).getTime();
    const diffMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} mins ago`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      if (minutes === 0) {
        return `${hours} hr ago`;
      } else {
        return `${hours} hr ${minutes} mins ago`;
      }
    }
  };

  /**
   * Handles report update submission
   * Simulates API call and updates local state with new report type
   * 
   * @param {string} reportType - Type of report to submit
   */
  const submitUpdateReport = async (reportType: 'still-here' | 'clear' | 'tfl' | 'police-check') => {
    if (!inspectorData?.coordinates) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update current state with new data
      let newType: 'tfl' | 'police-check' | 'clear';
      switch (reportType) {
        case 'still-here':
          newType = currentReportType; // Keep current type
          break;
        case 'clear':
          newType = 'clear';
          break;
        case 'tfl':
          newType = 'tfl';
          break;
        case 'police-check':
          newType = 'police-check';
          break;
        default:
          newType = currentReportType;
      }
      
      setCurrentReportType(newType);
      
      // Update inspector data
      setInspectorData({
        ...inspectorData,
        type: newType,
        time: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error updating report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if inspector is currently live/active
  const isLiveInspector = isLive(new Date(inspectorData.time));

  // Map markers for inspector location
  const mapMarkers = [
    {
      coordinates: inspectorData.coordinates,
      type: 'inspector' as const,
      data: {
        type: currentReportType,
        status: inspectorData.status,
        locationName: inspectorData.locationName
      }
    }
  ];

  return (
    <>
      <div className="inspector-container">
        {/* Header with Back and Close buttons */}
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
        {/* Title Section - Inspector Location Name */}
        <div className="inspector-title-section">
          <div className="inspector-title">{inspectorData.locationName}</div>
        </div>

        {/* Live Icon Section - Shows if inspector is currently active */}
        <div className="inspector-live-icon-section" style={{ marginTop: '15px' }}>
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

        {/* Inspector Type Section - Shows current report type and time */}
        <div className="inspector-type-section" style={{ width: '95%', margin: '0 auto', marginBottom: '10px' }}>
          <div className="inspector-type-content ">
            <div className="inspector-type-icon-container">
              <img 
                src={`/Icons/inpectors_icons/${currentReportType === 'tfl' ? 'police.png' : currentReportType === 'police-check' ? 'alert.png' : 'white_like.png'}`}
                alt="Inspector Type" 
                className="inspector-type-icon"
              />
            </div>
            <div className="inspector-type-text">
              {currentReportType === 'tfl' ? 'TfL Stop Check' : 
               currentReportType === 'police-check' ? 'Police Stop Check' : 
               'Clear (No TfL / police)'}
            </div>
          </div>
          <div className="inspector-time-text">
            {formatTimeAgo(inspectorData.time)}
          </div>
        </div>

        {/* Update Report Container - Interactive buttons for report updates */}
        <UpdateReportContainer
          currentReportType={currentReportType}
          onSubmitReport={submitUpdateReport}
          isSubmitting={isSubmitting}
          isWithinBoundary={true}
        />
        
        {/* Map Section - Interactive map with inspector marker */}
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
        
        {/* Inspector Information Section */}
        <InspectorInfo 
          originalMessage={inspectorData.originalMessage}
          formattedAddress={inspectorData.formattedAddress}
          locationType={inspectorData.locationType}
          lastUpdated={inspectorData.time}
          matchType="Exact Match"
        />
        </div>
      </div>

      {/* Map Maximizer - Full-screen map overlay */}
      <MapMaximizer
        isMaximized={isMapMaximized}
        onMinimize={() => setIsMapMaximized(false)}
        coordinates={inspectorData.coordinates}
        type={currentReportType}
        locationName={inspectorData.locationName}
        lastUpdated={inspectorData.time}
        timeAgo={formatTimeAgo(inspectorData.time)}
        markers={mapMarkers}
      />
    </>
  );
}
