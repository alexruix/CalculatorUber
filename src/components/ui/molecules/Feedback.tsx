/**
 * Feedback.tsx - Refactored Molecule
 * Gaming aesthetic feedback messages
 * 
 * Uses design tokens from global.css
 * Supports neon glow effects per type
 */

import React, { type HTMLAttributes, type ElementType } from 'react';
import { cn } from '../../../lib/utils';

export type FeedbackType = 'info' | 'success' | 'warning' | 'error';

interface FeedbackProps extends HTMLAttributes<HTMLParagraphElement> {
  type: FeedbackType;
  icon?: ElementType;
  glow?: boolean;       // Add neon glow effect
  shake?: boolean;      // Shake animation (for errors)
}

export const Feedback: React.FC<FeedbackProps> = ({
  children,
  type,
  icon: Icon,
  glow = false,
  shake = false,
  className,
  ...props
}) => {
  // Type to style mapping (using design tokens)
  const typeStyles = {
    info: {
      text: 'text-secondary',
      bg: 'bg-secondary/10',
      border: 'border-secondary/30',
      glow: 'shadow-[0_0_20px_var(--color-secondary-glow)]',
    },
    success: {
      text: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/30',
      glow: 'shadow-[0_0_20px_var(--color-primary-glow)]',
    },
    warning: {
      text: 'text-accent',
      bg: 'bg-accent/10',
      border: 'border-accent/30',
      glow: 'shadow-[0_0_20px_var(--color-accent-glow)]',
    },
    error: {
      text: 'text-error',
      bg: 'bg-error/10',
      border: 'border-error/30',
      glow: 'shadow-[0_0_20px_rgba(255,68,68,0.3)]',
    },
  };

  const currentType = typeStyles[type];

  return (
    <p
      className={cn(
        // Base styles
        'flex items-center gap-2',
        'px-4 py-3 rounded-xl',
        'text-sm font-semibold',
        'border-2',
        'transition-all duration-300',
        
        // Type-specific styles
        currentType.text,
        currentType.bg,
        currentType.border,
        
        // Glow effect
        glow && currentType.glow,
        
        // Shake animation (for errors)
        shake && 'animate-shake',
        
        // Custom classes
        className
      )}
      role={type === 'error' ? 'alert' : 'status'}
      {...props}
    >
      {Icon && (
        <Icon 
          className="w-5 h-5 shrink-0" 
          aria-hidden="true" 
        />
      )}
      <span>{children}</span>
    </p>
  );
};

Feedback.displayName = 'Feedback';