/**
 * GlassCard.tsx - Refactored Molecule
 * Collapsible glass card with neon accent
 * 
 * Uses design tokens from global.css
 * Uses .glass utility class for glassmorphism effect
 */

import React, { type HTMLAttributes, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface GlassCardProps extends HTMLAttributes<HTMLDetailsElement> {
  summary: ReactNode;
  open?: boolean;
  onToggle?: (e: React.SyntheticEvent<HTMLDetailsElement>) => void;
  variant?: 'default' | 'primary' | 'secondary';  // Border color variant
  glow?: boolean;                                  // Add neon glow
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  summary,
  open,
  onToggle,
  variant = 'default',
  glow = false,
  className,
  ...props
}) => {
  // Variant styles
  const variantStyles = {
    default: {
      border: 'border-white/10',
      glow: '',
    },
    primary: {
      border: 'border-primary/30',
      glow: 'shadow-[0_0_20px_var(--color-primary-glow)]',
    },
    secondary: {
      border: 'border-secondary/30',
      glow: 'shadow-[0_0_20px_var(--color-secondary-glow)]',
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <details
      className={cn(
        // Glass effect (from global.css utility)
        'glass',
        
        // Base styles
        'rounded-2xl overflow-hidden',
        'border-2',
        'transition-all duration-300',
        
        // Variant border
        currentVariant.border,
        
        // Glow effect
        glow && currentVariant.glow,
        
        // Custom classes
        className
      )}
      open={open}
      onToggle={onToggle}
      {...props}
    >
      {/* Summary (clickable header) */}
      <summary
        className={cn(
          'px-5 py-4',
          'cursor-pointer list-none',
          'flex items-center justify-between',
          'hover:bg-white/5',
          'transition-colors duration-200',
          'group'
        )}
      >
        {/* Summary Content */}
        <div className="flex-1">
          {summary}
        </div>

        {/* Chevron Icon (rotates when open) */}
        <ChevronDown
          className={cn(
            'w-5 h-5 ml-3 shrink-0',
            'text-moon',
            'transition-transform duration-300',
            'group-open:rotate-180',
            'group-hover:text-starlight'
          )}
          aria-hidden="true"
        />
      </summary>

      {/* Content (revealed when open) */}
      <div
        className={cn(
          'px-5 pb-4 pt-2',
          'border-t-2',
          currentVariant.border,
          'space-y-4',
          'animate-fade-in'
        )}
      >
        {children}
      </div>
    </details>
  );
};

GlassCard.displayName = 'GlassCard';