/**
 * DisruptionInfo Component
 * 
 * This component displays comprehensive information about road disruptions, including:
 * - Affected roads with share functionality
 * - Current update details
 * - Comments and last updated information
 * - Reasons, dates, and other metadata
 * 
 * Features:
 * - Dynamic road badge display (A roads, M roads, and streets)
 * - Share button for affected roads section
 * - Formatted date/time display using London timezone
 * - Conditional rendering of sections based on data availability
 * - Proper spacing and layout matching Android design
 * 
 * Data Sections:
 * - Affected Roads: Shows road badges with share functionality
 * - Current Update: Displays the latest disruption information
 * - Comments: Shows additional comments about the disruption
 * - Last Updated: Shows when the information was last updated
 * - Reasons: Displays category and subcategory information
 * - From/To: Shows disruption start and end dates
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.description - Current update description
 * @param {string} props.lastUpdated - Last updated timestamp
 * @param {Array} props.affectedRoads - Array of affected road objects
 * @param {string} [props.category] - Disruption category
 * @param {string} [props.subCategory] - Disruption subcategory
 * @param {string} [props.fromDate] - Disruption start date
 * @param {string} [props.toDate] - Disruption end date
 * @param {string} [props.comments] - Additional comments
 * @param {string} [props.roadName] - Road name for share functionality
 * @param {string} [props.disruptionId] - Disruption ID for share functionality
 * @param {string} [props.className] - Optional CSS class name
 * @returns {JSX.Element} Comprehensive disruption information display
 */
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
  /**
   * Formats a date string to London timezone
   * Handles errors gracefully by returning the original string if parsing fails
   * 
   * @param {string} dateString - ISO date string to format
   * @returns {string} Formatted date string in London timezone
   */
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
      {/* Affected Roads Section with Share Functionality */}
      {affectedRoads && affectedRoads.length > 0 && (
        <div className="affected-roads-section">
          <div className="affected-roads-header">
            <div className="affected-roads-label ml-1">Affected Roads</div>
            {/* Share Button - Only show if road name and disruption ID are available */}
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

      {/* Horizontal Rule Separator */}
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

      {/* Horizontal Rule Separator */}
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

      {/* From Date Section */}
      {fromDate && (
        <div className="content-section">
          <div className="title-spacing" />
          <div className="section-title">From</div>
          <div className="section-text">{formatDateTime(fromDate)}</div>
        </div>
      )}

      {/* To Date Section */}
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
