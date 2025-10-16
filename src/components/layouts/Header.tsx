// components/layouts/Header.tsx
import Image from 'next/image';

interface HeaderProps {
  title?: string;
  onBack?: () => void;
  onClose?: () => void;
  showTitle?: boolean;
  border?: boolean;
  iconStyle?: 'gray' | 'dark';
}

export const Header: React.FC<HeaderProps> = ({ title, onBack, onClose, showTitle = true, border = true, iconStyle = 'dark' }) => {
  // Always use gray icons for road disruption page (matching mobile app)
  const backIconSrc = '/Icons/navigation_icons/Back.png';
  const closeIconSrc = '/Icons/navigation_icons/Close.png';
  
  return (
    <header className={`road-disruption-header${border ? '' : ' no-border'}`}>
      {/* Back Button */}
      {onBack && (
        <button 
          onClick={onBack}
          className="header-back-button"
          aria-label="Go back"
          type="button"
        >
          <Image 
            src={backIconSrc}
            alt="Back" 
            width={50}
            height={50}
            className="button-icon"
          />
        </button>
      )}
      
      {/* Title - Hidden for road disruption page */}
      {showTitle && (
        <h1 className="header-title">
          {title}
        </h1>
      )}
      
      {/* Close Button */}
      {onClose && (
        <button 
          onClick={onClose}
          className="header-close-button"
          aria-label="Close"
          type="button"
        >
          <Image 
            src={closeIconSrc}
            alt="Close" 
            width={50}
            height={50}
            className="button-icon"
          />
        </button>
      )}
    </header>
  );
};
