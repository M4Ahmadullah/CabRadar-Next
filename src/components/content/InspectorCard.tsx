// components/content/InspectorCard.tsx
import { InspectorData } from '@/lib/types/inspectors';

interface InspectorCardProps {
  data: InspectorData;
}

export const InspectorCard: React.FC<InspectorCardProps> = ({ data }) => {
  // Get type text based on inspector type
  const getTypeText = () => {
    switch (data.type) {
      case 'tfl':
        return 'TfL Stop Check';
      case 'police-check':
        return 'Police Stop Check';
      case 'clear':
        return 'Clear (No TfL / police)';
      default:
        return 'TfL Stop Check';
    }
  };

  // Get type icon based on inspector type
  const getTypeIcon = () => {
    switch (data.type) {
      case 'tfl':
        return '/Icons/inpectors_icons/police.png';
      case 'police-check':
        return '/Icons/inpectors_icons/alert.png';
      case 'clear':
        return '/Icons/inpectors_icons/white_like.png';
      default:
        return '/Icons/inpectors_icons/police.png';
    }
  };

  // Format time ago (same as mobile app)
  const formatTimeAgo = (timeString: string) => {
    const now = new Date();
    const time = new Date(timeString);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}min ago`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      if (minutes === 0) {
        return `${hours}hr ago`;
      } else {
        return `${hours}hr ${minutes}min ago`;
      }
    }
  };

  return (
    <div className="inspector-card">
      {/* Title Section */}
      <div className="title-section">
        <div className="title">{data.locationName}</div>
      </div>

      {/* Type and Time Section */}
      <div className="type-section">
        <div className="type-content">
          <div className="type-icon-container">
            <img 
              src={getTypeIcon()}
              alt={data.type}
              className="type-icon"
            />
          </div>
          <div className="type-text">{getTypeText()}</div>
        </div>
        <div className="time-text">{formatTimeAgo(data.time)}</div>
      </div>
    </div>
  );
};