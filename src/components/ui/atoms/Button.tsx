/**
 * Button.tsx - Refactored Atom
 * Extends Park UI Button with gaming variants
 * 
 * Uses design tokens from global.css
 * Adds neon glow effects and custom gaming styles
 */

import React from 'react';
import { ark } from '@ark-ui/react/factory';
import { cn } from '../../../lib/utils';

export type ButtonVariant =
    | 'neon'       // Primary green neon (solid)
    | 'outline'    // Outline with neon border
    | 'ghost'      // Transparent, minimal
    | 'gradient'   // Gradient background
    | 'primary-white'  // Solid white bg, black text
    | 'secondary-dark'; // Dark gray bg, white/gray text

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ComponentPropsWithoutRef<typeof ark.button> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    loading?: boolean;
    glow?: boolean;  // Add neon glow effect
    children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    neon: `
    bg-primary 
    text-black 
    font-extrabold 
    uppercase 
    tracking-wide
    shadow-[0_0_20px_var(--color-primary-glow)]
    hover:shadow-[0_0_30px_var(--color-primary-glow)]
    hover:scale-105
    active:scale-95
  `,
    outline: `
    bg-transparent 
    text-primary 
    border-2 
    border-primary
    font-extrabold 
    uppercase 
    tracking-wide
    shadow-[inset_0_0_20px_rgba(0,240,104,0.1)]
    hover:bg-primary/10
    hover:shadow-[0_0_25px_var(--color-primary-glow)]
  `,
    ghost: `
    bg-transparent 
    text-starlight 
    font-semibold
    hover:text-primary
    hover:bg-primary/10
  `,
    gradient: `
    bg-gradient-primary
    text-black 
    font-extrabold 
    uppercase 
    tracking-wide
    shadow-[0_0_20px_var(--color-primary-glow)]
    hover:shadow-[0_0_30px_var(--color-primary-glow)]
  `,
    'primary-white': `
    bg-white
    text-black
    font-extrabold
    uppercase
    tracking-wide
    shadow-[0_0_20px_rgba(255,255,255,0.2)]
    hover:bg-starlight
    hover:scale-105
    active:scale-95
  `,
    'secondary-dark': `
    bg-white/[0.05]
    text-white/80
    font-bold
    uppercase
    tracking-wide
    border border-white/10
    hover:bg-white/[0.1]
    hover:text-white
    active:scale-95
  `
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'text-sm px-4 py-2 rounded-xl',
    md: 'text-base px-6 py-4 rounded-2xl',
    lg: 'text-lg px-8 py-5 rounded-3xl',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'neon',
            size = 'md',
            fullWidth = false,
            loading = false,
            glow = false,
            children,
            className,
            disabled,
            ...props
        },
        ref
    ) => {
        return (
            <ark.button
                ref={ref}
                disabled={disabled || loading}
                className={cn(
                    // Base styles
                    'inline-flex items-center justify-center gap-2',
                    'border-none cursor-pointer',
                    'transition-all duration-300',
                    'disabled:opacity-50 disabled:cursor-not-allowed',

                    // Variant
                    variantStyles[variant],

                    // Size
                    sizeStyles[size],

                    // Full width
                    fullWidth && 'w-full',

                    // Extra glow (on top of variant glow)
                    glow && 'animate-glow-pulse',

                    // Custom classes
                    className
                )}
                {...props}
            >
                {loading ? (
                    <>
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>Cargando...</span>
                    </>
                ) : (
                    children
                )}
            </ark.button>
        );
    }
);

Button.displayName = 'Button';