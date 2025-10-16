// components/content/TransportDisruptionInfo.tsx
import { motion } from 'framer-motion';
import { formatLondonTime } from '@/lib/utils/timeUtils';

interface TransportDisruptionInfoProps {
  description: string;
  lastUpdated: string;
}

export const TransportDisruptionInfo: React.FC<TransportDisruptionInfoProps> = ({
  description,
  lastUpdated
}) => {
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatLondonTime(date);
    } catch {
      return dateString;
    }
  };

  return (
    <>
      {/* Description Section */}
      <div className="transport-disruption-description-section">
        <div className="transport-disruption-description-title">Description</div>
        <div className="transport-disruption-description-text">{description}</div>
      </div>

      {/* Last Updated Section */}
      <div className="transport-disruption-last-updated-section">
        <div className="transport-disruption-last-updated-title">Last Updated</div>
        <div className="transport-disruption-last-updated-text">{formatDateTime(lastUpdated)}</div>
      </div>

      {/* Horizontal Line */}
      <div 
        style={{
          width: '85%',
          height: '1px',
          backgroundColor: '#E5E7EB',
          margin: '20px auto 0 auto', // Center horizontally with auto margins
          display: 'block',
        }}
      />

      {/* Location Section */}
      <div className="transport-disruption-location-section">
        <div className="transport-disruption-location-title">Location</div>
      </div>
    </>
  );
};
