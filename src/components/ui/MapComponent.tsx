// components/ui/MapComponent.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_CONFIG } from '@/lib/utils/mapbox';

interface MapComponentProps {
  coordinates: [number, number];
  zoom?: number;
  className?: string;
  markers?: Array<{
    coordinates: [number, number];
    type: 'disruption' | 'event' | 'inspector' | 'transport-disruption';
    data: any;
  }>;
  onMaximize?: () => void;
  showMaximizeButton?: boolean;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  coordinates,
  zoom = 12,
  className = '',
  markers = [],
  onMaximize,
  showMaximizeButton = false
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Debug logging
    console.log('MapComponent Debug:', {
      coordinates,
      zoom,
      accessToken: MAPBOX_CONFIG.ACCESS_TOKEN ? 'Present' : 'Missing',
      styleUrl: MAPBOX_CONFIG.STYLE_URL ? 'Present' : 'Missing',
      container: mapContainer.current
    });

    // Check if Mapbox config is available
    if (!MAPBOX_CONFIG.ACCESS_TOKEN || !MAPBOX_CONFIG.STYLE_URL) {
      console.error('Mapbox configuration missing!');
      // Show fallback content
      if (mapContainer.current) {
        mapContainer.current.innerHTML = `
          <div style="
            width: 100%; 
            height: 100%; 
            background-color: #e5e7eb; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: #6b7280;
            font-size: 14px;
          ">
            Map not available - Missing configuration
          </div>
        `;
      }
      return;
    }

    // EXACT mobile app map initialization
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_CONFIG.STYLE_URL,
      center: coordinates,
      zoom: zoom,
      accessToken: MAPBOX_CONFIG.ACCESS_TOKEN,
      // EXACT mobile app map settings
      renderWorldCopies: false,
      maxZoom: MAPBOX_CONFIG.MAX_ZOOM,
      minZoom: MAPBOX_CONFIG.MIN_ZOOM,
    });

    // Disable UI elements after map loads - EXACT mobile app settings
    map.current.on('load', () => {
      if (map.current) {
        // Hide logo
        const logo = map.current.getContainer().querySelector('.mapboxgl-ctrl-logo');
        if (logo) {
          (logo as HTMLElement).style.display = 'none';
        }
        
        // Hide attribution
        const attribution = map.current.getContainer().querySelector('.mapboxgl-ctrl-attrib');
        if (attribution) {
          (attribution as HTMLElement).style.display = 'none';
        }
      }
    });

    // Add markers with EXACT mobile app styling
    markers.forEach(marker => {
      const el = document.createElement('div');
      el.className = `marker ${marker.type}`;
      
      // Add severity class for road disruptions
      if (marker.type === 'disruption' && marker.data.severity) {
        el.classList.add(marker.data.severity.toLowerCase());
        
        // Add the actual PNG icon for disruption markers
        const iconImg = document.createElement('img');
        iconImg.src = `/Icons/message_status_icons/${marker.data.severity.toLowerCase()}.png`;
        iconImg.style.width = '32px';
        iconImg.style.height = '32px';
        iconImg.style.objectFit = 'contain';
        el.appendChild(iconImg);
      }
      
      // Add type class for inspectors
      if (marker.type === 'inspector' && marker.data.type) {
        el.classList.add(marker.data.type.toLowerCase());
      }
      
      // Add category class for events
      if (marker.type === 'event' && marker.data.category) {
        el.classList.add(marker.data.category.toLowerCase());
      }
      
      // Add status badge for transport disruptions
      if (marker.type === 'transport-disruption' && marker.data.status) {
        el.classList.add(marker.data.status.toLowerCase());
        
        // Create status badge
        const statusBadge = document.createElement('div');
        statusBadge.style.borderRadius = '4px';
        statusBadge.style.paddingLeft = '8px';
        statusBadge.style.paddingRight = '8px';
        statusBadge.style.paddingTop = '4px';
        statusBadge.style.paddingBottom = '4px';
        
        // Create status text
        const statusText = document.createElement('span');
        statusText.textContent = marker.data.status;
        statusText.style.fontSize = '16px';
        statusText.style.fontWeight = '600';
        statusText.style.fontFamily = 'var(--font-gill-sans), "Gill Sans MT", sans-serif';
        
        // Get status color
        const getStatusStyle = (status: string) => {
          const lowerStatus = status.toLowerCase();
          switch (lowerStatus) {
            case 'severe delays':
              return { backgroundColor: '#FDB813', textColor: '#000000' };
            case 'no service':
              return { backgroundColor: '#D52723', textColor: '#FFFFFF' };
            case 'suspended':
              return { backgroundColor: '#D52723', textColor: '#FFFFFF' };
            case 'closed':
              return { backgroundColor: '#D52723', textColor: '#FFFFFF' };
            case 'good service':
              return { backgroundColor: '#10B981', textColor: '#FFFFFF' };
            case 'minor delays':
              return { backgroundColor: '#F59E0B', textColor: '#000000' };
            case 'disruption':
              return { backgroundColor: '#EA580C', textColor: '#FFFFFF' };
            case 'closure':
              return { backgroundColor: '#DC2626', textColor: '#FFFFFF' };
            case 'suspension':
              return { backgroundColor: '#991B1B', textColor: '#FFFFFF' };
            case 'delay':
              return { backgroundColor: '#D97706', textColor: '#FFFFFF' };
            default:
              return { backgroundColor: '#6B7280', textColor: '#FFFFFF' };
          }
        };
        
        const statusStyle = getStatusStyle(marker.data.status);
        statusBadge.style.backgroundColor = statusStyle.backgroundColor;
        statusText.style.color = statusStyle.textColor;
        
        statusBadge.appendChild(statusText);
        el.appendChild(statusBadge);
      }
      
      // Add service class for transport disruptions
      if (marker.type === 'transport-disruption' && marker.data.service) {
        el.classList.add(marker.data.service.toLowerCase());
      }
      
      new mapboxgl.Marker(el)
        .setLngLat(marker.coordinates)
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
    };
  }, [coordinates, zoom, markers]);

  return (
    <div className="relative">
      <div ref={mapContainer} className={className} />
      {showMaximizeButton && onMaximize && (
        <button 
          className="maximize-button"
          onClick={onMaximize}
          aria-label="Maximize map"
        >
          <img src="/Icons/navigation_icons/maximize.png" alt="Maximize" className="button-icon" />
        </button>
      )}
    </div>
  );
};

// EXACT mobile app marker color functions
const getDisruptionColor = (severity: string) => {
  switch (severity) {
    case 'Serious': return '#EA580C';
    case 'Severe': return '#DC2626';
    case 'Closure': return '#991B1B';
    case 'Moderate': return '#D97706';
    default: return '#6B7280';
  }
};

const getInspectorColor = (type: string) => {
  switch (type) {
    case 'tfl': return '#0066CC';
    case 'police-check': return '#DC2626';
    case 'clear': return '#16A34A';
    default: return '#6B7280';
  }
};

const getEventColor = (category: string) => {
  switch (category) {
    case 'sports': return '#22C55E';
    case 'concerts': return '#9333EA';
    case 'festivals': return '#EA580C';
    case 'performing-arts': return '#DB2777';
    case 'conferences': return '#2563EB';
    case 'expos': return '#4B5563';
    default: return '#6B7280';
  }
};

const getTransportColor = (status: string) => {
  switch (status) {
    case 'Disruption': return '#EA580C';
    case 'Closure': return '#DC2626';
    case 'Suspension': return '#991B1B';
    case 'Delay': return '#D97706';
    default: return '#6B7280';
  }
};
