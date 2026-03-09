/**
 * CardMetric.tsx - Refactored Molecule
 * Gaming aesthetic metric card with neon glow effects
 * 
 * Uses design tokens from global.css
 * Integrates with refactored atoms (Label)
 */

import React, { type HTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface CardMetricProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  value?: string | number;
  subValue?: string | number;
  status?: 'positive' | 'negative' | 'neutral' | 'info' | 'fare' | 'warning';
  icon?: LucideIcon;
  flat?: boolean;
  glow?: boolean;        // Add neon glow effect
  pulse?: boolean;       // Pulse animation for live data
}

export const CardMetric: React.FC<CardMetricProps> = ({
  label,
  value,
  subValue,
  status = 'neutral',
  icon: Icon,
  flat = false,
  glow = false,
  pulse = false,
  className,
  ...props
}) => {
  // Status to color mapping (using design tokens)
  const statusStyles = {
    positive: {
      value: 'text-primary',
      border: 'border-primary/30',
      bg: 'bg-primary/5',
      glow: 'shadow-[0_0_30px_var(--color-primary-glow)]',
    },
    negative: {
      value: 'text-error',
      border: 'border-error/30',
      bg: 'bg-error/5',
      glow: 'shadow-[0_0_30px_rgba(255,68,68,0.3)]',
    },
    neutral: {
      value: 'text-starlight',
      border: 'border-white/10',
      bg: 'bg-white/5',
      glow: '',
    },
    info: {
      value: 'text-secondary',
      border: 'border-secondary/30',
      bg: 'bg-secondary/5',
      glow: 'shadow-[0_0_30px_var(--color-secondary-glow)]',
    },
    fare: {
      value: 'text-primary',
      border: 'border-primary/20',
      bg: 'bg-primary/5',
      glow: 'shadow-[0_0_20px_var(--color-primary-glow)]',
    },
    warning: {
      value: 'text-accent',
      border: 'border-accent/30',
      bg: 'bg-accent/5',
      glow: 'shadow-[0_0_30px_var(--color-accent-glow)]',
    },
  };

  const currentStatus = statusStyles[status];

  return (
    <div
      className={cn(
        // Base styles
        'rounded-2xl p-4 transition-all duration-300',
        
        // Flat vs elevated
        flat ? (
          // Flat: minimal style
          'bg-transparent'
        ) : (
          // Elevated: glass effect with border
          cn(
            'border-2',
            currentStatus.border,
            currentStatus.bg
          )
        ),
        
        // Glow effect (only for elevated cards)
        !flat && glow && currentStatus.glow,
        
        // Pulse animation
        pulse && 'animate-pulse',
        
        // Custom classes
        className
      )}
      {...props}
    >
      {/* Header: Label + Icon */}
      <div className="flex items-start justify-between mb-1">
        {label && (
          <p className="text-[10px] text-moon uppercase font-extrabold tracking-widest">
            {label}
          </p>
        )}
        {Icon && (
          <Icon 
            className={cn(
              'w-3 h-3',
              flat ? 'text-moon' : currentStatus.value
            )} 
          />
        )}
      </div>

      {/* Main Value */}
      {value !== undefined && (
        <p
          className={cn(
            'text-xl font-extrabold leading-tight',
            currentStatus.value
          )}
        >
          {value}
        </p>
      )}

      {/* Sub Value / Secondary Info */}
      {subValue && (
        <p className="text-[10px] text-moon font-bold uppercase mt-1">
          {subValue}
        </p>
      )}
    </div>
  );
};

CardMetric.displayName = 'CardMetric';