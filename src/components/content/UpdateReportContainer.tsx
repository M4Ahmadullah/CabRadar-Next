/**
 * UpdateReportContainer Component
 * 
 * This component provides interactive report update functionality for TfL Stop Checks,
 * allowing users to update the status of inspector reports in real-time.
 * 
 * Features:
 * - Dynamic button layout based on current report type
 * - Two-button layout for TfL/Police reports: "Still Here" and "Clear"
 * - Three-button layout for clear reports: "TfL", "Police Check", and "Clear"
 * - Loading states and disabled states during submission
 * - Conditional rendering based on boundary and submission status
 * 
 * Button Types:
 * - Still Here: Confirms the inspector is still present (for TfL/Police reports)
 * - Clear: Reports that the location is clear of inspectors
 * - TfL: Reports TfL inspector presence
 * - Police Check: Reports police checkpoint presence
 * 
 * @component
 * @param {Object} props - Component props
 * @param {'tfl' | 'police-check' | 'clear'} props.currentReportType - Current type of report
 * @param {Function} props.onSubmitReport - Callback function for report submission
 * @param {boolean} [props.isSubmitting] - Whether a report is currently being submitted
 * @param {boolean} [props.isWithinBoundary] - Whether user is within the report boundary
 * @param {string} [props.className] - Optional CSS class name
 * @returns {JSX.Element} Interactive report update container with buttons
 */
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
  // State for controlling component visibility (currently unused but available for future use)
  const [isVisible, setIsVisible] = useState(true);

  // Don't show the component if not within boundary, submitting, or not visible
  if (!isWithinBoundary || isSubmitting || !isVisible) {
    return null;
  }

  return (
    <div className={`update-report-container ${className || ''}`}>
      {/* Component Title */}
      <div className="update-report-title">Update this report</div>
      
      {/* Button Row - Layout changes based on current report type */}
      <div className="update-buttons-row">
        {currentReportType === 'clear' ? (
          // Three-button layout for clear reports
          <>
            {/* TfL Button - Reports TfL inspector presence */}
            <button 
              className="tfl-button-three-buttons"
              onClick={() => onSubmitReport('tfl')}
              disabled={isSubmitting}
            >
              <span className="tfl-button-text">TfL</span>
            </button>
            
            {/* Police Check Button - Reports police checkpoint presence */}
            <button 
              className="police-button-three-buttons"
              onClick={() => onSubmitReport('police-check')}
              disabled={isSubmitting}
            >
              <span className="police-button-text">Police Check</span>
            </button>
            
            {/* Clear Button - Confirms location is clear */}
            <button 
              className="clear-button-three-buttons"
              onClick={() => onSubmitReport('clear')}
              disabled={isSubmitting}
            >
              <span className="clear-button-text">Clear</span>
            </button>
          </>
        ) : (
          // Two-button layout for TfL/Police reports
          <>
            {/* Still Here Button - Confirms inspector is still present */}
            <button 
              className="still-here-button"
              onClick={() => onSubmitReport('still-here')}
              disabled={isSubmitting}
            >
              <span className="still-here-button-text">Still Here</span>
            </button>
            
            {/* Clear Button - Reports that location is now clear */}
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
