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
    <div style={{ marginLeft: '10px', marginRight: '15px' }}>
      {/* Description Section */}
      <div className="content-section">
        <div className="title-spacing" />
        <div className="section-title">Description</div>
        <div className="section-text">{description}</div>
      </div>

      {/* Last Updated Section */}
      <div className="content-section">
        <div className="title-spacing" />
        <div className="section-title">Last Updated</div>
        <div className="section-text">{formatDateTime(lastUpdated)}</div>
      </div>

      {/* Horizontal Rule */}
      <div className="horizontal-rule" />
    </div>
  );
};
