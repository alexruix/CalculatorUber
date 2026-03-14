/**
 * MetricCard.tsx - Unified Molecule
 * ─────────────────────────────────────────────────────────────
 * Premium stat card with gaming aesthetics and neon glow effects.
 * Supports multiple variants, sizes, and animations.
 * 
 * @molecule
 */

import React, { type HTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../../lib/utils';

export type MetricVariant = 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'streak';

interface MetricCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  unit?: string;
  variant?: MetricVariant;
  icon?: LucideIcon;
  glow?: boolean;
  pulse?: boolean;
  compact?: boolean;
}

const variantStyles: Record<MetricVariant, { text: string; border: string; bg: string; glow: string }> = {
  default: {
    text: 'text-starlight',
    border: 'border-white/10',
    bg: 'bg-white/5',
    glow: '',
  },
  primary: {
    text: 'text-primary',
    border: 'border-primary/30',
    bg: 'bg-primary/5',
    glow: 'shadow-[0_0_20px_var(--color-primary-glow)]',
  },
  secondary: {
    text: 'text-secondary',
    border: 'border-secondary/30',
    bg: 'bg-secondary/5',
    glow: 'shadow-[0_0_20px_var(--color-secondary-glow)]',
  },
  accent: {
    text: 'text-accent',
    border: 'border-accent/30',
    bg: 'bg-accent/5',
    glow: 'shadow-[0_0_20px_var(--color-accent-glow)]',
  },
  success: {
    text: 'text-success',
    border: 'border-success/30',
    bg: 'bg-success/5',
    glow: 'shadow-[0_0_20px_var(--color-success-glow)]',
  },
  warning: {
    text: 'text-warning',
    border: 'border-warning/30',
    bg: 'bg-warning/5',
    glow: 'shadow-[0_0_20px_var(--color-warning-glow)]',
  },
  error: {
    text: 'text-error',
    border: 'border-error/30',
    bg: 'bg-error/5',
    glow: 'shadow-[0_0_20px_rgba(255,68,68,0.3)]',
  },
  streak: {
    text: 'text-accent',
    border: 'border-accent/40',
    bg: 'bg-accent/10',
    glow: 'shadow-[0_0_30px_var(--color-accent-glow)]',
  },
};

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  variant = 'default',
  icon: Icon,
  glow = false,
  pulse = false,
  compact = false,
  className,
  ...props
}) => {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        // Base structure
        'flex flex-col rounded-2xl transition-all duration-300',
        compact ? 'p-2 items-center justify-center text-center min-h-0' : 'p-4 min-h-[80px]',
        
        // Visuals
        !compact && 'border-2',
        !compact && styles.border,
        !compact && styles.bg,
        !compact && glow && styles.glow,
        
        // Animations
        pulse && 'animate-pulse-once',
        
        className
      )}
      {...props}
    >
      {/* Header (Label + Icon) */}
      <div className={cn(
        'flex items-center w-full mb-1',
        compact ? 'justify-center order-2' : 'justify-between'
      )}>
        <span className={cn(
          'text-[10px] font-extrabold uppercase tracking-[0.2em]',
          compact ? 'text-white/50' : 'text-moon'
        )}>
          {label}
        </span>
        {!compact && Icon && <Icon size={14} className={styles.text} />}
      </div>

      {/* Main Value */}
      <div className={cn(
        'flex items-baseline gap-0.5',
        compact ? 'order-1 mb-0.5' : ''
      )}>
        <span className={cn(
          'text-xl font-black tabular-nums tracking-tight leading-none',
          styles.text
        )}>
          {value}
        </span>
        {unit && (
          <span className="text-[10px] font-bold opacity-60 uppercase">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};

MetricCard.displayName = 'MetricCard';
