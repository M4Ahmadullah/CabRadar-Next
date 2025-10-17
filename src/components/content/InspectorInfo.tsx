// components/content/InspectorInfo.tsx
import { formatLondonTime } from '@/lib/utils/timeUtils';

interface InspectorInfoProps {
  originalMessage: string;
  lastUpdated: string;
  formattedAddress: string;
  locationType: 'Fixed' | 'Loose';
  matchType: 'Exact Match' | 'OSM lookup';
  className?: string;
}

export const InspectorInfo: React.FC<InspectorInfoProps> = ({
  originalMessage,
  lastUpdated,
  formattedAddress,
  locationType,
  matchType,
  className
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
    <div className={`inspector-info-component${className ? ` ${className}` : ''}`} style={{ marginLeft: '10px', marginRight: '15px' }}>
      {/* Comments Section */}
      {originalMessage && (
        <div className="content-section">
          <div className="title-spacing" />
          <div className="section-title">Comments</div>
          <div className="section-text">{originalMessage}</div>
        </div>
      )}

      {/* Last Updated Section */}
      {lastUpdated && (
        <div className="content-section">
          <div className="title-spacing" />
          <div className="section-title">Last Updated</div>
          <div className="section-text">{formatDateTime(lastUpdated)}</div>
        </div>
      )}
    </div>
  );
};