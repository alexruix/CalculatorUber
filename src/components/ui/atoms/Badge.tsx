import React, { type HTMLAttributes } from 'react';

export type BadgeVariant = 'neutral' | 'accent' | 'success' | 'warning' | 'error';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'neutral',
    className = '',
    ...props
}) => {
    return (
        <span className={`badge-${variant} ${className}`} {...props}>
            {children}
        </span>
    );
};
