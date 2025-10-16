// components/content/EventInfo.tsx
import { motion } from 'framer-motion';
import { formatLondonTime } from '@/lib/utils/timeUtils';

interface EventInfoProps {
  venue_name: string | null;
  venue_formatted_address: string | null;
  start_local: string;
  true_end: string;
  attendance: number | null;
  comment?: string | null;
}

export const EventInfo: React.FC<EventInfoProps> = ({
  venue_name,
  venue_formatted_address,
  start_local,
  true_end,
  attendance,
  comment
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
    <motion.div 
      className="px-4 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
    >
      {/* Event Details */}
      <motion.div 
        className="mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.3 }}
      >
        <h3 className="text-message-title mb-3">Event Details</h3>
        <div className="space-y-3">
          {/* Venue */}
          {venue_name && (
            <div>
              <span className="text-sm text-gray-600">Venue:</span>
              <p className="text-message-body">{venue_name}</p>
              {venue_formatted_address && (
                <p className="text-sm text-gray-600 mt-1">{venue_formatted_address}</p>
              )}
            </div>
          )}

          {/* Timing */}
          <div>
            <span className="text-sm text-gray-600">Start Time:</span>
            <p className="text-london-time">{formatDateTime(start_local)}</p>
          </div>

          {true_end && (
            <div>
              <span className="text-sm text-gray-600">End Time:</span>
              <p className="text-london-time">{formatDateTime(true_end)}</p>
            </div>
          )}

          {/* Attendance */}
          {attendance && (
            <div>
              <span className="text-sm text-gray-600">Expected Attendance:</span>
              <p className="text-london-time">{attendance.toLocaleString()} people</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Additional Information */}
      {comment && (
        <motion.div 
          className="mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.3 }}
        >
          <h3 className="text-message-title mb-2">Additional Information</h3>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-message-body">{comment}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
