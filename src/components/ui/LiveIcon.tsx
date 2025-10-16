// components/ui/LiveIcon.tsx
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface LiveIconProps {
  backgroundColor?: 'gray' | 'white';
  fontFamily?: string;
  letterSpacing?: number;
  textMarginLeft?: number;
  textMarginTop?: number;
  outerCircleSizeMultiplier?: number;
  innerWhiteCircleSizeMultiplier?: number;
  centerCircleSizeMultiplier?: number;
}

export const LiveIcon: React.FC<LiveIconProps> = ({ 
  backgroundColor = 'gray', 
  fontFamily, 
  letterSpacing, 
  textMarginLeft, 
  textMarginTop,
  outerCircleSizeMultiplier = 1,
  innerWhiteCircleSizeMultiplier = 1,
  centerCircleSizeMultiplier = 1
}) => {
  const pulseRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  
  // Fixed reasonable dimensions (about 60% smaller than mobile app)
  const containerWidth = 60; // 158 * 0.38
  const containerHeight = 23; // 60 * 0.38
  const borderRadius = 15; // 40 * 0.38
  const paddingTop = 0;
  const paddingRight = 9; // 23 * 0.38
  const paddingBottom = 0;
  const paddingLeft = 6; // 15 * 0.38
  const outerCircleSize = 13.3; // Perfectly round outer circle
  const innerWhiteCircleSize = 10.2; // Perfectly round inner circle (70% of outer)
  const centerGreenCircleSize = 7.2; // Perfectly round center circle (40% of outer)
  const fontSize = 15; // 40 * 0.38
  const lineHeight = 15;
  
  const bgColor = backgroundColor === 'gray' ? '#F7F7F7' : '#FFFFFF';
  
  // Start glow animation on mount (gentle inner circle color change only)
  useEffect(() => {
    if (!glowRef.current) return;
    
    const startGlowAnimation = () => {
      const glowElement = glowRef.current!;
      
      let glowOpacity = 0.3;
      let direction = 1;
      
      const animate = () => {
        if (direction === 1) {
          glowOpacity += 0.001; // Much slower change
          if (glowOpacity >= 0.6) direction = -1;
        } else {
          glowOpacity -= 0.001; // Much slower change
          if (glowOpacity <= 0.4) direction = 1;
        }
        
        // Only inner circle changes color, very gently
        const darkGreen = '#26D543';
        const lightGreen = '#86EFAC';
        
        // Gentle color interpolation for inner circle only
        const interpolateColor = (start: string, end: string, factor: number) => {
          // Simple color interpolation
          return factor > 0.5 ? end : start;
        };
        
        glowElement.style.opacity = glowOpacity.toString();
        glowElement.style.backgroundColor = interpolateColor(darkGreen, lightGreen, glowOpacity);
        
        requestAnimationFrame(animate);
      };
      
      animate();
    };

    startGlowAnimation();
  }, []);
  
  return (
    <div 
      style={{
        width: containerWidth,
        height: containerHeight,
        borderRadius,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        backgroundColor: bgColor,
        borderWidth: 0.17,
        borderColor: 'rgba(0, 0, 0, 1)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Live indicator circle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Outer circle */}
        <div 
          style={{
            width: outerCircleSize,
            height: outerCircleSize,
            borderRadius: outerCircleSize / 2,
            backgroundColor: '#26D543', // Static dark green - no color change
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0, // Prevent shrinking
          }}
        >
          {/* Inner white circle */}
          <div style={{
            width: innerWhiteCircleSize,
            height: innerWhiteCircleSize,
            borderRadius: innerWhiteCircleSize / 2,
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative', // Add this for absolute positioning of center circle
            flexShrink: 0, // Prevent shrinking
          }}>
            {/* Center green circle with glow animation */}
            <div 
              ref={glowRef}
              style={{
                width: centerGreenCircleSize,
                height: centerGreenCircleSize,
                borderRadius: centerGreenCircleSize / 2,
                backgroundColor: '#26D543', // Initial dark green
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }} 
            />
          </div>
        </div>
      </div>
      
      {/* Live text */}
      <span style={{
        fontSize,
        lineHeight,
        fontFamily: fontFamily || 'var(--font-gill-sans), "Gill Sans MT", sans-serif',
        letterSpacing: letterSpacing || 0.5,
        marginLeft: textMarginLeft || 0,
        marginTop: textMarginTop || 0,
        color: '#000000',
        fontWeight: '100',
      }}>Live</span>
    </div>
  );
};
