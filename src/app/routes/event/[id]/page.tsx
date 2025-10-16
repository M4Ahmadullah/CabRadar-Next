// app/(routes)/event/[id]/page.tsx
'use client';

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { motion } from 'framer-motion';
// Custom header implementation
import { LiveIcon } from '@/components/ui/LiveIcon';
import { EventCard } from '@/components/content/EventCard';
import { EventInfo } from '@/components/content/EventInfo';
import { MapComponent } from '@/components/ui/MapComponent';
import { ShareButton } from '@/components/ui/ShareButton';
import { getEvent } from '@/lib/api/events';
import { isLive } from '@/lib/utils/timeUtils';
import { useState, useEffect } from 'react';

interface EventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EventPage({ params }: EventPageProps) {
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedParams = await params;
        setId(resolvedParams.id);
        const data = await getEvent(resolvedParams.id);
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
            <img src="/Icons/navigation_icons/Back.png" alt="Back" width={32} height={32} />
          </button>
          <button 
            className="event-close-button"
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

  if (error || !eventData) {
    notFound();
  }

  const shareUrl = `/event/${id}`;
  const isLiveEvent = isLive(new Date(eventData.start_local));

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
    <motion.div 
      className="mobile-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="event-header">
        <button 
          className="event-back-button"
          onClick={() => window.history.back()}
        >
          <img src="/Icons/navigation_icons/Back.png" alt="Back" width={32} height={32} />
        </button>
        <button 
          className="event-close-button"
          onClick={() => window.location.href = '/'}
        >
          <img src="/Icons/navigation_icons/Close.png" alt="Close" width={32} height={32} />
        </button>
      </div>
      
      <motion.div 
        className="event-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {isLiveEvent && <LiveIcon />}
        
        <EventCard data={eventData} />
        
        <EventInfo 
          venue_name={eventData.venue_name}
          venue_formatted_address={eventData.venue_formatted_address}
          start_local={eventData.start_local}
          true_end={eventData.true_end}
          attendance={eventData.attendance}
          comment={eventData.comment}
        />
        
        <motion.div 
          className="px-4 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.4 }}
        >
          <h3 className="text-message-title mb-3">Event Location</h3>
          <MapComponent 
            coordinates={eventData.coordinates}
            zoom={14}
            className="w-full h-64 rounded-lg"
            markers={mapMarkers}
          />
        </motion.div>
        
        <ShareButton 
          url={shareUrl}
          title={`${eventData.title} at ${eventData.venue_name}`}
          buttonText="Share This Event"
        />
      </motion.div>
    </motion.div>
  );
}
