/**
 * Badge.tsx - Refactored Atom
 * Uses design tokens from global.css
 * 
 * Gaming aesthetic: Neon borders, uppercase text, optional glow
 */

import React from 'react';
import { cn } from '../../../lib/utils';

export type BadgeVariant =
    | 'primary'    // Green neon (success, profit)
    | 'secondary'  // Purple (XP, levels)
    | 'accent'     // Orange (warnings)
    | 'success'    // Alias for primary
    | 'warning'    // Alias for accent
    | 'error'      // Red (unprofitable)
    | 'info'       // Alias for secondary
    | 'neutral';   // Gray (default)

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    size?: BadgeSize;
    glow?: boolean;        // Add neon glow effect
    pulse?: boolean;       // Pulsing animation (for live states)
    className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
    primary: 'bg-primary text-black border-primary',
    secondary: 'bg-transparent text-secondary border-secondary',
    accent: 'bg-transparent text-accent border-accent',
    success: 'bg-primary text-black border-primary',
    warning: 'bg-transparent text-accent border-accent',
    error: 'bg-error text-white border-error',
    info: 'bg-transparent text-secondary border-secondary',
    neutral: 'bg-transparent text-moon border-moon',
};

const sizeStyles: Record<BadgeSize, string> = {
    sm: 'text-xs px-2 py-1',      // 12px font, tight padding
    md: 'text-sm px-3 py-1.5',    // 14px font, medium padding
    lg: 'text-base px-4 py-2',    // 16px font, generous padding
};

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'neutral',
    size = 'md',
    glow = false,
    pulse = false,
    className,
}) => {
    return (
        <span
            className={cn(
                // Base styles
                'inline-flex items-center gap-2',
                'font-extrabold uppercase tracking-wider',
                'rounded-full border-2',
                'transition-all duration-300',

                // Variant
                variantStyles[variant],

                // Size
                sizeStyles[size],

                // Glow effect (neon)
                glow && variant === 'primary' && 'shadow-[0_0_20px_var(--color-primary-glow)]',
                glow && variant === 'secondary' && 'shadow-[0_0_20px_var(--color-secondary-glow)]',
                glow && variant === 'accent' && 'shadow-[0_0_20px_var(--color-accent-glow)]',

                // Pulse animation
                pulse && 'animate-pulse',

                // Custom classes
                className
            )}
        >
            {children}
        </span>
    );
};

Badge.displayName = 'Badge';