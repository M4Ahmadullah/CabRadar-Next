// components/content/DisruptionInfo.tsx
import { motion } from 'framer-motion';
import { RoadBadge } from '@/components/ui/RoadBadge';
import { ShareButton } from '@/components/ui/ShareButton';
import { formatLondonTime } from '@/lib/utils/timeUtils';
import { generateRoadDisruptionSlug } from '@/lib/api/roadDisruptions';

interface DisruptionInfoProps {
  description: string;
  lastUpdated: string;
  affectedRoads: Array<{ type: 'A' | 'M' | 'Street'; number: string }>;
  category?: string;
  subCategory?: string;
  fromDate?: string;
  toDate?: string;
  comments?: string;
  roadName?: string;
  disruptionId?: string;
  className?: string;
}

export const DisruptionInfo: React.FC<DisruptionInfoProps> = ({
  description,
  lastUpdated,
  affectedRoads,
  className,
  category,
  subCategory,
  fromDate,
  toDate,
  comments,
  roadName,
  disruptionId
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
    <div className={`disruption-info-component${className ? ` ${className}` : ''}`} style={{ marginLeft: '10px', marginRight: '15px' }}>
      {/* Affected Roads Section */}
      {affectedRoads && affectedRoads.length > 0 && (
        <div className="affected-roads-section">
          <div className="affected-roads-header">
            <div className="affected-roads-label ml-1">Affected Roads</div>
            {roadName && disruptionId && (
              <ShareButton 
                url={`/routes/road-disruption/${generateRoadDisruptionSlug(roadName, disruptionId)}`}
                title={`Road Disruption: ${roadName}`}
                buttonText="Share"
              />
            )}
          </div>
          <div className="road-badges-container">
            {/* A and M type roads displayed inline */}
            {affectedRoads
              .filter(road => road.type === 'A' || road.type === 'M')
              .map((road, index) => (
                <RoadBadge 
                  key={`${road.type}-${index}`}
                  type={road.type} 
                  number={road.number}
                  size="base"
                />
              ))
            }
            
            {/* Normal streets displayed on new lines */}
            {affectedRoads
              .filter(road => road.type === 'Street')
              .map((road, index) => (
                <div key={`street-${index}`} className="street-container">
                  <RoadBadge 
                    type={road.type} 
                    number={road.number}
                    size="base"
                  />
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* Horizontal Rule */}
      <div className="horizontal-rule" />

      {/* Current Update Section */}
      {description && (
        <div className="content-section">
          <div className="title-spacing" />
          <div className="section-title">Current Update</div>
          <div className="section-text">{description}</div>
        </div>
      )}

      {/* Comments Section */}
      {comments && (
        <div className="content-section">
          <div className="title-spacing" />
          <div className="section-title">Comments</div>
          <div className="section-text">{comments}</div>
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

      {/* Horizontal Rule */}
      <div className="horizontal-rule" />

      {/* Spacing */}
      <div className="spacing" />

      {/* Reasons Section */}
      {category && (
        <div className="content-section">
          <div className="title-spacing" />
          <div className="section-title">Reasons</div>
          <div className="section-text">
            {category}
            {subCategory && ` (${subCategory})`}
          </div>
        </div>
      )}

      {/* From Section */}
      {fromDate && (
        <div className="content-section">
          <div className="title-spacing" />
          <div className="section-title">From</div>
          <div className="section-text">{formatDateTime(fromDate)}</div>
        </div>
      )}

      {/* To Section */}
      {toDate && (
        <div className="content-section">
          <div className="title-spacing" />
          <div className="section-title">To</div>
          <div className="section-text">{formatDateTime(toDate)}</div>
        </div>
      )}

      {/* Bottom Padding */}
      <div className="bottom-padding" />
    </div>
  );
};
