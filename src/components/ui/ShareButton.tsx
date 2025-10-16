// components/ui/ShareButton.tsx
import { motion } from 'framer-motion';

interface ShareButtonProps {
  url: string;
  title: string;
  buttonText: string;
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ 
  url,
  title,
  buttonText,
  className = ''
}) => {
  const handleShare = async () => {
    const shareUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    
    if (navigator.share) {
      // Native sharing on mobile
      try {
        await navigator.share({
          title: title,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  return (
    <button 
      onClick={handleShare}
      className={`share-button ${className}`}
      type="button"
    >
      {buttonText}
    </button>
  );
};
