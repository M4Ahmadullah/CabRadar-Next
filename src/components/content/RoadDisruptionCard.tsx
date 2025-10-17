// components/content/RoadDisruptionCard.tsx
import { motion } from 'framer-motion';
import { StreetBadge } from '@/components/ui/StreetBadge';
import { RoadBadge } from '@/components/ui/RoadBadge';
import { RoadDisruptionData } from '@/lib/types/roadDisruptions';
import { formatLondonTime, formatRelativeTime } from '@/lib/utils/timeUtils';

interface RoadDisruptionCardProps {
  data: RoadDisruptionData;
}

export const RoadDisruptionCard: React.FC<RoadDisruptionCardProps> = ({ data }) => {
  const getSeverityIcon = (type: string) => {
    switch (type) {
      case 'Serious': return '/Icons/message_status_icons/serious.png';
      case 'Severe': return '/Icons/message_status_icons/severe.png';
      case 'Closure': return '/Icons/message_status_icons/closure.png';
      case 'Moderate': return '/Icons/message_status_icons/moderate.png';
      default: return '/Icons/message_status_icons/moderate.png';
    }
  };

  const getSeverityColor = (type: string) => {
    switch (type) {
      case 'Serious': return 'text-[#EA580C]';
      case 'Severe': return 'text-[#DC2626]';
      case 'Closure': return 'text-[#991B1B]';
      case 'Moderate': return 'text-[#D97706]';
      default: return 'text-[#6B7280]';
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatLondonTime(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="road-disruption-card">
      {/* Enlarged Road Badge - centered (only for A/M roads) */}
      {data.roadType !== 'Street' && (
        <div className="badge-container">
          <RoadBadge 
            type={data.roadType} 
            number={data.roadNumber}
            size="enlarged" 
          />
        </div>
      )}

      {/* Street Badge - centered (only for Street roads) */}
      {data.roadType === 'Street' && (
        <div className="badge-container">
          <StreetBadge 
            label={data.roadName || data.roadNumber}
            size="enlarged" 
          />
        </div>
      )}

      {/* Road Name - centered (always shown) */}
      <div className="road-name">{data.roadName}</div>

      {/* Type Container - gray background with icon + text on left, time on right */}
      <div className="type-container">
        <div className="type-left-section">
          <img src={getSeverityIcon(data.type)} alt={data.type} width={28} height={28} style={{ marginRight: 12 }} />
          <span className="type-heading">
            {data.type === 'Closure' ? 'Closure' : data.type === 'Moderate' ? 'Moderate Delays' : `${data.type} Delays`}
          </span>
        </div>
        <span className="time-ago">{formatRelativeTime(new Date(data.lastUpdated))}</span>
      </div>
    </div>
  );
};
