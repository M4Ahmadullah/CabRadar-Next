// components/navigation/NavigationCard.tsx
import { motion } from 'framer-motion';
import { NavigationItem } from '@/lib/api/navigation';
import { formatLondonTime } from '@/lib/utils/timeUtils';

interface NavigationCardProps {
  item: NavigationItem;
  onClick: () => void;
}

export const NavigationCard: React.FC<NavigationCardProps> = ({ item, onClick }) => {
  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    } catch {
      return dateString;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'road-disruption': return 'Road Disruption';
      case 'inspector': return 'Inspector Check';
      case 'event': return 'Event';
      case 'transport-disruption': return 'Transport Disruption';
      default: return 'Unknown';
    }
  };

  return (
    <motion.div
      className="bg-white rounded-lg p-4 mx-4 mb-4 shadow-sm border border-[#E5E7EB] cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {/* Header with icon and type */}
      <motion.div
        className="flex items-center mb-3"
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
          {item.icon}
        </motion.div>
        <div className="flex-1">
          <motion.div
            className="flex items-center mb-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <span 
              className="text-sm font-gill-sans px-2 py-1 rounded text-white"
              style={{ backgroundColor: item.color }}
            >
              {getTypeLabel(item.type)}
            </span>
          </motion.div>
          <motion.h3
            className="text-message-title"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            {item.title}
          </motion.h3>
        </div>
        {item.lastUpdated && (
          <motion.span
            className="text-london-time text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            {formatTimeAgo(item.lastUpdated)}
          </motion.span>
        )}
      </motion.div>

      {/* Description */}
      <motion.p
        className="text-message-body text-gray-600"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        {item.description}
      </motion.p>

      {/* Count indicator if available */}
      {item.count && (
        <motion.div
          className="mt-3 flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <span className="text-sm text-gray-500">
            {item.count} {item.count === 1 ? 'item' : 'items'} available
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};
