// components/content/TransportDisruptionCard.tsx
import { motion } from 'framer-motion';
import { TransportDisruptionData } from '@/lib/types/transportDisruptions';

interface TransportDisruptionCardProps {
  data: TransportDisruptionData;
}

export const TransportDisruptionCard: React.FC<TransportDisruptionCardProps> = ({ data }) => {
  const getStatusColor = (status: string) => {
    const lowerStatus = status.toLowerCase();
    
    switch (lowerStatus) {
      case 'severe delays':
        return { backgroundColor: '#FDB813', textColor: '#000000' }; // Yellow
      case 'no service':
        return { backgroundColor: '#D52723', textColor: '#FFFFFF' }; // Red
      case 'suspended':
        return { backgroundColor: '#D52723', textColor: '#FFFFFF' }; // Red
      case 'closed':
        return { backgroundColor: '#D52723', textColor: '#FFFFFF' }; // Red
      case 'good service':
        return { backgroundColor: '#10B981', textColor: '#FFFFFF' }; // Green
      case 'minor delays':
        return { backgroundColor: '#F59E0B', textColor: '#000000' }; // Orange
      case 'disruption':
        return { backgroundColor: '#EA580C', textColor: '#FFFFFF' }; // Orange-red
      case 'closure':
        return { backgroundColor: '#DC2626', textColor: '#FFFFFF' }; // Red
      case 'suspension':
        return { backgroundColor: '#991B1B', textColor: '#FFFFFF' }; // Dark red
      case 'delay':
        return { backgroundColor: '#D97706', textColor: '#FFFFFF' }; // Orange
      default:
        return { backgroundColor: '#6B7280', textColor: '#FFFFFF' }; // Gray
    }
  };

  const badgeStyle = getStatusColor(data.status);

  // Truncate station name after 25 characters (matching mobile app)
  const truncateStationName = (name: string) => {
    return name.length > 25 ? name.substring(0, 25) + '...' : name;
  };

  // Truncate disruption name after 17 characters (matching mobile app)
  const truncateDisruptionName = (name: string) => {
    return name.length > 17 ? name.substring(0, 17) + '...' : name;
  };

  // Get the first disruption to determine the disruption name
  const firstDisruption = Object.values(data.disruptions || {})[0];
  const disruptionName = firstDisruption?.description || data.description || 'Disruption';

  return (
    <div className="transport-disruption-card">
      {/* First Row: Title, Mileage */}
      <div className="transport-disruption-first-row">
        <div className="transport-disruption-title-container">
          <span className="transport-disruption-title">{truncateStationName(data.commonName)}</span>
        </div>
        
        <div className="transport-disruption-mileage-container">
          <span className="transport-disruption-mileage">{data.distance_km?.toFixed(1)}m</span>
        </div>
      </div>

      {/* Second Row: Disruption Name and Status Badge */}
      <div className="transport-disruption-second-row">
        <span className="transport-disruption-disruption-name">{truncateDisruptionName(disruptionName)}</span>
        <div 
          className="transport-disruption-status-badge"
          style={{ backgroundColor: badgeStyle.backgroundColor }}
        >
          <span 
            className="transport-disruption-status-text"
            style={{ color: badgeStyle.textColor }}
          >
            {data.status}
          </span>
        </div>
      </div>
    </div>
  );
};