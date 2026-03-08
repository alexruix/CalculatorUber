/**
 * Input.tsx - Refactored Atom
 * Gaming aesthetic input with neon focus glow
 * 
 * Uses design tokens from global.css
 * Supports error/success states with colored glows
 */

import React from 'react';
import { cn } from '../../../lib/utils';

export type InputVariant = 'default' | 'error' | 'success';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  size?: InputSize;
  icon?: React.ReactNode;      // Left icon
  suffix?: React.ReactNode;     // Right content (e.g., "XP")
  fullWidth?: boolean;
}

const variantStyles: Record<InputVariant, string> = {
  default: `
    bg-white/5 
    border-white/10
    focus:border-primary
    focus:bg-primary/5
    focus:shadow-[0_0_20px_var(--color-primary-glow)]
  `,
  error: `
    bg-error-bg
    border-error-border
    focus:border-error
    focus:shadow-[0_0_20px_rgba(255,68,68,0.3)]
  `,
  success: `
    bg-success-bg
    border-success-border
    focus:border-success
    focus:shadow-[0_0_20px_var(--color-primary-glow)]
  `,
};

const sizeStyles: Record<InputSize, string> = {
  sm: 'text-sm px-4 py-2 rounded-lg',
  md: 'text-base px-5 py-4 rounded-2xl',
  lg: 'text-lg px-6 py-5 rounded-3xl',
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      size = 'md',
      icon,
      suffix,
      fullWidth = true,
      className,
      ...props
    },
    ref
  ) => {
    const hasIcon = !!icon;
    const hasSuffix = !!suffix;

    return (
      <div className={cn('relative', fullWidth && 'w-full')}>
        {/* Left Icon */}
        {hasIcon && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-moon pointer-events-none transition-colors duration-300 peer-focus-within:text-primary">
            {icon}
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          className={cn(
            // Base styles
            'w-full',
            'text-starlight font-medium',
            'border-2',
            'transition-all duration-300',
            'outline-none',
            'placeholder:text-moon',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            
            // Variant
            variantStyles[variant],
            
            // Size
            sizeStyles[size],
            
            // Icon padding
            hasIcon && 'pl-12',
            
            // Suffix padding
            hasSuffix && 'pr-16',
            
            // Custom classes
            className
          )}
          {...props}
        />

        {/* Right Suffix (e.g., "XP", icons) */}
        {hasSuffix && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-primary font-extrabold text-sm uppercase tracking-widest pointer-events-none">
            {suffix}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';