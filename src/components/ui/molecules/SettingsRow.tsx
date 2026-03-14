/**
 * SettingsRow.tsx - Unified Molecule
 * ─────────────────────────────────────────────────────────────
 * Interactive row for settings, toggles, and property lists.
 * Pattern: Icon -> Label/Desc -> Interactive Slot.
 * 
 * @molecule
 */

import React from 'react';
import { cn } from '../../../lib/utils';

interface SettingsRowProps {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'warning' | 'info' | 'neutral';
  className?: string;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({
  label,
  description,
  icon,
  action,
  isActive = false,
  onClick,
  variant = 'primary',
  className,
}) => {
  const isClickable = !!onClick;

  const variantStyles = {
    primary: 'border-primary/30 bg-primary/5 hover:bg-primary/10',
    secondary: 'border-secondary/30 bg-secondary/5 hover:bg-secondary/10',
    warning: 'border-warning/30 bg-warning/5 hover:bg-warning/10',
    info: 'border-info/30 bg-info/5 hover:bg-info/10',
    neutral: 'border-white/10 bg-white/5 hover:bg-white/10',
  };

  const activeStyles = {
    primary: 'border-primary/50 bg-primary/10 shadow-[0_0_15px_var(--color-primary-glow)]',
    secondary: 'border-secondary/50 bg-secondary/10 shadow-[0_0_15px_var(--color-secondary-glow)]',
    warning: 'border-warning/50 bg-warning/10 shadow-[0_0_15px_var(--color-warning-glow)]',
    info: 'border-info/50 bg-info/10 shadow-[0_0_15px_var(--color-info-glow)]',
    neutral: 'border-white/30 bg-white/10',
  };

  const Component = isClickable ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={cn(
        'w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 text-left',
        isActive ? activeStyles[variant] : variantStyles[variant],
        isClickable ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default',
        className
      )}
    >
      <div className="flex items-center gap-4">
        {/* Icon Wrap */}
        {icon && (
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-colors',
            isActive 
              ? `bg-${variant}/20 border-${variant}/40 text-${variant}` 
              : 'bg-white/5 border-white/10 text-moon'
          )}>
            {icon}
          </div>
        )}

        {/* Text Group */}
        <div className="flex flex-col">
          <span className={cn(
            'font-bold leading-tight',
            isActive ? 'text-starlight' : 'text-moon'
          )}>
            {label}
          </span>
          {description && (
            <p className={cn(
              'text-[11px] font-medium leading-tight mt-1',
              isActive ? 'text-white/60' : 'text-white/30'
            )}>
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Action Slot (e.g. Switch) */}
      {action && (
        <div className="shrink-0 ml-4">
          {action}
        </div>
      )}
    </Component>
  );
};

SettingsRow.displayName = 'SettingsRow';
