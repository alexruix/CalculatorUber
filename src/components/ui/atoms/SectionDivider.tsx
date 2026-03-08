/**
 * SectionDivider.tsx - Refactored Atom
 * Gaming aesthetic divider with neon glow option
 * 
 * Uses design tokens from global.css
 */

import React from 'react';
import { cn } from '../../../lib/utils';

export type DividerVariant = 'default' | 'primary' | 'gradient';
export type DividerOrientation = 'horizontal' | 'vertical';

export interface SectionDividerProps {
  variant?: DividerVariant;
  orientation?: DividerOrientation;
  label?: string;          // Optional centered label
  glow?: boolean;          // Add neon glow
  className?: string;
}

const variantStyles: Record<DividerVariant, string> = {
  default: 'bg-gradient-to-r from-transparent via-moon/20 to-transparent',
  primary: 'bg-gradient-to-r from-transparent via-primary/30 to-transparent',
  gradient: 'bg-gradient-to-r from-secondary/30 via-primary/30 to-accent/30',
};

export const SectionDivider: React.FC<SectionDividerProps> = ({
  variant = 'default',
  orientation = 'horizontal',
  label,
  glow = false,
  className,
}) => {
  if (orientation === 'vertical') {
    return (
      <div
        className={cn(
          'w-px h-full',
          'bg-gradient-to-b from-transparent via-moon/20 to-transparent',
          glow && 'shadow-[0_0_10px_var(--color-primary-glow)]',
          className
        )}
        role="separator"
        aria-orientation="vertical"
      />
    );
  }

  if (label) {
    return (
      <div className={cn('relative', className)} role="separator" aria-orientation="horizontal">
        {/* Line */}
        <div className={cn('h-px', variantStyles[variant])} />
        
        {/* Label */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span
            className={cn(
              'px-4 bg-black text-xs font-bold uppercase tracking-widest',
              variant === 'primary' ? 'text-primary' : 'text-moon'
            )}
          >
            {label}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'h-px',
        variantStyles[variant],
        glow && 'shadow-[0_0_10px_var(--color-primary-glow)]',
        className
      )}
      role="separator"
      aria-orientation="horizontal"
    />
  );
};

SectionDivider.displayName = 'SectionDivider';