'use client';

import { useState, useEffect } from 'react';
import { getNavigationData, NavigationData } from '@/lib/api/navigation';
import { NavigationItem } from '@/lib/api/navigation';

export default function NavigationPage() {
  const [navigationData, setNavigationData] = useState<NavigationData>({
    roadDisruptions: [],
    events: [],
    transportDisruptions: [],
    inspectors: [] // Add back inspectors property
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const data = await getNavigationData();
        setNavigationData(data);
      } catch (error) {
        console.error('Error fetching navigation data:', error);
        // Set empty data instead of crashing - this prevents 404s
        setNavigationData({
          roadDisruptions: [],
          events: [],
          transportDisruptions: [],
          inspectors: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleItemClick = (item: NavigationItem) => {
    window.location.href = `/routes/${item.type}/${item.id}`;
  };

  const sections = [
    {
      title: 'Road Disruptions',
      items: navigationData.roadDisruptions
    },
    {
      title: 'Events',
      items: navigationData.events
    },
    {
      title: 'Transport Disruptions',
      items: navigationData.transportDisruptions
    }
  ];

  if (loading) {
    return (
      <div className="mobile-container">
        {/* Header with Back and Close */}
        <div className="transport-disruption-header">
          <button 
            className="transport-disruption-back-button"
            onClick={() => window.history.back()}
          >
            <img 
              src="/Icons/navigation_icons/Back.png" 
              alt="Back" 
              width={50}
              height={50}
            />
          </button>
          <button 
            className="transport-disruption-close-button"
            onClick={() => window.location.href = '/'}
          >
            <img 
              src="/Icons/navigation_icons/Close.png" 
              alt="Close" 
              width={50}
              height={50}
            />
          </button>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-4xl font-hammersmith">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container">
      {/* Header with Back and Close */}
      <div className="transport-disruption-header">
        <button 
          className="transport-disruption-back-button"
          onClick={() => window.history.back()}
        >
          <img 
            src="/Icons/navigation_icons/Back.png" 
            alt="Back" 
            width={50}
            height={50}
          />
        </button>
        <button 
          className="transport-disruption-close-button"
          onClick={() => window.location.href = '/'}
        >
          <img 
            src="/Icons/navigation_icons/Close.png" 
            alt="Close" 
            width={50}
            height={50}
          />
        </button>
      </div>

      {/* Content */}
      <div className="transport-disruption-scroll-container">
        <div className="transport-disruption-scroll-content">
          {/* Sections */}
          {sections.map((section) => (
            <div key={section.title} className="mb-6">
              {/* Section Title */}
              <h2 className="text-screen-title px-4 mb-3">{section.title}</h2>
              
              {/* All Items */}
              <div className="space-y-2">
                {section.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg p-3 mx-4 shadow-sm border border-[#E5E7EB] cursor-pointer"
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-message-title text-sm">{item.title}</h3>
                        <p className="text-small-label text-gray-600 truncate">{item.description}</p>
                      </div>
                      <div className="text-lg ml-2">→</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
