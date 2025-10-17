// components/ui/StreetBadge.tsx
'use client';

import React from 'react';

type StreetBadgeSize = 'base' | 'enlarged' | 'small' | 'road-disruption-message';

export interface StreetBadgeProps {
  label: string; // e.g., "Oxford St"
  size?: StreetBadgeSize;
  className?: string;
}

const sizeClasses: Record<StreetBadgeSize, {
  outer: string;
  inner: string;
  text: string;
}> = {
  base: {
    outer: 'h-[32px] px-[2px] border-[0.8px] rounded-[7px] mx-[5px] mb-[4px] inline-flex items-center border-white bg-[#6B7280] ',
    inner: 'h-[27px] px-[1px] rounded-[4.5px] inline-flex items-center justify-center bg-[#6B7280] ',
    text: 'text-[20px] leading-[26px] text-white font-[400] font-[var(--font-hammersmith,\_Hammersmith\_One)]',
  },
  enlarged: {
    outer: 'h-[45.7px] px-[2.15px] border-[1px] rounded-[9px] mx-[7.5px] mb-0 inline-flex items-center border-white bg-[#6B7280] ',
    inner: 'h-[40px] px-[1.5px] rounded-[6px] inline-flex items-center justify-center bg-[#6B7280] ',
    text: 'text-[30px] leading-[39px] text-white font-[400] font-[var(--font-hammersmith,\_Hammersmith\_One)]',
  },
  small: {
    outer: 'h-[25px] px-[1.6px] border-[0.5px] rounded-[5px] inline-flex items-center border-white bg-[#6B7280] ',
    inner: 'h-[21px] px-[2px] rounded-[3px] inline-flex items-center justify-center bg-[#6B7280] ',
    text: 'text-[14px] leading-[17px] text-white font-[400] font-[var(--font-hammersmith,\_Hammersmith\_One)]',
  },
  'road-disruption-message': {
    outer: 'h-[27.1px] px-[1.4px] border-[0.7px] rounded-[6px] mx-[4px] mb-[3px] inline-flex items-center border-white bg-[#6B7280] ',
    inner: 'h-[23px] px-[0.8px] rounded-[4px] inline-flex items-center justify-center bg-[#6B7280] ',
    text: 'text-[16px] leading-[20px] text-white font-[400] font-[var(--font-hammersmith,\_Hammersmith\_One)]',
  },
};

export function StreetBadge({ label, size = 'base', className = '' }: StreetBadgeProps) {
  const sz = sizeClasses[size];
  return (
    <span className={sz.outer + className}>
      <span className={sz.inner}>
        <span className={sz.text}>
          {label}
        </span>
      </span>
    </span>
  );
}

export default StreetBadge;
