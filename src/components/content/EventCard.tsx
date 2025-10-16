// components/content/EventCard.tsx
import { motion } from 'framer-motion';
import { EventData } from '@/lib/types/events';
import { formatLondonTime } from '@/lib/utils/timeUtils';

interface EventCardProps {
  data: EventData;
}

export const EventCard: React.FC<EventCardProps> = ({ data }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sports': return '⚽';
      case 'concerts': return '🎵';
      case 'festivals': return '🎪';
      case 'performing-arts': return '🎭';
      case 'conferences': return '💼';
      case 'expos': return '🏢';
      default: return '🎉';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sports': return 'text-[#22C55E]';
      case 'concerts': return 'text-[#9333EA]';
      case 'festivals': return 'text-[#EA580C]';
      case 'performing-arts': return 'text-[#DB2777]';
      case 'conferences': return 'text-[#2563EB]';
      case 'expos': return 'text-[#4B5563]';
      default: return 'text-[#6B7280]';
    }
  };

  const getSizeBadge = (size: string) => {
    switch (size) {
      case 'major': return { label: 'Major Event', color: 'bg-red-100 text-red-800' };
      case 'main': return { label: 'Main Event', color: 'bg-orange-100 text-orange-800' };
      case 'event': return { label: 'Event', color: 'bg-blue-100 text-blue-800' };
      case 'local': return { label: 'Local', color: 'bg-green-100 text-green-800' };
      default: return { label: 'Event', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const sizeBadge = getSizeBadge(data.size);

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
      className="bg-white rounded-lg p-4 mx-4 mb-4 shadow-sm border border-[#E5E7EB]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Header with category icon and title - EXACT mobile app layout */}
      <motion.div 
        className="flex items-start mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <motion.div 
          className="text-2xl mr-3"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.2, type: "spring", stiffness: 200 }}
        >
          {getCategoryIcon(data.category)}
        </motion.div>
        <div className="flex-1">
          <motion.h1 
            className="text-xl font-hammersmith text-[#1F2937] mb-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {data.title}
          </motion.h1>
          <motion.div 
            className="flex items-center gap-2 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <span className={`text-sm font-gill-sans ${getCategoryColor(data.category)}`}>
              {data.category.replace('-', ' ').toUpperCase()}
            </span>
            <span className={`px-2 py-1 rounded text-xs ${sizeBadge.color}`}>
              {sizeBadge.label}
            </span>
          </motion.div>
        </div>
        <motion.span 
          className="text-london-time"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          {data.timeAgo}
        </motion.span>
      </motion.div>

      {/* Venue information - EXACT mobile app layout */}
      {data.venue_name && (
        <motion.div 
          className="mb-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <div className="flex items-center mb-1">
            <span className="text-sm text-[#6B7280] mr-2">📍</span>
            <span className="text-message-title">{data.venue_name}</span>
          </div>
          {data.venue_formatted_address && (
            <p className="text-sm text-[#6B7280] ml-6">{data.venue_formatted_address}</p>
          )}
        </motion.div>
      )}

      {/* Timing information - EXACT mobile app layout */}
      <motion.div 
        className="mb-3"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <div className="flex items-center mb-1">
          <span className="text-sm text-[#6B7280] mr-2">🕐</span>
          <span className="text-sm text-[#6B7280]">Starts:</span>
          <span className="text-london-time ml-2">{formatDateTime(data.start_local)}</span>
        </div>
        {data.true_end && (
          <div className="flex items-center">
            <span className="text-sm text-[#6B7280] mr-2 ml-6">Ends:</span>
            <span className="text-london-time">{formatDateTime(data.true_end)}</span>
          </div>
        )}
      </motion.div>

      {/* Attendance - EXACT mobile app layout */}
      {data.attendance && (
        <motion.div 
          className="flex items-center mb-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <span className="text-sm text-[#6B7280] mr-2">👥</span>
          <span className="text-sm text-[#6B7280]">Expected Attendance:</span>
          <span className="text-london-time ml-2">{data.attendance.toLocaleString()}</span>
        </motion.div>
      )}

      {/* Distance - EXACT mobile app layout */}
      {data.distance_km && (
        <motion.div 
          className="text-london-time"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.3 }}
        >
          {data.distance_km.toFixed(1)} km away
        </motion.div>
      )}
    </motion.div>
  );
};
