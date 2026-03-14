/**
 * InfoRow.tsx - Unified Molecule
 * ─────────────────────────────────────────────────────────────
 * semantic data row for summaries (Icon + Label + Value).
 * Used in JourneyCard, VehicleIdentityCard, etc.
 * 
 * @molecule
 */

import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface InfoRowProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  align?: 'left' | 'right';
  className?: string;
}

export const InfoRow: React.FC<InfoRowProps> = ({
  label,
  value,
  subValue,
  icon: Icon,
  variant = 'default',
  align = 'left',
  className,
}) => {
  const variantColors = {
    default: 'text-moon',
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
  };

  const isRight = align === 'right';

  return (
    <div className={cn(
      'flex flex-col space-y-1.5',
      isRight ? 'items-end text-right' : 'items-start text-left',
      className
    )}>
      {/* Header: Icon + Label */}
      <div className={cn(
        'flex items-center gap-2',
        isRight && 'flex-row-reverse'
      )}>
        {Icon && <Icon className="w-3.5 h-3.5 text-white/40" />}
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
          {label}
        </span>
      </div>

      {/* Main Content */}
      <div className="space-y-0.5">
        <p className={cn(
          'text-sm font-black tabular-nums leading-none',
          variant === 'default' ? 'text-starlight' : variantColors[variant]
        )}>
          {value}
        </p>
        {subValue && (
          <p className="text-[10px] uppercase tracking-wider text-white/30 font-medium">
            {subValue}
          </p>
        )}
      </div>
    </div>
  );
};

InfoRow.displayName = 'InfoRow';
