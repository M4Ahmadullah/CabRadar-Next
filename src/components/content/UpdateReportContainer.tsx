// components/content/UpdateReportContainer.tsx
'use client';

import { useState } from 'react';

interface UpdateReportContainerProps {
  currentReportType: 'tfl' | 'police-check' | 'clear';
  onSubmitReport: (reportType: 'still-here' | 'clear' | 'tfl' | 'police-check') => Promise<void>;
  isSubmitting?: boolean;
  isWithinBoundary?: boolean;
  className?: string;
}

export const UpdateReportContainer: React.FC<UpdateReportContainerProps> = ({
  currentReportType,
  onSubmitReport,
  isSubmitting = false,
  isWithinBoundary = true,
  className
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Don't show if not within boundary or submitting
  if (!isWithinBoundary || isSubmitting || !isVisible) {
    return null;
  }

  return (
    <div className={`update-report-container ${className || ''}`}>
      <div className="update-report-title">Update this report</div>
      <div className="update-buttons-row">
        {currentReportType === 'clear' ? (
          // Three buttons for clear reports
          <>
            <button 
              className="tfl-button-three-buttons"
              onClick={() => onSubmitReport('tfl')}
              disabled={isSubmitting}
            >
              <span className="tfl-button-text">TfL</span>
            </button>
            <button 
              className="police-button-three-buttons"
              onClick={() => onSubmitReport('police-check')}
              disabled={isSubmitting}
            >
              <span className="police-button-text">Police Check</span>
            </button>
            <button 
              className="clear-button-three-buttons"
              onClick={() => onSubmitReport('clear')}
              disabled={isSubmitting}
            >
              <span className="clear-button-text">Clear</span>
            </button>
          </>
        ) : (
          // Two buttons for TfL/Police reports
          <>
            <button 
              className="still-here-button"
              onClick={() => onSubmitReport('still-here')}
              disabled={isSubmitting}
            >
              <span className="still-here-button-text">Still Here</span>
            </button>
            <button 
              className="clear-button"
              onClick={() => onSubmitReport('clear')}
              disabled={isSubmitting}
            >
              <span className="clear-button-text">Clear</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
