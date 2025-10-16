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
    <div className={`inspector-info-component${className ? ` ${className}` : ''}`}>
      {/* Comments Section */}
      {originalMessage && (
        <div className="comments-section">
          <div className="comments-title">Comments</div>
          <div className="comments-text">{originalMessage}</div>
        </div>
      )}

      {/* Last Updated Section */}
      {lastUpdated && (
        <div className="last-updated-section">
          <div className="last-updated-label">Last Updated</div>
          <div className="last-updated-value">{formatDateTime(lastUpdated)}</div>
        </div>
      )}
    </div>
  );
};