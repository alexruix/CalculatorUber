/**
 * Label.tsx - Refactored Atom
 * Gaming aesthetic label with uppercase tracking
 * 
 * Uses design tokens from global.css
 */

import React from 'react';
import { cn } from '../../../lib/utils';

export type LabelVariant = 'default' | 'primary' | 'secondary' | 'muted';
export type LabelSize = 'xs' | 'sm' | 'md';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  variant?: LabelVariant;
  size?: LabelSize;
  uppercase?: boolean;     // Force uppercase (default: true)
  required?: boolean;      // Show asterisk
  children: React.ReactNode;
}

const variantStyles: Record<LabelVariant, string> = {
  default: 'text-moon font-extrabold',
  primary: 'text-primary font-extrabold',
  secondary: 'text-secondary font-extrabold',
  muted: 'text-moon font-medium',
};

const sizeStyles: Record<LabelSize, string> = {
  xs: 'text-xs tracking-[0.2em]',      // 12px, extra wide tracking
  sm: 'text-sm tracking-widest',       // 14px, wide tracking
  md: 'text-base tracking-wide',      // 16px, normal wide
};

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  (
    {
      variant = 'default',
      size = 'xs',
      uppercase = true,
      required = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <label
        ref={ref}
        className={cn(
          // Base styles
          'block font-medium',
          'transition-colors duration-200',

          // Variant
          variantStyles[variant],

          // Size
          sizeStyles[size],

          // Uppercase
          uppercase && 'uppercase',

          // Custom classes
          className
        )}
        {...props}
      >
        {children}
        {required && (
          <span className="text-error ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
    );
  }
);

Label.displayName = 'Label';