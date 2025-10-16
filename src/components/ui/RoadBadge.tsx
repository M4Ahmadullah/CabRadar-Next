// components/ui/RoadBadge.tsx
interface RoadBadgeProps {
  type: 'A' | 'M' | 'Street';
  number: string;
  size?: 'base' | 'enlarged' | 'small' | 'road-disruption-message';
}

export const RoadBadge: React.FC<RoadBadgeProps> = ({ 
  type, 
  number, 
  size = 'base' 
}) => {
  // For ordinary streets, render as text instead of badge (matching mobile app)
  if (type === 'Street') {
    const getStreetTextSize = () => {
      switch (size) {
        case 'enlarged':
          return { fontSize: '18px', lineHeight: '24px' };
        case 'small':
          return { fontSize: '11px', lineHeight: '15px' };
        case 'road-disruption-message':
          return { fontSize: '14px', lineHeight: '16px' };
        default: // base
          return { fontSize: '12px', lineHeight: '16px' };
      }
    };

    const textSize = getStreetTextSize();
    
    return (
      <span 
        style={{
          fontSize: textSize.fontSize,
          lineHeight: textSize.lineHeight,
          fontWeight: 'bold',
          fontFamily: 'Inter, sans-serif',
          textAlign: 'center',
          color: '#000000',
          marginLeft: '5px',
          marginRight: '4px',
          marginBottom: '4px'
        }}
      >
        {number}
      </span>
    );
  }
  
  // For M and A roads, render as 3-layer badge (matching mobile app exactly)
  const getBadgeColors = () => {
    switch (type) {
      case 'A':
        return {
          outerBorder: '#006C49', // Green border
          middleBg: '#006C49',    // Green background
          textColor: '#F8E027',   // Yellow text
        };
      case 'M':
        return {
          outerBorder: '#007BC1', // Blue border
          middleBg: '#007BC1',    // Blue background
          textColor: '#FFFFFF',   // White text
        };
      default:
        return {
          outerBorder: '#6B7280', // Gray border
          middleBg: '#6B7280',    // Gray background
          textColor: '#FFFFFF',   // White text
        };
    }
  };

  // EXACT mobile app size specifications from badgeStyles.ts
  const getSizeStyles = () => {
    switch (size) {
      case 'enlarged':
        return {
          outer: {
            height: '45.7px',
            padding: '2.15px',
            borderWidth: '1px',
            borderRadius: '9px',
            marginLeft: '7.5px',
            marginRight: '0px',
            marginBottom: '0px',
          },
          middle: {
            height: '40px',
            padding: '1.5px',
            borderRadius: '6px',
          },
          inner: {
            height: '50px',
            paddingHorizontal: '4.5px',
            borderRadius: '9px',
          },
          text: {
            fontSize: '30px',
            lineHeight: '39px',
          }
        };
      case 'small':
        return {
          outer: {
            height: '25px',
            padding: '1.6px',
            borderWidth: '0.5px',
            borderRadius: '5px',
          },
          middle: {
            height: '21px',
            padding: '2px',
            borderRadius: '3px',
          },
          inner: {
            height: '27px',
            paddingHorizontal: '3px',
            borderRadius: '0px',
          },
          text: {
            fontSize: '14px',
            lineHeight: '17px',
          }
        };
      case 'road-disruption-message':
        return {
          outer: {
            height: '27.1px',
            padding: '1.4px',
            borderWidth: '0.7px',
            borderRadius: '6px',
            marginLeft: '4px',
            marginRight: '3px',
            marginBottom: '3px',
          },
          middle: {
            height: '23px',
            padding: '0.8px',
            borderRadius: '4px',
          },
          inner: {
            height: '28px',
            paddingHorizontal: '2.5px',
            borderRadius: '5px',
          },
          text: {
            fontSize: '16px',
            lineHeight: '20px',
          }
        };
      default: // base
        return {
          outer: {
            height: '32px',
            padding: '2px',
            borderWidth: '0.8px',
            borderRadius: '7px',
            marginLeft: '5px',
            marginRight: '4px',
            marginBottom: '4px',
          },
          middle: {
            height: '27px',
            padding: '1px',
            borderRadius: '4.5px',
          },
          inner: {
            height: '33px',
            paddingHorizontal: '3px',
            borderRadius: '6px',
          },
          text: {
            fontSize: '20px',
            lineHeight: '26px',
          }
        };
    }
  };

  const colors = getBadgeColors();
  const sizes = getSizeStyles();

  return (
    <div 
      style={{
        // Outer Container (white background with colored border)
        height: sizes.outer.height,
        backgroundColor: '#FFFFFF',
        border: `${sizes.outer.borderWidth} solid ${colors.outerBorder}`,
        borderRadius: sizes.outer.borderRadius,
        padding: sizes.outer.padding,
        marginLeft: sizes.outer.marginLeft,
        marginRight: sizes.outer.marginRight,
        marginBottom: sizes.outer.marginBottom,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'auto',
        minWidth: 'fit-content',
      }}
    >
      <div 
        style={{
          // Middle Container (colored background)
          height: sizes.middle.height,
          backgroundColor: colors.middleBg,
          padding: sizes.middle.padding,
          borderRadius: sizes.middle.borderRadius,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <div 
          style={{
            // Inner Container (contains text)
            height: sizes.inner.height,
            paddingLeft: sizes.inner.paddingHorizontal,
            paddingRight: sizes.inner.paddingHorizontal,
            borderRadius: sizes.inner.borderRadius,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <span 
            style={{
              fontSize: sizes.text.fontSize,
              lineHeight: sizes.text.lineHeight,
              fontWeight: 'bold',
              fontFamily: 'Inter, sans-serif',
              textAlign: 'center',
              color: colors.textColor,
            }}
          >
            {type} {number}
          </span>
        </div>
      </div>
    </div>
  );
};
